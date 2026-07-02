import { FieldValue } from 'firebase-admin/firestore';
import { n as normalizeEmail, f as emailToCreditDocId } from './server-env_D1vftNvA.mjs';
import { d as adminDb, f as adminAuth, v as verifyExtensionSessionToken } from './extension-auth_DbC87bnZ.mjs';

const CUSTOMER_CREDITS_COLLECTION = "customerCredits";
const POLAR_EVENTS_COLLECTION = "polarEvents";
const FREE_PLAN_ID = "free";
const FREE_PLAN_SCREENSHOTS = 3;
const creditCorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type"
};
const getBearerToken = (request) => {
  const authorization = request.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
};
const serializeDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  if (typeof value === "object" && "toDate" in value) {
    const toDate = value.toDate;
    if (typeof toDate === "function") return toDate.call(value).toISOString();
  }
  return null;
};
const jsonResponse = (body, init = {}) => new Response(JSON.stringify(body), {
  ...init,
  headers: {
    "Content-Type": "application/json",
    ...creditCorsHeaders,
    ...init.headers
  }
});
const verifyCreditRequest = async (request) => {
  const token = getBearerToken(request);
  if (!token) {
    return { error: jsonResponse({ error: "missing_authorization" }, { status: 401 }) };
  }
  let decodedToken;
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
        email: extensionSession.email
      },
      normalizedEmail: extensionSession.normalizedEmail,
      emailKey: extensionSession.emailKey
    };
  }
  if (!decodedToken.email) {
    return { error: jsonResponse({ error: "missing_email" }, { status: 403 }) };
  }
  const normalizedEmail = normalizeEmail(decodedToken.email);
  return {
    decodedToken,
    normalizedEmail,
    emailKey: emailToCreditDocId(normalizedEmail)
  };
};
const serializeCreditData = (data) => ({
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
  updatedAt: serializeDate(data.updatedAt)
});
const createFreeCreditDocument = (verified) => ({
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
  updatedAt: FieldValue.serverTimestamp()
});
const createFreeCreditResponseData = (verified, creditsRemaining = FREE_PLAN_SCREENSHOTS) => ({
  ...createFreeCreditDocument(verified),
  creditsRemaining,
  createdAt: /* @__PURE__ */ new Date(),
  updatedAt: /* @__PURE__ */ new Date()
});
const getCreditsForRequest = async (request) => {
  const verified = await verifyCreditRequest(request);
  if ("error" in verified) return verified.error;
  const db = adminDb();
  const creditRef = db.collection(CUSTOMER_CREDITS_COLLECTION).doc(verified.emailKey);
  const creditData = await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(creditRef);
    if (snapshot.exists) return snapshot.data();
    const freeCreditDocument = createFreeCreditDocument(verified);
    transaction.set(creditRef, freeCreditDocument);
    return createFreeCreditResponseData(verified);
  });
  return jsonResponse(serializeCreditData(creditData));
};
const consumeCreditsForRequest = async (request, amount) => {
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
          return { error: "insufficient_credits", creditsRemaining: FREE_PLAN_SCREENSHOTS };
        }
        const nextCreditsRemaining2 = FREE_PLAN_SCREENSHOTS - amount;
        transaction.set(creditRef, {
          ...createFreeCreditDocument(verified),
          creditsRemaining: nextCreditsRemaining2
        });
        return {
          credits: serializeCreditData(createFreeCreditResponseData(verified, nextCreditsRemaining2))
        };
      }
      const data = snapshot.data();
      const creditsRemaining = typeof data.creditsRemaining === "number" ? data.creditsRemaining : 0;
      if (data.normalizedEmail !== verified.normalizedEmail) {
        return { error: "email_mismatch" };
      }
      if (data.status !== "active") {
        return { error: "inactive_credits" };
      }
      const periodEnd = serializeDate(data.currentPeriodEnd);
      if (periodEnd && Date.parse(periodEnd) <= Date.now()) {
        return { error: "credits_expired" };
      }
      if (creditsRemaining < amount) {
        return { error: "insufficient_credits", creditsRemaining };
      }
      const nextCreditsRemaining = creditsRemaining - amount;
      transaction.update(creditRef, {
        creditsRemaining: FieldValue.increment(-amount),
        updatedAt: FieldValue.serverTimestamp()
      });
      return {
        credits: serializeCreditData({
          ...data,
          creditsRemaining: nextCreditsRemaining,
          updatedAt: /* @__PURE__ */ new Date()
        })
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

export { CUSTOMER_CREDITS_COLLECTION as C, POLAR_EVENTS_COLLECTION as P, consumeCreditsForRequest as a, creditCorsHeaders as c, getCreditsForRequest as g, jsonResponse as j };
