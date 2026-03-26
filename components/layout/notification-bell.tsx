"use client";

import { IconBell } from "@tabler/icons-react";

// ── Notification Bell (placeholder) ─────────────────────────────────

export function NotificationBell() {
  return (
    <button
      data-tour="notifications"
      className="relative rounded-md text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
      aria-label="Notificações"
    >
      <IconBell className="h-5 w-5" strokeWidth={1.5} />
    </button>
  );
}
