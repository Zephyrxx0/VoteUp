"use client";

import { useState } from "react";
import { JOURNEY_CHIPS } from "@/lib/landing-data";
import { Link } from "@/navigation";

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
        <div className="reveal">
          <h2
            className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-tight text-civic-text"
            style={{ fontFamily: "var(--font-lora)" }}
          >
            Choose Your Voting Path.
          </h2>
          <p className="mt-4 max-w-[600px] text-lg font-light text-civic-text-secondary">
            Select the journey that matches your move. We&apos;ll tailor your
            entire experience — from legal translations to live polling
            updates — based on your unique situation.
          </p>
        </div>

        {/* Journey chips grid */}
        <div className="mt-12">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {JOURNEY_CHIPS.map((chip, i) => (
              <button
                key={`${chip.from}-${chip.to}-${i}`}
                onClick={() => setSelected(selected === i ? null : i)}
                className={`group relative flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-all duration-300 hover:shadow-lg ${
                  selected === i
                    ? "border-civic-indigo bg-civic-indigo-pale ring-2 ring-civic-indigo ring-offset-2"
                    : "border-civic-border bg-civic-card hover:border-civic-indigo hover:bg-white"
                }`}
                aria-pressed={selected === i}
              >
                <div className="flex items-center gap-2 text-3xl">
                  <span>{chip.fromFlag}</span>
                  <span
                    className="text-sm text-civic-text-muted opacity-40"
                    aria-hidden="true"
                  >
                    →
                  </span>
                  <span>{chip.toFlag}</span>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-civic-text-muted">
                    {chip.from} to {chip.to}
                  </p>
                  {selected === i && (
                    <span className="block text-[10px] font-bold uppercase text-civic-indigo">
                      Active Path
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Post-selection action */}
          <div
            className={`mt-12 overflow-hidden transition-all duration-500 ${
              selected !== null
                ? "max-h-[200px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="rounded-2xl bg-civic-indigo p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold">Ready to start?</h3>
                <p className="mt-1 text-white/70">
                  You&apos;ve selected the{" "}
                  <span className="font-bold text-white">
                    {selected !== null && JOURNEY_CHIPS[selected].from} →{" "}
                    {selected !== null && JOURNEY_CHIPS[selected].to}
                  </span>{" "}
                  journey.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-bold text-civic-indigo transition-all hover:bg-civic-gold hover:text-white"
              >
                Launch My Journey →
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-12 text-sm text-civic-text-muted text-center md:text-left">
          Don&apos;t see your journey? We support 80+ home countries and 50+
          destination countries.{" "}
          <a
            href="#cta"
            className="text-civic-indigo font-bold underline underline-offset-4 hover:text-civic-indigo-light"
          >
            Start custom path
          </a>
        </p>
      </div>
    </section>
  );
}
