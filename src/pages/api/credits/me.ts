import type { APIRoute } from "astro";
import { getDb } from "../../../lib/firebase-admin";
import { readOrCreateCredits } from "../../../lib/credits";
import { requireEnv } from "../../../lib/env";
import {
  json,
  preflight,
  readBearer,
  verifySessionToken,
} from "../../../lib/extension-auth";

export const prerender = false;

export const OPTIONS: APIRoute = () => preflight();

// GET /api/credits/me  (Authorization: Bearer <extension-session-token>)
export const GET: APIRoute = async ({ request }) => {
  const token = readBearer(request);
  if (!token) return json({ error: "missing_authorization" }, 401);

  const session = verifySessionToken(token, requireEnv("EXTENSION_AUTH_SECRET"));
  if (!session) return json({ error: "invalid_authorization" }, 401);

  try {
    const view = await readOrCreateCredits(getDb(), session.email);
    return json(view);
  } catch (err) {
    console.error("[credits/me] failed", err);
    return json({ error: "server_error" }, 500);
  }
};
