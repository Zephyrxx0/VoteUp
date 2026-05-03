'use client';

import { useEffect, useMemo, useState } from 'react';
import { Award, CheckCircle2, Cloud, CloudOff, Loader2, Shield } from 'lucide-react';

import { UpgradePrompt } from '@/components/auth/UpgradePrompt';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser } from '@/lib/auth';
import { getUserProfile, type UserProfile } from '@/lib/user-service';

const STAGE_LABELS: Record<string, string> = {
  'stage-1': 'Registration',
  'stage-2': 'Verification',
  'stage-3': 'Final Roll',
  'stage-4': 'Notification',
  'stage-5': 'Campaigning',
  'stage-6': 'Silence',
  'stage-7': 'Polling',
  'stage-8': 'Counting & Result',
};

function toStageLabel(value: string): string {
  const normalized = value.trim().toLowerCase();
  return STAGE_LABELS[normalized] ?? value;
}

function iconForBadge(badgeId: string) {
  const value = badgeId.toLowerCase();
  if (value.includes('shield')) return Shield;
  if (value.includes('cloud') || value.includes('sync')) return Cloud;
  if (value.includes('complete') || value.includes('winner')) return CheckCircle2;
  return Award;
}

export function ProfileView() {
  const user = getCurrentUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user?.uid) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const data = await getUserProfile(user.uid);
        setProfile(data);
        setError(null);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Unable to load profile');
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, [user?.uid]);

  const badges = profile?.badges ?? [];
  const history = useMemo(() => (profile?.history ?? []).map(toStageLabel), [profile?.history]);
  const isAnonymous = user?.isAnonymous ?? true;

  return (
    <main className="mx-auto min-h-screen max-w-4xl space-y-6 p-4 sm:p-6">
      <section className="rounded-xl border bg-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-1 text-sm text-muted-foreground">Review your civic progress and account sync status.</p>
          </div>
          <Badge variant={isAnonymous ? 'secondary' : 'default'}>
            {isAnonymous ? <CloudOff className="size-3" /> : <Cloud className="size-3" />}
            {isAnonymous ? 'Local Only' : 'Cloud Synced'}
          </Badge>
        </div>
        {loading ? (
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading profile...
          </p>
        ) : null}
        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      </section>

      <section className="rounded-xl border bg-card p-4 sm:p-5">
        <h2 className="text-lg font-semibold">Earned Badges</h2>
        {badges.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2" aria-label="Earned badges">
            {badges.map((badgeId) => {
              const Icon = iconForBadge(badgeId);
              return (
                <Badge key={badgeId} variant="outline" className="h-auto px-2 py-1 text-xs capitalize">
                  <Icon className="size-3" />
                  {badgeId.replace(/[-_]/g, ' ')}
                </Badge>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">No badges yet. Complete stages to earn your first badge.</p>
        )}
      </section>

      <section className="rounded-xl border bg-card p-4 sm:p-5">
        <h2 className="text-lg font-semibold">Completed Stages</h2>
        {history.length > 0 ? (
          <ul className="mt-3 space-y-2" aria-label="Completed stages">
            {history.map((stage, index) => (
              <li key={`${stage}-${index}`} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="size-4 text-primary" />
                <span>{stage}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">No completed stages yet.</p>
        )}
      </section>

      <UpgradePrompt isAnonymous={isAnonymous} badgesCount={badges.length} />
    </main>
  );
}
