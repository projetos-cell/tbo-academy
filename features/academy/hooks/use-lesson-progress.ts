"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface LessonProgress {
  lesson_id: string;
  completed: boolean;
  progress_pct: number;
  last_position_sec: number;
}

async function fetchLessonProgress(lessonId?: string): Promise<LessonProgress[]> {
  const url = lessonId ? `/api/academy/lesson-progress?lessonId=${lessonId}` : "/api/academy/lesson-progress";
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();
  return json.progress ?? [];
}

async function saveLessonProgress(data: {
  lessonId: string;
  completed?: boolean;
  progressPct?: number;
  lastPositionSec?: number;
}): Promise<void> {
  const res = await fetch("/api/academy/lesson-progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error ?? "Erro ao salvar progresso");
  }
}

export function useLessonProgress(lessonId?: string) {
  const queryClient = useQueryClient();

  const { data: progressList = [], isLoading } = useQuery({
    queryKey: ["academy", "lesson-progress", lessonId ?? "all"],
    queryFn: () => fetchLessonProgress(lessonId),
    staleTime: 2 * 60 * 1000,
  });

  const { mutate: saveProgress } = useMutation({
    mutationFn: saveLessonProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academy", "lesson-progress"] });
      queryClient.invalidateQueries({ queryKey: ["academy", "courses"] });
    },
  });

  const getProgress = (id: string): LessonProgress | undefined => progressList.find((p) => p.lesson_id === id);

  const isCompleted = (id: string) => progressList.find((p) => p.lesson_id === id)?.completed ?? false;

  const markComplete = (id: string) => saveProgress({ lessonId: id, completed: true, progressPct: 100 });

  const updatePosition = (id: string, positionSec: number, pct: number) =>
    saveProgress({ lessonId: id, lastPositionSec: positionSec, progressPct: pct });

  return {
    progressList,
    isLoading,
    getProgress,
    isCompleted,
    markComplete,
    updatePosition,
    saveProgress,
  };
}
