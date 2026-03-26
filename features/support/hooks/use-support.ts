"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { FaqItem, SupportTicket } from "../types";

interface SupportResponse {
  faq: FaqItem[];
  tickets: SupportTicket[];
}

async function fetchSupport(): Promise<SupportResponse> {
  try {
    const res = await fetch("/api/academy/support");
    if (!res.ok) return { faq: [], tickets: [] };
    return await res.json();
  } catch {
    return { faq: [], tickets: [] };
  }
}

export function useSupport() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<SupportResponse>({
    queryKey: ["academy", "support"],
    queryFn: fetchSupport,
    staleTime: 1000 * 60 * 5,
  });

  const { mutate: createTicket } = useMutation({
    mutationFn: async (input: { subject: string; body: string; category?: string }) => {
      const res = await fetch("/api/academy/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Erro ao abrir chamado");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academy", "support"] });
    },
  });

  return {
    faq: data?.faq ?? [],
    tickets: data?.tickets ?? [],
    isLoading,
    createTicket,
  };
}
