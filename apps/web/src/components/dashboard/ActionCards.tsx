"use client";

import { useEffect } from "react";
import {
  MapPin,
  CalendarPlus,
  ExternalLink,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useActions } from "@/hooks/useActions";
import { usePipelineStore } from "@/store/pipelineStore";
import { useUiStore } from "@/store/uiStore";
import type { ActionItem } from "@voteup/contracts";

const priorityConfig = {
  urgent: {
    bg: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    icon: AlertTriangle,
    label: "Urgent",
  },
  high: {
    bg: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    icon: ArrowUpRight,
    label: "High Priority",
  },
  normal: {
    bg: "bg-civic-indigo-pale border-civic-indigo/10",
    badge: "bg-civic-indigo-pale text-civic-indigo",
    icon: CheckCircle2,
    label: "Recommended",
  },
};

function ctaIcon(ctaType: string) {
  switch (ctaType) {
    case "map_view":
      return MapPin;
    case "calendar_add":
      return CalendarPlus;
    case "external_url":
      return ExternalLink;
    default:
      return ArrowUpRight;
  }
}

import { PAST_ELECTIONS_DATA } from "@/lib/mock-data";
import { ChevronDown } from "lucide-react";

function ActionCard({ item }: { item: ActionItem }) {
  const openMapDrawer = useUiStore((state) => state.openMapDrawer);
  const config = priorityConfig[item.priority] || priorityConfig.normal;
  const CtaIcon = ctaIcon(item.ctaType);

  function handleCta() {
    if (item.ctaType === "map_view") {
      openMapDrawer();
    } else if (item.ctaType === "external_url" && typeof item.ctaPayload === "string") {
      window.open(item.ctaPayload, "_blank", "noopener");
    } else if (item.ctaType === "calendar_add") {
      const event = new CustomEvent("voteup:calendar-add", { detail: item.ctaPayload });
      window.dispatchEvent(event);
    }
  }

  return (
    <article
      className={`group relative overflow-hidden rounded-xl border p-5 transition-all hover:shadow-lg hover:border-civic-indigo ${config.bg}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={`text-[10px] font-bold uppercase tracking-widest ${config.badge}`}
            >
              <config.icon className="mr-1 h-3 w-3" />
              {config.label}
            </Badge>
          </div>
          <h3 className="text-base font-bold text-foreground group-hover:text-civic-indigo transition-colors">{item.title}</h3>
          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2 group-hover:line-clamp-none transition-all">
            {item.description}
          </p>
        </div>

        {item.ctaType !== "none" && (
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 gap-2 text-xs font-bold border-civic-border bg-white hover:bg-civic-indigo hover:text-white hover:border-civic-indigo transition-all"
            onClick={handleCta}
          >
            <CtaIcon className="h-3.5 w-3.5" />
            {item.ctaType === "map_view"
              ? "View Map"
              : item.ctaType === "calendar_add"
                ? "Add to Calendar"
                : "Open Link"}
          </Button>
        )}
      </div>
      {/* Subtle background decoration */}
      <div className="absolute -right-4 -bottom-4 h-16 w-16 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-125">
        <CtaIcon className="h-full w-full" />
      </div>
    </article>
  );
}

export function ActionCards() {
  const { fetchActions } = useActions();
  const actions = usePipelineStore((state) => state.actions);
  const activeStage = usePipelineStore((state) => state.activeStage);

  useEffect(() => {
    if (activeStage?.stageId) {
      void fetchActions();
    }
  }, [activeStage?.stageId, fetchActions]);

  if (!actions || actions.items.length === 0) {
    return (
      <section className="rounded-xl border bg-card p-6 text-center">
        <div className="flex justify-center mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://cdn.prod.website-files.com/5e51c674258ffe10d286d30a/5e536281c992503d98cecdc1_peep-standing-19.svg" 
            alt="Person with megaphone" 
            className="h-32 opacity-80" 
          />
        </div>
        <h2 className="text-xl font-bold">No Active Actions</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          There are no live actions for the current election stage. You can explore previous major elections to see how they progressed.
        </p>
        
        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Previous Election</p>
          <div className="relative w-full max-w-xs">
            <select className="w-full appearance-none rounded-lg border border-civic-border bg-civic-muted-bg/20 px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-civic-indigo pr-10">
              {PAST_ELECTIONS_DATA.map(e => (
                <option key={e.id} value={e.id}>{e.name} ({e.region})</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          <Button variant="outline" className="mt-2 text-xs font-bold border-civic-indigo text-civic-indigo hover:bg-civic-indigo hover:text-white">
            View Election Info
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border bg-card p-5">
      <h2 className="text-lg font-semibold">Personalised Actions</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        AI-generated steps based on your election stage and country.
      </p>
      <div className="mt-4 space-y-3">
        {actions.items.map((item) => (
          <ActionCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
