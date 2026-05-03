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

  if (comparisonLoading || !comparison) {
    return (
      <section className="rounded-xl border bg-card p-5 text-center">
        <div className="flex justify-center mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e536210c67e798fb29b1e94_peep-standing-15.svg" 
            alt="Person with laptop" 
            className="h-32 opacity-80" 
          />
        </div>
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
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="group relative overflow-hidden rounded-xl border bg-civic-muted-bg/20 p-5 transition-all hover:border-civic-indigo hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-civic-indigo">
                🏠 Home System
              </p>
              <h3 className="text-sm font-bold text-foreground">{comparison.homeCountryCode}</h3>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e5360ba550b761a0bfabd32_peep-standing-4.svg" 
              alt="Home peep" 
              className="h-14 opacity-60 grayscale transition-all group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110" 
            />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {comparison.homeSummary}
          </p>
          <a href="https://electionresults.info/" target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-0" />
        </div>

        <div className="group relative overflow-hidden rounded-xl border bg-civic-muted-bg/20 p-5 transition-all hover:border-civic-coral hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-civic-coral">
                🌍 New System
              </p>
              <h3 className="text-sm font-bold text-foreground">{comparison.newCountryCode}</h3>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e536281c992503d98cecdc1_peep-standing-19.svg" 
              alt="New peep" 
              className="h-14 opacity-60 grayscale transition-all group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110" 
            />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {comparison.newSummary}
          </p>
          <a href="https://electionresults.info/" target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-0" />
        </div>
      </div>

      {/* Key differences */}
      {differences.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] whitespace-nowrap">
              Structural Gaps
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          <div className="grid gap-4">
            {differences.map((diff, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl border bg-white p-4 transition-all hover:border-civic-indigo hover:shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1 tracking-wider">{diff.dimension}</p>
                    <div className="h-1 w-8 bg-civic-indigo/20 rounded-full group-hover:w-12 transition-all" />
                  </div>
                  <div className="flex-[2] grid grid-cols-2 gap-0 divide-x border rounded-lg overflow-hidden bg-muted/30">
                    <div className="p-3 space-y-1">
                      <p className="text-[9px] font-bold text-civic-indigo uppercase tracking-tight">Home System</p>
                      <p className="text-xs font-semibold text-foreground leading-tight">{diff.homeValue}</p>
                    </div>
                    <div className="p-3 space-y-1 bg-white">
                      <p className="text-[9px] font-bold text-civic-coral uppercase tracking-tight">New System</p>
                      <p className="text-xs font-semibold text-foreground leading-tight">{diff.newValue}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
