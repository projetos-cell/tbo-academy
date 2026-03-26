"use client";

import { IconCheck, IconFlag, IconX, IconUser } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useModerateComment, type CommentStatus } from "@/features/admin/hooks/use-admin-comments";
import { toast } from "sonner";
import type { AdminComment } from "@/features/admin/types";

const STATUS_LABELS: Record<CommentStatus, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
  flagged: "Sinalizado",
};

const STATUS_VARIANTS: Record<CommentStatus, "secondary" | "default" | "destructive" | "outline"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
  flagged: "outline",
};

interface CommentCardProps {
  comment: AdminComment;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export function CommentCard({ comment, selected, onSelect }: CommentCardProps) {
  const moderate = useModerateComment();

  function handleModerate(status: CommentStatus) {
    toast.promise(moderate.mutateAsync({ id: comment.id, status }), {
      loading: "Atualizando...",
      success: `Comentário ${STATUS_LABELS[status].toLowerCase()}`,
      error: (err) => err.message,
    });
  }

  const authorName = comment.user?.full_name ?? "Usuário desconhecido";
  const initials = authorName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase();

  const location = [comment.lesson?.module?.course?.title, comment.lesson?.module?.title, comment.lesson?.title]
    .filter(Boolean)
    .join(" › ");

  return (
    <div
      className={cn(
        "bg-card space-y-3 rounded-lg border p-4 transition-colors",
        selected && "border-primary bg-primary/5",
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {onSelect && (
          <input type="checkbox" checked={selected} onChange={() => onSelect(comment.id)} className="mt-1 rounded" />
        )}

        {/* Avatar */}
        <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium">
          {comment.user?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={comment.user.avatar_url} alt={authorName} className="size-8 rounded-full object-cover" />
          ) : initials ? (
            initials
          ) : (
            <IconUser className="text-muted-foreground size-4" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{authorName}</span>
            <Badge variant={STATUS_VARIANTS[comment.status]} className="px-1.5 py-0 text-[10px]">
              {STATUS_LABELS[comment.status]}
            </Badge>
          </div>
          {location && <p className="text-muted-foreground mt-0.5 truncate text-xs">{location}</p>}
          <p className="text-muted-foreground text-xs">{new Date(comment.created_at).toLocaleString("pt-BR")}</p>
        </div>
      </div>

      {/* Body */}
      <p className="pl-11 text-sm leading-relaxed">{comment.body}</p>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-1.5 pl-11">
        {comment.status !== "approved" && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 border-green-200 text-xs text-green-600 hover:bg-green-50"
            onClick={() => handleModerate("approved")}
            disabled={moderate.isPending}
          >
            <IconCheck className="size-3" />
            Aprovar
          </Button>
        )}
        {comment.status !== "rejected" && (
          <Button
            size="sm"
            variant="outline"
            className="text-destructive border-destructive/20 hover:bg-destructive/5 h-7 gap-1 text-xs"
            onClick={() => handleModerate("rejected")}
            disabled={moderate.isPending}
          >
            <IconX className="size-3" />
            Rejeitar
          </Button>
        )}
        {comment.status !== "flagged" && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1 border-amber-200 text-xs text-amber-600 hover:bg-amber-50"
            onClick={() => handleModerate("flagged")}
            disabled={moderate.isPending}
          >
            <IconFlag className="size-3" />
            Sinalizar
          </Button>
        )}
        {comment.status !== "pending" && (
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground h-7 text-xs"
            onClick={() => handleModerate("pending")}
            disabled={moderate.isPending}
          >
            Marcar como pendente
          </Button>
        )}
      </div>
    </div>
  );
}
