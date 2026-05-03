"use client";

import { useState, useEffect } from "react";
import { PIPELINE_STAGES, PIPELINE_DATA, PEEPS } from "@/lib/landing-data";
import { Carousel } from "@/components/carousel";

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

  return (
    <section
      id="pipeline-demo"
      className="relative bg-civic-dark py-24 overflow-visible z-10"
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

        {/* Pipeline Carousel */}
        <div className="reveal mt-12">
          <Carousel
            slides={PIPELINE_STAGES.map((stage, i) => (
              <div
                key={`${selectedPair}-${stage}`}
                className="w-full min-h-[300px] rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3
                    className="text-2xl italic text-white"
                    style={{ fontFamily: "var(--font-lora)" }}
                  >
                    {pipelineInfo?.comparisons[i]?.stageName ?? stage}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-civic-coral" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-civic-coral">
                      Stage {i + 1}
                    </span>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3 rounded-xl bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.05]">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {COUNTRY_PAIRS.find((p) => p.key === selectedPair)
                          ?.fromFlag ?? ""}
                      </span>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                        Home Procedure
                      </p>
                    </div>
                    <p className="text-[15px] leading-relaxed text-white/80">
                      {pipelineInfo?.comparisons[i]?.home ??
                        "Standard procedure details coming soon for this stage."}
                    </p>
                  </div>

                  <div className="space-y-3 rounded-xl border border-civic-green/20 bg-civic-green/5 p-5 transition-colors hover:bg-civic-green/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {COUNTRY_PAIRS.find((p) => p.key === selectedPair)
                          ?.toFlag ?? ""}
                      </span>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-civic-green/60">
                        New System
                      </p>
                    </div>
                    <p className="text-[15px] leading-relaxed text-white/90">
                      {pipelineInfo?.comparisons[i]?.new_ ??
                        "Comparative analysis for the new country is currently being finalized."}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            thumbnails={PIPELINE_STAGES.map((stage, i) => (
              <div
                key={stage}
                className={`flex h-full w-full flex-col items-center justify-center p-2 text-[10px] font-bold uppercase tracking-tighter ${
                  i < activeIndex
                    ? "text-civic-green"
                    : i === activeIndex
                    ? "text-civic-coral"
                    : "text-white/40"
                }`}
              >
                <span>{stage}</span>
                {i === activeIndex && (
                  <span className="mt-0.5 rounded-[2px] bg-civic-coral/20 px-1 text-[8px] text-civic-coral">
                    LIVE
                  </span>
                )}
              </div>
            ))}
            showArrows={false}
            showDots={false}
            showProgress={false}
            autoplayDelay={0}
            options={{ loop: false, align: "start" }}
          />
        </div>
      </div>

      {/* Peeps at boundary — seamlessly integrated across sections */}
      <div className="absolute -bottom-24 left-10 hidden lg:block overflow-visible z-30 pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PEEPS.standingWoman5}
          alt="Illustrated character observing"
          className="h-[360px] w-auto opacity-80 transition-all duration-700"
          style={{ 
            filter: "brightness(1.1) saturate(0.7) sepia(0.1)",
            transform: "rotate(-2deg)" 
          }}
          loading="lazy"
        />
      </div>

      <div className="absolute -bottom-32 right-12 hidden lg:block overflow-visible z-30 pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PEEPS.sittingWoman1}
          alt="Illustrated character sitting"
          className="h-[340px] w-auto opacity-75 transition-all duration-700"
          style={{ 
            filter: "brightness(1.1) saturate(0.6) sepia(0.2)",
            transform: "rotate(2deg) scaleX(-1)" 
          }}
          loading="lazy"
        />
      </div>
    </section>
  );
}
