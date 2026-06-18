"use client";

import { useQuery } from "@tanstack/react-query";
import type { Course } from "@/features/courses/types";

export interface DbLearningPath {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string | null;
  sort_order: number;
  status: string;
  courseIds: string[];
  totalCourses: number;
}

async function fetchCourses(): Promise<Course[]> {
  try {
    const res = await fetch("/api/academy/courses");
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data as Course[];
  } catch {
    return [];
  }
}

async function fetchLearningPaths(): Promise<DbLearningPath[]> {
  try {
    const res = await fetch("/api/academy/learning-paths");
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return [];
    return data as DbLearningPath[];
  } catch {
    return [];
  }
}

export function useCourses() {
  return useQuery({
    queryKey: ["academy", "courses"],
    queryFn: fetchCourses,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLearningPaths() {
  return useQuery({
    queryKey: ["academy", "learning-paths"],
    queryFn: fetchLearningPaths,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Mapeia as trilhas reais do Supabase para a shape de LearningPath.
 * Sem trilhas no banco → retorna [] (empty state na UI, sem mock).
 */
export function useMergedLearningPaths(courses: Course[]) {
  const { data: dbPaths = [] } = useLearningPaths();

  if (dbPaths.length === 0) {
    // Sem trilhas reais → vazio (empty state na UI). Nada de mock.
    return [];
  }

  return dbPaths.map((p) => {
    const pathCourses = p.courseIds.map((id) => courses.find((c) => c.id === id)).filter(Boolean) as Course[];

    const completedCourses = pathCourses.filter((c) => c.status === "concluido").length;
    const totalProgress =
      pathCourses.length > 0
        ? Math.round(pathCourses.reduce((acc, c) => acc + (c.progress ?? 0), 0) / pathCourses.length)
        : 0;

    return {
      id: p.id,
      title: p.title,
      description: p.description,
      totalCourses: p.totalCourses,
      completedCourses,
      progress: totalProgress,
    };
  });
}
