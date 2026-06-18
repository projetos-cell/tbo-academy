"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared";
import { useFeed } from "@/features/feed/hooks/use-feed";
import type { FeedPost, FeedItemType } from "@/features/feed/types";
import {
  IconNews,
  IconHeart,
  IconMessageCircle,
  IconShare,
  IconBookmark,
  IconTrophy,
  IconCertificate,
  IconFlame,
  IconBook2,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const TYPE_CONFIG: Record<FeedItemType, { icon: React.ElementType; label: string }> = {
  conquista: { icon: IconTrophy, label: "Conquista" },
  conclusao: { icon: IconCertificate, label: "Conclusão" },
  comentario: { icon: IconMessageCircle, label: "Comentário" },
  ranking: { icon: IconFlame, label: "Ranking" },
  novo_curso: { icon: IconBook2, label: "Novo curso" },
};

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "agora";
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  return `${days} dia${days > 1 ? "s" : ""} atrás`;
}

export default function FeedPage() {
  const { posts, isLoading, toggleLike } = useFeed();

  const conquistas = useMemo(() => posts.filter((i) => i.type === "conquista" || i.type === "ranking"), [posts]);
  const novidades = useMemo(() => posts.filter((i) => i.type === "novo_curso" || i.type === "conclusao"), [posts]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Comunidade" title="Feed" description="Acompanhe a atividade da comunidade TBO Academy" />

      <Tabs defaultValue="todos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="conquistas">Conquistas</TabsTrigger>
          <TabsTrigger value="novidades">Novidades</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="todos" className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <FeedCard
                    key={post.id}
                    post={post}
                    onLike={() => toggleLike({ postId: post.id, liked: post.likedByMe })}
                  />
                ))
              ) : (
                <EmptyState
                  icon={IconNews}
                  title="Seu feed está vazio por enquanto"
                  description="Conforme a comunidade avança nos cursos, as conquistas e novidades aparecerão aqui."
                />
              )}
            </TabsContent>

            <TabsContent value="conquistas" className="space-y-4">
              {conquistas.length > 0 ? (
                conquistas.map((post) => (
                  <FeedCard
                    key={post.id}
                    post={post}
                    onLike={() => toggleLike({ postId: post.id, liked: post.likedByMe })}
                  />
                ))
              ) : (
                <EmptyState
                  icon={IconNews}
                  title="Seu feed está vazio por enquanto"
                  description="Ainda não há conquistas para mostrar. Elas aparecerão aqui assim que a comunidade começar a evoluir."
                />
              )}
            </TabsContent>

            <TabsContent value="novidades" className="space-y-4">
              {novidades.length > 0 ? (
                novidades.map((post) => (
                  <FeedCard
                    key={post.id}
                    post={post}
                    onLike={() => toggleLike({ postId: post.id, liked: post.likedByMe })}
                  />
                ))
              ) : (
                <EmptyState
                  icon={IconNews}
                  title="Seu feed está vazio por enquanto"
                  description="Ainda não há novidades para mostrar. Novos cursos e conclusões aparecerão aqui."
                />
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}

function FeedCard({ post, onLike }: { post: FeedPost; onLike: () => void }) {
  const config = TYPE_CONFIG[post.type];
  const Icon = config.icon;

  return (
    <Card className="overflow-hidden rounded-2xl border-black/[0.06] shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,11,11,0.10)]">
      <CardContent className="p-5">
        <div className="flex gap-4">
          <Avatar className="size-10 shrink-0">
            <AvatarFallback className="bg-forest-900 text-volt text-xs font-bold">{post.userInitials}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold">{post.userName}</span>
              <span className="text-xs text-[var(--tbo-gray-500)]">{post.userRole}</span>
              <span className="text-xs text-[var(--tbo-gray-500)]">·</span>
              <span className="text-xs text-[var(--tbo-gray-500)]">{formatTimeAgo(post.createdAt)}</span>
              <span className="bg-paper-off text-forest-700 ml-auto inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] px-2.5 py-0.5 text-[11px] font-semibold">
                <Icon className="text-forest-500 size-3.5" />
                {config.label}
              </span>
            </div>

            <div className="mt-2.5">
              <p className="text-sm leading-snug font-medium">{post.content}</p>
              {post.detail && <p className="mt-1 text-xs text-[var(--tbo-gray-500)]">{post.detail}</p>}
            </div>

            <div className="mt-4 flex items-center gap-5">
              <button
                onClick={onLike}
                aria-label={post.likedByMe ? "Remover curtida" : "Curtir"}
                aria-pressed={post.likedByMe}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-semibold transition-colors",
                  post.likedByMe ? "text-ink" : "hover:text-ink text-[var(--tbo-gray-500)]",
                )}
              >
                <IconHeart className={cn("size-3.5", post.likedByMe && "fill-volt text-ink")} />
                {post.likesCount}
              </button>
              <button
                aria-label="Comentar"
                className="hover:text-ink flex items-center gap-1.5 text-xs font-semibold text-[var(--tbo-gray-500)] transition-colors"
              >
                <IconMessageCircle className="size-3.5" />
                {post.commentsCount}
              </button>
              <button
                aria-label="Compartilhar"
                className="hover:text-ink flex items-center gap-1.5 text-xs font-semibold text-[var(--tbo-gray-500)] transition-colors"
              >
                <IconShare className="size-3.5" />
              </button>
              <button
                aria-label="Salvar"
                className="hover:text-ink ml-auto flex items-center gap-1.5 text-xs font-semibold text-[var(--tbo-gray-500)] transition-colors"
              >
                <IconBookmark className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
