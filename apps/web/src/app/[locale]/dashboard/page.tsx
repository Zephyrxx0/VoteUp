'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Circle, Settings, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Existing components
import { ChecklistContainer } from '@/components/checklist/ChecklistContainer';
import { CompactSocialPulse } from '@/components/social-pulse/CompactSocialPulse';
import { ResultCard, type CandidateResultView } from '@/components/ui/result-card';
import { Navbar, Footer } from '@/components/landing';

// New pipeline-powered components
import { ElectionPipelineTracker } from '@/components/dashboard/ElectionPipelineTracker';
import { ComparisonPanel } from '@/components/dashboard/ComparisonPanel';
import { ActionCards } from '@/components/dashboard/ActionCards';
import { VideoCarousel } from '@/components/dashboard/VideoCarousel';
import { CalendarSync } from '@/components/dashboard/CalendarSync';
import { FcmBanner } from '@/components/dashboard/FcmBanner';
import { MapDrawer } from '@/components/dashboard/MapDrawer';
import { PastResults } from '@/components/dashboard/PastResults';

// Auth & stores

import { useChecklistStore } from '@/lib/stores/checklist-store';
import { useSocialPulseStore } from '@/lib/stores/social-pulse-store';
import { useUserStore } from '@/store/userStore';
import { usePipelineStore } from '@/store/pipelineStore';

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
  // Mock image and source url generation based on the candidate's name to give it a realistic feel
  const isWinnerOrLeading = candidate.status.includes('Won') || candidate.status.includes('Leading');
  const image = isWinnerOrLeading 
    ? 'https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e536281c992503d98cecdc1_peep-standing-19.svg'
    : 'https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e5360ba550b761a0bfabd32_peep-standing-4.svg';
    
  return {
    name: candidate.candidate,
    party: candidate.party,
    votes: candidate.votes,
    status: candidate.status,
    image,
    sourceUrl: `https://results.eci.gov.in`,
  };
}

export function shouldShowShareJourney(stage: string): boolean {
  return stage === 'Result Declared';
}

export function buildShareJourneyMessage(constituency: string, winner: string): string {
  return `I followed the election journey for ${constituency} on VoteUp! Result: ${winner} won!`;
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  ClipboardList, 
  LineChart, 
  History, 
  Map as MapIcon,
  Vote
} from 'lucide-react';

