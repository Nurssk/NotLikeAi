import { createHash, createHmac, randomInt, timingSafeEqual } from "node:crypto";
import type { DecodedIdToken } from "firebase-admin/auth";
import { FieldValue } from "firebase-admin/firestore";
import { emailToCreditDocId, isValidEmail, normalizeEmail } from "./billing";
import { adminAuth, adminDb } from "./firebase-admin";
import { readServerEnv } from "./server-env";

export const EXTENSION_AUTH_CODES_COLLECTION = "extensionAuthCodes";
export const EXTENSION_AUTH_RATE_LIMITS_COLLECTION = "extensionAuthRateLimits";

export const extensionAuthCorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

const CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CODE_LENGTH = 6;
const CODE_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;
const CODE_ATTEMPT_LIMIT = 5;
const EXCHANGE_ATTEMPT_LIMIT = 10;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

type ExtensionSessionPayload = {
  typ: "extension-session";
  sub: string;
  email: string;
  emailKey: string;
  iat: number;
  exp: number;
};

type StoredCode = {
  userId?: string;
  email?: string;
  normalizedEmail?: string;
  expiresAt?: unknown;
  usedAt?: unknown;
};

export type VerifiedExtensionSession = {
  uid: string;
  email: string;
  normalizedEmail: string;
  emailKey: string;
};

export const extensionAuthJsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...extensionAuthCorsHeaders,
      ...init.headers,
    },
  });

const base64UrlEncode = (value: Buffer | string) =>
  Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const base64UrlDecode = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return Buffer.from(padded, "base64").toString("utf8");
};

const getExtensionAuthSecret = () => {
  const secret = readServerEnv("EXTENSION_AUTH_SECRET");
  if (!secret || secret.length < 32) {
    throw new Error("EXTENSION_AUTH_SECRET must be configured with at least 32 characters");
  }
  return secret;
};

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

const hmacBase64Url = (value: string) => base64UrlEncode(createHmac("sha256", getExtensionAuthSecret()).update(value).digest());

const timingSafeEqualString = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

export const normalizeExtensionCode = (code: string) => code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

export const formatExtensionCode = (code: string) => code;

const generateRawCode = () => {
  let code = "";
  for (let index = 0; index < CODE_LENGTH; index += 1) {
    code += CODE_ALPHABET[randomInt(0, CODE_ALPHABET.length)];
  }
  return code;
};

const getBearerToken = (request: Request) => {
  const authorization = request.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
};

const getClientIp = (request: Request) => {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    forwarded ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("fly-client-ip") ||
    "unknown"
  );
};

const toMillis = (value: unknown) => {
  if (!value) return 0;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "string") return Date.parse(value);

  if (typeof value === "object" && "toDate" in value) {
    const toDate = (value as { toDate?: () => Date }).toDate;
    if (typeof toDate === "function") return toDate.call(value).getTime();
  }

  return 0;
};

const rateLimit = async (kind: "code" | "exchange", keyParts: string[], limit: number) => {
  const now = Date.now();
  const windowStart = Math.floor(now / RATE_LIMIT_WINDOW_MS) * RATE_LIMIT_WINDOW_MS;
  const docId = sha256([kind, windowStart, ...keyParts].join(":"));
  const ref = adminDb().collection(EXTENSION_AUTH_RATE_LIMITS_COLLECTION).doc(docId);

  return adminDb().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const data = snapshot.exists ? snapshot.data() : null;
    const count = typeof data?.count === "number" ? data.count : 0;
    const nextCount = count + 1;

    transaction.set(
      ref,
      {
        kind,
        keyHash: sha256(keyParts.join(":")),
        windowStart: new Date(windowStart),
        expiresAt: new Date(windowStart + RATE_LIMIT_WINDOW_MS),
        count: nextCount,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return nextCount <= limit;
  });
};

export const verifyWebsiteFirebaseRequest = async (request: Request) => {
  const token = getBearerToken(request);
  if (!token) {
    return { error: extensionAuthJsonResponse({ error: "missing_authorization" }, { status: 401 }) };
  }

  let decodedToken: DecodedIdToken;
  try {
    decodedToken = await adminAuth().verifyIdToken(token);
  } catch {
    return { error: extensionAuthJsonResponse({ error: "invalid_authorization" }, { status: 401 }) };
  }

  if (!decodedToken.email || !isValidEmail(decodedToken.email)) {
    return { error: extensionAuthJsonResponse({ error: "missing_email" }, { status: 403 }) };
  }

  if (!decodedToken.email_verified) {
    return { error: extensionAuthJsonResponse({ error: "email_not_verified" }, { status: 403 }) };
  }

  return {
    decodedToken,
    normalizedEmail: normalizeEmail(decodedToken.email),
  };
};

