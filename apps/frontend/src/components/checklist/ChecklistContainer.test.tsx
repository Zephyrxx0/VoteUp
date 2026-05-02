import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ChecklistContainer } from './ChecklistContainer';

const fetchMock = vi.fn();

type StoreState = {
  items: Record<string, { completed: boolean; completedAt: string | null }>;
  toggleItem: (id: string) => void;
};

const mockState: StoreState = {
  items: {},
  toggleItem: (id: string) => {
    const current = mockState.items[id] ?? { completed: false, completedAt: null };
    mockState.items[id] = {
      completed: !current.completed,
      completedAt: !current.completed ? new Date().toISOString() : null,
    };
  },
};

vi.mock('@/lib/stores/checklist-store', () => ({
  useChecklistStore: (selector: (state: StoreState) => unknown) => selector(mockState),
}));

vi.stubGlobal('fetch', fetchMock);

describe('ChecklistContainer', () => {
  beforeEach(() => {
    mockState.items = {};
    fetchMock.mockReset();
  });

  it('renders checklist items from customization API', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        stage: 5,
        items: [
          {
            id: 's5-verify-information',
            title: 'Verify election information',
            description: 'Use official ECI channels to confirm claims before sharing.',
            stage: 5,
            category: 'Safety',
          },
        ],
      }),
    });

    render(<ChecklistContainer stage={5} constituency="New Delhi" />);

    await waitFor(() => {
      expect(screen.getByText('Verify election information')).toBeInTheDocument();
    });
  });

  it('flags overdue tasks from previous stages and toggles completion', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        stage: 5,
        items: [
          {
            id: 's1-submit-form6',
            title: 'Submit Form 6',
            description: 'Apply online or visit your local ERO office to register as a voter.',
            stage: 1,
            category: 'Application',
          },
        ],
      }),
    });

    render(<ChecklistContainer stage={5} constituency="New Delhi" />);

    await waitFor(() => {
      expect(screen.getByText('OVERDUE')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /toggle checklist item: submit form 6/i }));

    expect(mockState.items['s1-submit-form6']?.completed).toBe(true);
  });
});
