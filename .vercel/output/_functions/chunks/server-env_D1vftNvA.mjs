const CREDIT_PURCHASE_MIN_CREDITS = 3;
const CREDIT_PURCHASE_MAX_CREDITS = 200;
const CREDIT_PURCHASE_MIN_AMOUNT = 100;
const CREDIT_PURCHASE_MAX_AMOUNT = 6500;
const normalizeEmail = (email) => email.trim().toLowerCase();
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
const emailToCreditDocId = (email) => normalizeEmail(email).replace(/[.#$[\]/\s]/g, "_");
const amountForCredits = (credits) => {
  const progress = (credits - CREDIT_PURCHASE_MIN_CREDITS) / (CREDIT_PURCHASE_MAX_CREDITS - CREDIT_PURCHASE_MIN_CREDITS);
  return Math.round(CREDIT_PURCHASE_MIN_AMOUNT + progress * (CREDIT_PURCHASE_MAX_AMOUNT - CREDIT_PURCHASE_MIN_AMOUNT));
};
const creditsForAmount = (amount) => {
  const progress = (amount - CREDIT_PURCHASE_MIN_AMOUNT) / (CREDIT_PURCHASE_MAX_AMOUNT - CREDIT_PURCHASE_MIN_AMOUNT);
  return Math.round(CREDIT_PURCHASE_MIN_CREDITS + progress * (CREDIT_PURCHASE_MAX_CREDITS - CREDIT_PURCHASE_MIN_CREDITS));
};
const resolveCreditQuantity = (rawCredits) => {
  const credits = typeof rawCredits === "number" ? rawCredits : Number(rawCredits);
  if (!Number.isInteger(credits)) return null;
  if (credits < CREDIT_PURCHASE_MIN_CREDITS || credits > CREDIT_PURCHASE_MAX_CREDITS) return null;
  return credits;
};
const resolveCreditAmount = (rawAmount) => {
  const amount = typeof rawAmount === "number" ? rawAmount : Number(rawAmount);
  if (!Number.isInteger(amount)) return null;
  if (amount < CREDIT_PURCHASE_MIN_AMOUNT || amount > CREDIT_PURCHASE_MAX_AMOUNT) return null;
  return amount;
};
const creditPurchaseFromQuantity = (rawCredits) => {
  const credits = resolveCreditQuantity(rawCredits);
  if (!credits) return null;
  return {
    credits,
    amount: amountForCredits(credits),
    label: `${credits} credits`,
    limit: "one-time credits",
    period: "one_time"
  };
};
const creditPurchaseFromAmount = (rawAmount) => {
  const amount = resolveCreditAmount(rawAmount);
  if (!amount) return null;
  const credits = resolveCreditQuantity(creditsForAmount(amount));
  if (!credits) return null;
  return {
    credits,
    amount,
    label: `${credits} credits`,
    limit: "one-time credits",
    period: "one_time"
  };
};
const creditQuantityFromAmount = (amount) => {
  if (typeof amount !== "number") return null;
  for (let credits = CREDIT_PURCHASE_MIN_CREDITS; credits <= CREDIT_PURCHASE_MAX_CREDITS; credits += 1) {
    if (amountForCredits(credits) === amount) return credits;
  }
  return null;
};
const purchaseFromMetadata = (metadata, amount) => {
  const metadataCredits = metadata?.credits ?? metadata?.credit_quantity;
  const purchase = creditPurchaseFromQuantity(
    typeof metadataCredits === "string" || typeof metadataCredits === "number" ? metadataCredits : null
  );
  if (purchase) return purchase;
  return creditPurchaseFromQuantity(creditQuantityFromAmount(amount));
};

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "PUBLIC_FIREBASE_API_KEY": "AIzaSyCaWik40y-a2Q_RaYYduMDh-Se0ZpKCRdo", "PUBLIC_FIREBASE_APP_ID": "1:770696481931:web:74ca13ac394aa8f634588e", "PUBLIC_FIREBASE_AUTH_DOMAIN": "humanize-ui.firebaseapp.com", "PUBLIC_FIREBASE_MEASUREMENT_ID": "G-0ZXYGDJB5Y", "PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "770696481931", "PUBLIC_FIREBASE_PROJECT_ID": "humanize-ui", "PUBLIC_FIREBASE_STORAGE_BUCKET": "humanize-ui.firebasestorage.app", "SITE": undefined, "SSR": true};
const readServerEnv = (key) => Object.assign(__vite_import_meta_env__, {})[key] || (typeof process !== "undefined" ? process.env[key] : void 0);

export { CREDIT_PURCHASE_MAX_CREDITS as C, CREDIT_PURCHASE_MIN_AMOUNT as a, CREDIT_PURCHASE_MAX_AMOUNT as b, CREDIT_PURCHASE_MIN_CREDITS as c, creditPurchaseFromAmount as d, creditPurchaseFromQuantity as e, emailToCreditDocId as f, isValidEmail as i, normalizeEmail as n, purchaseFromMetadata as p, readServerEnv as r };
