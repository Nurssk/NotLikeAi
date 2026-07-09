import { FieldValue, type Firestore } from "firebase-admin/firestore";

export const FREE_PLAN_ID = "free";
export const FREE_PLAN_SCREENSHOTS = 3;

/** Lowercase + trim, so the same person always maps to one credit document. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Firestore-safe document id derived from a normalized email. */
export function emailToCreditDocId(normalizedEmail: string): string {
  return normalizedEmail.replace(/[.#$[\]/\s]/g, "_");
}

interface GrantInput {
  db: Firestore;
  normalizedEmail: string;
  credits: number;
  purchaseLabel: string;
  eventId: string;
  eventType: string;
  polarObjectId?: string | null;
  polarCustomerId?: string | null;
  polarCheckoutId?: string | null;
  polarOrderId?: string | null;
}

export type GrantStatus =
  | "applied"
  | "duplicate"
  | "skipped_missing_email"
  | "skipped_missing_purchase";

/**
 * Idempotently add purchased screenshots to a customer's balance.
 * Writes an audit/idempotency record to `polarEvents` and updates
 * `customerCredits/{emailKey}` inside a single transaction.
 */
export async function grantPurchasedCredits(
  input: GrantInput
): Promise<GrantStatus> {
  const { db, normalizedEmail, credits, eventId } = input;

  if (!normalizedEmail) return "skipped_missing_email";
  if (!Number.isFinite(credits) || credits <= 0)
    return "skipped_missing_purchase";

  const emailKey = emailToCreditDocId(normalizedEmail);
  const eventRef = db.collection("polarEvents").doc(eventId);
  const creditRef = db.collection("customerCredits").doc(emailKey);

  return db.runTransaction(async (tx) => {
    const eventSnap = await tx.get(eventRef);
    if (eventSnap.exists) return "duplicate";

    const creditSnap = await tx.get(creditRef);
    const prev = creditSnap.data() ?? {};
    const prevTotal = Number(prev.creditsTotal ?? 0);
    const prevRemaining = Number(prev.creditsRemaining ?? 0);

    tx.set(
      creditRef,
      {
        normalizedEmail,
        emailKey,
        planId: null,
        purchaseType: "credits",
        lastCreditPurchase: credits,
        status: "active",
        creditsTotal: prevTotal + credits,
        creditsRemaining: prevRemaining + credits,
        period: "one_time",
        usageLimit: "one-time credits",
        polarCustomerId: input.polarCustomerId ?? prev.polarCustomerId ?? null,
        polarCheckoutId: input.polarCheckoutId ?? prev.polarCheckoutId ?? null,
        polarOrderId: input.polarOrderId ?? prev.polarOrderId ?? null,
        polarSubscriptionId: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        createdAt: creditSnap.exists
          ? (prev.createdAt ?? FieldValue.serverTimestamp())
          : FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        lastEventId: eventId,
        lastEventType: input.eventType,
      },
      { merge: true }
    );

    tx.set(eventRef, {
      eventId,
      type: input.eventType,
      polarObjectId: input.polarObjectId ?? null,
      emailKey,
      normalizedEmail,
      purchaseType: "credits",
      creditsPurchased: credits,
      processingStatus: "applied",
      receivedAt: FieldValue.serverTimestamp(),
    });

    return "applied";
  });
}

export interface CreditView {
  normalizedEmail: string;
  emailKey: string;
  planId: string | null;
  purchaseType: string;
  status: string;
  creditsTotal: number;
  creditsRemaining: number;
  usageLimit: string;
  period: string;
}

function toView(normalizedEmail: string, data: Record<string, any>): CreditView {
  return {
    normalizedEmail,
    emailKey: emailToCreditDocId(normalizedEmail),
    planId: data.planId ?? null,
    purchaseType: data.purchaseType ?? "free",
    status: data.status ?? "active",
    creditsTotal: Number(data.creditsTotal ?? 0),
    creditsRemaining: Number(data.creditsRemaining ?? 0),
    usageLimit: data.usageLimit ?? `${FREE_PLAN_SCREENSHOTS} screenshots`,
    period: data.period ?? "free",
  };
}

/**
 * Read a customer's balance, creating the free-plan document on first access.
 * Never overwrites an existing (free or paid) document.
 */
export async function readOrCreateCredits(
  db: Firestore,
  normalizedEmail: string
): Promise<CreditView> {
  const emailKey = emailToCreditDocId(normalizedEmail);
  const ref = db.collection("customerCredits").doc(emailKey);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists) return toView(normalizedEmail, snap.data()!);
    const free = {
      normalizedEmail,
      emailKey,
      planId: FREE_PLAN_ID,
      purchaseType: "free",
      status: "active",
      creditsTotal: FREE_PLAN_SCREENSHOTS,
      creditsRemaining: FREE_PLAN_SCREENSHOTS,
      usageLimit: `${FREE_PLAN_SCREENSHOTS} screenshots`,
      period: "free",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    tx.set(ref, free);
    return toView(normalizedEmail, free);
  });
}

/** Typed error so API routes can map to the right HTTP status/error code. */
export class CreditError extends Error {
  constructor(
    public code:
      | "inactive_credits"
      | "credits_expired"
      | "insufficient_credits",
    public httpStatus: number,
    public creditsRemaining?: number
  ) {
    super(code);
  }
}

/** Transactionally consume screenshots. Creates the free doc if none exists. */
export async function consumeCredits(
  db: Firestore,
  normalizedEmail: string,
  amount: number
): Promise<CreditView> {
  const qty = Math.max(1, Math.floor(amount));
  const emailKey = emailToCreditDocId(normalizedEmail);
  const ref = db.collection("customerCredits").doc(emailKey);

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.exists
      ? snap.data()!
      : {
          normalizedEmail,
          emailKey,
          planId: FREE_PLAN_ID,
          purchaseType: "free",
          status: "active",
          creditsTotal: FREE_PLAN_SCREENSHOTS,
          creditsRemaining: FREE_PLAN_SCREENSHOTS,
          usageLimit: `${FREE_PLAN_SCREENSHOTS} screenshots`,
          period: "free",
          createdAt: FieldValue.serverTimestamp(),
        };

    if ((data.status ?? "active") !== "active")
      throw new CreditError("inactive_credits", 403);

    const remaining = Number(data.creditsRemaining ?? 0);
    if (remaining < qty)
      throw new CreditError("insufficient_credits", 402, Math.max(0, remaining));

    const next = { ...data, creditsRemaining: remaining - qty, updatedAt: FieldValue.serverTimestamp() };
    tx.set(ref, next, { merge: true });
    return toView(normalizedEmail, next);
  });
}

/** Record a skipped/duplicate event for debugging without granting credits. */
export async function recordEvent(
  db: Firestore,
  eventId: string,
  fields: Record<string, unknown>
): Promise<void> {
  await db
    .collection("polarEvents")
    .doc(eventId)
    .set(
      { eventId, receivedAt: FieldValue.serverTimestamp(), ...fields },
      { merge: true }
    );
}
