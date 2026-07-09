import { getFirestore, type Firestore } from "firebase/firestore";
import { getFirebaseApp } from "./firebase";

let db: Firestore | null = null;

export function getFirebaseDb(): Firestore {
  if (db) return db;
  db = getFirestore(getFirebaseApp());
  return db;
}
