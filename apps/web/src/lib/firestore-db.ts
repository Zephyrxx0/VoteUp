import { getFirestore, type Firestore } from 'firebase/firestore';

import { getFirebaseApp } from './firebase';

let db: Firestore | null = null;

export function getFirestoreDb(): Firestore | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!db) {
    const app = getFirebaseApp();
    if (!app) {
      return null;
    }
    db = getFirestore(app);
  }

  return db;
}
