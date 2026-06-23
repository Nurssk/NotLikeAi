import type { DecodedIdToken } from "firebase-admin/auth";
import { FieldValue } from "firebase-admin/firestore";
import { emailToCreditDocId, normalizeEmail } from "./billing";
import { verifyExtensionSessionToken } from "./extension-auth";
import { adminAuth, adminDb } from "./firebase-admin";

export const CUSTOMER_CREDITS_COLLECTION = "customerCredits";
export const POLAR_EVENTS_COLLECTION = "polarEvents";
export const FREE_PLAN_ID = "free";
export const FREE_PLAN_SCREENSHOTS = 3;

export const creditCorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

type CreditDocument = {
  normalizedEmail?: string;
  emailKey?: string;
  planId?: string;
  purchaseType?: string;
  lastCreditPurchase?: number;
  status?: string;
  creditsTotal?: number;
  creditsRemaining?: number;
  usageLimit?: string;
  period?: string;
  polarCustomerId?: string | null;
  polarOrderId?: string | null;
  polarSubscriptionId?: string | null;
  createdAt?: unknown;
  currentPeriodStart?: unknown;
  currentPeriodEnd?: unknown;
  updatedAt?: unknown;
};

const getBearerToken = (request: Request) => {
  const authorization = request.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
};

const serializeDate = (value: unknown) => {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;

  if (typeof value === "object" && "toDate" in value) {
    const toDate = (value as { toDate?: () => Date }).toDate;
    if (typeof toDate === "function") return toDate.call(value).toISOString();
  }

  return null;
};

export const jsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...creditCorsHeaders,
      ...init.headers,
    },
  });

export const verifyCreditRequest = async (request: Request) => {
  const token = getBearerToken(request);
  if (!token) {
    return { error: jsonResponse({ error: "missing_authorization" }, { status: 401 }) };
  }

  let decodedToken: DecodedIdToken;
  try {
    decodedToken = await adminAuth().verifyIdToken(token);
  } catch {
    const extensionSession = (() => {
      try {
        return verifyExtensionSessionToken(token);
      } catch {
        return null;
      }
    })();

    if (!extensionSession) {
      return { error: jsonResponse({ error: "invalid_authorization" }, { status: 401 }) };
    }

    return {
      decodedToken: {
        uid: extensionSession.uid,
        email: extensionSession.email,
      } as DecodedIdToken,
      normalizedEmail: extensionSession.normalizedEmail,
      emailKey: extensionSession.emailKey,
    };
  }

  if (!decodedToken.email) {
    return { error: jsonResponse({ error: "missing_email" }, { status: 403 }) };
  }

  const normalizedEmail = normalizeEmail(decodedToken.email);
  return {
    decodedToken,
    normalizedEmail,
    emailKey: emailToCreditDocId(normalizedEmail),
  };
};

export const serializeCreditData = (data: CreditDocument) => ({
  normalizedEmail: data.normalizedEmail ?? null,
  emailKey: data.emailKey ?? null,
  planId: data.planId ?? null,
  purchaseType: data.purchaseType ?? null,
  lastCreditPurchase: typeof data.lastCreditPurchase === "number" ? data.lastCreditPurchase : null,
  status: data.status ?? null,
  creditsTotal: typeof data.creditsTotal === "number" ? data.creditsTotal : 0,
  creditsRemaining: typeof data.creditsRemaining === "number" ? data.creditsRemaining : 0,
  usageLimit: data.usageLimit ?? null,
  period: data.period ?? null,
  polarCustomerId: data.polarCustomerId ?? null,
  polarOrderId: data.polarOrderId ?? null,
  polarSubscriptionId: data.polarSubscriptionId ?? null,
  createdAt: serializeDate(data.createdAt),
  currentPeriodStart: serializeDate(data.currentPeriodStart),
  currentPeriodEnd: serializeDate(data.currentPeriodEnd),
  updatedAt: serializeDate(data.updatedAt),
});

