"use client";

import { useEffect, useState, useRef } from "react";
import { FEED_ITEMS, PEEPS } from "@/lib/landing-data";
import { Separator } from "@/components/ui/separator";

export function CommunitySection() {
  const [visibleItems, setVisibleItems] = useState(FEED_ITEMS.slice(0, 4));
  const [feedIndex, setFeedIndex] = useState(4);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeedIndex((prev) => {
        const next = (prev + 1) % FEED_ITEMS.length;
        setVisibleItems((items) => {
          const newItems = [...items];
          newItems.pop();
          newItems.unshift(FEED_ITEMS[next]);
          return newItems;
        });
        return next;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const borderColor = (type: string) => {
    switch (type) {
      case "action":
        return "border-l-civic-coral";
      case "milestone":
        return "border-l-civic-gold";
      default:
        return "border-l-civic-indigo";
    }
  };

  return (
    <section
      id="community"
      className="bg-civic-muted-bg py-24"
      aria-label="Community"
    >
      <div className="mx-auto max-w-[1200px] px-4 lg:px-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-civic-text-muted">
          Community
        </p>
        <h2
          className="reveal text-[clamp(1.75rem,4vw,2.25rem)] italic text-civic-text"
          style={{ fontFamily: "var(--font-lora)" }}
        >
          You&apos;re not navigating this alone.
        </h2>
        <p className="reveal mt-3 max-w-[500px] text-base font-light text-civic-text-secondary">
          Thousands of new citizens are using VoteUp across 50 countries
          right now.
        </p>

        <div className="mt-12 flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Left — activity feed */}
          <div className="lg:w-[60%]" ref={feedRef}>
            <div className="flex flex-col gap-3">
              {visibleItems.map((item, i) => (
                <div
                  key={`${item.flags}-${item.time}-${i}`}
                  className={`animate-slide-in rounded-xl border border-civic-border border-l-[3px] ${borderColor(
                    item.type
                  )} bg-civic-card p-3.5`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="text-lg leading-none">
                        {item.flags.split("→")[0]}
                      </span>
                      <p className="text-[13px] text-civic-text">
                        <span className="font-mono text-xs text-civic-text-muted">
                          {item.flags}
                        </span>{" "}
                        {item.text}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] text-civic-text-muted">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — stats */}
          <div className="lg:w-[40%]">
            <div className="flex flex-col gap-8">
              {[
                { number: "281M", label: "People globally in your situation" },
                { number: "50+", label: "Destination countries supported" },
                { number: "22", label: "Languages available instantly" },
              ].map((stat, i, arr) => (
                <div key={stat.number}>
                  <div className="reveal">
                    <p
                      className="text-[clamp(3rem,6vw,5.5rem)] font-bold leading-none text-civic-indigo"
                      style={{ fontFamily: "var(--font-lora)" }}
                    >
                      {stat.number}
                    </p>
                    <p className="mt-2 max-w-[160px] text-sm font-light leading-snug text-civic-text-secondary">
                      {stat.label}
                    </p>
                  </div>
                  {i < arr.length - 1 && (
                    <Separator className="mt-8 bg-civic-border" />
                  )}
                </div>
              ))}

              {/* Peep avatar stack */}
              <div className="mt-4">
                <div className="flex items-center">
                  {[
                    PEEPS.bust1,
                    PEEPS.bust2,
                    PEEPS.bust3,
                    PEEPS.bust4,
                    PEEPS.bust5,
                  ].map((peep, i) => (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      key={peep}
                      src={peep}
                      alt=""
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full border-2 border-civic-card bg-civic-indigo-pale object-cover shadow-sm"
                      style={{
                        marginLeft: i > 0 ? "-12px" : "0",
                        filter: "sepia(0.2) hue-rotate(200deg)",
                        zIndex: 5 - i,
                        position: "relative",
                      }}
                      loading="lazy"
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs text-civic-text-muted">
                  People navigating their first vote in a new democracy — like
                  you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
