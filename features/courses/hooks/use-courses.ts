"use client";

import { useQuery } from "@tanstack/react-query";
import type { Course } from "@/features/courses/types";
import { MOCK_COURSES, MOCK_LEARNING_PATHS } from "@/features/courses/data/mock-courses";

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
    if (!res.ok) return MOCK_COURSES;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return MOCK_COURSES;
    return data as Course[];
  } catch {
    return MOCK_COURSES;
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
 * Returns the mock learning paths mapped to a shape compatible with
 * MOCK_LEARNING_PATHS, merged with real DB paths if available.
 */
export function useMergedLearningPaths(courses: Course[]) {
  const { data: dbPaths = [] } = useLearningPaths();

  if (dbPaths.length === 0) {
    // Fall back to mocks
    return MOCK_LEARNING_PATHS.map((p) => ({
      ...p,
      completedCourses: p.completedCourses,
      progress: p.progress,
    }));
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
