"use client";

import { useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { usePipelineStore } from "@/store/pipelineStore";
import { useComparison } from "@/hooks/useComparison";
import { useUserStore } from "@/store/userStore";

export function ComparisonPanel() {
  const { fetchComparison } = useComparison();
  const comparison = usePipelineStore((state) => state.comparison);
  const comparisonLoading = usePipelineStore((state) => state.comparisonLoading);
  const activeStage = usePipelineStore((state) => state.activeStage);
  const profile = useUserStore((state) => state.profile);

  useEffect(() => {
    if (activeStage?.stageId && profile?.homeCountry && profile?.newCountry) {
      void fetchComparison();
    }
  }, [activeStage?.stageId, profile?.homeCountry, profile?.newCountry, fetchComparison]);

  const differences = useMemo(() => comparison?.keyDifferences ?? [], [comparison]);

  if (comparisonLoading) {
    return (
      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-lg font-semibold">System Comparison</h2>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Comparing election systems…
        </div>
      </section>
    );
  }

  if (!comparison) {
    return (
      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-lg font-semibold">System Comparison</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Select your home and destination countries to see a comparison.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border bg-card p-5" aria-label="Election System Comparison">
      <h2 className="text-lg font-semibold">
        Election System Comparison
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        How your home and new country compare at this election stage.
      </p>

      {/* Summary cards */}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border bg-civic-indigo-pale/50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-civic-indigo">
            🏠 Home ({comparison.homeCountryCode})
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            {comparison.homeSummary}
          </p>
        </div>
        <div className="rounded-lg border bg-civic-coral-pale/50 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-civic-coral">
            🌍 New Country ({comparison.newCountryCode})
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            {comparison.newSummary}
          </p>
        </div>
      </div>

      {/* Key differences */}
      {differences.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Key Differences
          </h3>
          {differences.map((diff, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_1fr_1fr] gap-2 rounded-lg border p-3 text-xs"
            >
              <span className="font-semibold text-foreground">{diff.dimension}</span>
              <span className="text-civic-indigo">{diff.homeValue}</span>
              <span className="text-civic-coral">{diff.newValue}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
