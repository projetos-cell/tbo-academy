"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/features/admin/lib/admin-api";
import type { AdminModule } from "@/features/admin/types";

const COURSES_KEY = ["admin", "courses"] as const;

function courseKey(courseId: string) {
  return [...COURSES_KEY, courseId] as const;
}

export function useCreateModule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { course_id: string; title: string; description?: unknown }) =>
      adminFetch<AdminModule>("/api/admin/modules", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_module, vars) => {
      qc.invalidateQueries({ queryKey: courseKey(vars.course_id) });
    },
  });
}

export function useUpdateModule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, courseId, ...data }: Partial<AdminModule> & { id: string; courseId: string }) =>
      adminFetch<AdminModule>(`/api/admin/modules/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (_module, vars) => {
      qc.invalidateQueries({ queryKey: courseKey(vars.courseId) });
    },
  });
}

export function useDeleteModule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; courseId: string }) =>
      adminFetch(`/api/admin/modules/${id}`, { method: "DELETE" }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: courseKey(vars.courseId) });
    },
  });
}
