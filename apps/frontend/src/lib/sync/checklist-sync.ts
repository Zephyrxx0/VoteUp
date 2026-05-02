import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { useChecklistStore, type ChecklistItems } from '@/lib/stores/checklist-store';
import { getFirebaseApp } from '@/lib/firebase';

const DEFAULT_DEBOUNCE_MS = 750;

let checklistStoreUnsubscribe: (() => void) | null = null;
let authUnsubscribe: (() => void) | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let activeUid: string | null = null;

async function writeChecklist(uid: string, items: ChecklistItems): Promise<void> {
  const app = getFirebaseApp();
  if (!app) return;

  const firestore = getFirestore(app);
  const checklistRef = doc(firestore, 'checklists', uid);

  await setDoc(
    checklistRef,
    {
      items,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
}

function scheduleChecklistWrite(uid: string, items: ChecklistItems, debounceMs: number): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    void writeChecklist(uid, items).catch((error) => {
      console.error('[ChecklistSync] Failed to sync checklist to Firestore', error);
    });
  }, debounceMs);
}

export function syncChecklistToFirestore(items: ChecklistItems, userId: string, debounceMs = DEFAULT_DEBOUNCE_MS): void {
  scheduleChecklistWrite(userId, items, debounceMs);
}

export function initializeChecklistSync(debounceMs = DEFAULT_DEBOUNCE_MS): () => void {
  if (checklistStoreUnsubscribe) {
    return teardownChecklistSync;
  }

  const app = getFirebaseApp();
  if (!app) {
    return () => undefined;
  }

  const auth = getAuth(app);

  authUnsubscribe = onAuthStateChanged(auth, (user: User | null) => {
    activeUid = user?.uid ?? null;
  });

  checklistStoreUnsubscribe = useChecklistStore.subscribe((state) => {
    if (!activeUid) return;
    syncChecklistToFirestore(state.items, activeUid, debounceMs);
  });

  return teardownChecklistSync;
}

export function teardownChecklistSync(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }

  if (checklistStoreUnsubscribe) {
    checklistStoreUnsubscribe();
    checklistStoreUnsubscribe = null;
  }

  if (authUnsubscribe) {
    authUnsubscribe();
    authUnsubscribe = null;
  }

  activeUid = null;
}
