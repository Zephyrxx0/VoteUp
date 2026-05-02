"use client";

import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/lib/onboarding-store";

interface DigiLockerStepProps {
  onDone: () => void;
}

export function DigiLockerStep({ onDone }: DigiLockerStepProps) {
  const setDigilockerVerified = useOnboardingStore((state) => state.setDigilockerVerified);

  function handleSkip() {
    setDigilockerVerified(false);
    onDone();
  }

  function handleMockConnect() {
    setDigilockerVerified(true);
    onDone();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-civic-text-secondary">Step 3 of 3</p>
        <h2 className="text-2xl font-semibold">Verify with DigiLocker</h2>
        <p className="text-civic-text-secondary">Verification unlocks personalized voter details. You can do this now or later.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 text-sm text-civic-text-secondary">
        DigiLocker live integration is in progress. Use mock connect for now.
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleMockConnect}>Mock Connect</Button>
        <Button variant="outline" onClick={handleSkip}>Skip for Now</Button>
      </div>
    </div>
  );
}
