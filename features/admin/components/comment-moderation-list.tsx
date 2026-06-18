"use client";

import { useState } from "react";
import { toast } from "sonner";
import { IconCheck, IconLoader2, IconX } from "@tabler/icons-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentCard } from "@/features/admin/components/comment-card";
import {
  useAdminComments,
  useBatchModerateComments,
  type CommentStatus,
} from "@/features/admin/hooks/use-admin-comments";

const TABS: { value: CommentStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendentes" },
  { value: "approved", label: "Aprovados" },
  { value: "rejected", label: "Rejeitados" },
  { value: "flagged", label: "Sinalizados" },
];

function CommentList({ status }: { status?: CommentStatus }) {
  const { data: comments, isLoading } = useAdminComments(status);
  const batchModerate = useBatchModerateComments();
  const [selected, setSelected] = useState<string[]>([]);

  function toggleSelect(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function handleBatchApprove() {
    if (selected.length === 0) return;
    toast.promise(
      batchModerate.mutateAsync({ ids: selected, status: "approved" }).then(() => setSelected([])),
      {
        loading: `Aprovando ${selected.length} comentário(s)...`,
        success: "Comentários aprovados!",
        error: (err) => err.message,
      },
    );
  }

  function handleBatchReject() {
    if (selected.length === 0) return;
    toast.promise(
      batchModerate.mutateAsync({ ids: selected, status: "rejected" }).then(() => setSelected([])),
      {
        loading: `Rejeitando ${selected.length} comentário(s)...`,
        success: "Comentários rejeitados!",
        error: (err) => err.message,
      },
    );
  }

  if (isLoading) {
    return (
      <div className="mt-4 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="mt-8 py-16 text-center text-sm text-[var(--tbo-gray-500)]">Nenhum comentário encontrado.</div>
    );
  }

  const allSelected = selected.length === comments.length && comments.length > 0;

  return (
    <div className="mt-4 space-y-3">
      {/* Bulk actions bar */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--tbo-gray-500)] select-none">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={() => setSelected(allSelected ? [] : comments.map((c) => c.id))}
            className="accent-volt size-4 rounded"
          />
          {selected.length > 0 ? `${selected.length} selecionado(s)` : "Selecionar todos"}
        </label>

        {selected.length > 0 && (
          <>
            <Button
              size="sm"
              className="bg-forest-900 hover:bg-ink h-7 gap-1 rounded-full text-xs text-white"
              onClick={handleBatchApprove}
              disabled={batchModerate.isPending}
            >
              {batchModerate.isPending ? (
                <IconLoader2 className="size-3 animate-spin" />
              ) : (
                <IconCheck className="size-3" />
              )}
              Aprovar selecionados
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive border-destructive/20 hover:bg-destructive/5 h-7 gap-1 rounded-full text-xs"
              onClick={handleBatchReject}
              disabled={batchModerate.isPending}
            >
              {batchModerate.isPending ? <IconLoader2 className="size-3 animate-spin" /> : <IconX className="size-3" />}
              Rejeitar selecionados
            </Button>
          </>
        )}
      </div>

      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          selected={selected.includes(comment.id)}
          onSelect={toggleSelect}
        />
      ))}
    </div>
  );
}

export function CommentModerationList() {
  const [activeTab, setActiveTab] = useState<string>("pending");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="h-auto flex-wrap gap-1">
        {TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {TABS.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <CommentList status={tab.value === "all" ? undefined : tab.value} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
