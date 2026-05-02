"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { signInAnon } from "@/lib/auth";

interface IdentityStepProps {
  onNext: () => void;
}

export function IdentityStep({ onNext }: IdentityStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue() {
    setLoading(true);
    setError(null);

    const result = await signInAnon();
    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    onNext();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-civic-text-secondary">Step 2 of 3</p>
        <h2 className="text-2xl font-semibold">Start privately</h2>
        <p className="text-civic-text-secondary">We create a private guest session now. You can link Google or phone later.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 text-sm text-civic-text-secondary">
        No provider is required at this stage. Your progress stays saved on this device.
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button onClick={handleContinue} disabled={loading} className="w-full sm:w-auto">
        {loading ? "Starting..." : "Continue as Guest"}
      </Button>
    </div>
  );
}
