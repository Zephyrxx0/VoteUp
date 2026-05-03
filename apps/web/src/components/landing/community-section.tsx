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

        <div className="mt-12 flex flex-col gap-16">
          {/* Top — activity feed */}
          <div className="w-full" ref={feedRef}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleItems.map((item, i) => (
                <div
                  key={`${item.flags}-${item.time}-${i}`}
                  className={`animate-slide-in rounded-xl border border-civic-border border-l-[3px] ${borderColor(
                    item.type
                  )} bg-civic-card p-4 shadow-sm transition-all hover:shadow-md`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-xl leading-none">
                        {item.flags.split("→")[0]}
                      </span>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-civic-text-muted">
                          {item.flags}
                        </p>
                        <p className="mt-1 text-[14px] leading-snug text-civic-text">
                          {item.text}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] text-civic-text-muted">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom — stats horizontal */}
          <div className="w-full border-t border-civic-border pt-16">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:gap-20">
              {[
                { number: "281M", label: "People globally in your situation" },
                { number: "50+", label: "Destination countries supported" },
                { number: "22", label: "Languages available instantly" },
              ].map((stat) => (
                <div key={stat.number} className="reveal text-center md:text-left">
                  <p
                    className="text-[clamp(3rem,6vw,5rem)] font-bold leading-none text-civic-indigo"
                    style={{ fontFamily: "var(--font-lora)" }}
                  >
                    {stat.number}
                  </p>
                  <p className="mt-3 text-base font-light leading-relaxed text-civic-text-secondary max-w-[200px] mx-auto md:mx-0">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Peep avatar stack & social proof */}
            <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-civic-border/50 pt-10 md:flex-row">
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
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full border-4 border-civic-muted-bg bg-civic-indigo-pale object-cover shadow-sm"
                    style={{
                      marginLeft: i > 0 ? "-16px" : "0",
                      filter: "sepia(0.1) hue-rotate(200deg)",
                      zIndex: 10 - i,
                      position: "relative",
                    }}
                    loading="lazy"
                  />
                ))}
                <div className="ml-4">
                  <p className="text-sm font-medium text-civic-text">
                    Join the community
                  </p>
                  <p className="text-xs text-civic-text-muted">
                    Active citizens across 50+ countries
                  </p>
                </div>
              </div>
              <p className="max-w-[300px] text-center text-sm italic text-civic-text-secondary md:text-right">
                &ldquo;You are not just a voter, you are a participant in a global movement for democracy.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
