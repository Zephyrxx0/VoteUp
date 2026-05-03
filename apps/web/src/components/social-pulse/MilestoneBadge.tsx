'use client';

import { Badge } from '@/components/ui/badge';
import { useSocialPulseStore } from '@/lib/stores/social-pulse-store';

interface MilestoneBadgeProps {
  stage: number;
  personalCompletedCount: number;
  communityThreshold?: number;
  personalThreshold?: number;
}

export function MilestoneBadge({
  stage,
  personalCompletedCount,
  communityThreshold = 100,
  personalThreshold = 1,
}: MilestoneBadgeProps) {
  const communityMet = useSocialPulseStore((state) => state.isCommunityThresholdMet(stage, communityThreshold));
  const personalMet = personalCompletedCount >= personalThreshold;

  if (!communityMet && !personalMet) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2" aria-label="Milestone badges">
      {personalMet ? <Badge variant="secondary">Personal milestone achieved</Badge> : null}
      {communityMet ? <Badge>Community milestone achieved</Badge> : null}
    </div>
  );
}
