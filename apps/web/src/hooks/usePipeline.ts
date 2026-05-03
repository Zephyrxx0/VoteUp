"use client";

import { useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { getFirebaseDb } from '@/lib/firebase';
import { useUserStore } from '@/store/userStore';
import { usePipelineStore } from '@/store/pipelineStore';
import { ElectionPipeline } from '@voteup/contracts';
import { MOCK_PIPELINES } from '@/lib/mock-data';

export function usePipeline() {
  const profile = useUserStore((state) => state.profile);
  const setPipeline = usePipelineStore((state) => state.setPipeline);
  const setPipelineLoading = usePipelineStore((state) => state.setPipelineLoading);

  useEffect(() => {
    const enableLivePipeline = process.env.NEXT_PUBLIC_ENABLE_FIREBASE_PIPELINE === 'true';
    const db = getFirebaseDb();
    const countryCode = profile?.newCountry || 'India';

    setPipelineLoading(true);

    // Fallback to mock data immediately for a responsive experience
    // especially since we know Firebase rules might block unauthenticated users
    const mockData = MOCK_PIPELINES[countryCode];
    if (mockData) {
      setPipeline(mockData);
      setPipelineLoading(false);
    }

    if (!enableLivePipeline) {
      return;
    }

    if (!db) {
      return;
    }

    // Try to get live data if possible
    const pipelineRef = ref(db, `pipelines/${countryCode}/federal_2025`);

    const unsubscribe = onValue(pipelineRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as ElectionPipeline;
        setPipeline(data);
      }
      setPipelineLoading(false);
    }, (error) => {
      console.info('Firebase pipeline unavailable, using mock fallback:', error.message);
      setPipelineLoading(false);
    });

    return () => {
      off(pipelineRef);
    };
  }, [profile?.newCountry, setPipeline, setPipelineLoading]);
}
