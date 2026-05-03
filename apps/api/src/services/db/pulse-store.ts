import { getFirestore } from 'firebase-admin/firestore';

let getFirestoreImpl: typeof getFirestore = getFirestore;
let firestoreDb: import('firebase-admin/firestore').Firestore | null = null;

const FIRESTORE_DISABLED_MESSAGE = '[PulseStore] Firebase not configured - skipping pulse sync';
const FIRESTORE_SETUP_MESSAGE = '[PulseStore] Add Firebase credentials to enable sync';

export function __setGetFirestoreForTest(impl: typeof getFirestore): void {
  getFirestoreImpl = impl;
}

export function __resetGetFirestoreForTest(): void {
  getFirestoreImpl = getFirestore;
  firestoreDb = null;
}

function resolveFirestoreDb(): import('firebase-admin/firestore').Firestore | null {
  if (firestoreDb) return firestoreDb;

  try {
    firestoreDb = getFirestoreImpl();
    return firestoreDb;
  } catch {
    return null;
  }
}

export async function getStageCompletionCount(acId: string, stage: number): Promise<number> {
  const db = resolveFirestoreDb();
  if (!db) {
    console.log(FIRESTORE_DISABLED_MESSAGE);
    console.log(FIRESTORE_SETUP_MESSAGE);
    return 0;
  }

  try {
    const snapshot = await db
      .collection('reports')
      .where('acId', '==', acId)
      .where('reportedStage', '==', stage.toString())
      .count()
      .get();

    return snapshot.data().count;
  } catch (error) {
    console.error('[PulseStore] Firestore write/read failed:', error);
    return 0;
  }
}
