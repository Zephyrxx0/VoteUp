import { PEEPS } from "@/lib/landing-data";

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="bg-civic-page py-24"
      aria-label="How it works"
    >
      <div className="mx-auto max-w-[1200px] px-4 lg:px-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-civic-text-muted">
          How it works
        </p>

        {/* ─── Step 1 ─────────────────────────────── */}
        <div className="reveal mt-12 flex flex-col gap-12 lg:flex-row lg:items-center">
          {/* Left — text */}
          <div className="lg:w-1/2">
            <span
              className="block font-mono text-[80px] font-bold leading-none text-civic-indigo-pale select-none"
              aria-hidden="true"
            >
              01
            </span>
            <h3
              className="mt-2 text-[1.75rem] font-bold text-civic-text"
              style={{ fontFamily: "var(--font-lora)" }}
            >
              Tell us your story.
            </h3>
            <p className="mt-4 max-w-[480px] text-base font-light leading-relaxed text-civic-text-secondary">
              Where are you from? Where do you vote now? What language do you
              prefer? Three questions. Thirty seconds. No account needed on
              first visit.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-civic-green">
              <span>✓ No forms</span>
              <span>✓ No jargon</span>
              <span>✓ No government portals</span>
            </div>
          </div>

          {/* Right — mockup */}
          <div className="relative lg:w-1/2">
            <div className="rounded-2xl border border-civic-border bg-civic-card p-6 shadow-sm">
              <p className="font-mono text-[10px] uppercase tracking-wider text-civic-text-muted">
                Select your journey
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-xl border-2 border-civic-indigo bg-civic-indigo-pale p-4 text-center">
                  <span className="text-3xl">🇳🇬</span>
                  <p className="mt-2 font-mono text-xs font-medium text-civic-indigo">
                    I&apos;m from
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-civic-text">
                    Nigeria
                  </p>
                </div>
                <div className="rounded-xl border-2 border-civic-coral bg-civic-coral-pale p-4 text-center">
                  <span className="text-3xl">🇨🇦</span>
                  <p className="mt-2 font-mono text-xs font-medium text-civic-coral">
                    I vote in
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-civic-text">
                    Canada
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-civic-border p-3 text-center">
                <span className="text-lg">🌐</span>
                <p className="mt-1 font-mono text-xs text-civic-text-muted">
                  Language: English
                </p>
              </div>
            </div>
            {/* Peep — waving */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PEEPS.waving}
              alt="Illustrated character waving in welcome"
              width={120}
              height={140}
              className="absolute -bottom-10 -left-4 hidden h-[140px] w-auto drop-shadow-[8px_12px_0px_rgba(45,43,107,0.10)] lg:block"
              style={{ filter: "sepia(0.15) hue-rotate(200deg)" }}
              loading="lazy"
            />
          </div>
        </div>

        {/* ─── Step 2 ─────────────────────────────── */}
        <div className="reveal mt-28 flex flex-col gap-12 lg:flex-row-reverse lg:items-center">
          {/* Right (reversed) — text */}
          <div className="lg:w-1/2">
            <span
              className="block font-mono text-[80px] font-bold leading-none text-civic-indigo-pale select-none"
              aria-hidden="true"
            >
              02
            </span>
            <h3
              className="mt-2 text-[1.75rem] font-bold text-civic-text"
              style={{ fontFamily: "var(--font-lora)" }}
            >
              Watch democracy happen, live.
            </h3>
            <p className="mt-4 max-w-[480px] text-base font-light leading-relaxed text-civic-text-secondary">
              The election pipeline shows every stage of the process in real
              time — from the writ drop to the final count. Each stage lights up
              as it officially begins. You never wonder &ldquo;where are we in
              the election?&rdquo; again.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["🔴 LIVE updates", "📊 7 stages", "⚡ Instant alerts"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-civic-border bg-civic-card px-3 py-1 font-mono text-[11px] text-civic-text-secondary"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Left (reversed) — pipeline visualization */}
          <div className="lg:w-1/2">
            <div className="rounded-2xl border border-civic-border bg-civic-card p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { label: "Writ", status: "done" },
                  { label: "Nomination", status: "done" },
                  { label: "Campaign", status: "active" },
                  { label: "Silence", status: "upcoming" },
                  { label: "Polling", status: "upcoming" },
                  { label: "Counting", status: "upcoming" },
                  { label: "Result", status: "upcoming" },
                ].map((stage, i, arr) => (
                  <div key={stage.label} className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-mono text-[11px] transition-all ${
                        stage.status === "done"
                          ? "bg-civic-green/10 text-civic-green border border-civic-green/30"
                          : stage.status === "active"
                          ? "bg-civic-coral text-white animate-pulse-ring"
                          : "border border-dashed border-civic-border text-civic-text-muted"
                      }`}
                    >
                      {stage.status === "done" && "✓ "}
                      {stage.status === "active" && (
                        <span className="animate-live-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                      {stage.label}
                    </span>
                    {i < arr.length - 1 && (
                      <div className="h-px w-4 bg-civic-border" aria-hidden="true" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-1.5 font-mono text-[10px]">
                <span className="animate-live-dot inline-block h-2 w-2 rounded-full bg-civic-coral" />
                <span className="font-medium text-civic-coral">LIVE</span>
                <span className="text-civic-text-muted">
                  Campaign Period · Day 15 of 36
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Step 3 ─────────────────────────────── */}
        <div className="reveal mt-28 flex flex-col gap-12 lg:flex-row lg:items-center">
          {/* Left — text */}
          <div className="lg:w-1/2">
            <span
              className="block font-mono text-[80px] font-bold leading-none text-civic-indigo-pale select-none"
              aria-hidden="true"
            >
              03
            </span>
            <h3
              className="mt-2 text-[1.75rem] font-bold text-civic-text"
              style={{ fontFamily: "var(--font-lora)" }}
            >
              Understand it through your eyes.
            </h3>
            <p className="mt-4 max-w-[480px] text-base font-light leading-relaxed text-civic-text-secondary">
              Every stage explained in comparison to the system you already know.
              Side by side. In your language. With specific examples — not
              generic civics lessons.
            </p>

            {/* Comparison table */}
            <div className="mt-6 overflow-hidden rounded-xl border border-civic-border">
              <div className="grid grid-cols-2">
                <div className="bg-civic-coral-pale p-3">
                  <p className="font-mono text-[11px] font-medium text-civic-coral">
                    🇳🇬 In Nigeria
                  </p>
                </div>
                <div className="border-l border-civic-border bg-civic-indigo-pale p-3">
                  <p className="font-mono text-[11px] font-medium text-civic-indigo">
                    🇨🇦 In Canada
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="border-t border-civic-border p-3">
                  <p className="font-mono text-[11px] text-civic-text-secondary">
                    90-day campaigns
                  </p>
                </div>
                <div className="border-l border-t border-civic-border p-3">
                  <p className="font-mono text-[11px] text-civic-text-secondary">
                    36-day cap by law
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="border-t border-civic-border p-3">
                  <p className="font-mono text-[11px] text-civic-text-secondary">
                    No spending limit
                  </p>
                </div>
                <div className="border-l border-t border-civic-border p-3">
                  <p className="font-mono text-[11px] text-civic-text-secondary">
                    $35K per riding
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — peep + comparison card */}
          <div className="relative hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PEEPS.reading}
              alt="Illustrated character reading thoughtfully about election comparisons"
              width={200}
              height={240}
              className="h-[220px] w-auto drop-shadow-[8px_12px_0px_rgba(45,43,107,0.10)]"
              style={{ filter: "sepia(0.15) hue-rotate(200deg)" }}
              loading="lazy"
            />
            {/* Floating comparison card */}
            <div className="absolute right-0 top-8 w-[200px] rounded-xl border border-civic-border bg-white p-3 shadow-md">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇳🇬</span>
                <span className="text-civic-text-muted" aria-hidden="true">
                  vs
                </span>
                <span className="text-xl">🇨🇦</span>
              </div>
              <p className="mt-2 font-mono text-[10px] text-civic-text-secondary">
                Campaign spending: Nigeria has variable enforcement. Canada caps
                at $35K per riding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
