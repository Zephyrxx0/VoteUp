import * as admin from 'firebase-admin';
import { ElectionPipeline } from '@voteup/contracts';

// Initialize Firebase Admin if it hasn't been initialized already
if (admin.apps.length === 0) {
  admin.initializeApp();
}

export function getDb() {
  return admin.database();
}

export function getFirestore() {
  return admin.firestore();
}

export async function getPipeline(countryCode: string): Promise<ElectionPipeline | null> {
  const db = getDb();
  const ref = db.ref(`election_pipeline/${countryCode}`);
  const snapshot = await ref.once('value');
  return snapshot.val() as ElectionPipeline;
}

export async function setPipeline(countryCode: string, data: ElectionPipeline): Promise<void> {
  const db = getDb();
  const ref = db.ref(`election_pipeline/${countryCode}`);
  await ref.set(data);
}

