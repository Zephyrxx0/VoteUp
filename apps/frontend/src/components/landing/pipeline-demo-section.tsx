"use client";

import { useState } from "react";
import { PIPELINE_STAGES, PIPELINE_DATA, PEEPS } from "@/lib/landing-data";

const COUNTRY_PAIRS = [
  { key: "NG-CA", label: "Nigeria → Canada", fromFlag: "🇳🇬", toFlag: "🇨🇦" },
  { key: "IN-GB", label: "India → UK", fromFlag: "🇮🇳", toFlag: "🇬🇧" },
  { key: "MX-US", label: "Mexico → US", fromFlag: "🇲🇽", toFlag: "🇺🇸" },
  { key: "PL-DE", label: "Poland → Germany", fromFlag: "🇵🇱", toFlag: "🇩🇪" },
];

export function PipelineDemoSection() {
  const [selectedPair, setSelectedPair] = useState("NG-CA");
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  const pipelineInfo = PIPELINE_DATA[selectedPair];
  const activeIndex = pipelineInfo?.activeIndex ?? 2;

  const handleStageClick = (index: number) => {
    setSelectedStage(selectedStage === index ? null : index);
  };

  return (
    <section
      id="pipeline-demo"
      className="relative bg-civic-dark py-24"
      aria-label="Live pipeline demo"
    >
      <div className="mx-auto max-w-[800px] px-4 lg:px-6">
        {/* Section heading */}
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-white/40">
          See it live
        </p>
        <h2
          className="reveal text-[clamp(1.75rem,4vw,3rem)] italic text-white"
          style={{ fontFamily: "var(--font-lora)" }}
        >
          The election is happening right now.
        </h2>
        <p className="reveal mt-3 text-lg font-light text-white/60">
          Select your journey and watch the process unfold.
        </p>

        {/* Country pair selector */}
        <div className="reveal mt-10 flex flex-wrap gap-2">
          {COUNTRY_PAIRS.map((pair) => (
            <button
              key={pair.key}
              onClick={() => {
                setSelectedPair(pair.key);
                setSelectedStage(null);
              }}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-sm transition-all ${
                selectedPair === pair.key
                  ? "border-civic-coral bg-civic-coral/10 text-white"
                  : "border-white/15 text-white/60 hover:border-white/30 hover:text-white/80"
              }`}
              aria-pressed={selectedPair === pair.key}
            >
              <span>{pair.fromFlag}</span>
              <span className="text-white/30">→</span>
              <span>{pair.toFlag}</span>
            </button>
          ))}
        </div>

        {/* Pipeline */}
        <div className="reveal mt-10">
          <div className="snap-scroll-x flex items-center gap-2 pb-2 lg:flex-wrap lg:overflow-visible">
            {PIPELINE_STAGES.map((stage, i) => {
              const isCompleted = i < activeIndex;
              const isActive = i === activeIndex;
              const isUpcoming = i > activeIndex;
              const isSelected = selectedStage === i;

              return (
                <div key={stage} className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => handleStageClick(i)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-mono text-xs transition-all focus:outline-none focus:ring-2 focus:ring-civic-coral focus:ring-offset-2 focus:ring-offset-civic-dark ${
                      isCompleted
                        ? "border border-civic-green/30 bg-civic-green/20 text-[#5EC499]"
                        : isActive
                        ? "animate-pulse-ring bg-civic-coral text-white"
                        : "border border-dashed border-white/20 text-white/40"
                    } ${isSelected ? "ring-2 ring-civic-coral ring-offset-2 ring-offset-civic-dark" : ""}`}
                    role="button"
                    aria-label={`${stage} stage, ${
                      isCompleted
                        ? "completed"
                        : isActive
                        ? "currently active"
                        : "upcoming"
                    }`}
                    tabIndex={0}
                  >
                    {isCompleted && <span>✓</span>}
                    {isActive && (
                      <span className="animate-live-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                    {stage}
                    {isActive && (
                      <span className="ml-1 rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-medium">
                        LIVE
                      </span>
                    )}
                  </button>
                  {i < PIPELINE_STAGES.length - 1 && (
                    <div
                      className="hidden h-px w-4 bg-white/15 lg:block"
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Stage detail panel */}
          {selectedStage !== null && pipelineInfo?.comparisons[selectedStage] && (
            <div className="mt-6 animate-slide-in rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3
                className="text-xl italic text-white"
                style={{ fontFamily: "var(--font-lora)" }}
              >
                {pipelineInfo.comparisons[selectedStage].stageName}
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="font-mono text-xs font-medium text-civic-coral">
                    {COUNTRY_PAIRS.find((p) => p.key === selectedPair)
                      ?.fromFlag ?? ""}{" "}
                    Home Country
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {pipelineInfo.comparisons[selectedStage].home}
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="font-mono text-xs font-medium text-civic-green">
                    {COUNTRY_PAIRS.find((p) => p.key === selectedPair)
                      ?.toFlag ?? ""}{" "}
                    New Country
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {pipelineInfo.comparisons[selectedStage].new_}
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedStage !== null &&
            !pipelineInfo?.comparisons[selectedStage] && (
              <div className="mt-6 animate-slide-in rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <p className="text-sm text-white/50">
                  Comparison data for this stage and country pair coming soon.
                </p>
              </div>
            )}
        </div>
      </div>

      {/* Peep at boundary — curly */}
      <div className="absolute -bottom-12 left-8 hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PEEPS.curly}
          alt="Illustrated character with curly hair observing the election pipeline"
          width={140}
          height={160}
          className="h-[140px] w-auto opacity-60"
          style={{ filter: "brightness(1.8) saturate(0.3)" }}
          loading="lazy"
        />
      </div>
    </section>
  );
}
