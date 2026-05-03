import { beforeEach, describe, expect, it, vi } from 'vitest';

const docMock = vi.fn();
const getDocMock = vi.fn();
const setDocMock = vi.fn();
const serverTimestampMock = vi.fn(() => ({ __ts: true }));

const getCurrentUserMock = vi.fn();
const getFirestoreDbMock = vi.fn();

vi.mock('firebase/firestore', () => ({
  doc: (...args: unknown[]) => docMock(...args),
  getDoc: (...args: unknown[]) => getDocMock(...args),
  setDoc: (...args: unknown[]) => setDocMock(...args),
  serverTimestamp: () => serverTimestampMock(),
}));

vi.mock('./auth', () => ({
  getCurrentUser: () => getCurrentUserMock(),
}));

vi.mock('./firestore-db', () => ({
  getFirestoreDb: () => getFirestoreDbMock(),
}));

import { createInitialProfile, getUserProfile, updateUserProfile } from './user-service';

describe('user-service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    docMock.mockReturnValue('users/doc-ref');
    getFirestoreDbMock.mockReturnValue({});
    getCurrentUserMock.mockReturnValue({ uid: 'uid-1' });
  });

  it('returns null when profile does not exist', async () => {
    getDocMock.mockResolvedValue({ exists: () => false });

    const result = await getUserProfile('uid-1');

    expect(result).toBeNull();
  });

  it('returns profile when profile exists', async () => {
    const data = { history: ['stage-1'], badges: ['badge-1'], updatedAt: { __ts: true } };
    getDocMock.mockResolvedValue({ exists: () => true, data: () => data });

    const result = await getUserProfile('uid-1');

    expect(result).toEqual(data);
    expect(docMock).toHaveBeenCalledWith({}, 'users', 'uid-1');
  });

  it('creates an initial profile with timestamps', async () => {
    const profile = await createInitialProfile('uid-1');

    expect(setDocMock).toHaveBeenCalledWith(
      'users/doc-ref',
      expect.objectContaining({ history: [], badges: [] }),
      { merge: true },
    );
    expect(profile).toEqual(
      expect.objectContaining({ history: [], badges: [], updatedAt: { __ts: true } }),
    );
  });

  it('merges updates with updatedAt timestamp', async () => {
    await updateUserProfile('uid-1', { history: ['stage-1'] });

    expect(setDocMock).toHaveBeenCalledWith(
      'users/doc-ref',
      { history: ['stage-1'], updatedAt: { __ts: true } },
      { merge: true },
    );
  });

  it('throws when user is unauthenticated', async () => {
    getCurrentUserMock.mockReturnValue(null);

    await expect(getUserProfile('uid-1')).rejects.toThrow('Not authenticated');
  });

  it('throws when user uid does not match target uid', async () => {
    getCurrentUserMock.mockReturnValue({ uid: 'uid-2' });

    await expect(updateUserProfile('uid-1', { badges: ['badge-1'] })).rejects.toThrow(
      'Unauthorized profile access',
    );
  });
});
