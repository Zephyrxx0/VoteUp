import { beforeEach, describe, expect, it, vi } from 'vitest';

const setDocMock = vi.fn();
const docMock = vi.fn(() => ({ path: 'checklists/user-123' }));
const getFirestoreMock = vi.fn(() => ({}));

vi.mock('firebase/firestore', () => ({
  doc: (...args: unknown[]) => docMock(...args),
  setDoc: (...args: unknown[]) => setDocMock(...args),
  getFirestore: (...args: unknown[]) => getFirestoreMock(...args),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn(() => () => undefined),
}));

vi.mock('@/lib/firebase', () => ({
  getFirebaseApp: vi.fn(() => ({ name: 'app' })),
}));

import { syncChecklistToFirestore, teardownChecklistSync } from './checklist-sync';

describe('checklist-sync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setDocMock.mockReset();
    docMock.mockClear();
    getFirestoreMock.mockClear();
    teardownChecklistSync();
  });

  it('debounces multiple sync calls into a single firestore write', async () => {
    syncChecklistToFirestore({ a: { completed: true, completedAt: '2026-05-03T00:00:00.000Z' } }, 'user-123', 100);
    syncChecklistToFirestore({ a: { completed: false, completedAt: null } }, 'user-123', 100);

    expect(setDocMock).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(110);

    expect(setDocMock).toHaveBeenCalledTimes(1);
    expect(setDocMock).toHaveBeenCalledWith(
      { path: 'checklists/user-123' },
      expect.objectContaining({
        items: {
          a: { completed: false, completedAt: null },
        },
      }),
      { merge: true },
    );
  });
});
