"use client"

import { useCallback } from "react"

const ACADEMY_HOSTNAMES = ["academy.wearetbo.com.br", "academy.localhost"]

function isAcademyHost(): boolean {
  if (typeof window === "undefined") return false
  return ACADEMY_HOSTNAMES.some(
    (h) => window.location.hostname === h || window.location.host.startsWith(`${h}:`)
  )
}

/**
 * Returns a function that converts internal `/academy/*` paths to the correct
 * URL depending on whether we're on the academy subdomain or the main dashboard.
 *
 * On subdomain: `/academy/cursos/123` → `/cursos/123`
 * On main app:  `/academy/cursos/123` → `/academy/cursos/123` (unchanged)
 */
export function useAcademyUrl() {
  const isSubdomain = isAcademyHost()

  const academyUrl = useCallback(
    (path: string): string => {
      if (!isSubdomain) return path
      // Strip /academy prefix for subdomain
      return path.replace(/^\/academy/, "") || "/"
    },
    [isSubdomain],
  )

  return { academyUrl, isSubdomain }
}
