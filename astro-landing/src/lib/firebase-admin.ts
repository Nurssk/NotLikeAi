import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";
import { requireEnv } from "./env";

let app: App | null = null;

function getApp(): App {
  if (app) return app;
  const existing = getApps();
  if (existing.length) {
    app = existing[0]!;
    return app;
  }
  const raw = requireEnv("FIREBASE_SERVICE_ACCOUNT_JSON");
  let parsed: { project_id: string; client_email: string; private_key: string };
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON");
  }
  app = initializeApp({
    credential: cert({
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      // Support keys stored with literal "\n" sequences.
      privateKey: parsed.private_key.replace(/\\n/g, "\n"),
    }),
  });
  return app;
}

/** Firestore Admin instance. Server-only; bypasses security rules. */
export function getDb(): Firestore {
  return getFirestore(getApp());
}

/** Firebase Auth Admin instance. Server-only. */
export function getAdminAuth(): Auth {
  return getAuth(getApp());
}
