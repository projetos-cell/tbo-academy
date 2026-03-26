"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { FeedPost } from "../types";

async function fetchFeed(): Promise<FeedPost[]> {
  try {
    const res = await fetch("/api/academy/feed");
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function useFeed() {
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery<FeedPost[]>({
    queryKey: ["academy", "feed"],
    queryFn: fetchFeed,
    staleTime: 1000 * 60 * 2,
  });

  const { mutate: toggleLike } = useMutation({
    mutationFn: async ({ postId, liked }: { postId: string; liked: boolean }) => {
      const res = await fetch("/api/academy/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: liked ? "unlike" : "like", postId }),
      });
      if (!res.ok) throw new Error("Erro ao curtir");
    },
    onMutate: async ({ postId, liked }) => {
      await queryClient.cancelQueries({ queryKey: ["academy", "feed"] });
      const previous = queryClient.getQueryData<FeedPost[]>(["academy", "feed"]);

      queryClient.setQueryData<FeedPost[]>(["academy", "feed"], (old) =>
        (old ?? []).map((post) =>
          post.id === postId
            ? {
                ...post,
                likedByMe: !liked,
                likesCount: post.likesCount + (liked ? -1 : 1),
              }
            : post,
        ),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["academy", "feed"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["academy", "feed"] });
    },
  });

  return { posts, isLoading, toggleLike };
}
