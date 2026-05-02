import { getFirestore } from 'firebase-admin/firestore';

let getFirestoreImpl: typeof getFirestore = getFirestore;

export function __setGetFirestoreForTest(impl: typeof getFirestore): void {
  getFirestoreImpl = impl;
}

export function __resetGetFirestoreForTest(): void {
  getFirestoreImpl = getFirestore;
}

export async function getStageCompletionCount(acId: string, stage: number): Promise<number> {
  const db = getFirestoreImpl();
  const snapshot = await db
    .collection('reports')
    .where('acId', '==', acId)
    .where('reportedStage', '==', stage.toString())
    .count()
    .get();

  return snapshot.data().count;
}