export const createExtensionAuthCode = async (request: Request) => {
  const verified = await verifyWebsiteFirebaseRequest(request);
  if ("error" in verified) return verified.error;

  const clientIpHash = sha256(getClientIp(request));
  const allowed = await rateLimit("code", [verified.decodedToken.uid, clientIpHash], CODE_ATTEMPT_LIMIT);
  if (!allowed) {
    return extensionAuthJsonResponse({ error: "rate_limited" }, { status: 429 });
  }

  const db = adminDb();
  let rawCode = generateRawCode();
  let codeHash = sha256(`${verified.normalizedEmail}:${rawCode}`);
  let codeRef = db.collection(EXTENSION_AUTH_CODES_COLLECTION).doc(codeHash);

  for (let attempts = 0; attempts < 3; attempts += 1) {
    const existing = await codeRef.get();
    if (!existing.exists) break;

    rawCode = generateRawCode();
    codeHash = sha256(`${verified.normalizedEmail}:${rawCode}`);
    codeRef = db.collection(EXTENSION_AUTH_CODES_COLLECTION).doc(codeHash);
  }

  const expiresAt = new Date(Date.now() + CODE_TTL_MS);
  await codeRef.set({
    userId: verified.decodedToken.uid,
    email: verified.decodedToken.email,
    normalizedEmail: verified.normalizedEmail,
    codeHash,
    expiresAt,
    usedAt: null,
    createdAt: FieldValue.serverTimestamp(),
    createdIpHash: clientIpHash,
  });

  return extensionAuthJsonResponse({
    code: formatExtensionCode(rawCode),
    expiresAt: expiresAt.toISOString(),
    expiresInSeconds: Math.floor(CODE_TTL_MS / 1000),
    email: verified.normalizedEmail,
  });
};

export const createExtensionSessionToken = (payload: Pick<ExtensionSessionPayload, "sub" | "email" | "emailKey">) => {
  const now = Math.floor(Date.now() / 1000);
  const sessionPayload: ExtensionSessionPayload = {
    typ: "extension-session",
    sub: payload.sub,
    email: payload.email,
    emailKey: payload.emailKey,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(sessionPayload));
  const signature = hmacBase64Url(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
};

export const verifyExtensionSessionToken = (token: string): VerifiedExtensionSession | null => {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;
  const expectedSignature = hmacBase64Url(`${header}.${body}`);
  if (!timingSafeEqualString(signature, expectedSignature)) return null;

  let payload: ExtensionSessionPayload;
  try {
    payload = JSON.parse(base64UrlDecode(body)) as ExtensionSessionPayload;
  } catch {
    return null;
  }

  if (payload.typ !== "extension-session") return null;
  if (!payload.sub || !payload.email || !payload.emailKey) return null;
  if (payload.exp <= Math.floor(Date.now() / 1000)) return null;

  const normalizedEmail = normalizeEmail(payload.email);
  const emailKey = emailToCreditDocId(normalizedEmail);
  if (payload.emailKey !== emailKey) return null;

  return {
    uid: payload.sub,
    email: payload.email,
    normalizedEmail,
    emailKey,
  };
};

export const exchangeExtensionAuthCode = async (request: Request) => {
  const body = (await request.json().catch(() => ({}))) as { email?: unknown; code?: unknown };
  const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
  const code = typeof body.code === "string" ? normalizeExtensionCode(body.code) : "";

  if (!email || !isValidEmail(email)) {
    return extensionAuthJsonResponse({ error: "invalid_email" }, { status: 400 });
  }

  if (code.length !== CODE_LENGTH) {
    return extensionAuthJsonResponse({ error: "invalid_code" }, { status: 400 });
  }

  const allowed = await rateLimit("exchange", [emailToCreditDocId(email), sha256(getClientIp(request))], EXCHANGE_ATTEMPT_LIMIT);
  if (!allowed) {
    return extensionAuthJsonResponse({ error: "rate_limited" }, { status: 429 });
  }

  const codeHash = sha256(`${email}:${code}`);
  const db = adminDb();
  const codeRef = db.collection(EXTENSION_AUTH_CODES_COLLECTION).doc(codeHash);

  const result = await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(codeRef);
    if (!snapshot.exists) return { error: "invalid_code" as const };

    const data = snapshot.data() as StoredCode;
    if (data.normalizedEmail !== email) return { error: "invalid_code" as const };
    if (data.usedAt) return { error: "code_used" as const };
    if (toMillis(data.expiresAt) <= Date.now()) return { error: "code_expired" as const };
    if (!data.userId || !data.email) return { error: "invalid_code" as const };

    transaction.update(codeRef, {
      usedAt: FieldValue.serverTimestamp(),
      exchangedAt: FieldValue.serverTimestamp(),
      exchangedIpHash: sha256(getClientIp(request)),
    });

    return {
      userId: data.userId,
      email: normalizeEmail(data.email),
    };
  });

  if ("error" in result) {
    const status = result.error === "code_expired" || result.error === "code_used" ? 410 : 401;
    return extensionAuthJsonResponse({ error: result.error }, { status });
  }

  const emailKey = emailToCreditDocId(result.email);
  return extensionAuthJsonResponse({
    token: createExtensionSessionToken({
      sub: result.userId,
      email: result.email,
      emailKey,
    }),
    tokenType: "Bearer",
    expiresInSeconds: SESSION_TTL_SECONDS,
    email: result.email,
  });
};
