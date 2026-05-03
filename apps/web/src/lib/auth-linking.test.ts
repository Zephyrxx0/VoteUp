import { beforeEach, describe, expect, it, vi } from 'vitest';

const getFirebaseAppMock = vi.fn();
const getAuthMock = vi.fn();
const linkWithPopupMock = vi.fn();
const signInWithCredentialMock = vi.fn();
const credentialFromErrorMock = vi.fn();
const getUserProfileMock = vi.fn();
const updateUserProfileMock = vi.fn();

vi.mock('./firebase', () => ({
  initializeFirebase: vi.fn(),
  isFirebaseConfigured: () => true,
  getFirebaseApp: () => getFirebaseAppMock(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: (...args: unknown[]) => getAuthMock(...args),
  signInAnonymously: vi.fn(),
  onAuthStateChanged: vi.fn(),
  linkWithPopup: (...args: unknown[]) => linkWithPopupMock(...args),
  GoogleAuthProvider: Object.assign(
    class GoogleAuthProvider {},
    {
      credentialFromError: (...args: unknown[]) => credentialFromErrorMock(...args),
    },
  ),
  signInWithCredential: (...args: unknown[]) => signInWithCredentialMock(...args),
  signInWithPopup: vi.fn(),
}));

vi.mock('./user-service', () => ({
  getUserProfile: (...args: unknown[]) => getUserProfileMock(...args),
  updateUserProfile: (...args: unknown[]) => updateUserProfileMock(...args),
}));

import { upgradeToGoogle } from './auth';

describe('upgradeToGoogle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getFirebaseAppMock.mockReturnValue({});
    getAuthMock.mockReturnValue({ currentUser: { uid: 'anon-1' } });
  });

  it('links anonymous user directly when popup succeeds', async () => {
    linkWithPopupMock.mockResolvedValue({ user: { uid: 'google-1' } });
    getUserProfileMock.mockResolvedValue(null);

    const result = await upgradeToGoogle();

    expect(result.error).toBeNull();
    expect(result.user?.uid).toBe('google-1');
    expect(signInWithCredentialMock).not.toHaveBeenCalled();
    expect(updateUserProfileMock).not.toHaveBeenCalled();
  });

  it('merges local and cloud data when credential is already in use', async () => {
    linkWithPopupMock.mockRejectedValue({ code: 'auth/credential-already-in-use' });
    credentialFromErrorMock.mockReturnValue({ providerId: 'google.com' });
    signInWithCredentialMock.mockResolvedValue({ user: { uid: 'google-1' } });
    getUserProfileMock
      .mockResolvedValueOnce({ history: ['stage-2'], badges: ['local-badge'] })
      .mockResolvedValueOnce({ history: ['stage-1'], badges: ['cloud-badge'] });

    const result = await upgradeToGoogle();

    expect(result.error).toBeNull();
    expect(result.conflict).toBeUndefined();
    expect(updateUserProfileMock).toHaveBeenCalledWith('google-1', {
      history: ['stage-1', 'stage-2'],
      badges: ['cloud-badge', 'local-badge'],
    });
  });

  it('returns constituency conflict when mismatch is detected and choice is keep-cloud', async () => {
    linkWithPopupMock.mockRejectedValue({ code: 'auth/credential-already-in-use' });
    credentialFromErrorMock.mockReturnValue({ providerId: 'google.com' });
    signInWithCredentialMock.mockResolvedValue({ user: { uid: 'google-1' } });
    getUserProfileMock
      .mockResolvedValueOnce({ history: ['stage-2'], badges: ['local-badge'], constituencyId: 'ac-100' })
      .mockResolvedValueOnce({ history: ['stage-1'], badges: ['cloud-badge'], constituencyId: 'ac-200' });

    const result = await upgradeToGoogle();

    expect(result.error).toBeNull();
    expect(result.conflict).toEqual({
      type: 'constituency-mismatch',
      localConstituency: 'ac-100',
      cloudConstituency: 'ac-200',
    });
    expect(updateUserProfileMock).not.toHaveBeenCalled();
  });
});
