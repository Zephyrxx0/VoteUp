'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Circle } from 'lucide-react';
import { ChecklistContainer } from '@/components/checklist/ChecklistContainer';
import { ComparisonCards } from '@/components/ai-comparison/ComparisonCards';
import { MilestoneBadge } from '@/components/social-pulse/MilestoneBadge';
import { PulseCounter } from '@/components/social-pulse/PulseCounter';
import { ResultCard, type CandidateResultView } from '@/components/ui/result-card';
import { getCurrentUser } from '@/lib/auth';
import { useChecklistStore } from '@/lib/stores/checklist-store';
import { useSocialPulseStore } from '@/lib/stores/social-pulse-store';

const STAGE_TO_NUMBER: Record<string, number> = {
  Registration: 1,
  Verification: 2,
  'Final Roll': 3,
  Notification: 4,
  Campaigning: 5,
  Silence: 6,
  Polling: 7,
  Counting: 8,
  'Result Declared': 8,
};

const CONSTITUENCY_ID = 'S2477';

function toResultView(candidate: {
  candidate: string;
  party: string;
  votes: number;
  status: string;
}): CandidateResultView {
  return {
    name: candidate.candidate,
    party: candidate.party,
    votes: candidate.votes,
    status: candidate.status,
  };
}

export function shouldShowShareJourney(stage: string): boolean {
  return stage === 'Result Declared';
}

export function buildShareJourneyMessage(constituency: string, winner: string): string {
  return `I followed the election journey for ${constituency} on VoteUp! Result: ${winner} won!`;
}

export default function DashboardPage() {
  const router = useRouter();
  const user = getCurrentUser();
  const homeCountry = 'United States';
  const fetchCounts = useSocialPulseStore((state) => state.fetchCounts);
  const fetchConstituencyStatus = useSocialPulseStore((state) => state.fetchConstituencyStatus);
  const pulseError = useSocialPulseStore((state) => state.error);
  const checklistItems = useChecklistStore((state) => state.items);
  const [liveStage, setLiveStage] = useState('Campaigning');
  const [constituencyName] = useState('New Delhi');
  const [liveResults, setLiveResults] = useState<CandidateResultView[]>([]);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      router.replace('/');
    }
  }, [router, user?.uid]);

  const stageNumber = useMemo(() => STAGE_TO_NUMBER[liveStage] ?? 5, [liveStage]);

  const personalCompletedCount = useMemo(
    () => Object.values(checklistItems).filter((item) => item.completed).length,
    [checklistItems],
  );

  useEffect(() => {
    let cancelled = false;

    async function refreshStatus() {
      try {
        const status = await fetchConstituencyStatus(CONSTITUENCY_ID);
        if (cancelled) return;

        const sortedResults = status.results
          .map(toResultView)
          .sort((a, b) => b.votes - a.votes);

        setLiveStage(status.stage);
        setLiveResults(sortedResults);
        setStatusError(null);
      } catch (error) {
        if (cancelled) return;
        setStatusError(error instanceof Error ? error.message : 'Unable to fetch live status');
      }
    }

    void refreshStatus();
    const intervalId = window.setInterval(() => {
      void refreshStatus();
    }, 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [fetchConstituencyStatus]);

  useEffect(() => {
    void fetchCounts('new-delhi', stageNumber);
  }, [fetchCounts, stageNumber]);

  const isCountingStage = liveStage === 'Counting';
  const canShareJourney = shouldShowShareJourney(liveStage);
  const winningCandidate = useMemo(
    () => liveResults.find((candidate) => candidate.status.toLowerCase().includes('won')) ?? liveResults[0],
    [liveResults],
  );

  async function handleShareJourney(): Promise<void> {
    const winner = winningCandidate?.name ?? 'the winning candidate';
    const message = buildShareJourneyMessage(constituencyName, winner);

    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share({
          title: 'VoteUp Election Journey',
          text: message,
        });
        setShareStatus('Shared successfully.');
        return;
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(message);
        setShareStatus('Copied message to clipboard.');
        return;
      }

      setShareStatus(message);
    } catch {
      setShareStatus('Unable to share right now. Please try again.');
    }
  }

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
          Current stage: <span className="font-medium text-foreground">{liveStage}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Constituency: <span className="font-medium text-foreground">{constituencyName}</span>
        </p>
        {isCountingStage ? (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Circle className="h-3 w-3 animate-[pulse_1s_ease-in-out_infinite] fill-current" />
            LIVE
          </div>
        ) : null}
        {statusError ? <p className="mt-3 text-sm text-destructive">{statusError}</p> : null}
        {canShareJourney ? (
          <div className="mt-3 space-y-2">
            <button
              type="button"
              onClick={() => {
                void handleShareJourney();
              }}
              className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Share Journey
            </button>
            {shareStatus ? <p className="text-xs text-muted-foreground">{shareStatus}</p> : null}
          </div>
        ) : null}
      </section>

      <ChecklistContainer stage={stageNumber} constituency={constituencyName} />

      {isCountingStage ? (
        <section className="mb-6 space-y-3 rounded-xl border bg-card p-4 sm:p-5">
          <h2 className="text-lg font-semibold">Live Results</h2>
          {liveResults.length > 0 ? (
            <div className="space-y-3">
              {liveResults.map((candidate) => (
                <ResultCard key={`${candidate.name}-${candidate.party}`} candidate={candidate} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Results pending official update.</p>
          )}
        </section>
      ) : null}

      <ComparisonCards homeCountry={homeCountry} />

      <section className="mt-6 space-y-3">
        <PulseCounter />
        <MilestoneBadge stage={stageNumber} personalCompletedCount={personalCompletedCount} />
        {pulseError ? <p className="text-sm text-destructive">Unable to update social pulse: {pulseError}</p> : null}
      </section>
    </main>
  );
}
