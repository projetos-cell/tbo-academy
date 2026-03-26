"use client";

import { useQuery } from "@tanstack/react-query";
import type { Resource } from "../types";

async function fetchResources(): Promise<Resource[]> {
  try {
    const res = await fetch("/api/academy/library");
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function useLibrary() {
  const { data: resources = [], isLoading } = useQuery<Resource[]>({
    queryKey: ["academy", "library"],
    queryFn: fetchResources,
    staleTime: 1000 * 60 * 5,
  });

  const featured = resources.filter((r) => r.isFeatured);

  return { resources, featured, isLoading };
}
