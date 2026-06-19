import type { APIRoute } from "astro";
import { Polar } from "@polar-sh/sdk";
import { CREDIT_PLANS, isValidEmail, normalizeEmail, resolvePlanId } from "../../lib/billing";
import { readServerEnv } from "../../lib/server-env";

const absoluteUrl = (base: string, path: string) => new URL(path, base).toString();

export const GET: APIRoute = async ({ url, request }) => {
  const rawPlan = url.searchParams.get("plan") || "popular";
  const planId = resolvePlanId(rawPlan);
  const plan = planId ? CREDIT_PLANS[planId] : null;

  if (!plan) {
    return new Response("Unknown plan", { status: 400 });
  }

  const rawEmail = url.searchParams.get("email") || "";
  const customerEmail = normalizeEmail(rawEmail);

  if (!isValidEmail(customerEmail)) {
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

  const checkout = await polar.checkouts.create({
    products: [productId],
    prices: {
      [productId]: [
        {
          amountType: "fixed",
          priceAmount: plan.amount,
          priceCurrency: "usd",
        },
      ],
    },
    customerEmail,
    successUrl: absoluteUrl(
      appUrl,
      `/?checkout=success&plan=${encodeURIComponent(plan.id)}&checkout_id={CHECKOUT_ID}#pricing`,
    ),
    returnUrl: absoluteUrl(appUrl, "/#pricing"),
    allowDiscountCodes: true,
    metadata: {
      plan: plan.id,
      plan_id: plan.id,
      plan_name: plan.label,
      customer_email: customerEmail,
      screenshots: plan.credits,
      usage_limit: plan.limit,
      billing_period: plan.period,
      source: "landing_pricing",
      referrer: request.headers.get("referer") || "",
    },
  });

  const checkoutUrl = new URL(checkout.url);
  checkoutUrl.searchParams.set("theme", "light");

  return Response.redirect(checkoutUrl.toString(), 303);
};
