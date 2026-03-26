"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { LiveClass } from "../types";

async function fetchLiveClasses(): Promise<LiveClass[]> {
  try {
    const res = await fetch("/api/academy/live-classes");
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function useLiveClasses() {
  const queryClient = useQueryClient();

  const { data: classes = [], isLoading } = useQuery<LiveClass[]>({
    queryKey: ["academy", "live-classes"],
    queryFn: fetchLiveClasses,
    staleTime: 1000 * 60 * 2,
  });

  const upcoming = classes.filter((c) => c.status === "upcoming" || c.status === "live");
  const recorded = classes.filter((c) => c.status === "recorded");

  const { mutate: toggleRegistration } = useMutation({
    mutationFn: async ({ classId, isRegistered }: { classId: string; isRegistered: boolean }) => {
      const res = await fetch("/api/academy/live-classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: isRegistered ? "unregister" : "register", classId }),
      });
      if (!res.ok) throw new Error("Erro na inscrição");
    },
    onMutate: async ({ classId, isRegistered }) => {
      await queryClient.cancelQueries({ queryKey: ["academy", "live-classes"] });
      const previous = queryClient.getQueryData<LiveClass[]>(["academy", "live-classes"]);

      queryClient.setQueryData<LiveClass[]>(["academy", "live-classes"], (old) =>
        (old ?? []).map((cls) =>
          cls.id === classId
            ? {
                ...cls,
                isRegistered: !isRegistered,
                attendeesCount: cls.attendeesCount + (isRegistered ? -1 : 1),
              }
            : cls,
        ),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["academy", "live-classes"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["academy", "live-classes"] });
    },
  });

  return { classes, upcoming, recorded, isLoading, toggleRegistration };
}
