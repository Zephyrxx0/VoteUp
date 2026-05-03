import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface ComparisonItem {
  category: string;
  homeCountryValue: string;
  indiaValue: string;
}

interface ComparisonApiResponse {
  comparison: ComparisonItem[];
}

interface AiComparisonStoreState {
  cache: Record<string, ComparisonItem[]>;
  loading: boolean;
  error: string | null;
  fetchComparison: (homeCountry: string) => Promise<ComparisonItem[]>;
}

const STORAGE_KEY = 'voteup-ai-comparison-cache';

function normalizeCountryKey(homeCountry: string): string {
  return homeCountry.trim().toLowerCase();
}

export const useAiComparisonStore = create<AiComparisonStoreState>()(
  persist(
    (set, get) => ({
      cache: {},
      loading: false,
      error: null,
      fetchComparison: async (homeCountry: string) => {
        const countryKey = normalizeCountryKey(homeCountry);

        if (!countryKey) {
          const message = 'homeCountry is required';
          set({ error: message });
          throw new Error(message);
        }

        const cached = get().cache[countryKey];
        if (cached) {
          return cached;
        }

        set({ loading: true, error: null });

        try {
          const response = await fetch('/api/compare', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ homeCountry: homeCountry.trim() }),
          });

          if (!response.ok) {
            throw new Error(`Unable to fetch AI comparison (${response.status})`);
          }

          const data = (await response.json()) as ComparisonApiResponse;
          if (!Array.isArray(data.comparison)) {
            throw new Error('Invalid comparison payload');
          }

          set((state) => ({
            cache: {
              ...state.cache,
              [countryKey]: data.comparison,
            },
            loading: false,
            error: null,
          }));

          return data.comparison;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          set({ loading: false, error: message });
          throw error;
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cache: state.cache,
      }),
    },
  ),
);

export const __internal = {
  normalizeCountryKey,
  STORAGE_KEY,
};
