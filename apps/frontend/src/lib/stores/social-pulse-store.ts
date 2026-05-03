import { create } from 'zustand';

export type StageCounts = Partial<Record<number, number>>;

interface PulseApiResponse {
  acId: string;
  stage: number;
  count: number;
}

export interface LiveCandidateResult {
  candidate: string;
  party: string;
  votes: number;
  status: string;
}

interface ConstituencyStatusApiResponse {
  stage: string;
  results: LiveCandidateResult[];
}

interface SocialPulseStoreState {
  stageCounts: StageCounts;
  loading: boolean;
  error: string | null;
  fetchCounts: (acId: string, stage: number) => Promise<number>;
  fetchConstituencyStatus: (constituencyId: string) => Promise<ConstituencyStatusApiResponse>;
  isCommunityThresholdMet: (stage: number, threshold?: number) => boolean;
}

const DEFAULT_COMMUNITY_THRESHOLD = 100;
const CONSTITUENCY_ID_PATTERN = /^S\d{4}$/;

function sanitizeCandidateResult(result: LiveCandidateResult): LiveCandidateResult {
  return {
    candidate: result.candidate.trim(),
    party: result.party.trim(),
    votes: Number.isFinite(result.votes) ? Math.max(0, Math.floor(result.votes)) : 0,
    status: result.status.trim(),
  };
}

export const useSocialPulseStore = create<SocialPulseStoreState>()((set, get) => ({
  stageCounts: {},
  loading: false,
  error: null,
  fetchCounts: async (acId: string, stage: number) => {
    const trimmedAcId = acId.trim();

    if (!trimmedAcId) {
      set({ error: 'acId is required' });
      throw new Error('acId is required');
    }

    if (!Number.isInteger(stage) || stage < 1 || stage > 8) {
      set({ error: 'stage must be an integer between 1 and 8' });
      throw new Error('stage must be an integer between 1 and 8');
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch(`/api/pulse/${trimmedAcId}/stages/${stage}`);
      if (!response.ok) {
        throw new Error(`Unable to fetch pulse counts (${response.status})`);
      }

      const data = (await response.json()) as PulseApiResponse;
      set((state) => ({
        stageCounts: {
          ...state.stageCounts,
          [stage]: data.count,
        },
        loading: false,
      }));

      return data.count;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      set({ loading: false, error: message });
      throw error;
    }
  },
  fetchConstituencyStatus: async (constituencyId: string) => {
    const normalizedId = constituencyId.trim().toUpperCase();

    if (!CONSTITUENCY_ID_PATTERN.test(normalizedId)) {
      set({ error: 'constituencyId must match S#### format' });
      throw new Error('constituencyId must match S#### format');
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch(`/api/constituency/${normalizedId}/status`);
      if (!response.ok) {
        throw new Error(`Unable to fetch constituency status (${response.status})`);
      }

      const data = (await response.json()) as ConstituencyStatusApiResponse;
      const sanitizedResults = (Array.isArray(data.results) ? data.results : []).map(sanitizeCandidateResult);

      set({ loading: false });
      return {
        stage: typeof data.stage === 'string' ? data.stage.trim() : 'Unknown',
        results: sanitizedResults,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      set({ loading: false, error: message });
      throw error;
    }
  },
  isCommunityThresholdMet: (stage: number, threshold = DEFAULT_COMMUNITY_THRESHOLD) => {
    const count = get().stageCounts[stage] ?? 0;
    return count > threshold;
  },
}));

export const __internal = {
  DEFAULT_COMMUNITY_THRESHOLD,
};
