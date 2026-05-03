import { deleteDoc, doc, getDoc, serverTimestamp, setDoc, type Firestore } from 'firebase/firestore';

import { getCurrentUser } from './auth';
import { getFirestoreDb } from './firestore-db';
import { useChecklistStore } from './stores/checklist-store';
import { useSocialPulseStore } from './stores/social-pulse-store';

type TimestampValue = ReturnType<typeof serverTimestamp>;

export interface EncryptedVoterData {
  ciphertext: string;
  iv: string;
  salt: string;
}

export interface UserProfile {
  history: string[];
  badges: string[];
  encryptedVoterData?: EncryptedVoterData;
  createdAt?: TimestampValue;
  updatedAt: TimestampValue;
}

export type UserProfileUpdate = Partial<Omit<UserProfile, 'updatedAt' | 'createdAt'>>;

function getUsersDocRef(db: Firestore, uid: string) {
  return doc(db, 'users', uid);
}

function assertAuthorized(uid: string) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  if (currentUser.uid !== uid) {
    throw new Error('Unauthorized profile access');
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  assertAuthorized(uid);

  const db = getFirestoreDb();
  if (!db) return null;

  const snapshot = await getDoc(getUsersDocRef(db, uid));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
}

export async function createInitialProfile(uid: string): Promise<UserProfile | null> {
  assertAuthorized(uid);

  const db = getFirestoreDb();
  if (!db) return null;

  const payload: UserProfile = {
    history: [],
    badges: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(getUsersDocRef(db, uid), payload, { merge: true });

  return payload;
}

export async function updateUserProfile(uid: string, data: UserProfileUpdate): Promise<void> {
  assertAuthorized(uid);

  const db = getFirestoreDb();
  if (!db) return;

  await setDoc(
    getUsersDocRef(db, uid),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function deleteAllUserData(uid: string): Promise<void> {
  assertAuthorized(uid);

  const db = getFirestoreDb();
  if (db) {
    await deleteDoc(getUsersDocRef(db, uid));
  }

  useChecklistStore.setState({ items: {} });
  useSocialPulseStore.setState({ stageCounts: {}, error: null });
}
