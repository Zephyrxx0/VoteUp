"use client";

import { useMemo } from "react";
import { usePipelineStore } from "@/store/pipelineStore";
import { usePipeline } from "@/hooks/usePipeline";
import { Loader2 } from "lucide-react";

const stageLabels: Record<string, { label: string; emoji: string }> = {
  pre_election: { label: "Pre-Election", emoji: "📋" },
  registration: { label: "Registration", emoji: "✍️" },
  campaigning: { label: "Campaigning", emoji: "📢" },
  silence: { label: "Silence Period", emoji: "🤫" },
  voting: { label: "Voting Day", emoji: "🗳️" },
  counting: { label: "Counting", emoji: "📊" },
  results: { label: "Results", emoji: "🏆" },
};

function getStageInfo(stageId: string) {
  return stageLabels[stageId] || { label: stageId.replace(/_/g, " "), emoji: "📌" };
}

export function ElectionPipelineTracker() {
  // Subscribe to real-time pipeline data
  usePipeline();

  const pipeline = usePipelineStore((state) => state.pipeline);
  const pipelineLoading = usePipelineStore((state) => state.pipelineLoading);

  const stageEntries = useMemo(() => {
    if (!pipeline?.stages) return [];
    return Object.entries(pipeline.stages).map(([stageKey, stage]) => ({
      ...stage,
      ...getStageInfo(stageKey),
      id: stageKey,
    }));
  }, [pipeline]);

  if (pipelineLoading) {
    return (
      <section className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting to election pipeline…
        </div>
      </section>
    );
  }

  if (!pipeline || stageEntries.length === 0) {
    return (
      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-lg font-semibold">Election Pipeline</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No pipeline data available for your selected country.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Election Pipeline</h2>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-civic-green/20 bg-civic-green-pale px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-civic-green">
          <span className="h-1.5 w-1.5 rounded-full bg-civic-green animate-live-dot" />
          Live
        </div>
      </div>

      {/* Pipeline stages */}
      <div className="mt-5 relative">
        {/* Connecting line */}
        <div className="absolute left-[18px] top-3 bottom-3 w-0.5 bg-civic-border" />

        <div className="space-y-4">
          {stageEntries.map((stage) => {
            const isActive = stage.status === "active";
            const isComplete = stage.status === "complete";

            return (
              <div key={stage.id} className="relative flex items-start gap-4">
                {/* Stage indicator */}
                <div
                  className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm ${
                    isActive
                      ? "bg-civic-coral text-white animate-pulse-ring shadow-lg"
                      : isComplete
                        ? "bg-civic-indigo text-white"
                        : "bg-civic-muted-bg text-civic-text-muted border border-civic-border"
                  }`}
                >
                  {stage.emoji}
                </div>

                {/* Stage content */}
                <div className="flex-1 pt-1.5">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-sm font-semibold ${
                        isActive
                          ? "text-civic-coral"
                          : isComplete
                            ? "text-foreground"
                            : "text-civic-text-muted"
                      }`}
                    >
                      {stage.label}
                    </h3>
                    {isActive && (
                      <span className="rounded-full bg-civic-coral-pale px-2 py-0.5 text-[10px] font-semibold uppercase text-civic-coral">
                        Current
                      </span>
                    )}
                  </div>
                  {stage.startDate && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {stage.startDate}
                      {stage.endDate ? ` → ${stage.endDate}` : ""}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
