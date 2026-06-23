export const CREDIT_PURCHASE_MIN_CREDITS = 3;
export const CREDIT_PURCHASE_MAX_CREDITS = 200;
export const CREDIT_PURCHASE_MIN_AMOUNT = 100;
export const CREDIT_PURCHASE_MAX_AMOUNT = 6500;

export type CreditPurchase = {
  credits: number;
  amount: number;
  label: string;
  limit: string;
  period: "one_time";
};

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));

export const emailToCreditDocId = (email: string) => normalizeEmail(email).replace(/[.#$[\]/\s]/g, "_");

export const amountForCredits = (credits: number) => {
  const progress =
    (credits - CREDIT_PURCHASE_MIN_CREDITS) / (CREDIT_PURCHASE_MAX_CREDITS - CREDIT_PURCHASE_MIN_CREDITS);
  return Math.round(CREDIT_PURCHASE_MIN_AMOUNT + progress * (CREDIT_PURCHASE_MAX_AMOUNT - CREDIT_PURCHASE_MIN_AMOUNT));
};

export const creditsForAmount = (amount: number) => {
  const progress =
    (amount - CREDIT_PURCHASE_MIN_AMOUNT) / (CREDIT_PURCHASE_MAX_AMOUNT - CREDIT_PURCHASE_MIN_AMOUNT);
  return Math.round(CREDIT_PURCHASE_MIN_CREDITS + progress * (CREDIT_PURCHASE_MAX_CREDITS - CREDIT_PURCHASE_MIN_CREDITS));
};

export const resolveCreditQuantity = (rawCredits: string | number | null | undefined) => {
  const credits = typeof rawCredits === "number" ? rawCredits : Number(rawCredits);
  if (!Number.isInteger(credits)) return null;
  if (credits < CREDIT_PURCHASE_MIN_CREDITS || credits > CREDIT_PURCHASE_MAX_CREDITS) return null;
  return credits;
};

export const resolveCreditAmount = (rawAmount: string | number | null | undefined) => {
  const amount = typeof rawAmount === "number" ? rawAmount : Number(rawAmount);
  if (!Number.isInteger(amount)) return null;
  if (amount < CREDIT_PURCHASE_MIN_AMOUNT || amount > CREDIT_PURCHASE_MAX_AMOUNT) return null;
  return amount;
};

export const creditPurchaseFromQuantity = (rawCredits: string | number | null | undefined): CreditPurchase | null => {
  const credits = resolveCreditQuantity(rawCredits);
  if (!credits) return null;

  return {
    credits,
    amount: amountForCredits(credits),
    label: `${credits} credits`,
    limit: "one-time credits",
    period: "one_time",
  };
};

export const creditPurchaseFromAmount = (rawAmount: string | number | null | undefined): CreditPurchase | null => {
  const amount = resolveCreditAmount(rawAmount);
  if (!amount) return null;

  const credits = resolveCreditQuantity(creditsForAmount(amount));
  if (!credits) return null;

  return {
    credits,
    amount,
    label: `${credits} credits`,
    limit: "one-time credits",
    period: "one_time",
  };
};

const creditQuantityFromAmount = (amount: number | null | undefined) => {
  if (typeof amount !== "number") return null;

  for (let credits = CREDIT_PURCHASE_MIN_CREDITS; credits <= CREDIT_PURCHASE_MAX_CREDITS; credits += 1) {
    if (amountForCredits(credits) === amount) return credits;
  }

  return null;
};

export const purchaseFromMetadata = (metadata: Record<string, unknown> | null | undefined, amount?: number | null) => {
  const metadataCredits = metadata?.credits ?? metadata?.credit_quantity;
  const purchase = creditPurchaseFromQuantity(
    typeof metadataCredits === "string" || typeof metadataCredits === "number" ? metadataCredits : null,
  );

  if (purchase) return purchase;

  return creditPurchaseFromQuantity(creditQuantityFromAmount(amount));
};
