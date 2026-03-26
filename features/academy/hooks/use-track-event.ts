"use client";

import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export type AcademyEventType =
  | "course_view"
  | "lesson_start"
  | "lesson_complete"
  | "course_complete"
  | "path_start"
  | "path_complete"
  | "search"
  | "certificate_download";

export type AcademyEntityType = "course" | "lesson" | "module" | "learning_path";

interface TrackEventOptions {
  eventType: AcademyEventType;
  entityType?: AcademyEntityType;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

// Fire-and-forget event logger — never throws, never blocks UI
async function logEvent(options: TrackEventOptions): Promise<void> {
  try {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("academy_analytics_events").insert({
      user_id: session.user.id,
      event_type: options.eventType,
      entity_type: options.entityType ?? null,
      entity_id: options.entityId ?? null,
      metadata: options.metadata ?? {},
    });
  } catch {
    // Silently ignore — tracking must never break the user experience
  }
}

/**
 * useTrackEvent — returns a stable `track` function that logs an event to
 * academy_analytics_events. All calls are fire-and-forget and never throw.
 *
 * Usage:
 *   const track = useTrackEvent()
 *   track({ eventType: "lesson_start", entityType: "lesson", entityId: lessonId })
 */
export function useTrackEvent() {
  const track = useCallback((options: TrackEventOptions) => {
    void logEvent(options);
  }, []);

  return track;
}
