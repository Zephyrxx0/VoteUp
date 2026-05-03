import { useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { getFirebaseDb } from '@/lib/firebase';
import { useUserStore } from '@/store/userStore';
import { usePipelineStore } from '@/store/pipelineStore';
import { ElectionPipeline } from '@voteup/contracts';

export function usePipeline() {
  const profile = useUserStore((state) => state.profile);
  const setPipeline = usePipelineStore((state) => state.setPipeline);
  const setPipelineLoading = usePipelineStore((state) => state.setPipelineLoading);

  useEffect(() => {
    const db = getFirebaseDb();
    const newCountryCode = profile?.newCountry;

    if (!db || !newCountryCode) {
      setPipelineLoading(false);
      return;
    }

    setPipelineLoading(true);
    
    // For now, we assume a default electionId like 'federal_2025' or 'latest'
    // This could be made dynamic later based on the country data
    const pipelineRef = ref(db, `pipelines/${newCountryCode}/federal_2025`);

    const unsubscribe = onValue(pipelineRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as ElectionPipeline;
        setPipeline(data);
      } else {
        console.warn(`No pipeline found for ${newCountryCode}`);
        setPipeline(null);
      }
      setPipelineLoading(false);
    }, (error) => {
      console.error('Firebase pipeline subscription error:', error);
      setPipelineLoading(false);
    });

    return () => {
      off(pipelineRef);
    };
  }, [profile?.newCountry, setPipeline, setPipelineLoading]);
}
