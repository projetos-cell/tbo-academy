declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ""

/**
 * Send a custom event to Google Analytics 4.
 * No-op if gtag is not loaded (e.g. during SSR or when GA is not configured).
 */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.gtag) return
  window.gtag("event", name, params)
}

// ── Typed event helpers ─────────────────────────────────────────────────────

export function trackCourseStarted(courseId: string, courseTitle: string) {
  trackEvent("course_started", { course_id: courseId, course_title: courseTitle })
}

export function trackModuleCompleted(moduleId: string, moduleTitle: string, courseId: string) {
  trackEvent("module_completed", {
    module_id: moduleId,
    module_title: moduleTitle,
    course_id: courseId,
  })
}

export function trackDiagnosticCompleted(score: number, level: string) {
  trackEvent("diagnostic_completed", { score, level })
}

export function trackCheckoutInitiated(plan: string) {
  trackEvent("checkout_initiated", { plan })
}

export function trackSubscriptionActivated(plan: string) {
  trackEvent("subscription_activated", { plan })
}
