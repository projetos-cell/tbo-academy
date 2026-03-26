"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/features/admin/lib/admin-api";
import type { AdminLesson } from "@/features/admin/types";

const COURSES_KEY = ["admin", "courses"] as const;

function courseKey(courseId: string) {
  return [...COURSES_KEY, courseId] as const;
}

export function useCreateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      module_id: string;
      courseId: string;
      title: string;
      description?: unknown;
      video_url?: string | null;
      video_duration_sec?: number | null;
      is_free?: boolean;
    }) => {
      const { courseId: _courseId, ...payload } = data;
      return adminFetch<AdminLesson>("/api/admin/lessons", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (_lesson, vars) => {
      qc.invalidateQueries({ queryKey: courseKey(vars.courseId) });
    },
  });
}

export function useUpdateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, courseId, ...data }: Partial<AdminLesson> & { id: string; courseId: string }) =>
      adminFetch<AdminLesson>(`/api/admin/lessons/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (_lesson, vars) => {
      qc.invalidateQueries({ queryKey: courseKey(vars.courseId) });
    },
  });
}

export function useDeleteLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; courseId: string }) =>
      adminFetch(`/api/admin/lessons/${id}`, { method: "DELETE" }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: courseKey(vars.courseId) });
    },
  });
}