export default function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const router = useRouter();
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);
  const pipeline = usePipelineStore((state) => state.pipeline);

  const fetchCounts = useSocialPulseStore((state) => state.fetchCounts);
  const fetchConstituencyStatus = useSocialPulseStore((state) => state.fetchConstituencyStatus);
  const pulseError = useSocialPulseStore((state) => state.error);
  const checklistItems = useChecklistStore((state) => state.items);

  const [liveStage, setLiveStage] = useState('Campaigning');
  const [constituencyName] = useState('New Delhi');
  const [liveResults, setLiveResults] = useState<CandidateResultView[]>([]);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

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

  const isCountingStage = liveStage === 'Counting' || liveStage === 'Result Declared';
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

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-6xl px-4 sm:px-6 pb-8 pt-28 sm:pt-36">
        {/* Header */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Your Election Dashboard
            </h1>
            <p className="mt-1 text-muted-foreground">
              {profile?.homeCountry && profile?.newCountry
                ? `${profile.homeCountry} → ${profile.newCountry}`
                : 'Track your election journey in real time'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              className="rounded-full border-civic-border bg-white/80 backdrop-blur-md px-5 py-2.5 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-civic-indigo transition-all cursor-pointer hover:border-civic-indigo"
              value={profile?.newCountry || 'India'}
              onChange={(e) => setProfile(profile ? { ...profile, newCountry: e.target.value } : { 
                homeCountry: 'India', 
                newCountry: e.target.value,
                preferredLanguage: 'en',
                registrationStatus: 'registered',
                updatedAt: new Date(),
                history: [],
                badges: []
              })}
            >
              <option value="India">🇮🇳 India</option>
              <option value="United States">🇺🇸 United States</option>
              <option value="United Kingdom">🇬🇧 United Kingdom</option>
              <option value="Canada">🇨🇦 Canada</option>
              <option value="Australia">🇦🇺 Australia</option>
            </select>
          </div>
        </header>

        {/* FCM Notification Banner */}
        <div className="mb-8">
          <FcmBanner />
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px] h-12 items-stretch bg-civic-page border border-civic-border p-1 rounded-xl shadow-sm">
            <TabsTrigger value="overview" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">My Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <LineChart className="h-4 w-4" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Results</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 outline-none">
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <div className="space-y-6">
                <section className="rounded-2xl border bg-white/50 backdrop-blur-sm p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Status Update</h2>
                    {isCountingStage && (
                      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        <Circle className="h-3 w-3 animate-pulse fill-current" />
                        LIVE
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Current Stage</p>
                      <p className="text-lg font-bold text-civic-indigo">{liveStage}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Constituency</p>
                      <p className="text-lg font-bold text-civic-coral">{constituencyName}</p>
                    </div>
                  </div>
                  {statusError && <p className="mt-4 text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">{statusError}</p>}
                  {canShareJourney && (
                    <div className="mt-6 flex items-center gap-4 border-t pt-6">
                      <Button onClick={() => void handleShareJourney()}>
                        Share My Journey
                      </Button>
                      {shareStatus && <p className="text-xs text-muted-foreground">{shareStatus}</p>}
                    </div>
                  )}
                </section>
                <ActionCards />
              </div>
              <aside className="space-y-6">
                <ElectionPipelineTracker />
                <CalendarSync />
              </aside>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6 outline-none">
            <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
              <div className="space-y-6">
                <ChecklistContainer stage={stageNumber} constituency={constituencyName} />
              </div>
              <aside className="space-y-6">
                <section className="rounded-2xl border bg-civic-indigo text-white p-6 shadow-lg">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Preparation Goal
                  </h3>
                  <p className="mt-2 text-indigo-100 text-sm leading-relaxed">
                    Complete your checklist to ensure a smooth voting experience on polling day.
                  </p>
                  <div className="mt-6">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span>Progress</span>
                      <span>{personalCompletedCount} items done</span>
                    </div>
                    <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-500" 
                        style={{ width: `${Math.min(100, (personalCompletedCount / 5) * 100)}%` }}
                      />
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6 outline-none">
            <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
              <div className="space-y-6">
                <ComparisonPanel />
                <VideoCarousel />
              </div>
              <aside className="space-y-6">
                <div className="space-y-3">
                  <CompactSocialPulse 
                    stage={stageNumber} 
                    personalCompletedCount={personalCompletedCount} 
                  />
                  {pulseError && (
                    <p className="text-sm text-destructive">Unable to update social pulse: {pulseError}</p>
                  )}
                </div>
              </aside>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6 outline-none">
            <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
              <div className="space-y-6">
                {isCountingStage && (
                  <section className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        <Vote className="h-5 w-5 text-civic-coral" />
                        Live Results
                      </h2>
                      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                        Refresh
                      </Button>
                    </div>
                    {liveResults.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {liveResults.map((candidate) => (
                          <ResultCard key={`${candidate.name}-${candidate.party}`} candidate={candidate} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center border-2 border-dashed rounded-xl">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground/30" />
                        <p className="mt-3 text-sm text-muted-foreground">Results pending official update...</p>
                      </div>
                    )}
                  </section>
                )}
                <PastResults />
              </div>
              <aside className="space-y-6">
                <section className="rounded-2xl border bg-white p-6 shadow-sm overflow-hidden">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <MapIcon className="h-5 w-5" />
                    Interactive Map
                  </h3>
                  <div className="aspect-square rounded-xl bg-muted flex items-center justify-center border group cursor-pointer hover:bg-muted/80 transition-colors">
                    <p className="text-xs font-bold text-muted-foreground text-center px-4">
                      Open interactive constituency map to see regional trends
                    </p>
                  </div>
                  <Button variant="secondary" className="w-full mt-4" onClick={() => {}}>
                    Explore Map
                  </Button>
                </section>
              </aside>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <MapDrawer />
      <Footer />
    </>
  );
}
