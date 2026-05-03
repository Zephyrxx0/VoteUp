"use client";

import { useMemo } from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageStep } from "@/components/onboarding/LanguageStep";
import { IdentityStep } from "@/components/onboarding/IdentityStep";
import { DigiLockerStep } from "@/components/onboarding/DigiLockerStep";
import { useOnboardingStore } from "@/lib/onboarding-store";

export function OnboardingShell() {
  const onboardingStep = useOnboardingStore((state) => state.onboardingStep);
  const setOnboardingStep = useOnboardingStore((state) => state.setOnboardingStep);
  const setHasCompletedOnboarding = useOnboardingStore((state) => state.setHasCompletedOnboarding);

  const stepNode = useMemo(() => {
    if (onboardingStep === 0) {
      return <LanguageStep onNext={() => setOnboardingStep(1)} />;
    }

    if (onboardingStep === 1) {
      return <IdentityStep onNext={() => setOnboardingStep(2)} />;
    }

    return (
      <DigiLockerStep
        onDone={() => {
          setHasCompletedOnboarding(true);
          setOnboardingStep(0);
        }}
      />
    );
  }, [onboardingStep, setHasCompletedOnboarding, setOnboardingStep]);

  return (
    <main className="min-h-screen bg-civic-dark text-civic-text-inverse">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col p-6 md:p-10">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-civic-text-muted">VoteUp</p>
            <h1 className="text-2xl font-semibold md:text-3xl">Your election guide</h1>
          </div>
          <ThemeToggle />
        </header>

        <section className="rounded-2xl border border-white/15 bg-white/5 p-6 md:p-8">
          {stepNode}
        </section>
      </div>
    </main>
  );
}
