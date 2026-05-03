import { useCallback } from 'react';
import { useUserStore } from '@/store/userStore';
import { usePipelineStore } from '@/store/pipelineStore';
import { useUiStore } from '@/store/uiStore';
import { MOCK_COMPARISONS } from '@/lib/mock-data';
import { StageComparison } from '@voteup/contracts';

export function useComparison() {
  const profile = useUserStore((state) => state.profile);
  const activeStage = usePipelineStore((state) => state.activeStage);
  const setComparison = usePipelineStore((state) => state.setComparison);
  const setComparisonLoading = usePipelineStore((state) => state.setComparisonLoading);
  const language = useUiStore((state) => state.language);

  const fetchComparison = useCallback(async () => {
    const homeCountry = profile?.homeCountry || 'India';
    const newCountry = profile?.newCountry || 'India';
    const stageId = activeStage?.stageId || 'registration';

    setComparisonLoading(true);

    // Mock fallback check
    const mockKey = `${homeCountry}-${stageId}`;
    if (MOCK_COMPARISONS[mockKey]) {
      setComparison(MOCK_COMPARISONS[mockKey]);
    }

    try {
      const response = await fetch('/api/comparison', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeCountry,
          newCountry,
          stageId,
          language
        })
      });

      if (response.ok) {
        const data = await response.json() as StageComparison;
        setComparison(data);
      }
    } catch (error) {
      console.warn('Error fetching comparison, using mock fallback:', error);
    } finally {
      setComparisonLoading(false);
    }
  }, [profile?.homeCountry, profile?.newCountry, activeStage?.stageId, language, setComparison, setComparisonLoading]);

  return { fetchComparison };
}
