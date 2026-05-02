"use client";

import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/lib/onboarding-store";

interface LanguageStepProps {
  onNext: () => void;
}

export function LanguageStep({ onNext }: LanguageStepProps) {
  const selectedLocale = useOnboardingStore((state) => state.selectedLocale);
  const setSelectedLocale = useOnboardingStore((state) => state.setSelectedLocale);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-civic-text-secondary">Step 1 of 3</p>
        <h2 className="text-2xl font-semibold">Choose your language</h2>
        <p className="text-civic-text-secondary">You can change this later from your profile settings.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setSelectedLocale("en")}
          className={`rounded-xl border p-4 text-left transition ${selectedLocale === "en" ? "border-primary bg-primary/10" : "border-border bg-card"}`}
        >
          <p className="font-medium">English</p>
          <p className="text-sm text-civic-text-secondary">Continue in English</p>
        </button>
        <button
          type="button"
          onClick={() => setSelectedLocale("hi")}
          className={`rounded-xl border p-4 text-left transition ${selectedLocale === "hi" ? "border-primary bg-primary/10" : "border-border bg-card"}`}
        >
          <p className="font-medium">Hindi</p>
          <p className="text-sm text-civic-text-secondary">हिंदी में जारी रखें</p>
        </button>
      </div>

      <Button onClick={onNext} className="w-full sm:w-auto">Continue</Button>
    </div>
  );
}
