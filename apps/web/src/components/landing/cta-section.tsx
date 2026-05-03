import { PEEPS } from "@/lib/landing-data";
import { Link } from "@/navigation";

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
          VoteUp makes the election process clear, personal, and live — for
          every new citizen, in every democracy, in every language.
        </p>

        {/* CTA buttons */}
        <div className="reveal mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 text-lg font-medium text-civic-indigo transition-all hover:bg-civic-coral hover:text-white hover:scale-[1.02] active:scale-[0.98]"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-base text-white underline-offset-4 transition-colors hover:underline"
          >
            See the dashboard <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Trust strip */}
        <p className="reveal mt-8 font-mono text-[11px] text-white/40">
          No account required · CC0 data · Powered by Google AI
        </p>
      </div>

      {/* Peep — standing left */}
      <div className="absolute bottom-0 left-8 hidden lg:block pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PEEPS.standingWoman6}
          alt="Illustrated character"
          className="h-[220px] w-auto opacity-50"
          style={{ filter: "brightness(1.5) saturate(0.5) sepia(0.2)" }}
          loading="lazy"
        />
      </div>

      {/* Peep — standing right */}
      <div className="absolute bottom-0 right-8 hidden lg:block pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PEEPS.standingMan5}
          alt="Illustrated character"
          className="h-[200px] w-auto opacity-50 -scale-x-100"
          style={{ filter: "brightness(1.5) saturate(0.5) sepia(0.2)" }}
          loading="lazy"
        />
      </div>
    </section>
  );
}
