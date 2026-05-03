"use client";

import { useState, useCallback } from "react";
import { Calendar, Check, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Google Calendar API constants
const SCOPES = "https://www.googleapis.com/auth/calendar.events";
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

interface CalendarEvent {
  title: string;
  date: string;
  description?: string;
  location?: string;
}

type SyncStatus = "idle" | "authorizing" | "syncing" | "success" | "error";

export function CalendarSync() {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [addedEvents, setAddedEvents] = useState<string[]>([]);

  // Listen for calendar-add events from ActionCards
  if (typeof window !== "undefined") {
    window.addEventListener("voteup:calendar-add", ((e: CustomEvent<CalendarEvent>) => {
      void addToCalendar(e.detail);
    }) as EventListener);
  }

  const addToCalendar = useCallback(async (event: CalendarEvent) => {
    // If no Google API is loaded, fall back to Google Calendar URL
    const startDate = event.date.replace(/-/g, "");
    const endDate = startDate; // Single day event
    const gcalUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description || "")}&location=${encodeURIComponent(event.location || "")}`;

    window.open(gcalUrl, "_blank", "noopener");
    setAddedEvents((prev) => [...prev, event.title]);
    setStatus("success");
  }, []);

  const handleOAuthSync = useCallback(async () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError("Google Calendar client ID not configured");
      setStatus("error");
      return;
    }

    setStatus("authorizing");
    setError(null);

    try {
      // Use Google's OAuth2 redirect flow
      const redirectUri = `${window.location.origin}/api/auth/google/callback`;
      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.searchParams.set("client_id", clientId);
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("scope", SCOPES);
      authUrl.searchParams.set("access_type", "offline");
      authUrl.searchParams.set("prompt", "consent");

      window.open(authUrl.toString(), "_blank", "width=500,height=600");
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authorization failed");
      setStatus("error");
    }
  }, []);

  return (
    <section className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-civic-indigo" />
            Calendar Sync
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add election deadlines and voting dates to your Google Calendar.
          </p>
        </div>

        {status === "success" ? (
          <Badge variant="outline" className="bg-civic-green-pale text-civic-green border-civic-green/20">
            <Check className="mr-1 h-3 w-3" />
            Connected
          </Badge>
        ) : null}
      </div>

      {/* Added events */}
      {addedEvents.length > 0 && (
        <div className="mt-3 space-y-1">
          {addedEvents.map((title, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-civic-green">
              <Check className="h-3 w-3" />
              <span>Added: {title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-3 text-xs text-destructive">{error}</p>
      )}

      {/* Connect button */}
      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={handleOAuthSync}
          disabled={status === "authorizing" || status === "syncing"}
        >
          {status === "authorizing" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ExternalLink className="h-3.5 w-3.5" />
          )}
          {status === "success" ? "Re-sync Calendar" : "Connect Google Calendar"}
        </Button>
      </div>
    </section>
  );
}
