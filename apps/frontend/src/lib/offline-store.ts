const STORAGE_KEY = 'voteup_constituencies';

export interface CachedConstituency {
  id: string;
  name: string;
  state: string;
  stage: string;
  pollingDate?: string;
  countingDate?: string;
  lastSyncedAt: string;
}

export interface OfflineStore {
  saveConstituency(acId: string, data: CachedConstituency): void;
  getCachedConstituency(acId: string): CachedConstituency | null;
  getAllCached(): CachedConstituency[];
  clearCache(): void;
}

export function createOfflineStore(): OfflineStore {
  return {
    saveConstituency(acId: string, data: CachedConstituency): void {
      try {
        const existing = getAllCachedInternal();
        existing[acId] = data;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    },

    getCachedConstituency(acId: string): CachedConstituency | null {
      try {
        const existing = getAllCachedInternal();
        return existing[acId] || null;
      } catch {
        return null;
      }
    },

    getAllCached(): CachedConstituency[] {
      try {
        const existing = getAllCachedInternal();
        return Object.values(existing);
      } catch {
        return [];
      }
    },

    clearCache(): void {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
    },
  };
}

function getAllCachedInternal(): Record<string, CachedConstituency> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

export function isDataStale(lastSyncedAt: string, thresholdHours = 24): boolean {
  const lastSync = new Date(lastSyncedAt).getTime();
  const now = Date.now();
  const hoursSince = (now - lastSync) / (1000 * 60 * 60);
  return hoursSince > thresholdHours;
}

export function getStaleWarning(lastSyncedAt: string | undefined): string | null {
  if (!lastSyncedAt) return 'No sync data available';
  
  if (isDataStale(lastSyncedAt, 24)) {
    const hours = Math.floor((Date.now() - new Date(lastSyncedAt).getTime()) / (1000 * 60 * 60));
    return `Data may be outdated (${hours}h since last sync)`;
  }
  
  return null;
}