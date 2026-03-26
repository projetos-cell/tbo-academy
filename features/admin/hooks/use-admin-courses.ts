"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/features/admin/lib/admin-api";
import type { AdminCourse } from "@/features/admin/types";

const COURSES_KEY = ["admin", "courses"] as const;

export function useAdminCourses() {
  return useQuery({
    queryKey: COURSES_KEY,
    queryFn: () => adminFetch<AdminCourse[]>("/api/admin/courses"),
  });
}

export function useAdminCourse(id: string) {
  return useQuery({
    queryKey: [...COURSES_KEY, id],
    queryFn: () => adminFetch<AdminCourse>(`/api/admin/courses/${id}`),
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AdminCourse>) =>
      adminFetch<AdminCourse>("/api/admin/courses", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: COURSES_KEY });
    },
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<AdminCourse> & { id: string }) =>
      adminFetch<AdminCourse>(`/api/admin/courses/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onMutate: async ({ id, ...data }) => {
      await qc.cancelQueries({ queryKey: COURSES_KEY });
      const previous = qc.getQueryData<AdminCourse[]>(COURSES_KEY);
      qc.setQueryData<AdminCourse[]>(
        COURSES_KEY,
        (old) => old?.map((c) => (c.id === id ? { ...c, ...data } : c)) ?? [],
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(COURSES_KEY, ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: COURSES_KEY });
    },
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminFetch(`/api/admin/courses/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: COURSES_KEY });
    },
  });
}
