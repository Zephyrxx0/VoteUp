"use client";

import { useMemo } from "react";
import { useSocialPulseStore } from "@/lib/stores/social-pulse-store";
import { Badge } from "@/components/ui/badge";
import { Users, Zap } from "lucide-react";

interface CompactSocialPulseProps {
  stage: number;
  personalCompletedCount: number;
}

export function CompactSocialPulse({ stage, personalCompletedCount }: CompactSocialPulseProps) {
  const stageCounts = useSocialPulseStore((state) => state.stageCounts);
  
  const totalCompletions = useMemo(
    () => Object.values(stageCounts).reduce((sum: number, count) => sum + (count ?? 0), 0),
    [stageCounts]
  );
  
  const personalMet = personalCompletedCount >= 1;
  const communityMet = (stageCounts[stage] || 0) >= 5;

  return (
    <section className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-civic-coral fill-civic-coral" />
        <h2 className="text-lg font-semibold">Social Pulse</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Personal Milestone */}
        <div className="space-y-3">
          <div className={`rounded-full px-3 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider border ${
            personalMet 
              ? "bg-civic-indigo/10 text-civic-indigo border-civic-indigo/20" 
              : "bg-muted text-muted-foreground border-border"
          }`}>
            Personal
          </div>
          <div className="text-center px-1">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {personalCompletedCount}
            </span>
            <p className="text-[9px] text-muted-foreground uppercase font-semibold mt-0.5">Tasks Done</p>
          </div>
        </div>

        {/* Community Goal */}
        <div className="space-y-3">
          <div className={`rounded-full px-3 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider border ${
            communityMet 
              ? "bg-civic-coral/10 text-civic-coral border-civic-coral/20" 
              : "bg-muted text-muted-foreground border-border"
          }`}>
            Community
          </div>
          <div className="text-center px-1">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {stageCounts[stage] || 0}
            </span>
            <p className="text-[9px] text-muted-foreground uppercase font-semibold mt-0.5">Active Now</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-bold text-foreground">{totalCompletions} total users active</span>
        </div>
        <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-civic-indigo transition-all duration-1000" 
            style={{ width: `${Math.min(100, (totalCompletions / 100) * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
