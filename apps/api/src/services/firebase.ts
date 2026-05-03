import { getApps, initializeApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { ElectionPipeline } from '@voteup/contracts';

// Initialize Firebase Admin if it hasn't been initialized already
if (getApps().length === 0) {
  initializeApp();
}

export function getDb() {
  return getDatabase();
}

export function getFirestore() {
  return getAdminFirestore();
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
