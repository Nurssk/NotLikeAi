import type { APIRoute } from "astro";
import { getAdminAuth, getDb } from "../../../lib/firebase-admin";
import { emailToCreditDocId, normalizeEmail } from "../../../lib/credits";
import { requireEnv } from "../../../lib/env";
import {
  json,
  normalizeCode,
  preflight,
  signSessionToken,
} from "../../../lib/extension-auth";

export const prerender = false;

export const OPTIONS: APIRoute = () => preflight();

// POST /api/extension-auth/exchange  { email, code }
// Verifies a one-time code and returns an HMAC session token. The website stores
// only { email, code } in Firestore; this endpoint resolves the Firebase uid by
// email and deletes the code on success.
export const POST: APIRoute = async ({ request }) => {
  let payload: { email?: string; code?: string };
  try {
    payload = await request.json();
  } catch {
    return json({ error: "invalid_request" }, 400);
  }

  const email = payload.email ? normalizeEmail(payload.email) : "";
  const code = payload.code ? normalizeCode(payload.code) : "";
  if (!email || !code) return json({ error: "invalid_request" }, 400);

  const emailKey = emailToCreditDocId(email);
  const db = getDb();
  const ref = db.collection("extensionAuthCodes").doc(emailKey);

  const result = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return { ok: false as const };
    const data = snap.data()!;

    if (String(data.email ?? "") !== email || String(data.code ?? "") !== code) {
      if (String(data.email ?? "") === email) {
        tx.delete(ref);
      }
      return { ok: false as const };
    }

    // One-time use: delete on success.
    tx.delete(ref);
    return {
      ok: true as const,
      normalizedEmail: email,
    };
  });

  if (!result.ok) return json({ error: "invalid_code" }, 401);

  let uid = "";
  try {
    const user = await getAdminAuth().getUserByEmail(result.normalizedEmail);
    uid = user.uid;
  } catch {
    return json({ error: "user_not_found" }, 401);
  }

  const { token, expiresInSeconds } = signSessionToken(
    {
      sub: uid,
      email: result.normalizedEmail,
      emailKey: emailToCreditDocId(result.normalizedEmail),
    },
    requireEnv("EXTENSION_AUTH_SECRET")
  );

  return json({
    token,
    tokenType: "Bearer",
    expiresInSeconds,
    email: result.normalizedEmail,
  });
};
