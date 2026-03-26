"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/features/admin/lib/admin-api";
import type { AdminComment } from "@/features/admin/types";

const COMMENTS_KEY = ["admin", "comments"] as const;

export type CommentStatus = "pending" | "approved" | "rejected" | "flagged";

export function useAdminComments(status?: CommentStatus) {
  return useQuery({
    queryKey: [...COMMENTS_KEY, status ?? "all"],
    queryFn: () => {
      const url = status ? `/api/admin/comments?status=${status}` : "/api/admin/comments";
      return adminFetch<AdminComment[]>(url);
    },
  });
}

export function useModerateComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: CommentStatus }) =>
      adminFetch<AdminComment>(`/api/admin/comments?id=${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: COMMENTS_KEY });
    },
  });
}

export function useBatchModerateComments() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: CommentStatus }) =>
      adminFetch("/api/admin/comments", {
        method: "PATCH",
        body: JSON.stringify({ ids, status }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: COMMENTS_KEY });
    },
  });
}
