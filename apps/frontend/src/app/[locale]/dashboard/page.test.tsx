import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const replaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

const getCurrentUserMock = vi.fn();

vi.mock('@/lib/auth', () => ({
  getCurrentUser: () => getCurrentUserMock(),
}));

vi.mock('@/components/checklist/ChecklistContainer', () => ({
  ChecklistContainer: ({ stage, constituency }: { stage: number; constituency: string }) => (
    <div data-testid="checklist-container">
      Checklist stage {stage} for {constituency}
    </div>
  ),
}));

vi.mock('@/lib/stores/checklist-store', () => ({
  useChecklistStore: (selector: (state: { items: Record<string, { completed: boolean }> }) => unknown) =>
    selector({
      items: {
        's1-submit-form6': { completed: false },
      },
    }),
}));

const fetchCountsMock = vi.fn();
const fetchConstituencyStatusMock = vi.fn().mockResolvedValue({
  stage: 'Campaigning',
  results: [],
});

vi.mock('@/lib/stores/social-pulse-store', () => ({
  useSocialPulseStore: (selector: (state: {
    fetchCounts: typeof fetchCountsMock;
    fetchConstituencyStatus: typeof fetchConstituencyStatusMock;
    error: string | null;
  }) => unknown) =>
    selector({
      fetchCounts: fetchCountsMock,
      fetchConstituencyStatus: fetchConstituencyStatusMock,
      error: null,
    }),
}));

vi.mock('@/components/ai-comparison/ComparisonCards', () => ({
  ComparisonCards: () => <div data-testid="comparison-cards" />,
}));

vi.mock('@/components/social-pulse/MilestoneBadge', () => ({
  MilestoneBadge: () => <div data-testid="milestone-badge" />,
}));

vi.mock('@/components/social-pulse/PulseCounter', () => ({
  PulseCounter: () => <div data-testid="pulse-counter" />,
}));

vi.mock('@/components/ui/result-card', () => ({
  ResultCard: () => <div data-testid="result-card" />,
}));

import DashboardPage from './page';

describe('DashboardPage', () => {
  it('renders action plan and checklist for authenticated users', () => {
    getCurrentUserMock.mockReturnValue({ uid: 'user-1' });

    render(<DashboardPage />);

    expect(screen.getByText('Personalized Action Plan')).toBeInTheDocument();
    expect(screen.getByTestId('checklist-container')).toHaveTextContent('Checklist stage 5 for New Delhi');
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('shows redirect state for unauthenticated users', () => {
    getCurrentUserMock.mockReturnValue(null);

    render(<DashboardPage />);

    expect(screen.getByText(/Redirecting to onboarding/i)).toBeInTheDocument();
  });
});
