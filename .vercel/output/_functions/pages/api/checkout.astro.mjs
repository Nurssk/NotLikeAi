import { Polar } from '@polar-sh/sdk';
import { C as CREDIT_PURCHASE_MAX_CREDITS, a as CREDIT_PURCHASE_MIN_AMOUNT, b as CREDIT_PURCHASE_MAX_AMOUNT, c as CREDIT_PURCHASE_MIN_CREDITS, n as normalizeEmail, i as isValidEmail, r as readServerEnv, d as creditPurchaseFromAmount, e as creditPurchaseFromQuantity } from '../../chunks/server-env_D1vftNvA.mjs';
export { renderers } from '../../renderers.mjs';

const absoluteUrl = (base, path) => new URL(path, base).toString();
const GET = async ({ url, request }) => {
  const rawAmount = url.searchParams.get("amount");
  const rawCredits = url.searchParams.get("credits") || String(CREDIT_PURCHASE_MAX_CREDITS);
  const purchase = rawAmount ? creditPurchaseFromAmount(rawAmount) : creditPurchaseFromQuantity(rawCredits);
  if (!purchase) {
    return new Response(
      rawAmount ? `Amount must be whole cents between ${CREDIT_PURCHASE_MIN_AMOUNT} and ${CREDIT_PURCHASE_MAX_AMOUNT}` : `Credits must be a whole number between ${CREDIT_PURCHASE_MIN_CREDITS} and ${CREDIT_PURCHASE_MAX_CREDITS}`,
      { status: 400 }
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
    server
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
    ...customerEmail ? { customer_email: customerEmail } : {},
    ...referrer ? { referrer } : {}
  };
  const checkout = await polar.checkouts.create({
    products: [productId],
    prices: {
      [productId]: [
        {
          amountType: "fixed",
          priceAmount: purchase.amount,
          priceCurrency: "usd"
        }
      ]
    },
    customerEmail: customerEmail || void 0,
    successUrl: absoluteUrl(
      appUrl,
      `/?checkout=success&credits=${encodeURIComponent(String(purchase.credits))}&checkout_id={CHECKOUT_ID}#pricing`
    ),
    returnUrl: absoluteUrl(appUrl, "/#pricing"),
    allowDiscountCodes: true,
    metadata: checkoutMetadata
  });
  const checkoutUrl = new URL(checkout.url);
  checkoutUrl.searchParams.set("theme", "light");
  return Response.redirect(checkoutUrl.toString(), 303);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
