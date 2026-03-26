"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const CATEGORY_COLORS: Record<string, string> = {
  Branding: "bg-purple-500/10 text-purple-500",
  Archviz: "bg-cyan-500/10 text-cyan-500",
  Tech: "bg-blue-500/10 text-blue-500",
  Fotografia: "bg-amber-500/10 text-amber-500",
  Audiovisual: "bg-pink-500/10 text-pink-500",
  Estratégia: "bg-emerald-500/10 text-emerald-500",
};

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
        title="Comunidade"
        description="Troque ideias, tire dúvidas e conecte-se com outros profissionais"
        actions={
          <Button size="sm" className="gap-1.5 bg-[#BAF241] text-black hover:bg-[#BAF241]/90">
            <IconPlus className="size-4" />
            Novo Tópico
          </Button>
        }
      />

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Membros", value: String(stats.totalMembers), icon: IconUsers, variant: "lime" as const },
          { label: "Tópicos", value: String(stats.totalTopics), icon: IconMessageCircle, variant: "black" as const },
          { label: "Respostas hoje", value: String(stats.repliesToday), icon: IconThumbUp, variant: "lime" as const },
          { label: "Online agora", value: String(stats.onlineNow), icon: IconFlame, variant: "black" as const },
        ].map((stat) => {
          const Icon = stat.icon;
          const isBlack = stat.variant === "black";
          return (
            <div
              key={stat.label}
              className={cn(
                "group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
                isBlack ? "bg-black text-white" : "bg-[#BAF241] text-black",
              )}
            >
              <div
                className={cn(
                  "absolute -top-3 -right-3 size-16 rounded-full opacity-[0.07] transition-transform duration-500 group-hover:scale-125",
                  isBlack ? "bg-[#BAF241]" : "bg-black",
                )}
              />
              <div
                className={cn(
                  "mb-2 inline-flex items-center justify-center rounded-xl p-2",
                  isBlack ? "bg-[#BAF241] text-black" : "bg-black text-[#BAF241]",
                )}
              >
                <Icon className="size-4" strokeWidth={2.2} />
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className={cn("text-xs", isBlack ? "text-white/60" : "text-black/50")}>{stat.label}</p>
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
                  <Skeleton key={i} className="h-20 rounded-xl" />
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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Categorias</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                <Badge key={cat} variant="secondary" className={cn("cursor-pointer", color)}>
                  {cat}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TopicCard({ topic }: { topic: ForumTopic }) {
  const catColor = CATEGORY_COLORS[topic.category] ?? "bg-gray-500/10 text-gray-500";

  return (
    <Card className="cursor-pointer transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="size-9 shrink-0">
            <AvatarFallback className="bg-black text-xs font-bold text-[#BAF241]">
              {topic.authorInitials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <h3 className="flex-1 text-sm leading-snug font-medium">
                {topic.isPinned && <IconPin className="mr-1 inline size-3 text-[#BAF241]" />}
                {topic.title}
              </h3>
              {topic.isHot && (
                <Badge variant="secondary" className="shrink-0 bg-orange-500/10 text-[10px] text-orange-500">
                  <IconFlame className="mr-0.5 size-3" />
                  Hot
                </Badge>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className={cn("text-[10px]", catColor)}>
                {topic.category}
              </Badge>
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <IconMessageCircle className="size-3" />
                {topic.repliesCount}
              </span>
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <IconEye className="size-3" />
                {topic.viewsCount}
              </span>
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <IconThumbUp className="size-3" />
                {topic.likesCount}
              </span>
              <span className="text-muted-foreground ml-auto text-xs">{formatTimeAgo(topic.lastActivityAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
