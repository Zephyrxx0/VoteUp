"use client";

import { useState, useCallback, useEffect } from "react";
import { Bell, BellOff, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/uiStore";
import { getFirebaseApp } from "@/lib/firebase";

type PermissionStatus = "default" | "granted" | "denied" | "unsupported";

export function FcmBanner() {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>("default");
  const [loading, setLoading] = useState(false);
  const dismissed = useUiStore((state) => state.fcmPermissionDismissed);
  const dismiss = useUiStore((state) => state.dismissFcmPermission);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermissionStatus("unsupported");
      return;
    }
    setPermissionStatus(Notification.permission as PermissionStatus);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return;

    setLoading(true);

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission as PermissionStatus);

      if (permission === "granted") {
        // Register service worker and get FCM token
        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
        const app = getFirebaseApp();

        if (app && vapidKey) {
          try {
            // Dynamically import to avoid SSR issues
            const { getMessaging, getToken } = await import("firebase/messaging");
            const messaging = getMessaging(app);
            const token = await getToken(messaging, { vapidKey });
            console.log("[FCM] Token obtained:", token.substring(0, 20) + "...");
            
            // In production, send this token to the backend
            // await fetch('/api/fcm/register', { method: 'POST', body: JSON.stringify({ token }) });
          } catch (err) {
            console.warn("[FCM] Token retrieval failed:", err);
          }
        }
      }
    } catch (err) {
      console.error("[FCM] Permission request failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Don't show if dismissed, already granted, or unsupported
  if (dismissed || permissionStatus === "granted" || permissionStatus === "unsupported") {
    return null;
  }

  if (permissionStatus === "denied") {
    return null; // Can't ask again once denied
  }

  return (
    <div className="rounded-xl border border-civic-gold/30 bg-civic-gold-pale p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-civic-gold/10 p-2">
            <Bell className="h-4 w-4 text-civic-gold" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Stay informed with push notifications
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Get notified when election stages change, new deadlines approach, or results come in.
            </p>
          </div>
        </div>

        <button
          onClick={dismiss}
          className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-muted transition-colors"
          aria-label="Dismiss notification prompt"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex gap-2 pl-11">
        <Button
          size="sm"
          className="gap-1.5 bg-civic-gold text-white hover:bg-civic-gold/90"
          onClick={requestPermission}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Bell className="h-3.5 w-3.5" />
          )}
          Enable Notifications
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="gap-1.5 text-muted-foreground"
          onClick={dismiss}
        >
          <BellOff className="h-3.5 w-3.5" />
          Not now
        </Button>
      </div>
    </div>
  );
}
