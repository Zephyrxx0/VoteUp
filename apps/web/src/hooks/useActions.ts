import { useCallback } from 'react';
import { useUserStore } from '@/store/userStore';
import { usePipelineStore } from '@/store/pipelineStore';
import { useUiStore } from '@/store/uiStore';
import { PersonalisedActions } from '@voteup/contracts';

export function useActions() {
  const profile = useUserStore((state) => state.profile);
  const activeStage = usePipelineStore((state) => state.activeStage);
  const setActions = usePipelineStore((state) => state.setActions);
  const language = useUiStore((state) => state.language);

  const fetchActions = useCallback(async (lat?: number, lng?: number) => {
    if (!profile?.newCountry || !activeStage?.stageId) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeCountry: profile.homeCountry,
          newCountry: profile.newCountry,
          stageId: activeStage.stageId,
          language,
          registrationStatus: profile.registrationStatus || 'unknown',
          lat,
          lng
        })
      });

      if (!response.ok) throw new Error('Failed to fetch actions');

      const data = await response.json() as PersonalisedActions;
      setActions(data);
    } catch (error) {
      console.error('Error fetching actions:', error);
    }
  }, [profile?.homeCountry, profile?.newCountry, profile?.registrationStatus, activeStage?.stageId, language, setActions]);

  return { fetchActions };
}
