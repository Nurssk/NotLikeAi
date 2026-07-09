import type { APIRoute } from "astro";
import { resolvePurchase } from "../../lib/billing";
import { normalizeEmail } from "../../lib/credits";
import { serverEnv } from "../../lib/env";
import { getPolar, getPolarProductId } from "../../lib/polar";

// Serverless (on-demand) — never prerender.
export const prerender = false;

function parseIntOrNull(v: string | null): number | null {
  if (v == null || v.trim() === "") return null;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

const absoluteUrl = (base: string, path: string) => new URL(path, base).toString();

export const GET: APIRoute = async ({ url, request }) => {
  const credits = parseIntOrNull(url.searchParams.get("credits"));
  const amount = parseIntOrNull(url.searchParams.get("amount"));
  const rawEmail = url.searchParams.get("email");
  const email = rawEmail ? normalizeEmail(rawEmail) : undefined;

  const purchase = resolvePurchase({ credits, amount });

  // Redirect back to this same deployment after payment. Success only means
  // the browser returned — credits are granted by the Polar webhook.
  const origin = new URL(request.url).origin;
  const appUrl = serverEnv("NEXT_PUBLIC_APP_URL") || origin;
  const productId = getPolarProductId();
  const referrer = request.headers.get("referer") || "";

  try {
    const checkout = await getPolar().checkouts.create({
      products: [productId],
      prices: {
        [productId]: [
          {
            amountType: "fixed",
            priceAmount: purchase.amount,
            priceCurrency: "usd",
          },
        ],
      },
      ...(email ? { customerEmail: email } : {}),
      successUrl: absoluteUrl(
        appUrl,
        `/thank-you?credits=${encodeURIComponent(String(purchase.credits))}&checkout_id={CHECKOUT_ID}`
      ),
      returnUrl: absoluteUrl(appUrl, "/#pricing"),
      allowDiscountCodes: true,
      metadata: {
        purchase_type: "credits",
        credit_quantity: purchase.credits,
        credit_pack: purchase.label,
        credits: purchase.credits,
        amount_cents: purchase.amount,
        usage_limit: purchase.limit,
        billing_period: purchase.period,
        pricing_mode: purchase.pricingMode,
        source: "landing_pricing",
        ...(email ? { customer_email: email } : {}),
        ...(referrer ? { referrer } : {}),
      },
    });

    const checkoutUrl = new URL(checkout.url);
    checkoutUrl.searchParams.set("theme", "light");

    return new Response(null, {
      status: 303,
      headers: { Location: checkoutUrl.toString() },
    });
  } catch (err) {
    console.error("[checkout] failed to create Polar checkout", err);
    return new Response("Unable to start checkout. Please try again.", {
      status: 502,
    });
  }
};
