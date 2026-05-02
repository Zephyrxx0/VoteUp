'use client';

interface StaleWarningProps {
  lastSyncedAt: string | undefined;
  thresholdHours?: number;
}

export function StaleWarning({ lastSyncedAt, thresholdHours = 24 }: StaleWarningProps) {
  if (!lastSyncedAt) {
    return (
      <div className="flex items-center gap-2 p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-800">
        <span>⚠️</span>
        <span>No sync data available</span>
      </div>
    );
  }

  const lastSync = new Date(lastSyncedAt).getTime();
  const now = Date.now();
  const hoursSince = Math.floor((now - lastSync) / (1000 * 60 * 60));

  if (hoursSince > thresholdHours) {
    return (
      <div className="flex items-center gap-2 p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-800">
        <span>⚠️</span>
        <span>Data may be outdated ({hoursSince}h since last sync)</span>
      </div>
    );
  }

  return null;
}