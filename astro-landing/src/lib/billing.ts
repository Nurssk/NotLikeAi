// Pricing math — the single source of truth shared by the pricing slider and
// the checkout route. Amounts are in cents ($1 = 100).

export const CREDIT_PURCHASE_MIN_CREDITS = 3;
export const CREDIT_PURCHASE_MAX_CREDITS = 200;
export const CREDIT_PURCHASE_MIN_AMOUNT = 100; // $1
export const CREDIT_PURCHASE_MAX_AMOUNT = 6500; // $65

const MIN_PRICE_DOLLARS = CREDIT_PURCHASE_MIN_AMOUNT / 100;
const MAX_PRICE_DOLLARS = CREDIT_PURCHASE_MAX_AMOUNT / 100;

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/** Whole-dollar price for a given screenshot count (matches the slider UI). */
export function priceDollarsForCredits(credits: number): number {
  const c = clamp(
    Math.round(credits),
    CREDIT_PURCHASE_MIN_CREDITS,
    CREDIT_PURCHASE_MAX_CREDITS
  );
  if (c <= CREDIT_PURCHASE_MIN_CREDITS) return MIN_PRICE_DOLLARS;
  if (c >= CREDIT_PURCHASE_MAX_CREDITS) return MAX_PRICE_DOLLARS;
  const ratio =
    (c - CREDIT_PURCHASE_MIN_CREDITS) /
    (CREDIT_PURCHASE_MAX_CREDITS - CREDIT_PURCHASE_MIN_CREDITS);
  return Math.round(
    MIN_PRICE_DOLLARS + ratio * (MAX_PRICE_DOLLARS - MIN_PRICE_DOLLARS)
  );
}

/** Screenshot count for a whole-dollar price (inverse of the slider UI). */
export function creditsForPriceDollars(dollars: number): number {
  const d = clamp(Math.round(dollars), MIN_PRICE_DOLLARS, MAX_PRICE_DOLLARS);
  if (d <= MIN_PRICE_DOLLARS) return CREDIT_PURCHASE_MIN_CREDITS;
  if (d >= MAX_PRICE_DOLLARS) return CREDIT_PURCHASE_MAX_CREDITS;
  const ratio =
    (d - MIN_PRICE_DOLLARS) / (MAX_PRICE_DOLLARS - MIN_PRICE_DOLLARS);
  return Math.round(
    CREDIT_PURCHASE_MIN_CREDITS +
      ratio *
        (CREDIT_PURCHASE_MAX_CREDITS - CREDIT_PURCHASE_MIN_CREDITS)
  );
}

export interface Purchase {
  credits: number;
  amount: number; // cents
  label: string;
  limit: "one-time credits";
  period: "one_time";
  pricingMode: "credits" | "amount";
}

/**
 * Resolve a checkout request (given screenshots OR an amount in cents) into a
 * single canonical purchase. The server is authoritative: the charged amount
 * is always derived here so the customer pays exactly the count's price.
 */
export function resolvePurchase(input: {
  credits?: number | null;
  amount?: number | null;
}): Purchase {
  let credits: number;
  let pricingMode: "credits" | "amount";

  if (input.amount != null && Number.isFinite(input.amount)) {
    pricingMode = "amount";
    credits = creditsForPriceDollars(input.amount / 100);
  } else {
    pricingMode = "credits";
    credits = clamp(
      Math.round(input.credits ?? CREDIT_PURCHASE_MIN_CREDITS),
      CREDIT_PURCHASE_MIN_CREDITS,
      CREDIT_PURCHASE_MAX_CREDITS
    );
  }

  const amount = priceDollarsForCredits(credits) * 100;

  return {
    credits,
    amount,
    label: `${credits} screenshot${credits === 1 ? "" : "s"}`,
    limit: "one-time credits",
    period: "one_time",
    pricingMode,
  };
}
