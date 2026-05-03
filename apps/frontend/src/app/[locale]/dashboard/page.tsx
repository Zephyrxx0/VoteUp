'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChecklistContainer } from '@/components/checklist/ChecklistContainer';
import { ComparisonCards } from '@/components/ai-comparison/ComparisonCards';
import { MilestoneBadge } from '@/components/social-pulse/MilestoneBadge';
import { PulseCounter } from '@/components/social-pulse/PulseCounter';
import { getCurrentUser } from '@/lib/auth';
import { useChecklistStore } from '@/lib/stores/checklist-store';
import { useSocialPulseStore } from '@/lib/stores/social-pulse-store';

export default function DashboardPage() {
  const router = useRouter();
  const user = getCurrentUser();
  const homeCountry = 'United States';
  const fetchCounts = useSocialPulseStore((state) => state.fetchCounts);
  const pulseError = useSocialPulseStore((state) => state.error);
  const checklistItems = useChecklistStore((state) => state.items);

  useEffect(() => {
    if (!user?.uid) {
      router.replace('/');
    }
  }, [router, user?.uid]);

  const mockStageData = useMemo(
    () => ({
      stage: 5,
      stageName: 'Campaigning',
      constituency: 'New Delhi',
    }),
    [],
  );

  const personalCompletedCount = useMemo(
    () => Object.values(checklistItems).filter((item) => item.completed).length,
    [checklistItems],
  );

  useEffect(() => {
    void fetchCounts('new-delhi', mockStageData.stage);
  }, [fetchCounts, mockStageData.stage]);

  if (!user?.uid) {
    return (
      <main className="mx-auto min-h-screen max-w-4xl p-4 sm:p-6">
        <p className="text-sm text-muted-foreground">Redirecting to onboarding…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl p-4 sm:p-6">
      <section className="mb-6 rounded-xl border bg-card p-4 sm:p-5">
        <h1 className="text-2xl font-semibold">Personalized Action Plan</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Current stage: <span className="font-medium text-foreground">{mockStageData.stageName}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Constituency: <span className="font-medium text-foreground">{mockStageData.constituency}</span>
        </p>
      </section>

      <ChecklistContainer stage={mockStageData.stage} constituency={mockStageData.constituency} />

      <ComparisonCards homeCountry={homeCountry} />

      <section className="mt-6 space-y-3">
        <PulseCounter />
        <MilestoneBadge stage={mockStageData.stage} personalCompletedCount={personalCompletedCount} />
        {pulseError ? <p className="text-sm text-destructive">Unable to update social pulse: {pulseError}</p> : null}
      </section>
    </main>
  );
}
