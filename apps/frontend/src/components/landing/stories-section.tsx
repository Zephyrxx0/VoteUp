import { PERSONAS } from "@/lib/landing-data";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function StoriesSection() {
  return (
    <section
      id="who-it's-for"
      className="bg-civic-muted-bg py-20"
      aria-label="Who it's for"
    >
      <div className="mx-auto max-w-[1200px] px-4 lg:px-6">
        {/* Section heading */}
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-civic-text-muted">
          For people like you
        </p>
        <h2
          className="reveal text-[clamp(1.75rem,4vw,2.25rem)] italic text-civic-text"
          style={{ fontFamily: "var(--font-lora)" }}
        >
          From anywhere, to everywhere.
        </h2>
        <p className="reveal mt-3 max-w-[600px] text-base font-light leading-relaxed text-civic-text-secondary">
          Millions of new citizens navigate their first election in an
          unfamiliar democracy every year. VoteUp is built for every one of
          them.
        </p>

        {/* Story cards */}
        <div className="mt-12 snap-scroll-x flex gap-5 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {PERSONAS.map((persona) => (
            <Card
              key={persona.name}
              className="reveal min-w-[280px] shrink-0 rounded-[20px] border-civic-border bg-civic-card lg:min-w-0"
            >
              <CardContent className="p-6">
                {/* Full-body standing illustration */}
                <div className="flex justify-center overflow-hidden rounded-xl bg-civic-muted-bg py-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={persona.peep}
                    alt={`Illustrated full-body character of ${persona.name}, from ${persona.from}`}
                    className="h-[200px] w-auto object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Name */}
                <h3
                  className="mt-4 text-lg font-bold text-civic-text"
                  style={{ fontFamily: "var(--font-lora)" }}
                >
                  {persona.name}
                </h3>

                {/* Journey */}
                <p className="mt-1 flex items-center gap-1 font-mono text-xs text-civic-text-secondary">
                  <span className="text-lg">{persona.fromFlag}</span>
                  <span>{persona.from}</span>
                  <span className="text-civic-text-muted">→</span>
                  <span className="text-lg">{persona.toFlag}</span>
                  <span>{persona.to}</span>
                </p>

                {/* Quote */}
                <p
                  className="mt-4 text-sm italic leading-relaxed text-civic-text-secondary"
                  style={{
                    fontFamily: "var(--font-lora)",
                    lineHeight: 1.7,
                  }}
                >
                  &ldquo;{persona.quote}&rdquo;
                </p>

                <Separator className="my-4 bg-civic-border" />

                {/* Footer */}
                <p className="font-mono text-[11px] text-civic-text-muted">
                  Now voting in: {persona.election}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
