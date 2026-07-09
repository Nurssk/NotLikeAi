import type { APIRoute } from "astro";
import { getDb } from "../../../lib/firebase-admin";
import { CreditError, consumeCredits } from "../../../lib/credits";
import { requireEnv } from "../../../lib/env";
import {
  json,
  preflight,
  readBearer,
  verifySessionToken,
} from "../../../lib/extension-auth";

export const prerender = false;

export const OPTIONS: APIRoute = () => preflight();

// POST /api/credits/consume  { amount }  (Bearer <extension-session-token>)
export const POST: APIRoute = async ({ request }) => {
  const token = readBearer(request);
  if (!token) return json({ error: "missing_authorization" }, 401);

  const session = verifySessionToken(token, requireEnv("EXTENSION_AUTH_SECRET"));
  if (!session) return json({ error: "invalid_authorization" }, 401);

  let amount = 1;
  try {
    const body = await request.json();
    if (body && body.amount != null) amount = Number(body.amount);
  } catch {
    // empty/invalid body → default to consuming 1
  }
  if (!Number.isInteger(amount) || amount < 1)
    return json({ error: "invalid_amount" }, 400);

  try {
    const view = await consumeCredits(getDb(), session.email, amount);
    return json(view);
  } catch (err) {
    if (err instanceof CreditError) {
      return json(
        { error: err.code, creditsRemaining: err.creditsRemaining },
        err.httpStatus
      );
    }
    console.error("[credits/consume] failed", err);
    return json({ error: "server_error" }, 500);
  }
};
