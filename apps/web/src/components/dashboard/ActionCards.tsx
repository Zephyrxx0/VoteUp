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
      // Will be handled by CalendarSync component
      const event = new CustomEvent("voteup:calendar-add", { detail: item.ctaPayload });
      window.dispatchEvent(event);
    }
  }

  return (
    <article
      className={`rounded-xl border p-4 transition-all hover:shadow-md ${config.bg}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={`text-[10px] font-semibold uppercase tracking-wider ${config.badge}`}
            >
              <config.icon className="mr-1 h-3 w-3" />
              {config.label}
            </Badge>
          </div>
          <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        </div>

        {item.ctaType !== "none" && (
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 gap-1.5 text-xs"
            onClick={handleCta}
          >
            <CtaIcon className="h-3.5 w-3.5" />
            {item.ctaType === "map_view"
              ? "View Map"
              : item.ctaType === "calendar_add"
                ? "Add to Calendar"
                : "Open"}
          </Button>
        )}
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

  if (!actions) {
    return (
      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-lg font-semibold">Personalised Actions</h2>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating your action plan…
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
