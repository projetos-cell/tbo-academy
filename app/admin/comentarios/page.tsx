import { PageHeader } from "@/components/shared/page-header";
import { CommentModerationList } from "@/features/admin/components/comment-moderation-list";

export const dynamic = "force-dynamic";

export default function AdminComentariosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Moderação"
        title="Comentários"
        description="Modere comentários das aulas. Aprove, rejeite ou sinalize conteúdo inadequado."
      />

      <CommentModerationList />
    </div>
  );
}
