import { useCallback } from 'react';
import { useUserStore } from '@/store/userStore';
import { usePipelineStore } from '@/store/pipelineStore';

export function useVideos() {
  const profile = useUserStore((state) => state.profile);
  const activeStage = usePipelineStore((state) => state.activeStage);
  const setVideos = usePipelineStore((state) => state.setVideos);

  const fetchVideos = useCallback(async () => {
    if (!profile?.newCountry || !activeStage?.stageId) {
      return;
    }

    try {
      const response = await fetch(
        `/api/videos?countryCode=${encodeURIComponent(profile.newCountry)}&stageId=${encodeURIComponent(activeStage.stageId)}`
      );

      if (!response.ok) throw new Error('Failed to fetch videos');

      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  }, [profile?.newCountry, activeStage?.stageId, setVideos]);

  return { fetchVideos };
}
