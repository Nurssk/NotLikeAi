import { getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY ?? "AIzaSyCaWik40y-a2Q_RaYYduMDh-Se0ZpKCRdo",
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN ?? "humanize-ui.firebaseapp.com",
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID ?? "humanize-ui",
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET ?? "humanize-ui.firebasestorage.app",
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "770696481931",
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID ?? "1:770696481931:web:74ca13ac394aa8f634588e",
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-0ZXYGDJB5Y",
};

// Minimal, secret-safe diagnostics (dev only): warn if required config is absent.
if (import.meta.env.DEV) {
  const present = {
    apiKey: Boolean(firebaseConfig.apiKey),
    projectId: Boolean(firebaseConfig.projectId),
    appId: Boolean(firebaseConfig.appId),
  };
  if (!present.apiKey || !present.projectId || !present.appId) {
    console.warn(
      "[firebase] Missing PUBLIC_FIREBASE_* env values. Present:",
      present,
      "— add them to .env and restart the dev server.",
    );
  }
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export { app };

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

let analyticsPromise: Promise<unknown | null> | null = null;

export const initFirebaseAnalytics = () => {
  if (typeof window === "undefined") return Promise.resolve(null);

  analyticsPromise ??= import("firebase/analytics")
    .then(({ getAnalytics, isSupported }) => isSupported().then((supported) => (supported ? getAnalytics(app) : null)))
    .catch(() => null);

  return analyticsPromise;
};
