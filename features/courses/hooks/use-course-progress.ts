"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface ProgressRecord {
  module_id: string
  status: "completed" | "in_progress" | "not_started"
  completed_at: string | null
  updated_at: string
}

async function fetchProgress(): Promise<ProgressRecord[]> {
  const res = await fetch("/api/academy/progress")
  if (!res.ok) return []
  const json = await res.json()
  return json.progress ?? []
}

async function upsertProgress(moduleId: string, status: string): Promise<void> {
  const res = await fetch("/api/academy/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ moduleId, status }),
  })
  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    throw new Error(json.error ?? "Erro ao salvar progresso")
  }
}

export function useCourseProgress() {
  const queryClient = useQueryClient()

  const { data: progressRecords = [] } = useQuery<ProgressRecord[]>({
    queryKey: ["academy", "progress"],
    queryFn: fetchProgress,
    staleTime: 1000 * 60 * 5,
  })

  const { mutate: markModuleComplete } = useMutation({
    mutationFn: (moduleId: string) => upsertProgress(moduleId, "completed"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academy", "progress"] })
    },
  })

  const { mutate: markModuleInProgress } = useMutation({
    mutationFn: (moduleId: string) => upsertProgress(moduleId, "in_progress"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academy", "progress"] })
    },
  })

  const getModuleStatus = (moduleId: string) => {
    return progressRecords.find((r) => r.module_id === moduleId)?.status ?? null
  }

  const isModuleCompleted = (moduleId: string) => {
    return getModuleStatus(moduleId) === "completed"
  }

  return {
    progressRecords,
    markModuleComplete,
    markModuleInProgress,
    getModuleStatus,
    isModuleCompleted,
  }
}
