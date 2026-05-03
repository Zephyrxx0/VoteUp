import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const getCurrentUserMock = vi.fn();
const updateUserProfileMock = vi.fn();
const encryptSensitiveMock = vi.fn();

let checklistItems: Record<string, { completed: boolean; completedAt: string | null }> = {};

vi.mock('@/lib/auth', () => ({
  getCurrentUser: () => getCurrentUserMock(),
}));

vi.mock('@/lib/user-service', () => ({
  updateUserProfile: (...args: unknown[]) => updateUserProfileMock(...args),
}));

vi.mock('@/lib/encryption', () => ({
  encryptSensitive: (...args: unknown[]) => encryptSensitiveMock(...args),
}));

vi.mock('@/lib/stores/checklist-store', () => ({
  useChecklistStore: (selector: (state: { items: typeof checklistItems }) => unknown) =>
    selector({ items: checklistItems }),
}));

import { FirestoreSync } from './FirestoreSync';

describe('FirestoreSync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    checklistItems = {};
    encryptSensitiveMock.mockResolvedValue({
      ciphertext: 'cipher',
      iv: 'iv',
      salt: 'salt',
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not sync when user is anonymous', async () => {
    getCurrentUserMock.mockReturnValue({ uid: 'anon', isAnonymous: true });

    render(<FirestoreSync />);
    vi.advanceTimersByTime(2500);

    await Promise.resolve();
    expect(updateUserProfileMock).not.toHaveBeenCalled();
  });

  it('syncs when checklist state changes for persistent users', async () => {
    getCurrentUserMock.mockReturnValue({ uid: 'user-1', isAnonymous: false });
    const { rerender } = render(<FirestoreSync />);

    checklistItems = {
      stage1: { completed: true, completedAt: '2026-05-01T00:00:00.000Z' },
    };
    rerender(<FirestoreSync />);

    await vi.advanceTimersByTimeAsync(2500);
    expect(updateUserProfileMock).toHaveBeenCalledTimes(1);
  });

  it('encrypts sensitive values before syncing profile', async () => {
    getCurrentUserMock.mockReturnValue({ uid: 'user-2', isAnonymous: false });
    const { rerender } = render(<FirestoreSync epicId="ABC1234567" acId="S2477" />);

    checklistItems = {
      stage2: { completed: true, completedAt: '2026-05-01T00:00:00.000Z' },
    };
    rerender(<FirestoreSync epicId="ABC1234567" acId="S2477" />);

    await vi.advanceTimersByTimeAsync(2500);
    expect(encryptSensitiveMock).toHaveBeenCalledWith('user-2', 'ABC1234567|S2477');
    expect(updateUserProfileMock).toHaveBeenCalledWith(
      'user-2',
      expect.objectContaining({
        encryptedVoterData: { ciphertext: 'cipher', iv: 'iv', salt: 'salt' },
      }),
    );
  });

  it('debounces rapid changes into one write', async () => {
    getCurrentUserMock.mockReturnValue({ uid: 'user-3', isAnonymous: false });
    const { rerender } = render(<FirestoreSync />);

    checklistItems = { a: { completed: true, completedAt: null } };
    rerender(<FirestoreSync />);
    checklistItems = { a: { completed: true, completedAt: null }, b: { completed: true, completedAt: null } };
    rerender(<FirestoreSync />);
    checklistItems = {
      a: { completed: true, completedAt: null },
      b: { completed: true, completedAt: null },
      c: { completed: true, completedAt: null },
    };
    rerender(<FirestoreSync />);

    await vi.advanceTimersByTimeAsync(2500);
    expect(updateUserProfileMock).toHaveBeenCalledTimes(1);
  });
});
