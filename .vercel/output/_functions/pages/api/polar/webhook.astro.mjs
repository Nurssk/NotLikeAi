import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';
import { FieldValue } from 'firebase-admin/firestore';
import { r as readServerEnv, p as purchaseFromMetadata, i as isValidEmail, f as emailToCreditDocId, n as normalizeEmail } from '../../../chunks/server-env_D1vftNvA.mjs';
import { d as adminDb } from '../../../chunks/extension-auth_DbC87bnZ.mjs';
import { P as POLAR_EVENTS_COLLECTION, C as CUSTOMER_CREDITS_COLLECTION } from '../../../chunks/credits_BjpG76A-.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const ACTIVE_EVENT_TYPES = /* @__PURE__ */ new Set(["order.paid"]);
const STATUS_EVENT_MAP = {
  "subscription.past_due": "past_due",
  "subscription.canceled": "canceled",
  "subscription.revoked": "revoked",
  "order.refunded": "refunded"
};
const asRecord = (value) => value && typeof value === "object" ? value : null;
const getRecord = (record, key) => asRecord(record[key]);
const getString = (record, key) => {
  const value = record?.[key];
  return typeof value === "string" && value ? value : null;
};
const getNumber = (record, key) => {
  const value = record?.[key];
  return typeof value === "number" ? value : null;
};
const getDate = (record, key) => {
  const value = record?.[key];
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
};
const cleanEventId = (value) => value.replace(/[.#$[\]/\s]/g, "_").slice(0, 500);
const getEventId = (request, event, data) => {
  const webhookId = request.headers.get("webhook-id");
  if (webhookId) return cleanEventId(webhookId);
  const objectId = getString(data, "id") || "unknown";
  const timestamp = event.timestamp instanceof Date ? event.timestamp.toISOString() : String(Date.now());
  return cleanEventId(`${event.type}_${objectId}_${timestamp}`);
};
const getMetadata = (data) => {
  const subscription = data ? getRecord(data, "subscription") : null;
  return {
    ...asRecord(subscription?.metadata) ?? {},
    ...asRecord(data?.metadata) ?? {}
  };
};
const getCustomerEmail = (data, metadata) => {
  const customer = data ? getRecord(data, "customer") : null;
  const email = getString(customer, "email") || getString(metadata, "customer_email") || getString(metadata, "email");
  return email ? normalizeEmail(email) : null;
};
const getCurrentPeriodStart = (data) => getDate(data, "currentPeriodStart") || getDate(getRecord(data ?? {}, "subscription"), "currentPeriodStart");
const getCurrentPeriodEnd = (data) => getDate(data, "currentPeriodEnd") || getDate(getRecord(data ?? {}, "subscription"), "currentPeriodEnd");
const getPlanAmount = (data) => getNumber(data, "amount") || getNumber(data, "subtotalAmount") || getNumber(data, "totalAmount");
const getPolarSubscriptionId = (eventType, data, fallback) => getString(data, "subscriptionId") || (eventType.startsWith("subscription.") ? getString(data, "id") : null) || (typeof fallback === "string" ? fallback : null);
const statusForEvent = (event, data) => {
  if (STATUS_EVENT_MAP[event.type]) return STATUS_EVENT_MAP[event.type];
  if (!ACTIVE_EVENT_TYPES.has(event.type)) return null;
  const status = getString(data, "status");
  if (event.type === "subscription.updated" && status !== "active") return null;
  return "active";
};
const POST = async ({ request }) => {
  const secret = readServerEnv("POLAR_WEBHOOK_SECRET");
  if (!secret) {
    return new Response("Polar webhook secret is not configured", { status: 500 });
  }
  const body = await request.text();
  const headers = Object.fromEntries(request.headers.entries());
  let event;
  try {
    event = validateEvent(body, headers, secret);
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
  const purchase = purchaseFromMetadata(metadata, getPlanAmount(data));
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
      eventTimestamp: event.timestamp instanceof Date ? event.timestamp : null
    };
    if (!eventStatus) {
      transaction.set(eventRef, {
        ...baseEventRecord,
        processingStatus: "ignored"
      });
      return { ignored: true };
    }
    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      transaction.set(eventRef, {
        ...baseEventRecord,
        processingStatus: "skipped_missing_email"
      });
      return { skipped: "missing_email" };
    }
    const emailKey = emailToCreditDocId(normalizedEmail);
    const creditRef = db.collection(CUSTOMER_CREDITS_COLLECTION).doc(emailKey);
    const currentCreditSnapshot = await transaction.get(creditRef);
    const currentCreditData = currentCreditSnapshot.data() ?? {};
    const existingCreditsRemaining = typeof currentCreditData.creditsRemaining === "number" ? currentCreditData.creditsRemaining : null;
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
          lastEventType: event.type
        },
        { merge: true }
      );
      transaction.set(eventRef, {
        ...baseEventRecord,
        emailKey,
        normalizedEmail,
        processingStatus: "applied"
      });
      return { applied: true };
    }
    if (!purchase) {
      transaction.set(eventRef, {
        ...baseEventRecord,
        normalizedEmail,
        processingStatus: "skipped_missing_purchase"
      });
      return { skipped: "missing_purchase" };
    }
    const existingCreditsTotal = typeof currentCreditData.creditsTotal === "number" ? currentCreditData.creditsTotal : 0;
    const creditsRemaining = (existingCreditsRemaining ?? 0) + purchase.credits;
    transaction.set(
      creditRef,
      {
        normalizedEmail,
        emailKey,
        planId: null,
        purchaseType: "credits",
        lastCreditPurchase: purchase.credits,
        status: "active",
        creditsTotal: existingCreditsTotal + purchase.credits,
        creditsRemaining,
        period: purchase.period,
        usageLimit: purchase.limit,
        polarCustomerId: getString(data, "customerId") || getString(data ? getRecord(data, "customer") : null, "id"),
        polarCheckoutId: getString(data, "checkoutId"),
        polarOrderId: event.type.startsWith("order.") ? getString(data, "id") : currentCreditData.polarOrderId ?? null,
        polarSubscriptionId: getPolarSubscriptionId(event.type, data, currentCreditData.polarSubscriptionId),
        currentPeriodStart: getCurrentPeriodStart(data),
        currentPeriodEnd: getCurrentPeriodEnd(data),
        updatedAt: FieldValue.serverTimestamp(),
        lastEventId: eventId,
        lastEventType: event.type
      },
      { merge: true }
    );
    transaction.set(eventRef, {
      ...baseEventRecord,
      emailKey,
      normalizedEmail,
      purchaseType: "credits",
      creditsPurchased: purchase.credits,
      creditsTotal: purchase.credits,
      processingStatus: "applied"
    });
    return { applied: true };
  });
  return new Response(JSON.stringify(result), {
    status: 202,
    headers: {
      "Content-Type": "application/json"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