const createFreeCreditDocument = (verified: { normalizedEmail: string; emailKey: string }) => ({
  normalizedEmail: verified.normalizedEmail,
  emailKey: verified.emailKey,
  planId: FREE_PLAN_ID,
  purchaseType: FREE_PLAN_ID,
  lastCreditPurchase: null,
  status: "active",
  creditsTotal: FREE_PLAN_SCREENSHOTS,
  creditsRemaining: FREE_PLAN_SCREENSHOTS,
  usageLimit: `${FREE_PLAN_SCREENSHOTS} screenshots`,
  period: FREE_PLAN_ID,
  polarCustomerId: null,
  polarOrderId: null,
  polarSubscriptionId: null,
  currentPeriodStart: null,
  currentPeriodEnd: null,
  createdAt: FieldValue.serverTimestamp(),
  updatedAt: FieldValue.serverTimestamp(),
});

const createFreeCreditResponseData = (verified: { normalizedEmail: string; emailKey: string }, creditsRemaining = FREE_PLAN_SCREENSHOTS) => ({
  ...createFreeCreditDocument(verified),
  creditsRemaining,
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const getCreditsForRequest = async (request: Request) => {
  const verified = await verifyCreditRequest(request);
  if ("error" in verified) return verified.error;

  const db = adminDb();
  const creditRef = db.collection(CUSTOMER_CREDITS_COLLECTION).doc(verified.emailKey);

  const creditData = await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(creditRef);
    if (snapshot.exists) return snapshot.data() as CreditDocument;

    const freeCreditDocument = createFreeCreditDocument(verified);
    transaction.set(creditRef, freeCreditDocument);
    return createFreeCreditResponseData(verified);
  });

  return jsonResponse(serializeCreditData(creditData));
};

export const consumeCreditsForRequest = async (request: Request, amount: number) => {
  const verified = await verifyCreditRequest(request);
  if ("error" in verified) return verified.error;

  if (!Number.isInteger(amount) || amount < 1 || amount > 100) {
    return jsonResponse({ error: "invalid_amount" }, { status: 400 });
  }

  const db = adminDb();
  const creditRef = db.collection(CUSTOMER_CREDITS_COLLECTION).doc(verified.emailKey);

  try {
    const result = await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(creditRef);
      if (!snapshot.exists) {
        if (FREE_PLAN_SCREENSHOTS < amount) {
          return { error: "insufficient_credits" as const, creditsRemaining: FREE_PLAN_SCREENSHOTS };
        }

        const nextCreditsRemaining = FREE_PLAN_SCREENSHOTS - amount;
        transaction.set(creditRef, {
          ...createFreeCreditDocument(verified),
          creditsRemaining: nextCreditsRemaining,
        });

        return {
          credits: serializeCreditData(createFreeCreditResponseData(verified, nextCreditsRemaining)),
        };
      }

      const data = snapshot.data() as CreditDocument;
      const creditsRemaining = typeof data.creditsRemaining === "number" ? data.creditsRemaining : 0;

      if (data.normalizedEmail !== verified.normalizedEmail) {
        return { error: "email_mismatch" as const };
      }

      if (data.status !== "active") {
        return { error: "inactive_credits" as const };
      }

      const periodEnd = serializeDate(data.currentPeriodEnd);
      if (periodEnd && Date.parse(periodEnd) <= Date.now()) {
        return { error: "credits_expired" as const };
      }

      if (creditsRemaining < amount) {
        return { error: "insufficient_credits" as const, creditsRemaining };
      }

      const nextCreditsRemaining = creditsRemaining - amount;
      transaction.update(creditRef, {
        creditsRemaining: FieldValue.increment(-amount),
        updatedAt: FieldValue.serverTimestamp(),
      });

      return {
        credits: serializeCreditData({
          ...data,
          creditsRemaining: nextCreditsRemaining,
          updatedAt: new Date(),
        }),
      };
    });

    if ("error" in result) {
      const status = result.error === "insufficient_credits" ? 402 : result.error === "credits_not_found" ? 404 : 403;
      return jsonResponse(result, { status });
    }

    return jsonResponse(result.credits);
  } catch {
    return jsonResponse({ error: "credit_consume_failed" }, { status: 500 });
  }
};
