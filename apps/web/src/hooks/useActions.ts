import { useCallback } from 'react';
import { useUserStore } from '@/store/userStore';
import { usePipelineStore } from '@/store/pipelineStore';
import { useUiStore } from '@/store/uiStore';
import { MOCK_ACTIONS } from '@/lib/mock-data';
import { PersonalisedActions } from '@voteup/contracts';

export function useActions() {
  const profile = useUserStore((state) => state.profile);
  const activeStage = usePipelineStore((state) => state.activeStage);
  const setActions = usePipelineStore((state) => state.setActions);
  const language = useUiStore((state) => state.language);

  const fetchActions = useCallback(async (lat?: number, lng?: number) => {
    const country = profile?.newCountry || 'India';
    const stageId = activeStage?.stageId || 'registration';

    // Mock fallback check
    const mockKey = `${country}-${stageId}`;
    if (MOCK_ACTIONS[mockKey]) {
      setActions(MOCK_ACTIONS[mockKey]);
    }

    try {
      const response = await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeCountry: profile?.homeCountry || country,
          newCountry: country,
          stageId,
          language,
          registrationStatus: profile?.registrationStatus || 'unknown',
          lat,
          lng
        })
      });

      if (response.ok) {
        const data = await response.json() as PersonalisedActions;
        setActions(data);
      }
    } catch (error) {
      console.warn('Error fetching actions, using mock fallback:', error);
    }
  }, [profile, activeStage?.stageId, language, setActions]);

  return { fetchActions };
}
