import type { APIRoute } from "astro";
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";
import { getDb } from "../../../lib/firebase-admin";
import {
  grantPurchasedCredits,
  normalizeEmail,
  recordEvent,
} from "../../../lib/credits";
import { requireEnv } from "../../../lib/env";

export const prerender = false;

function pickEmail(order: any): string {
  const raw =
    order?.customer?.email ??
    order?.customerEmail ??
    order?.metadata?.customer_email ??
    "";
  return raw ? normalizeEmail(String(raw)) : "";
}

function pickCredits(order: any): number {
  const raw = order?.metadata?.credits ?? order?.metadata?.credit_quantity;
  const n = Number.parseInt(String(raw ?? ""), 10);
  return Number.isFinite(n) ? n : 0;
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.text();
  const headers = Object.fromEntries(request.headers.entries());

  let event: { type: string; data: any };
  try {
    event = validateEvent(
      body,
      headers,
      requireEnv("POLAR_WEBHOOK_SECRET")
    ) as any;
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      return new Response("Invalid Polar webhook signature", { status: 403 });
    }
    console.error("[polar webhook] unexpected validation error", err);
    return new Response("Webhook error", { status: 500 });
  }

  const db = getDb();
  const order = event.data ?? {};
  // Standard-webhooks delivery id → stable idempotency key.
  const eventId =
    headers["webhook-id"] || `${event.type}_${order?.id ?? "unknown"}`;

  try {
    if (event.type === "order.paid") {
      const status = await grantPurchasedCredits({
        db,
        normalizedEmail: pickEmail(order),
        credits: pickCredits(order),
        purchaseLabel: String(order?.metadata?.credit_pack ?? ""),
        eventId,
        eventType: event.type,
        polarObjectId: order?.id ?? null,
        polarCustomerId: order?.customerId ?? order?.customer?.id ?? null,
        polarCheckoutId: order?.checkoutId ?? null,
        polarOrderId: order?.id ?? null,
      });
      return new Response(JSON.stringify({ status }), {
        status: status === "duplicate" ? 200 : 202,
        headers: { "content-type": "application/json" },
      });
    }

    if (event.type === "order.refunded") {
      // Recorded for audit; credit reversal is handled manually for now.
      await recordEvent(db, eventId, {
        type: event.type,
        polarObjectId: order?.id ?? null,
        emailKey: pickEmail(order)
          ? pickEmail(order).replace(/[.#$[\]/\s]/g, "_")
          : null,
        processingStatus: "refund_recorded",
      });
      return new Response(JSON.stringify({ status: "refund_recorded" }), {
        status: 202,
        headers: { "content-type": "application/json" },
      });
    }

    // Unsupported event type — acknowledge so Polar stops retrying.
    return new Response(JSON.stringify({ status: "ignored" }), {
      status: 202,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error("[polar webhook] processing failed", err);
    return new Response("Webhook processing error", { status: 500 });
  }
};
