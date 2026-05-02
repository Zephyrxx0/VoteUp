import { PEEPS } from "@/lib/landing-data";

export function CTASection() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-civic-indigo py-28"
      aria-label="Get started"
    >
      <div className="mx-auto max-w-[700px] px-4 text-center lg:px-6">
        <h2
          className="reveal text-[clamp(1.75rem,4vw,3rem)] italic text-white"
          style={{ fontFamily: "var(--font-lora)" }}
        >
          Your first vote in a new country should feel like a right, not a
          riddle.
        </h2>

        <p className="reveal mt-6 text-lg font-light leading-relaxed text-white/75">
          CivicMirror makes the election process clear, personal, and live — for
          every new citizen, in every democracy, in every language.
        </p>

        {/* CTA buttons */}
        <div className="reveal mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#"
            className="group inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 text-lg font-medium text-civic-indigo transition-all hover:bg-civic-coral hover:text-white hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started — It&apos;s Free
          </a>
          <a
            href="#pipeline-demo"
            className="inline-flex items-center gap-1 text-base text-white underline-offset-4 transition-colors hover:underline"
          >
            See the dashboard <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* Trust strip */}
        <p className="reveal mt-8 font-mono text-[11px] text-white/40">
          No account required · CC0 data · Powered by Google AI
        </p>
      </div>

      {/* Peep — left */}
      <div className="absolute bottom-0 left-8 hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PEEPS.sitting}
          alt="Illustrated character sitting, looking up at the call to action"
          width={140}
          height={160}
          className="h-[140px] w-auto opacity-20"
          style={{ filter: "brightness(2) saturate(0)" }}
          loading="lazy"
        />
      </div>

      {/* Peep — right */}
      <div className="absolute bottom-0 right-8 hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PEEPS.standing}
          alt="Illustrated character standing, looking toward the center"
          width={120}
          height={150}
          className="h-[130px] w-auto opacity-20 -scale-x-100"
          style={{ filter: "brightness(2) saturate(0)" }}
          loading="lazy"
        />
      </div>
    </section>
  );
}
