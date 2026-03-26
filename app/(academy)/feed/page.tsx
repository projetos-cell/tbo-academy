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

const MOCK_FEED: FeedPost[] = [
  {
    id: "1",
    userId: "u1",
    userName: "Ana Silva",
    userInitials: "AS",
    userRole: "Designer",
    type: "conquista",
    content: 'Conquistou o badge "Mestre em Branding"',
    detail: "Completou 5 cursos da trilha de Branding Imobiliário",
    likesCount: 12,
    commentsCount: 3,
    likedByMe: false,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "2",
    userId: "u2",
    userName: "Carlos Mendes",
    userInitials: "CM",
    userRole: "Gerente de Projetos",
    type: "conclusao",
    content: 'Concluiu o curso "Gestão de Lançamentos Imobiliários"',
    detail: "Nota final: 9.5/10 — Certificado emitido",
    likesCount: 8,
    commentsCount: 1,
    likedByMe: false,
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: "3",
    userId: "u3",
    userName: "Marina Costa",
    userInitials: "MC",
    userRole: "Coordenadora de Marketing",
    type: "ranking",
    content: "Subiu para o Top 3 no ranking geral!",
    detail: "Acumulou 2.450 pontos nesta semana",
    likesCount: 15,
    commentsCount: 5,
    likedByMe: false,
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
  {
    id: "4",
    userId: "u4",
    userName: "TBO Academy",
    userInitials: "TA",
    userRole: "Plataforma",
    type: "novo_curso",
    content: 'Novo curso disponível: "Archviz para Campanhas de Alto Padrão"',
    detail: "12 módulos · 4h de conteúdo · Nível Intermediário",
    likesCount: 22,
    commentsCount: 7,
    likedByMe: false,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "5",
    userId: "u5",
    userName: "Rafael Oliveira",
    userInitials: "RO",
    userRole: "Diretor Criativo",
    type: "comentario",
    content: 'Comentou na aula "Paleta Cromática em Empreendimentos Premium"',
    detail: '"Excelente abordagem sobre a psicologia das cores no segmento AAA..."',
    likesCount: 6,
    commentsCount: 2,
    likedByMe: false,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "6",
    userId: "u6",
    userName: "Julia Santos",
    userInitials: "JS",
    userRole: "Analista de Marketing",
    type: "conquista",
    content: "Sequência de 30 dias de estudo!",
    detail: 'Conquistou o badge "Dedicação Total"',
    likesCount: 19,
    commentsCount: 4,
    likedByMe: false,
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
];

const TYPE_CONFIG: Record<FeedItemType, { icon: React.ElementType; color: string }> = {
  conquista: { icon: IconTrophy, color: "text-amber-500" },
  conclusao: { icon: IconCertificate, color: "text-emerald-500" },
  comentario: { icon: IconMessageCircle, color: "text-blue-500" },
  ranking: { icon: IconFlame, color: "text-orange-500" },
  novo_curso: { icon: IconBook2, color: "text-[#BAF241]" },
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
  const { posts: dbPosts, isLoading, toggleLike } = useFeed();
  const posts = dbPosts.length > 0 ? dbPosts : MOCK_FEED;

  const conquistas = useMemo(() => posts.filter((i) => i.type === "conquista" || i.type === "ranking"), [posts]);
  const novidades = useMemo(() => posts.filter((i) => i.type === "novo_curso" || i.type === "conclusao"), [posts]);

  return (
    <div className="space-y-6">
      <PageHeader title="Feed" description="Acompanhe a atividade da comunidade TBO Academy" />

      <Tabs defaultValue="todos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="conquistas">Conquistas</TabsTrigger>
          <TabsTrigger value="novidades">Novidades</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
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
                  title="Nenhuma atividade"
                  description="O feed estará movimentado em breve."
                />
              )}
            </TabsContent>

            <TabsContent value="conquistas" className="space-y-4">
              {conquistas.map((post) => (
                <FeedCard
                  key={post.id}
                  post={post}
                  onLike={() => toggleLike({ postId: post.id, liked: post.likedByMe })}
                />
              ))}
            </TabsContent>

            <TabsContent value="novidades" className="space-y-4">
              {novidades.map((post) => (
                <FeedCard
                  key={post.id}
                  post={post}
                  onLike={() => toggleLike({ postId: post.id, liked: post.likedByMe })}
                />
              ))}
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
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="size-10 shrink-0">
            <AvatarFallback className="bg-black text-xs font-bold text-[#BAF241]">{post.userInitials}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold">{post.userName}</span>
              <span className="text-muted-foreground text-xs">{post.userRole}</span>
              <span className="text-muted-foreground text-xs">·</span>
              <span className="text-muted-foreground text-xs">{formatTimeAgo(post.createdAt)}</span>
            </div>

            <div className="mt-2 flex items-start gap-2">
              <div className={cn("mt-0.5 shrink-0", config.color)}>
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-sm">{post.content}</p>
                {post.detail && <p className="text-muted-foreground mt-1 text-xs">{post.detail}</p>}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-4">
              <button
                onClick={onLike}
                className={cn(
                  "flex items-center gap-1 text-xs transition-colors",
                  post.likedByMe ? "text-red-500" : "text-muted-foreground hover:text-red-500",
                )}
              >
                <IconHeart className={cn("size-3.5", post.likedByMe && "fill-current")} />
                {post.likesCount}
              </button>
              <button className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors">
                <IconMessageCircle className="size-3.5" />
                {post.commentsCount}
              </button>
              <button className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors">
                <IconShare className="size-3.5" />
              </button>
              <button className="text-muted-foreground hover:text-foreground ml-auto flex items-center gap-1 text-xs transition-colors">
                <IconBookmark className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
