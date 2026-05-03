import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const getCurrentUserMock = vi.fn();
const getUserProfileMock = vi.fn();

vi.mock('@/lib/auth', () => ({
  getCurrentUser: () => getCurrentUserMock(),
}));

vi.mock('@/lib/user-service', () => ({
  getUserProfile: (...args: unknown[]) => getUserProfileMock(...args),
}));

vi.mock('@/components/auth/UpgradePrompt', () => ({
  UpgradePrompt: ({ isAnonymous, badgesCount }: { isAnonymous: boolean; badgesCount: number }) => (
    <div data-testid="upgrade-prompt">
      {isAnonymous ? 'anon' : 'upgraded'}-{badgesCount}
    </div>
  ),
}));

import { ProfileView } from '@/components/dashboard/ProfileView';

describe('ProfileView', () => {
  it('renders badges and cloud sync status for upgraded users', async () => {
    getCurrentUserMock.mockReturnValue({ uid: 'user-1', isAnonymous: false });
    getUserProfileMock.mockResolvedValue({
      badges: ['cloud-syncer'],
      history: ['stage-1'],
      updatedAt: { __ts: true },
    });

    render(<ProfileView />);

    await waitFor(() => {
      expect(screen.getByText(/Cloud Synced/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/cloud syncer/i)).toBeInTheDocument();
    expect(screen.getByText(/Registration/i)).toBeInTheDocument();
    expect(screen.getByTestId('upgrade-prompt')).toHaveTextContent('upgraded-1');
  });

  it('renders local-only status for anonymous users', async () => {
    getCurrentUserMock.mockReturnValue({ uid: 'anon-1', isAnonymous: true });
    getUserProfileMock.mockResolvedValue({ badges: [], history: [], updatedAt: { __ts: true } });

    render(<ProfileView />);

    await waitFor(() => {
      expect(screen.getByText(/Local Only/i)).toBeInTheDocument();
    });

    expect(screen.getByTestId('upgrade-prompt')).toHaveTextContent('anon-0');
  });
});
