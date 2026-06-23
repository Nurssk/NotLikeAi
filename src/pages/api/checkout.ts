import type { APIRoute } from "astro";
import { Polar } from "@polar-sh/sdk";
import {
  CREDIT_PURCHASE_MAX_CREDITS,
  CREDIT_PURCHASE_MIN_CREDITS,
  CREDIT_PURCHASE_MAX_AMOUNT,
  CREDIT_PURCHASE_MIN_AMOUNT,
  creditPurchaseFromAmount,
  creditPurchaseFromQuantity,
  isValidEmail,
  normalizeEmail,
} from "../../lib/billing";
import { readServerEnv } from "../../lib/server-env";

const absoluteUrl = (base: string, path: string) => new URL(path, base).toString();

export const GET: APIRoute = async ({ url, request }) => {
  const rawAmount = url.searchParams.get("amount");
  const rawCredits = url.searchParams.get("credits") || String(CREDIT_PURCHASE_MAX_CREDITS);
  const purchase = rawAmount ? creditPurchaseFromAmount(rawAmount) : creditPurchaseFromQuantity(rawCredits);

  if (!purchase) {
    return new Response(
      rawAmount
        ? `Amount must be whole cents between ${CREDIT_PURCHASE_MIN_AMOUNT} and ${CREDIT_PURCHASE_MAX_AMOUNT}`
        : `Credits must be a whole number between ${CREDIT_PURCHASE_MIN_CREDITS} and ${CREDIT_PURCHASE_MAX_CREDITS}`,
      { status: 400 },
    );
  }

  const rawEmail = url.searchParams.get("email") || "";
  const customerEmail = normalizeEmail(rawEmail);

  if (customerEmail && !isValidEmail(customerEmail)) {
    return new Response("A valid checkout email is required", { status: 400 });
  }

  const accessToken = readServerEnv("POLAR_ACCESS_TOKEN");
  const productId = readServerEnv("POLAR_PRODUCT_ID");
  const appUrl = readServerEnv("NEXT_PUBLIC_APP_URL") || url.origin;
  const server = readServerEnv("POLAR_SERVER") === "sandbox" ? "sandbox" : "production";

  if (!accessToken || !productId) {
    return new Response("Polar is not configured", { status: 500 });
  }

  const polar = new Polar({
    accessToken,
    server,
  });

  const referrer = request.headers.get("referer") || "";
  const checkoutMetadata = {
    purchase_type: "credits",
    credit_quantity: purchase.credits,
    credit_pack: purchase.label,
    credits: purchase.credits,
    amount_cents: purchase.amount,
    usage_limit: purchase.limit,
    billing_period: purchase.period,
    pricing_mode: rawAmount ? "amount" : "credits",
    source: "landing_pricing",
    ...(customerEmail ? { customer_email: customerEmail } : {}),
    ...(referrer ? { referrer } : {}),
  };

  const checkout = await polar.checkouts.create({
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
    customerEmail: customerEmail || undefined,
    successUrl: absoluteUrl(
      appUrl,
      `/?checkout=success&credits=${encodeURIComponent(String(purchase.credits))}&checkout_id={CHECKOUT_ID}#pricing`,
    ),
    returnUrl: absoluteUrl(appUrl, "/#pricing"),
    allowDiscountCodes: true,
    metadata: checkoutMetadata,
  });

  const checkoutUrl = new URL(checkout.url);
  checkoutUrl.searchParams.set("theme", "light");

  return Response.redirect(checkoutUrl.toString(), 303);
};
