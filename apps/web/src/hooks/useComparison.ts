import { useCallback } from 'react';
import { useUserStore } from '@/store/userStore';
import { usePipelineStore } from '@/store/pipelineStore';
import { useUiStore } from '@/store/uiStore';
import { StageComparison } from '@voteup/contracts';

export function useComparison() {
  const profile = useUserStore((state) => state.profile);
  const activeStage = usePipelineStore((state) => state.activeStage);
  const setComparison = usePipelineStore((state) => state.setComparison);
  const setComparisonLoading = usePipelineStore((state) => state.setComparisonLoading);
  const language = useUiStore((state) => state.language);

  const fetchComparison = useCallback(async () => {
    if (!profile?.homeCountry || !profile?.newCountry || !activeStage?.stageId) {
      return;
    }

    setComparisonLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comparison`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeCountry: profile.homeCountry,
          newCountry: profile.newCountry,
          stageId: activeStage.stageId,
          language
        })
      });

      if (!response.ok) throw new Error('Failed to fetch comparison');

      const data = await response.json() as StageComparison;
      setComparison(data);
    } catch (error) {
      console.error('Error fetching comparison:', error);
    } finally {
      setComparisonLoading(false);
    }
  }, [profile?.homeCountry, profile?.newCountry, activeStage?.stageId, language, setComparison, setComparisonLoading]);

  return { fetchComparison };
}
