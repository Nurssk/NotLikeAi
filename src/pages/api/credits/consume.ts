import type { APIRoute } from "astro";
import { consumeCreditsForRequest, creditCorsHeaders, jsonResponse } from "../../../lib/credits";

export const prerender = false;

export const OPTIONS: APIRoute = async () => new Response(null, { status: 204, headers: creditCorsHeaders });

export const POST: APIRoute = async ({ request }) => {
  const body = (await request.json().catch(() => ({}))) as { amount?: unknown };
  const amount = typeof body.amount === "number" ? body.amount : 1;

  try {
    return await consumeCreditsForRequest(request, amount);
  } catch {
    return jsonResponse({ error: "credit_consume_failed" }, { status: 500 });
  }
};
