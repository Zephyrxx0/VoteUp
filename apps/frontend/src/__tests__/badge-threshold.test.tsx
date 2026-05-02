import { beforeEach, describe, expect, it } from 'vitest';
import { useSocialPulseStore } from '@/lib/stores/social-pulse-store';

describe('badge threshold logic', () => {
  beforeEach(() => {
    useSocialPulseStore.setState({
      stageCounts: {},
      loading: false,
      error: null,
    });
  });

  it('evaluates community threshold based on fetched counts', () => {
    useSocialPulseStore.setState({
      stageCounts: {
        1: 150,
      },
    });

    const isMet = useSocialPulseStore.getState().isCommunityThresholdMet(1, 100);
    expect(isMet).toBe(true);
  });

  it('returns false when community count is at or below threshold', () => {
    useSocialPulseStore.setState({
      stageCounts: {
        2: 100,
      },
    });

    const isMet = useSocialPulseStore.getState().isCommunityThresholdMet(2, 100);
    expect(isMet).toBe(false);
  });
});
