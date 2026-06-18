"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared";
import { useCommunity } from "@/features/community/hooks/use-community";
import type { ForumTopic, CommunityStats } from "@/features/community/types";
import { IconUsers, IconMessageCircle, IconPin, IconFlame, IconPlus, IconThumbUp, IconEye } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const MOCK_TOPICS: ForumTopic[] = [
  {
    id: "1",
    authorName: "Marina Costa",
    authorInitials: "MC",
    title: "Como montar um briefing criativo que o cliente realmente aprova?",
    category: "Branding",
    isPinned: true,
    isHot: false,
    repliesCount: 23,
    viewsCount: 156,
    likesCount: 18,
    lastActivityAt: new Date(Date.now() - 30 * 60000).toISOString(),
    createdAt: "",
  },
  {
    id: "2",
    authorName: "Rafael Oliveira",
    authorInitials: "RO",
    title: "Melhores práticas de Archviz para empreendimentos de alto padrão",
    category: "Archviz",
    isPinned: false,
    isHot: true,
    repliesCount: 17,
    viewsCount: 98,
    likesCount: 12,
    lastActivityAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    createdAt: "",
  },
  {
    id: "3",
    authorName: "Carlos Mendes",
    authorInitials: "CM",
    title: "Qual a melhor stack para landing pages de lançamento?",
    category: "Tech",
    isPinned: false,
    isHot: true,
    repliesCount: 31,
    viewsCount: 210,
    likesCount: 25,
    lastActivityAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    createdAt: "",
  },
  {
    id: "4",
    authorName: "Julia Santos",
    authorInitials: "JS",
    title: "Dicas para fotografar maquetes físicas",
    category: "Fotografia",
    isPinned: false,
    isHot: false,
    repliesCount: 8,
    viewsCount: 64,
    likesCount: 9,
    lastActivityAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    createdAt: "",
  },
  {
    id: "5",
    authorName: "Ana Silva",
    authorInitials: "AS",
    title: "Storytelling em vídeos de lançamento — o que funciona em 2026?",
    category: "Audiovisual",
    isPinned: false,
    isHot: false,
    repliesCount: 14,
    viewsCount: 112,
    likesCount: 16,
    lastActivityAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    createdAt: "",
  },
  {
    id: "6",
    authorName: "Pedro Lima",
    authorInitials: "PL",
    title: "Como usar IA generativa sem perder a identidade da marca?",
    category: "Estratégia",
    isPinned: false,
    isHot: false,
    repliesCount: 19,
    viewsCount: 145,
    likesCount: 21,
    lastActivityAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    createdAt: "",
  },
];

const MOCK_STATS: CommunityStats = { totalMembers: 127, totalTopics: 84, repliesToday: 23, onlineNow: 18 };

const CATEGORIES = ["Branding", "Archviz", "Tech", "Fotografia", "Audiovisual", "Estratégia"];

function formatTimeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}min atrás`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h atrás`;
  return `${Math.floor(hours / 24)} dia${Math.floor(hours / 24) > 1 ? "s" : ""} atrás`;
}

