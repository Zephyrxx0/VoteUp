import { FEATURES } from "@/lib/landing-data";
import { Card, CardContent } from "@/components/ui/card";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-civic-page py-24"
      aria-label="Features"
    >
      <div className="mx-auto max-w-[1200px] px-4 lg:px-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-civic-text-muted">
          Everything you need
        </p>
        <h2
          className="reveal text-[clamp(1.75rem,4vw,2.25rem)] font-bold text-civic-text"
          style={{ fontFamily: "var(--font-lora)" }}
        >
          One companion. Every step.
        </h2>

        {/* Feature grid — asymmetric masonry */}
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Card
              key={feature.title}
              className={`reveal rounded-[20px] border ${feature.border} ${feature.bg} ${
                feature.wide ? "md:col-span-2 lg:col-span-2" : ""
              }`}
            >
              <CardContent className="p-6">
                {/* Icon */}
                <div className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl">
                  {feature.icon}
                  {i === 0 && (
                    <span className="animate-live-dot ml-1 inline-block h-2 w-2 rounded-full bg-civic-coral" />
                  )}
                </div>

                {/* Title */}
                <h3
                  className="mt-4 text-lg font-semibold text-civic-text"
                  style={{ fontFamily: "var(--font-lora)" }}
                >
                  {feature.title}
                </h3>

                {/* Body */}
                <p className="mt-2 text-sm font-light leading-relaxed text-civic-text-secondary">
                  {feature.body}
                </p>

                {/* Special content for certain cards */}
                {i === 0 && (
                  /* Mini pipeline for "Live Election Pipeline" card */
                  <div className="mt-4 flex flex-wrap items-center gap-1">
                    {["Writ ✓", "Nom ✓", "● Campaign", "Silence", "Poll", "Count", "Result"].map(
                      (s, j) => (
                        <span
                          key={s}
                          className={`rounded px-2 py-0.5 font-mono text-[9px] ${
                            j < 2
                              ? "bg-civic-indigo/10 text-civic-indigo"
                              : j === 2
                              ? "bg-civic-coral text-white"
                              : "border border-dashed border-civic-border text-civic-text-muted"
                          }`}
                        >
                          {s}
                        </span>
                      )
                    )}
                  </div>
                )}

                {i === 1 && (
                  /* Language flags for "22 Languages" card */
                  <div className="mt-4 flex gap-1 text-xl">
                    {["🇮🇳", "🇳🇬", "🇵🇭", "🇲🇽", "🇫🇷", "🇩🇪"].map((flag) => (
                      <span key={flag}>{flag}</span>
                    ))}
                  </div>
                )}

                {i === 3 && (
                  /* Mini comparison for "Comparison Panel" card */
                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg border border-civic-border overflow-hidden">
                    <div className="bg-civic-coral-pale p-2">
                      <p className="font-mono text-[10px] text-civic-coral">
                        🇳🇬 Home
                      </p>
                      <p className="mt-1 text-[11px] text-civic-text-secondary">
                        90-day campaigns
                      </p>
                    </div>
                    <div className="border-l border-civic-border bg-civic-indigo-pale p-2">
                      <p className="font-mono text-[10px] text-civic-indigo">
                        🇨🇦 New
                      </p>
                      <p className="mt-1 text-[11px] text-civic-text-secondary">
                        36-day maximum
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
