import type { DecodedIdToken } from "firebase-admin/auth";
import { FieldValue } from "firebase-admin/firestore";
import { emailToCreditDocId, normalizeEmail } from "./billing";
import { verifyExtensionSessionToken } from "./extension-auth";
import { adminAuth, adminDb } from "./firebase-admin";

export const CUSTOMER_CREDITS_COLLECTION = "customerCredits";
export const POLAR_EVENTS_COLLECTION = "polarEvents";

export const creditCorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

type CreditDocument = {
  normalizedEmail?: string;
  planId?: string;
  status?: string;
  creditsTotal?: number;
  creditsRemaining?: number;
  period?: string;
  polarCustomerId?: string | null;
  polarOrderId?: string | null;
  polarSubscriptionId?: string | null;
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
  planId: data.planId ?? null,
  status: data.status ?? null,
  creditsTotal: typeof data.creditsTotal === "number" ? data.creditsTotal : 0,
  creditsRemaining: typeof data.creditsRemaining === "number" ? data.creditsRemaining : 0,
  period: data.period ?? null,
  polarCustomerId: data.polarCustomerId ?? null,
  polarOrderId: data.polarOrderId ?? null,
  polarSubscriptionId: data.polarSubscriptionId ?? null,
  currentPeriodStart: serializeDate(data.currentPeriodStart),
  currentPeriodEnd: serializeDate(data.currentPeriodEnd),
  updatedAt: serializeDate(data.updatedAt),
});

export const getCreditsForRequest = async (request: Request) => {
  const verified = await verifyCreditRequest(request);
  if ("error" in verified) return verified.error;

  const snapshot = await adminDb().collection(CUSTOMER_CREDITS_COLLECTION).doc(verified.emailKey).get();
  if (!snapshot.exists) {
    return jsonResponse({
      normalizedEmail: verified.normalizedEmail,
      status: "missing",
      creditsTotal: 0,
      creditsRemaining: 0,
    });
  }

  return jsonResponse(serializeCreditData(snapshot.data() as CreditDocument));
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
        return { error: "credits_not_found" as const };
      }

      const data = snapshot.data() as CreditDocument;
      const creditsRemaining = typeof data.creditsRemaining === "number" ? data.creditsRemaining : 0;

      if (data.normalizedEmail !== verified.normalizedEmail) {
        return { error: "email_mismatch" as const };
      }

      if (data.status !== "active") {
        return { error: "inactive_plan" as const };
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
