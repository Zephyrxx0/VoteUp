import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  selectedLocale: 'en' | 'hi';
  onboardingStep: number;
  digilockerVerified: boolean;
  
  setHasCompletedOnboarding: (value: boolean) => void;
  setSelectedLocale: (locale: 'en' | 'hi') => void;
  setOnboardingStep: (step: number) => void;
  setDigilockerVerified: (value: boolean) => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      selectedLocale: 'en',
      onboardingStep: 0,
      digilockerVerified: false,
      
      setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value }),
      setSelectedLocale: (locale) => set({ selectedLocale: locale }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      setDigilockerVerified: (value) => set({ digilockerVerified: value }),
      resetOnboarding: () => set({ 
        hasCompletedOnboarding: false, 
        onboardingStep: 0,
        digilockerVerified: false,
      }),
    }),
    {
      name: 'voteup-onboarding',
    }
  )
);