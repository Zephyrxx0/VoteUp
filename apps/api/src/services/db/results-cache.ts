export interface CandidateResult {
  candidate: string;
  party: string;
  votes: number;
  status: string;
}

interface CacheEntry {
  value: CandidateResult[];
  expiresAt: number;
}

const DEFAULT_TTL_MS = 5 * 60 * 1000;

class ResultsCache {
  private readonly store = new Map<string, CacheEntry>();

  get(constituencyId: string): CandidateResult[] | null {
    const cached = this.store.get(constituencyId);
    if (!cached) return null;

    if (Date.now() >= cached.expiresAt) {
      this.store.delete(constituencyId);
      return null;
    }

    return cached.value;
  }

  set(constituencyId: string, value: CandidateResult[], ttlMs = DEFAULT_TTL_MS): void {
    this.store.set(constituencyId, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  clear(): void {
    this.store.clear();
  }
}

export const resultsCache = new ResultsCache();
export { ResultsCache, DEFAULT_TTL_MS };
