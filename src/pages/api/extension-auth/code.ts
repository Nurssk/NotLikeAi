import type { APIRoute } from "astro";
import {
  CODE_TTL_MS,
  generateCode,
  json,
  preflight,
  readBearer,
} from "../../../lib/extension-auth";

export const prerender = false;

export const OPTIONS: APIRoute = () => preflight();

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function emailToCreditDocId(normalizedEmail: string): string {
  return normalizedEmail.replace(/[.#$[\]/\s]/g, "_");
}

// POST /api/extension-auth/code  (Authorization: Bearer <firebase-id-token>)
// Legacy endpoint. The current code page writes { email, code } directly to
// Firestore, but keep this route compatible with the same simple document shape.
export const POST: APIRoute = async ({ request }) => {
  const idToken = readBearer(request);
  if (!idToken) return json({ error: "missing_authorization" }, 401);

  let decoded;
  try {
    const { getAdminAuth } = await import("../../../lib/firebase-admin");
    decoded = await getAdminAuth().verifyIdToken(idToken);
  } catch (err: any) {
    if (!String(err?.code ?? "").startsWith("auth/")) {
      console.error("[extension-auth/code] failed to verify id token", err);
    }
    return json({ error: "invalid_authorization" }, 401);
  }

  if (!decoded.email_verified || !decoded.email)
    return json({ error: "email_not_verified" }, 403);

  const normalizedEmail = normalizeEmail(decoded.email);
  const emailKey = emailToCreditDocId(normalizedEmail);
  const code = generateCode();

  try {
    const { getDb } = await import("../../../lib/firebase-admin");

    // Doc id = emailKey → creating a new code overwrites any prior one.
    await getDb()
      .collection("extensionAuthCodes")
      .doc(emailKey)
      .set({
        email: normalizedEmail,
        code,
      });
  } catch (err) {
    console.error("[extension-auth/code] failed to write code", err);
    return json({ error: "server_error" }, 500);
  }

  return json({
    code,
    expiresInSeconds: Math.floor(CODE_TTL_MS / 1000),
    email: normalizedEmail,
  });
};
