"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { trackSubscriptionActivated } from "@/lib/analytics"

/**
 * Fires a subscription_activated GA event when the user lands on any academy
 * page with ?checkout=success in the URL (set as the Stripe success_url).
 */
export function CheckoutSuccessTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      trackSubscriptionActivated("unknown")
    }
  }, [searchParams])

  return null
}
