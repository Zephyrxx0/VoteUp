import { PEEPS } from "@/lib/landing-data";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden pt-16"
      aria-label="Hero"
    >
      {/* Dot grid background */}
      <div className="dot-grid absolute inset-0 opacity-50" aria-hidden="true" />

      {/* Subtle indigo blob — top right */}
      <div
        className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-civic-indigo-pale opacity-40"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-[1200px] flex-col gap-12 px-4 py-20 lg:min-h-[calc(100vh-64px)] lg:flex-row lg:items-center lg:gap-8 lg:px-6 lg:py-0">
        {/* Left column — text */}
        <div className="flex flex-col gap-8 lg:w-[55%]">
          {/* Eyebrow */}
          <div
            className="animate-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            <Badge
              variant="default"
              className="w-fit rounded-full bg-civic-indigo px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-white"
            >
              ✦ Built for new citizens · Globally
            </Badge>
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-2">
            <h1
              className="animate-fade-up"
              style={{ animationDelay: "100ms" }}
            >
              <span
                className="block text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.1] text-civic-text"
                style={{ fontFamily: "var(--font-lora)" }}
              >
                Your new country
              </span>
              <span
                className="animate-fade-up block text-[clamp(2.5rem,5vw,4rem)] font-bold italic leading-[1.1] text-civic-indigo"
                style={{
                  fontFamily: "var(--font-lora)",
                  animationDelay: "200ms",
                }}
              >
                is having an election.
              </span>
            </h1>
            <p
              className="animate-fade-up text-[clamp(1.5rem,3vw,2.25rem)] italic text-civic-coral"
              style={{
                fontFamily: "var(--font-lora)",
                fontWeight: 400,
                animationDelay: "300ms",
              }}
            >
              We&apos;ll explain every step.
            </p>
          </div>

          {/* Lead paragraph */}
          <p
            className="animate-fade-up max-w-[480px] text-lg font-light leading-relaxed text-civic-text-secondary"
            style={{ animationDelay: "400ms", lineHeight: 1.75 }}
          >
            CivicMirror shows you the election process unfolding live — and
            explains every stage through the lens of the democracy you already
            know. From Nigeria to Canada. From India to the UK. From anywhere,
            to everywhere.
          </p>

          {/* CTA cluster */}
          <div
            className="animate-fade-up flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "500ms" }}
          >
            <a
              href="#cta"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-civic-coral px-8 py-3.5 text-base font-medium text-white transition-all hover:bg-civic-coral-light hover:scale-[1.02] active:scale-[0.98]"
            >
              Get started — it&apos;s free
              <span
                className="inline-block transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-1 text-base text-civic-indigo transition-colors hover:underline hover:underline-offset-4"
            >
              See how it works <span aria-hidden="true">↓</span>
            </a>
          </div>

          {/* Social proof strip */}
          <div
            className="animate-fade-up flex flex-wrap items-center gap-2 pt-2 font-mono text-xs text-civic-text-muted"
            style={{ animationDelay: "600ms" }}
          >
            <span>🌍 281M migrants worldwide</span>
            <span className="text-civic-border" aria-hidden="true">
              ·
            </span>
            <span>🗳️ 50+ destination countries</span>
            <span className="text-civic-border" aria-hidden="true">
              ·
            </span>
            <span>🌐 Available in 22 languages</span>
          </div>
        </div>

        {/* Right column — card + peep */}
        <div className="relative hidden lg:flex lg:w-[45%] lg:items-center lg:justify-center">
          {/* Background shape */}
          <div
            className="absolute right-0 top-1/2 h-[420px] w-[380px] -translate-y-1/2 -rotate-3 rounded-[40px] bg-civic-indigo-pale"
            aria-hidden="true"
          />

          {/* Floating UI card */}
          <div
            className="animate-fade-up relative z-10 w-[360px] rounded-2xl border border-civic-border bg-white p-6 shadow-lg"
            style={{ animationDelay: "400ms" }}
          >
            {/* Card header */}
            <div className="flex items-center gap-2 border-b border-civic-border pb-4">
              <span className="text-2xl">🇳🇬</span>
              <span className="text-civic-text-muted" aria-hidden="true">
                →
              </span>
              <span className="text-2xl">🇨🇦</span>
              <div className="ml-2">
                <p
                  className="text-sm font-semibold text-civic-text"
                  style={{ fontFamily: "var(--font-lora)" }}
                >
                  Adaeze
                </p>
                <p className="font-mono text-[11px] text-civic-text-muted">
                  Yoruba
                </p>
              </div>
            </div>

            {/* Election name */}
            <p
              className="mt-4 text-sm font-semibold text-civic-text"
              style={{ fontFamily: "var(--font-lora)" }}
            >
              Canadian Federal Election 2025
            </p>

            {/* Pipeline mini */}
            <div className="mt-4 flex items-center gap-1">
              {["Writ", "Nom", "Campaign", "Silence", "Poll"].map(
                (stage, i) => (
                  <div key={stage} className="flex items-center gap-1">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[10px] ${
                        i < 2
                          ? "bg-civic-indigo text-white"
                          : i === 2
                          ? "animate-pulse-ring bg-civic-coral text-white"
                          : "border border-dashed border-civic-border text-civic-text-muted"
                      }`}
                    >
                      {i < 2 && "✓ "}
                      {stage}
                    </span>
                    {i < 4 && (
                      <div
                        className="h-px w-3 bg-civic-border"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                )
              )}
            </div>

            {/* Live indicator */}
            <div className="mt-2 flex items-center gap-1.5">
              <span className="animate-live-dot inline-block h-2 w-2 rounded-full bg-civic-coral" />
              <span className="font-mono text-[10px] font-medium text-civic-coral">
                LIVE
              </span>
              <span className="font-mono text-[10px] text-civic-text-muted">
                · Campaign Period · 21 days left
              </span>
            </div>

            {/* Comparison snippet */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-civic-indigo-pale p-2.5">
                <p className="font-mono text-[10px] font-medium text-civic-indigo">
                  🇳🇬 Nigeria
                </p>
                <p className="mt-1 text-[11px] leading-snug text-civic-text-secondary">
                  90-day campaigns. Spending limits, varied enforcement.
                </p>
              </div>
              <div className="rounded-lg bg-civic-coral-pale p-2.5">
                <p className="font-mono text-[10px] font-medium text-civic-coral">
                  🇨🇦 Canada
                </p>
                <p className="mt-1 text-[11px] leading-snug text-civic-text-secondary">
                  36-day cap by law. $35K per riding limit.
                </p>
              </div>
            </div>

            {/* Card actions */}
            <div className="mt-4 flex items-center gap-2">
              <button className="flex items-center gap-1 rounded-lg border border-civic-border px-3 py-1.5 font-mono text-[11px] text-civic-text-secondary transition-colors hover:border-civic-indigo hover:text-civic-indigo">
                📅 Add to Calendar
              </button>
              <button className="flex items-center gap-1 rounded-lg border border-civic-border px-3 py-1.5 font-mono text-[11px] text-civic-text-secondary transition-colors hover:border-civic-indigo hover:text-civic-indigo">
                📍 My Booth
              </button>
            </div>
          </div>

          {/* Peep — Adaeze */}
          <div className="absolute -bottom-8 -right-4 z-20 animate-peep-float">
            {/* Speech bubble */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-white px-3 py-1.5 shadow-sm">
              <p
                className="text-xs italic text-civic-text"
                style={{ fontFamily: "var(--font-lora)" }}
              >
                &ldquo;I understand my vote now&rdquo;
              </p>
              {/* Bubble tail */}
              <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PEEPS.afro}
              alt="Illustrated character of Adaeze, a new citizen from Nigeria now living in Canada"
              width={200}
              height={240}
              className="h-[200px] w-auto drop-shadow-[8px_12px_0px_rgba(45,43,107,0.10)]"
              style={{
                filter: "sepia(0.1) hue-rotate(180deg)",
              }}
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
