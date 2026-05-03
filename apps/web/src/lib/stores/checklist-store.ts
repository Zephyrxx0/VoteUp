import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChecklistItemState {
  completed: boolean;
  completedAt: string | null;
}

export type ChecklistItems = Record<string, ChecklistItemState>;

interface ChecklistStoreState {
  items: ChecklistItems;
  toggleItem: (id: string) => void;
  setItems: (items: ChecklistItems) => void;
}

export const useChecklistStore = create<ChecklistStoreState>()(
  persist(
    (set) => ({
      items: {},
      toggleItem: (id: string) =>
        set((state) => {
          const current = state.items[id] ?? { completed: false, completedAt: null };
          const nextCompleted = !current.completed;

          return {
            items: {
              ...state.items,
              [id]: {
                completed: nextCompleted,
                completedAt: nextCompleted ? new Date().toISOString() : null,
              },
            },
          };
        }),
      setItems: (items: ChecklistItems) => set({ items }),
    }),
    {
      name: 'voteup-checklist',
    },
  ),
);
