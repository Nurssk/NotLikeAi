import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import type { DecodedIdToken } from "firebase-admin/auth";
import { emailToCreditDocId, isValidEmail, normalizeEmail } from "./billing";
import { adminAuth, adminDb } from "./firebase-admin";
import { readServerEnv } from "./server-env";

export const EXTENSION_AUTH_CODES_COLLECTION = "extensionAuthCodes";

export const extensionAuthCorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

const CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CODE_LENGTH = 6;
const CODE_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;

type ExtensionSessionPayload = {
  typ: "extension-session";
  sub: string;
  email: string;
  emailKey: string;
  iat: number;
  exp: number;
};

type StoredCode = {
  email?: string;
  code?: string;
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

const deleteSnapshots = async (snapshots: FirebaseFirestore.QuerySnapshot[]) => {
  const db = adminDb();
  const refs = new Map<string, FirebaseFirestore.DocumentReference>();

  snapshots.forEach((snapshot) => {
    snapshot.docs.forEach((doc) => refs.set(doc.ref.path, doc.ref));
  });

  const refsToDelete = Array.from(refs.values());
  for (let index = 0; index < refsToDelete.length; index += 500) {
    const batch = db.batch();
    refsToDelete.slice(index, index + 500).forEach((ref) => batch.delete(ref));
    await batch.commit();
  }
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

  const db = adminDb();
  const rawCode = generateRawCode();
  const codesCollection = db.collection(EXTENSION_AUTH_CODES_COLLECTION);
  const [emailSnapshot, originalEmailSnapshot, normalizedEmailSnapshot] = await Promise.all([
    codesCollection.where("email", "==", verified.normalizedEmail).get(),
    codesCollection.where("email", "==", verified.decodedToken.email).get(),
    codesCollection.where("normalizedEmail", "==", verified.normalizedEmail).get(),
  ]);

  await deleteSnapshots([emailSnapshot, originalEmailSnapshot, normalizedEmailSnapshot]);

  await codesCollection.add({
    email: verified.normalizedEmail,
    code: rawCode,
  });

  return extensionAuthJsonResponse({
    code: formatExtensionCode(rawCode),
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

  const db = adminDb();
  const snapshot = await db
    .collection(EXTENSION_AUTH_CODES_COLLECTION)
    .where("email", "==", email)
    .where("code", "==", code)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return extensionAuthJsonResponse({ error: "invalid_code" }, { status: 401 });
  }

  const codeDoc = snapshot.docs[0];
  const data = codeDoc.data() as StoredCode;
  if (normalizeEmail(data.email || "") !== email || data.code !== code) {
    return extensionAuthJsonResponse({ error: "invalid_code" }, { status: 401 });
  }

  let userId = "";
  try {
    const user = await adminAuth().getUserByEmail(email);
    userId = user.uid;
  } catch {
    return extensionAuthJsonResponse({ error: "user_not_found" }, { status: 401 });
  }

  await codeDoc.ref.delete();

  const emailKey = emailToCreditDocId(email);
  return extensionAuthJsonResponse({
    token: createExtensionSessionToken({
      sub: userId,
      email,
      emailKey,
    }),
    tokenType: "Bearer",
    expiresInSeconds: SESSION_TTL_SECONDS,
    email,
  });
};
