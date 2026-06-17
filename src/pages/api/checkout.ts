import type { APIRoute } from "astro";
import { Polar } from "@polar-sh/sdk";

type PlanId = "minimal" | "popular" | "maximum";

type BillingPlan = {
  id: PlanId;
  label: string;
  amount: number;
  screenshots: number;
  limit: string;
};

declare const process:
  | {
      env: Record<string, string | undefined>;
    }
  | undefined;

const PLANS: Record<PlanId, BillingPlan> = {
  minimal: {
    id: "minimal",
    label: "Minimal",
    amount: 1000,
    screenshots: 50,
    limit: "screenshots per week",
  },
  popular: {
    id: "popular",
    label: "Popular",
    amount: 2500,
    screenshots: 200,
    limit: "screenshots per month",
  },
  maximum: {
    id: "maximum",
    label: "Maximum",
    amount: 4000,
    screenshots: 450,
    limit: "screenshots per month",
  },
};

const PLAN_ALIASES: Record<string, PlanId> = {
  min: "minimal",
  minimal: "minimal",
  popular: "popular",
  max: "maximum",
  maximum: "maximum",
};

const readEnv = (key: string) =>
  (import.meta.env[key] as string | undefined) ||
  (typeof process !== "undefined" ? process.env[key] : undefined);

const absoluteUrl = (base: string, path: string) => new URL(path, base).toString();

export const GET: APIRoute = async ({ url, request }) => {
  const rawPlan = url.searchParams.get("plan") || "popular";
  const planId = PLAN_ALIASES[rawPlan];
  const plan = planId ? PLANS[planId] : null;

  if (!plan) {
    return new Response("Unknown plan", { status: 400 });
  }

  const accessToken = readEnv("POLAR_ACCESS_TOKEN");
  const productId = readEnv("POLAR_PRODUCT_ID");
  const appUrl = readEnv("NEXT_PUBLIC_APP_URL") || url.origin;
  const server = readEnv("POLAR_SERVER") === "sandbox" ? "sandbox" : "production";

  if (!accessToken || !productId) {
    return new Response("Polar is not configured", { status: 500 });
  }

  const customerEmail = url.searchParams.get("email") || undefined;
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
      plan_name: plan.label,
      screenshots: plan.screenshots,
      usage_limit: plan.limit,
      source: "landing_pricing",
      referrer: request.headers.get("referer") || "",
    },
  });

  const checkoutUrl = new URL(checkout.url);
  checkoutUrl.searchParams.set("theme", "light");

  return Response.redirect(checkoutUrl.toString(), 303);
};
