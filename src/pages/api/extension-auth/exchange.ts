import type { APIRoute } from "astro";
import type { Timestamp } from "firebase-admin/firestore";
import { getDb } from "../../../lib/firebase-admin";
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
// Verifies a one-time code and returns an HMAC session token. Codes are
// single-use: deleted on success. Generic errors on any mismatch.
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

    const expiresAt: Timestamp | undefined = data.expiresAt;
    const expired = expiresAt ? expiresAt.toMillis() < Date.now() : false;

    if (data.code !== code || data.usedAt || expired) {
      // Clean up spent/expired codes so they can't be retried.
      if (data.usedAt || expired) tx.delete(ref);
      return { ok: false as const };
    }

    // One-time use: delete on success.
    tx.delete(ref);
    return {
      ok: true as const,
      uid: String(data.uid ?? ""),
      normalizedEmail: String(data.normalizedEmail ?? email),
    };
  });

  if (!result.ok) return json({ error: "invalid_code" }, 401);

  const { token, expiresInSeconds } = signSessionToken(
    {
      sub: result.uid,
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
