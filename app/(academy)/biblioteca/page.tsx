"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared";
import { useLibrary } from "@/features/library/hooks/use-library";
import type { Resource, ResourceType } from "@/features/library/types";
import {
  IconLibrary,
  IconSearch,
  IconDownload,
  IconExternalLink,
  IconFile,
  IconFileText,
  IconVideo,
  IconPhoto,
  IconPresentation,
  IconTemplate,
  IconBookmark,
  IconCalendar,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const MOCK_RESOURCES: Resource[] = [
  {
    id: "1",
    title: "Template de Briefing Criativo",
    description: "Modelo completo de briefing para empreendimentos imobiliários com checklist de entregáveis",
    type: "template",
    category: "Branding",
    downloadsCount: 234,
    isFeatured: true,
    createdAt: "2026-03-15",
  },
  {
    id: "2",
    title: "Guia de Paleta Cromática para Alto Padrão",
    description: "Referência de combinações de cores validadas para empreendimentos premium e AAA",
    type: "guia",
    category: "Direção de Arte",
    downloadsCount: 189,
    isFeatured: true,
    createdAt: "2026-03-10",
  },
  {
    id: "3",
    title: "Checklist de Entrega de Archviz",
    description: "Lista completa de itens para validar antes de entregar renders ao cliente",
    type: "checklist",
    category: "Archviz",
    downloadsCount: 156,
    isFeatured: false,
    createdAt: "2026-02-20",
  },
  {
    id: "4",
    title: "Masterclass: Direção de Câmeras 3D",
    description: "Gravação completa da masterclass sobre composição e enquadramento em renders",
    type: "video",
    category: "Archviz",
    downloadsCount: 312,
    isFeatured: false,
    createdAt: "2026-02-15",
  },
  {
    id: "5",
    title: "Deck de Apresentação — Modelo TBO",
    description: "Template de apresentação para propostas comerciais com guidelines de marca",
    type: "apresentacao",
    category: "Comercial",
    downloadsCount: 98,
    isFeatured: false,
    createdAt: "2026-01-20",
  },
  {
    id: "6",
    title: "Banco de Referências Visuais — Moodboards",
    description: "Coleção curada de referências visuais organizadas por segmento e estilo",
    type: "imagem",
    category: "Direção de Arte",
    downloadsCount: 201,
    isFeatured: false,
    createdAt: "2026-01-10",
  },
  {
    id: "7",
    title: "Guia de Tom de Voz para Incorporadoras",
    description: "Manual prático de escrita para comunicação de empreendimentos por segmento",
    type: "guia",
    category: "Copywriting",
    downloadsCount: 145,
    isFeatured: false,
    createdAt: "2025-12-15",
  },
  {
    id: "8",
    title: "Template de Roteiro — Filme de Lançamento",
    description: "Estrutura padrão de roteiro para vídeos de lançamento imobiliário",
    type: "template",
    category: "Audiovisual",
    downloadsCount: 167,
    isFeatured: false,
    createdAt: "2025-12-10",
  },
];

const TYPE_CONFIG: Record<ResourceType, { icon: React.ElementType; color: string }> = {
  template: { icon: IconTemplate, color: "text-purple-500" },
  guia: { icon: IconFileText, color: "text-blue-500" },
  video: { icon: IconVideo, color: "text-pink-500" },
  checklist: { icon: IconFile, color: "text-emerald-500" },
  apresentacao: { icon: IconPresentation, color: "text-amber-500" },
  imagem: { icon: IconPhoto, color: "text-cyan-500" },
};

const TYPE_LABELS: Record<ResourceType, string> = {
  template: "Template",
  guia: "Guia",
  video: "Vídeo",
  checklist: "Checklist",
  apresentacao: "Apresentação",
  imagem: "Imagens",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}

export default function BibliotecaPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
  const { resources: dbResources, featured: dbFeatured, isLoading } = useLibrary();

  const resources = dbResources.length > 0 ? dbResources : MOCK_RESOURCES;
  const featuredItems = dbFeatured.length > 0 ? dbFeatured : MOCK_RESOURCES.filter((r) => r.isFeatured);

  const filtered = useMemo(() => {
    let items = resources;
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q),
      );
    }
    if (activeTab !== "todos") items = items.filter((r) => r.type === activeTab);
    return items;
  }, [resources, search, activeTab]);

  return (
    <div className="space-y-6">
      <PageHeader title="Biblioteca" description="Templates, guias, checklists e recursos para o seu dia a dia" />

      {/* Featured */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredItems.map((resource, idx) => {
            const config = TYPE_CONFIG[resource.type];
            const Icon = config.icon;
            const isBlack = idx % 2 === 0;
            return (
              <div
                key={resource.id}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
                  isBlack ? "bg-black text-white" : "bg-[#BAF241] text-black",
                )}
              >
                <div
                  className={cn(
                    "absolute -top-4 -right-4 size-24 rounded-full opacity-[0.06] transition-transform duration-500 group-hover:scale-125",
                    isBlack ? "bg-[#BAF241]" : "bg-black",
                  )}
                />
                <div
                  className={cn(
                    "mb-3 inline-flex items-center justify-center rounded-xl p-2.5",
                    isBlack ? "bg-[#BAF241] text-black" : "bg-black text-[#BAF241]",
                  )}
                >
                  <Icon className="size-5" strokeWidth={2.2} />
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    "mb-2 text-[10px]",
                    isBlack ? "bg-white/10 text-white/70" : "bg-black/10 text-black/70",
                  )}
                >
                  {resource.category}
                </Badge>
                <h3 className="text-sm font-semibold">{resource.title}</h3>
                <p className={cn("mt-1 text-xs", isBlack ? "text-white/60" : "text-black/50")}>
                  {resource.description}
                </p>
                <div
                  className={cn("mt-3 flex items-center gap-3 text-xs", isBlack ? "text-white/40" : "text-black/40")}
                >
                  <span className="flex items-center gap-1">
                    <IconDownload className="size-3" />
                    {resource.downloadsCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconCalendar className="size-3" />
                    {formatDate(resource.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <IconSearch className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar recursos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabs + list */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="template">Templates</TabsTrigger>
          <TabsTrigger value="guia">Guias</TabsTrigger>
          <TabsTrigger value="video">Vídeos</TabsTrigger>
          <TabsTrigger value="checklist">Checklists</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={IconLibrary}
              title="Nenhum recurso encontrado"
              description="Tente ajustar sua busca ou filtro."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const config = TYPE_CONFIG[resource.type];
  const Icon = config.icon;

  return (
    <Card className="group cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("bg-muted/60 shrink-0 rounded-xl p-2.5", config.color)}>
            <Icon className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px]">
                {TYPE_LABELS[resource.type]}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {resource.category}
              </Badge>
            </div>
            <h3 className="text-sm leading-snug font-medium">{resource.title}</h3>
            <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{resource.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <IconDownload className="size-3" />
                {resource.downloadsCount} downloads
              </span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="size-7">
                  <IconBookmark className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="size-7">
                  <IconExternalLink className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
