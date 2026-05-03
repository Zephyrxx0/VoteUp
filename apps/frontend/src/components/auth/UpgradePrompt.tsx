"use client";

import { useState } from "react";

import { upgradeToGoogle } from "@/lib/auth";
import { Button } from "@/components/ui/button";

interface UpgradePromptProps {
  isAnonymous: boolean;
  badgesCount: number;
}

export function UpgradePrompt({ isAnonymous, badgesCount }: UpgradePromptProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isAnonymous || badgesCount < 1) {
    return null;
  }

  const handleUpgrade = async () => {
    setBusy(true);
    setMessage(null);

    const result = await upgradeToGoogle();

    if (result.error) {
      setMessage(`Could not link account: ${result.error.message}`);
      setBusy(false);
      return;
    }

    if (result.conflict) {
      setMessage("Account linked, but constituency conflict needs your review.");
      setBusy(false);
      return;
    }

    setMessage("Google account linked successfully. Your civic progress is now synced.");
    setBusy(false);
  };

  return (
    <section className="rounded-xl border bg-card p-4 text-card-foreground">
      <p className="text-sm font-medium">Secure your progress</p>
      <p className="mt-1 text-sm text-muted-foreground">
        You earned {badgesCount} badge{badgesCount === 1 ? "" : "s"}. Link your Google account to sync
        badges and history across devices.
      </p>
      <div className="mt-3 flex items-center gap-3">
        <Button onClick={handleUpgrade} disabled={busy}>
          {busy ? "Linking..." : "Link Google Account"}
        </Button>
        {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
      </div>
    </section>
  );
}
