import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
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

export const db = getFirestore(app);
