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
