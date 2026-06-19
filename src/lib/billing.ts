export type PlanId = "minimal" | "popular" | "maximum";

export type BillingPlan = {
  id: PlanId;
  label: string;
  amount: number;
  credits: number;
  period: "week" | "month";
  limit: string;
};

export const CREDIT_PLANS: Record<PlanId, BillingPlan> = {
  minimal: {
    id: "minimal",
    label: "Minimal",
    amount: 1000,
    credits: 50,
    period: "week",
    limit: "screenshots per week",
  },
  popular: {
    id: "popular",
    label: "Popular",
    amount: 2500,
    credits: 200,
    period: "month",
    limit: "screenshots per month",
  },
  maximum: {
    id: "maximum",
    label: "Maximum",
    amount: 4000,
    credits: 450,
    period: "month",
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

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));

export const emailToCreditDocId = (email: string) => normalizeEmail(email).replace(/[.#$[\]/\s]/g, "_");

export const resolvePlanId = (rawPlan: string | null | undefined): PlanId | null => {
  if (!rawPlan) return null;
  return PLAN_ALIASES[rawPlan.toLowerCase()] ?? null;
};

export const planFromAmount = (amount: number | null | undefined): BillingPlan | null =>
  Object.values(CREDIT_PLANS).find((plan) => plan.amount === amount) ?? null;

export const planFromMetadata = (metadata: Record<string, unknown> | null | undefined, amount?: number | null) => {
  const metadataPlan = metadata?.plan ?? metadata?.plan_id;
  if (typeof metadataPlan === "string") {
    const planId = resolvePlanId(metadataPlan);
    if (planId) return CREDIT_PLANS[planId];
  }

  return planFromAmount(amount);
};
