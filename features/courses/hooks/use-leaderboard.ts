"use client"

import { useQuery } from "@tanstack/react-query"
import type { LeaderboardEntry } from "../types"

async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await fetch("/api/academy/leaderboard")
  if (!res.ok) return []
  const json = await res.json()
  return json.leaderboard ?? []
}

export function useLeaderboard() {
  const { data: leaderboard = [], isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["academy", "leaderboard"],
    queryFn: fetchLeaderboard,
    staleTime: 1000 * 60 * 5,
  })

  return { leaderboard, isLoading }
}
