import type { APIRoute } from "astro";
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";
import { FieldValue } from "firebase-admin/firestore";
import {
  CREDIT_PLANS,
  emailToCreditDocId,
  isValidEmail,
  normalizeEmail,
  planFromMetadata,
} from "../../../lib/billing";
import { adminDb } from "../../../lib/firebase-admin";
import { readServerEnv } from "../../../lib/server-env";
import { CUSTOMER_CREDITS_COLLECTION, POLAR_EVENTS_COLLECTION } from "../../../lib/credits";

export const prerender = false;

type PolarEvent = {
  type: string;
  timestamp?: Date;
  data?: unknown;
};

type CreditStatus = "active" | "past_due" | "canceled" | "revoked" | "refunded";

const ACTIVE_EVENT_TYPES = new Set(["order.paid", "subscription.active", "subscription.updated", "subscription.uncanceled"]);

const STATUS_EVENT_MAP: Record<string, CreditStatus> = {
  "subscription.past_due": "past_due",
  "subscription.canceled": "canceled",
  "subscription.revoked": "revoked",
  "order.refunded": "refunded",
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : null;

const getRecord = (record: Record<string, unknown>, key: string) => asRecord(record[key]);

const getString = (record: Record<string, unknown> | null | undefined, key: string) => {
  const value = record?.[key];
  return typeof value === "string" && value ? value : null;
};

const getNumber = (record: Record<string, unknown> | null | undefined, key: string) => {
  const value = record?.[key];
  return typeof value === "number" ? value : null;
};

const getDate = (record: Record<string, unknown> | null | undefined, key: string) => {
  const value = record?.[key];
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
};

const cleanEventId = (value: string) => value.replace(/[.#$[\]/\s]/g, "_").slice(0, 500);

const getEventId = (request: Request, event: PolarEvent, data: Record<string, unknown> | null) => {
  const webhookId = request.headers.get("webhook-id");
  if (webhookId) return cleanEventId(webhookId);

  const objectId = getString(data, "id") || "unknown";
  const timestamp = event.timestamp instanceof Date ? event.timestamp.toISOString() : String(Date.now());
  return cleanEventId(`${event.type}_${objectId}_${timestamp}`);
};

const getMetadata = (data: Record<string, unknown> | null) => {
  const subscription = data ? getRecord(data, "subscription") : null;
  return {
    ...(asRecord(subscription?.metadata) ?? {}),
    ...(asRecord(data?.metadata) ?? {}),
  };
};

const getCustomerEmail = (data: Record<string, unknown> | null, metadata: Record<string, unknown>) => {
  const customer = data ? getRecord(data, "customer") : null;
  const email = getString(customer, "email") || getString(metadata, "customer_email") || getString(metadata, "email");
  return email ? normalizeEmail(email) : null;
};

const getCurrentPeriodStart = (data: Record<string, unknown> | null) =>
  getDate(data, "currentPeriodStart") || getDate(getRecord(data ?? {}, "subscription"), "currentPeriodStart");

const getCurrentPeriodEnd = (data: Record<string, unknown> | null) =>
  getDate(data, "currentPeriodEnd") || getDate(getRecord(data ?? {}, "subscription"), "currentPeriodEnd");

const getPlanAmount = (data: Record<string, unknown> | null) =>
  getNumber(data, "amount") || getNumber(data, "subtotalAmount") || getNumber(data, "totalAmount");

const getPolarSubscriptionId = (
  eventType: string,
  data: Record<string, unknown> | null,
  fallback: unknown,
) =>
  getString(data, "subscriptionId") ||
  (eventType.startsWith("subscription.") ? getString(data, "id") : null) ||
  (typeof fallback === "string" ? fallback : null);

const statusForEvent = (event: PolarEvent, data: Record<string, unknown> | null): CreditStatus | null => {
  if (STATUS_EVENT_MAP[event.type]) return STATUS_EVENT_MAP[event.type];
  if (!ACTIVE_EVENT_TYPES.has(event.type)) return null;

  const status = getString(data, "status");
  if (event.type === "subscription.updated" && status !== "active") return null;

  return "active";
};

export const POST: APIRoute = async ({ request }) => {
  const secret = readServerEnv("POLAR_WEBHOOK_SECRET");
  if (!secret) {
    return new Response("Polar webhook secret is not configured", { status: 500 });
  }

  const body = await request.text();
  const headers = Object.fromEntries(request.headers.entries());

  let event: PolarEvent;
  try {
    event = validateEvent(body, headers, secret) as PolarEvent;
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      return new Response("Invalid Polar webhook signature", { status: 403 });
    }

    throw error;
  }

  const data = asRecord(event.data);
  const eventId = getEventId(request, event, data);
  const eventStatus = statusForEvent(event, data);
  const metadata = getMetadata(data);
  const normalizedEmail = getCustomerEmail(data, metadata);
  const plan = planFromMetadata(metadata, getPlanAmount(data));

  const db = adminDb();
  const eventRef = db.collection(POLAR_EVENTS_COLLECTION).doc(eventId);

  const result = await db.runTransaction(async (transaction) => {
    const existingEvent = await transaction.get(eventRef);
    if (existingEvent.exists) {
      return { duplicate: true };
    }

    const baseEventRecord = {
      eventId,
      type: event.type,
      polarObjectId: getString(data, "id"),
      receivedAt: FieldValue.serverTimestamp(),
      eventTimestamp: event.timestamp instanceof Date ? event.timestamp : null,
    };

    if (!eventStatus) {
      transaction.set(eventRef, {
        ...baseEventRecord,
        processingStatus: "ignored",
      });
      return { ignored: true };
    }

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      transaction.set(eventRef, {
        ...baseEventRecord,
        processingStatus: "skipped_missing_email",
      });
      return { skipped: "missing_email" };
    }

    const emailKey = emailToCreditDocId(normalizedEmail);
    const creditRef = db.collection(CUSTOMER_CREDITS_COLLECTION).doc(emailKey);
    const currentCreditSnapshot = await transaction.get(creditRef);
    const currentCreditData = currentCreditSnapshot.data() ?? {};
    const existingCreditsRemaining =
      typeof currentCreditData.creditsRemaining === "number" ? currentCreditData.creditsRemaining : null;

    if (eventStatus !== "active") {
      transaction.set(
        creditRef,
        {
          normalizedEmail,
          emailKey,
          status: eventStatus,
          creditsRemaining: eventStatus === "canceled" ? existingCreditsRemaining ?? 0 : 0,
          polarCustomerId: getString(data, "customerId") || getString(data ? getRecord(data, "customer") : null, "id"),
          polarOrderId: event.type.startsWith("order.") ? getString(data, "id") : currentCreditData.polarOrderId ?? null,
          polarSubscriptionId: getPolarSubscriptionId(event.type, data, currentCreditData.polarSubscriptionId),
          updatedAt: FieldValue.serverTimestamp(),
          lastEventId: eventId,
          lastEventType: event.type,
        },
        { merge: true },
      );

      transaction.set(eventRef, {
        ...baseEventRecord,
        emailKey,
        normalizedEmail,
        processingStatus: "applied",
      });

      return { applied: true };
    }

    if (!plan) {
      transaction.set(eventRef, {
        ...baseEventRecord,
        normalizedEmail,
        processingStatus: "skipped_missing_plan",
      });
      return { skipped: "missing_plan" };
    }

    const shouldResetCredits = event.type === "order.paid" || !currentCreditSnapshot.exists;
    const creditsRemaining = shouldResetCredits
      ? plan.credits
      : Math.min(existingCreditsRemaining ?? plan.credits, plan.credits);

    transaction.set(
      creditRef,
      {
        normalizedEmail,
        emailKey,
        planId: plan.id,
        status: "active",
        creditsTotal: plan.credits,
        creditsRemaining,
        period: plan.period,
        usageLimit: plan.limit,
        polarCustomerId: getString(data, "customerId") || getString(data ? getRecord(data, "customer") : null, "id"),
        polarCheckoutId: getString(data, "checkoutId"),
        polarOrderId: event.type.startsWith("order.") ? getString(data, "id") : currentCreditData.polarOrderId ?? null,
        polarSubscriptionId: getPolarSubscriptionId(event.type, data, currentCreditData.polarSubscriptionId),
        currentPeriodStart: getCurrentPeriodStart(data),
        currentPeriodEnd: getCurrentPeriodEnd(data),
        updatedAt: FieldValue.serverTimestamp(),
        lastEventId: eventId,
        lastEventType: event.type,
      },
      { merge: true },
    );

    transaction.set(eventRef, {
      ...baseEventRecord,
      emailKey,
      normalizedEmail,
      planId: plan.id,
      creditsTotal: CREDIT_PLANS[plan.id].credits,
      processingStatus: "applied",
    });

    return { applied: true };
  });

  return new Response(JSON.stringify(result), {
    status: 202,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
