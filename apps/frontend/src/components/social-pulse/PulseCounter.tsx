'use client';

import { useMemo } from 'react';
import { useSocialPulseStore } from '@/lib/stores/social-pulse-store';

export function PulseCounter() {
  const stageCounts = useSocialPulseStore((state) => state.stageCounts);

  const totalCompletions = useMemo(
    () => Object.values(stageCounts).reduce((sum, count) => sum + (count ?? 0), 0),
    [stageCounts],
  );

  return (
    <section className="rounded-xl border bg-card p-4 sm:p-5" aria-label="Social Pulse">
      <h2 className="text-lg font-semibold">Social Pulse</h2>
      <p className="mt-1 text-sm text-muted-foreground">Community milestone momentum across stages</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border p-3">
          <p className="text-xs uppercase text-muted-foreground">Total milestone completions</p>
          <p className="mt-1 text-2xl font-semibold">{totalCompletions}</p>
        </div>

        <div className="rounded-lg border p-3">
          <p className="text-xs uppercase text-muted-foreground">Tracked stages</p>
          <p className="mt-1 text-2xl font-semibold">{Object.keys(stageCounts).length}</p>
        </div>
      </div>
    </section>
  );
}