export default function ComunidadePage() {
  const [sortTab, setSortTab] = useState("recentes");
  const sort = sortTab === "populares" ? "popular" : "recent";
  const { topics: dbTopics, stats: dbStats, isLoading } = useCommunity(sort);

  const topics = dbTopics.length > 0 ? dbTopics : MOCK_TOPICS;
  const stats = dbStats.totalMembers > 0 ? dbStats : MOCK_STATS;

  const noReplyTopics = topics.filter((t) => t.repliesCount < 10);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Comunidade"
        title="Comunidade"
        description="Troque ideias, tire dúvidas e conecte-se com outros profissionais"
        actions={
          <button className="bg-forest-900 hover:bg-ink flex items-center gap-2 rounded-full py-2 pr-2 pl-4 text-sm font-bold text-white transition-all hover:-translate-y-px">
            Novo Tópico
            <span className="bg-volt text-ink grid size-6 place-items-center rounded-full">
              <IconPlus className="size-4" />
            </span>
          </button>
        }
      />

      {/* Stats cards — tratamento forest/volt do DS */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Membros", value: String(stats.totalMembers), icon: IconUsers, variant: "volt" as const },
          { label: "Tópicos", value: String(stats.totalTopics), icon: IconMessageCircle, variant: "forest" as const },
          { label: "Respostas hoje", value: String(stats.repliesToday), icon: IconThumbUp, variant: "volt" as const },
          { label: "Online agora", value: String(stats.onlineNow), icon: IconFlame, variant: "forest" as const },
        ].map((stat) => {
          const Icon = stat.icon;
          const isForest = stat.variant === "forest";
          return (
            <div
              key={stat.label}
              className={cn(
                "group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,11,11,0.10)]",
                isForest ? "bg-forest-900 text-white" : "bg-volt text-ink",
              )}
            >
              <div
                className={cn(
                  "absolute -top-3 -right-3 size-16 rounded-full opacity-[0.07] transition-transform duration-500 group-hover:scale-125",
                  isForest ? "bg-volt" : "bg-ink",
                )}
              />
              <div
                className={cn(
                  "mb-2 inline-flex items-center justify-center rounded-xl p-2",
                  isForest ? "bg-volt text-ink" : "bg-ink text-volt",
                )}
              >
                <Icon className="size-4" strokeWidth={2.2} />
              </div>
              <p className="font-display text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className={cn("text-xs", isForest ? "text-white/60" : "text-ink/50")}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <Tabs value={sortTab} onValueChange={setSortTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="recentes">Recentes</TabsTrigger>
              <TabsTrigger value="populares">Populares</TabsTrigger>
              <TabsTrigger value="sem-resposta">Sem Resposta</TabsTrigger>
            </TabsList>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-2xl" />
                ))}
              </div>
            ) : (
              <>
                <TabsContent value="recentes" className="space-y-3">
                  {topics.length > 0 ? (
                    topics.map((t) => <TopicCard key={t.id} topic={t} />)
                  ) : (
                    <EmptyState
                      icon={IconMessageCircle}
                      title="Nenhum tópico"
                      description="Seja o primeiro a criar um tópico."
                    />
                  )}
                </TabsContent>
                <TabsContent value="populares" className="space-y-3">
                  {[...topics]
                    .sort((a, b) => b.likesCount - a.likesCount)
                    .map((t) => (
                      <TopicCard key={t.id} topic={t} />
                    ))}
                </TabsContent>
                <TabsContent value="sem-resposta" className="space-y-3">
                  {noReplyTopics.length > 0 ? (
                    noReplyTopics.map((t) => <TopicCard key={t.id} topic={t} />)
                  ) : (
                    <EmptyState
                      icon={IconMessageCircle}
                      title="Todos respondidos!"
                      description="Não há tópicos sem resposta."
                    />
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-2xl border border-black/[0.06] p-5 shadow-sm">
            <span className="text-forest-500 text-xs font-bold tracking-[0.14em] uppercase">Categorias</span>
            <div className="mt-4 flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat} className="tagpill">
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopicCard({ topic }: { topic: ForumTopic }) {
  return (
    <div className="group bg-card cursor-pointer rounded-2xl border border-black/[0.06] p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,11,11,0.10)]">
      <div className="flex gap-3">
        <Avatar className="size-9 shrink-0">
          <AvatarFallback className="bg-forest-900 text-volt text-xs font-bold">{topic.authorInitials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h3 className="font-display flex-1 text-[15px] leading-snug font-bold tracking-tight">
              {topic.isPinned && <IconPin className="text-volt-600 mr-1 inline size-3.5" />}
              {topic.title}
            </h3>
            {topic.isHot && (
              <span className="bg-volt text-ink inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold">
                <IconFlame className="size-3" />
                Hot
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="text-forest-700 bg-paper-off rounded-full border border-black/[0.06] px-2.5 py-0.5 text-[11px] font-semibold">
              {topic.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-[var(--tbo-gray-500)]">
              <IconMessageCircle className="size-3" />
              {topic.repliesCount}
            </span>
            <span className="flex items-center gap-1 text-xs text-[var(--tbo-gray-500)]">
              <IconEye className="size-3" />
              {topic.viewsCount}
            </span>
            <span className="flex items-center gap-1 text-xs text-[var(--tbo-gray-500)]">
              <IconThumbUp className="size-3" />
              {topic.likesCount}
            </span>
            <span className="ml-auto text-xs text-[var(--tbo-gray-500)]">{formatTimeAgo(topic.lastActivityAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
