import type { APIRoute } from "astro";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAdminAuth, getDb } from "../../../lib/firebase-admin";
import { emailToCreditDocId, normalizeEmail } from "../../../lib/credits";
import {
  CODE_TTL_MS,
  generateCode,
  json,
  preflight,
  readBearer,
} from "../../../lib/extension-auth";

export const prerender = false;

export const OPTIONS: APIRoute = () => preflight();

// POST /api/extension-auth/code  (Authorization: Bearer <firebase-id-token>)
// Creates a fresh one-time code for the verified user. Server-only writer of
// extensionAuthCodes, so browser clients never touch that collection.
export const POST: APIRoute = async ({ request }) => {
  const idToken = readBearer(request);
  if (!idToken) return json({ error: "missing_authorization" }, 401);

  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(idToken);
  } catch {
    return json({ error: "invalid_authorization" }, 401);
  }

  if (!decoded.email_verified || !decoded.email)
    return json({ error: "email_not_verified" }, 403);

  const normalizedEmail = normalizeEmail(decoded.email);
  const emailKey = emailToCreditDocId(normalizedEmail);
  const code = generateCode();
  const expiresAt = Timestamp.fromMillis(Date.now() + CODE_TTL_MS);

  // Doc id = emailKey → creating a new code overwrites any prior one.
  await getDb()
    .collection("extensionAuthCodes")
    .doc(emailKey)
    .set({
      email: normalizedEmail,
      normalizedEmail,
      emailKey,
      uid: decoded.uid,
      code,
      createdAt: FieldValue.serverTimestamp(),
      expiresAt,
      usedAt: null,
    });

  return json({
    code,
    expiresInSeconds: Math.floor(CODE_TTL_MS / 1000),
    email: normalizedEmail,
  });
};
