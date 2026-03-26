"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ForumTopic, CommunityStats } from "../types";

interface CommunityResponse {
  topics: ForumTopic[];
  stats: CommunityStats;
}

async function fetchCommunity(sort: string): Promise<CommunityResponse> {
  try {
    const res = await fetch(`/api/academy/community?sort=${sort}`);
    if (!res.ok) return { topics: [], stats: { totalMembers: 0, totalTopics: 0, repliesToday: 0, onlineNow: 0 } };
    return await res.json();
  } catch {
    return { topics: [], stats: { totalMembers: 0, totalTopics: 0, repliesToday: 0, onlineNow: 0 } };
  }
}

export function useCommunity(sort: string = "recent") {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<CommunityResponse>({
    queryKey: ["academy", "community", sort],
    queryFn: () => fetchCommunity(sort),
    staleTime: 1000 * 60 * 2,
  });

  const { mutate: createTopic } = useMutation({
    mutationFn: async (input: { title: string; body?: string; category?: string }) => {
      const res = await fetch("/api/academy/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Erro ao criar tópico");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academy", "community"] });
    },
  });

  return {
    topics: data?.topics ?? [],
    stats: data?.stats ?? { totalMembers: 0, totalTopics: 0, repliesToday: 0, onlineNow: 0 },
    isLoading,
    createTopic,
  };
}
