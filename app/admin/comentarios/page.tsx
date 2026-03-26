import { CommentModerationList } from "@/features/admin/components/comment-moderation-list";

export const dynamic = "force-dynamic";

export default function AdminComentariosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Comentários</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Modere comentários das aulas. Aprove, rejeite ou sinalize conteúdo inadequado.
        </p>
      </div>

      <CommentModerationList />
    </div>
  );
}
