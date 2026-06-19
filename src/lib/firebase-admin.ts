import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { readServerEnv } from "./server-env";

type ServiceAccountJson = {
  project_id?: string;
  projectId?: string;
  client_email?: string;
  clientEmail?: string;
  private_key?: string;
  privateKey?: string;
};

const parseServiceAccount = () => {
  const raw = readServerEnv("FIREBASE_SERVICE_ACCOUNT_JSON");
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not configured");
  }

  const parsed = JSON.parse(raw) as ServiceAccountJson;
  const projectId = parsed.projectId ?? parsed.project_id;
  const clientEmail = parsed.clientEmail ?? parsed.client_email;
  const privateKey = (parsed.privateKey ?? parsed.private_key)?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is missing projectId, clientEmail, or privateKey");
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
};

export const getAdminApp = (): App => {
  const existingApp = getApps()[0];
  if (existingApp) return existingApp;

  return initializeApp({
    credential: cert(parseServiceAccount()),
  });
};

export const adminDb = () => getFirestore(getAdminApp());

export const adminAuth = () => getAuth(getAdminApp());
