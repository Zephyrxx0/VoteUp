'use client';

import { useMemo } from 'react';
import { useSocialPulseStore } from '@/lib/stores/social-pulse-store';

export function PulseCounter() {
  const stageCounts = useSocialPulseStore((state) => state.stageCounts);

  const totalCompletions = useMemo(
    () => Object.values(stageCounts).reduce((sum: number, count) => sum + (count ?? 0), 0),
    [stageCounts],
  );

  return (
    <section className="rounded-xl border bg-card p-4 sm:p-5" aria-label="Social Pulse">
      <h2 className="text-lg font-semibold">Social Pulse</h2>
      <p className="mt-1 text-sm text-muted-foreground">Community milestone momentum across stages</p>

      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[140px] rounded-lg border bg-civic-muted-bg/30 p-3 transition-all hover:border-civic-indigo">
          <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Global Momentum</p>
          <p className="mt-1 text-2xl font-bold text-civic-indigo">{totalCompletions}</p>
        </div>

        <div className="flex-1 min-w-[140px] rounded-lg border bg-civic-muted-bg/30 p-3 transition-all hover:border-civic-coral">
          <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Tracked Stages</p>
          <p className="mt-1 text-2xl font-bold text-civic-coral">{Object.keys(stageCounts).length}</p>
        </div>
      </div>
    </section>
  );
}
