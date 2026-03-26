"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/features/admin/lib/admin-api";

interface ReorderItem {
  id: string;
  sort_order: number;
}

interface ReorderPayload {
  courseId: string;
  type: "modules" | "lessons";
  items: ReorderItem[];
}

export function useReorderItems() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, type, items }: ReorderPayload) =>
      adminFetch(`/api/admin/courses/${courseId}/reorder`, {
        method: "PATCH",
        body: JSON.stringify({ type, items }),
      }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["admin", "courses", vars.courseId] });
    },
  });
}
