"use client";

import { PAST_ELECTIONS_DATA } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, History } from "lucide-react";

export function PastResults() {
  return (
    <section className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-civic-indigo" />
          <h2 className="text-lg font-semibold">Election History</h2>
        </div>
        <Badge variant="outline" className="text-[10px] font-semibold uppercase">
          Archive
        </Badge>
      </div>

      <div className="space-y-4">
        {PAST_ELECTIONS_DATA.map((election) => (
          <div key={election.id} className="group relative rounded-lg border bg-civic-muted-bg/30 p-4 transition-all hover:border-civic-indigo hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground group-hover:text-civic-indigo transition-colors">
                  {election.name}
                </h3>
                <p className="text-xs text-muted-foreground">{election.region} • {election.date}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-civic-text-muted transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-civic-indigo" />
            </div>
            
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {election.summary}
            </p>

            <div className="mt-3 flex items-center gap-3">
              {election.results.map((res) => (
                <div key={res.party} className="flex items-center gap-1.5">
                  <div 
                    className="h-2 w-2 rounded-full" 
                    style={{ backgroundColor: res.color }}
                  />
                  <span className="text-[10px] font-medium text-foreground">
                    {res.party}: {res.seats}
                  </span>
                </div>
              ))}
            </div>
            
            <a 
              href={`https://electionresults.info/general-elections/${election.id.split('_')[1]}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute inset-0 z-0"
              aria-label={`View full results for ${election.name}`}
            />
          </div>
        ))}
      </div>
      
      <p className="mt-4 text-center">
        <a 
          href="https://electionresults.info/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] font-medium text-civic-indigo uppercase tracking-wider hover:underline"
        >
          Explore All Data →
        </a>
      </p>
    </section>
  );
}
