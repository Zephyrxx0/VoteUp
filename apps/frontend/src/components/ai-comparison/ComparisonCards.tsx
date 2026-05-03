'use client';

import { useEffect } from 'react';
import { useAiComparisonStore } from '@/lib/stores/ai-comparison-store';

interface ComparisonCardsProps {
  homeCountry: string;
}

export function ComparisonCards({ homeCountry }: ComparisonCardsProps) {
  const fetchComparison = useAiComparisonStore((state) => state.fetchComparison);
  const cache = useAiComparisonStore((state) => state.cache);
  const loading = useAiComparisonStore((state) => state.loading);
  const error = useAiComparisonStore((state) => state.error);

  const comparison = cache[homeCountry.trim().toLowerCase()] ?? [];

  useEffect(() => {
    void fetchComparison(homeCountry);
  }, [fetchComparison, homeCountry]);

  return (
    <section className="mt-6 rounded-xl border bg-card p-4 sm:p-5" aria-label="AI Election System Comparison">
      <h2 className="text-lg font-semibold">AI Comparison: {homeCountry} vs India</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Side-by-side election system highlights generated with Gemini and cached locally.
      </p>

      {loading ? <p className="mt-3 text-sm text-muted-foreground">Generating comparison…</p> : null}
      {error ? <p className="mt-3 text-sm text-destructive">Unable to load comparison: {error}</p> : null}

      <div className="mt-4 space-y-3">
        {comparison.map((item) => (
          <article key={item.category} className="rounded-lg border p-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{item.category}</h3>
            <div className="mt-2 flex flex-col gap-3 md:flex-row">
              <div className="flex-1 rounded-md bg-muted/40 p-3">
                <p className="text-xs uppercase text-muted-foreground">{homeCountry}</p>
                <p className="mt-1 text-sm font-medium text-foreground">{item.homeCountryValue}</p>
              </div>
              <div className="flex-1 rounded-md bg-muted/40 p-3">
                <p className="text-xs uppercase text-muted-foreground">India</p>
                <p className="mt-1 text-sm font-medium text-foreground">{item.indiaValue}</p>
              </div>
            </div>
          </article>
        ))}

        {!loading && !error && comparison.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comparison available yet.</p>
        ) : null}
      </div>
    </section>
  );
}
