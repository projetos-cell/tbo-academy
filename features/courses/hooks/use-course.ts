"use client";

import { useQuery } from "@tanstack/react-query";
import type { Course, CourseModule } from "@/features/courses/types";

/**
 * Per-lesson status the page renders. For a guest the API returns the neutral
 * "nao_iniciado" (clean, clickable, non-locked) — completion is layered on
 * client-side via useCourseProgress, and access via ContentGate.
 */
export type CourseModuleView = Omit<CourseModule, "status"> & {
  status: CourseModule["status"] | "nao_iniciado";
};

export interface UseCourseResult {
  course: Course | null;
  modules: CourseModuleView[];
}

interface CourseApiResponse {
  course: Course;
  modules: CourseModuleView[];
}

async function fetchCourse(courseId: string): Promise<UseCourseResult> {
  const res = await fetch(`/api/academy/courses/${courseId}`);
  if (res.status === 404) {
    return { course: null, modules: [] };
  }
  if (!res.ok) {
    throw new Error("Erro ao carregar o curso");
  }
  const data = (await res.json()) as CourseApiResponse;
  return {
    course: data.course ?? null,
    modules: Array.isArray(data.modules) ? data.modules : [],
  };
}

/**
 * Fetches a single published course (anonymous) with its flattened lessons.
 *
 * @returns react-query result whose `data` is { course, modules }:
 *   - course:  Course | null  (null when the course is not found / unpublished)
 *   - modules: CourseModuleView[]  (published lessons, already ordered)
 */
export function useCourse(courseId: string | undefined) {
  return useQuery({
    queryKey: ["academy", "course", courseId],
    queryFn: () => fetchCourse(courseId as string),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
}
