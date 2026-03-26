"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminFetch } from "@/features/admin/lib/admin-api";
import type { AdminLearningPath, AdminCourse } from "@/features/admin/types";

const KEY = ["admin", "learning-paths"] as const;

export function useAdminLearningPaths() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => adminFetch<AdminLearningPath[]>("/api/admin/learning-paths"),
    staleTime: 30_000,
  });
}

export function useCreateLearningPath() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      slug: string;
      description?: string;
      thumbnail_url?: string;
      status?: string;
      course_ids?: string[];
    }) =>
      adminFetch<AdminLearningPath>("/api/admin/learning-paths", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (path) => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success(`Trilha "${path.title}" criada com sucesso!`);
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateLearningPath() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ pathId, ...data }: Partial<AdminLearningPath> & { pathId: string; course_ids?: string[] }) =>
      adminFetch<AdminLearningPath>(`/api/admin/learning-paths/${pathId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Trilha atualizada!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteLearningPath() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pathId: string) => adminFetch(`/api/admin/learning-paths/${pathId}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Trilha excluída.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// Re-export AdminCourse type for use in learning path editor
export type { AdminCourse };
