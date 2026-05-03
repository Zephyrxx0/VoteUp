"use client";

import { useState } from "react";
import { JOURNEY_CHIPS } from "@/lib/landing-data";

export function JourneysSection() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section
      id="journeys"
      className="bg-civic-page py-24"
      aria-label="Supported journeys"
    >
      <div className="mx-auto max-w-[1200px] px-4 lg:px-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-civic-text-muted">
          Supported journeys
        </p>
        <h2
          className="reveal text-[clamp(1.5rem,3vw,1.75rem)] font-bold text-civic-text"
          style={{ fontFamily: "var(--font-lora)" }}
        >
          Find your journey.
        </h2>

        {/* Journey chips grid */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {JOURNEY_CHIPS.map((chip, i) => (
            <button
              key={`${chip.from}-${chip.to}-${i}`}
              onClick={() => setSelected(selected === i ? null : i)}
              className={`reveal group flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all hover:scale-[1.02] ${
                selected === i
                  ? "border-civic-coral bg-civic-coral-pale"
                  : "border-civic-border bg-civic-card hover:border-civic-indigo hover:bg-civic-indigo-pale"
              }`}
              aria-pressed={selected === i}
            >
              <div className="flex items-center gap-2 text-2xl">
                <span>{chip.fromFlag}</span>
                <span className="text-sm text-civic-text-muted" aria-hidden="true">
                  →
                </span>
                <span>{chip.toFlag}</span>
              </div>
              <div className="font-mono text-[11px] text-civic-text-secondary">
                <span>{chip.from}</span>
                <span className="mx-1 text-civic-text-muted">→</span>
                <span>{chip.to}</span>
              </div>
              {selected === i && (
                <span className="text-xs text-civic-coral">✓ Selected</span>
              )}
            </button>
          ))}
        </div>

        <p className="mt-8 text-sm text-civic-text-muted">
          Don&apos;t see your journey? We support 80+ home countries and 50+
          destination countries.{" "}
          <a
            href="#cta"
            className="text-civic-indigo underline underline-offset-2 hover:text-civic-indigo-light"
          >
            Start anyway — we&apos;ll have you covered.
          </a>
        </p>
      </div>
    </section>
  );
}
