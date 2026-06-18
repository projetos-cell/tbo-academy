"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
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

const TYPE_CONFIG: Record<ResourceType, { icon: React.ElementType }> = {
  template: { icon: IconTemplate },
  guia: { icon: IconFileText },
  video: { icon: IconVideo },
  checklist: { icon: IconFile },
  apresentacao: { icon: IconPresentation },
  imagem: { icon: IconPhoto },
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
  const { resources, featured: featuredItems, isLoading } = useLibrary();

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
      <PageHeader
        eyebrow="Recursos"
        title="Biblioteca"
        description="Templates, guias, checklists e recursos para o seu dia a dia"
      />

      {/* Featured */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
        </div>
      ) : featuredItems.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredItems.map((resource) => {
            const config = TYPE_CONFIG[resource.type];
            const Icon = config.icon;
            return (
              <div
                key={resource.id}
                className="from-forest-800 to-forest-950 group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,11,11,0.18)]"
              >
                <div
                  className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full blur-2xl"
                  style={{ background: "radial-gradient(circle, rgba(186,242,65,.16), transparent 62%)" }}
                />
                <div className="relative z-10">
                  <div className="bg-volt text-ink mb-3 inline-flex items-center justify-center rounded-xl p-2.5">
                    <Icon className="size-5" strokeWidth={2.2} />
                  </div>
                  <span className="text-volt block text-xs font-bold tracking-[0.14em] uppercase">
                    {resource.category}
                  </span>
                  <h3 className="font-display mt-2 text-lg leading-tight font-bold tracking-tight text-white">
                    {resource.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/65">{resource.description}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-white/50">
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
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Search */}
      <div className="relative">
        <IconSearch className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--tbo-gray-500)]" />
        <Input
          placeholder="Buscar recursos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="focus-visible:ring-volt rounded-full border-black/[0.08] pl-10"
        />
      </div>

      {/* Tabs + list */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="rounded-full">
          <TabsTrigger
            value="todos"
            className="data-[state=active]:bg-forest-900 rounded-full data-[state=active]:text-white"
          >
            Todos
          </TabsTrigger>
          <TabsTrigger
            value="template"
            className="data-[state=active]:bg-forest-900 rounded-full data-[state=active]:text-white"
          >
            Templates
          </TabsTrigger>
          <TabsTrigger
            value="guia"
            className="data-[state=active]:bg-forest-900 rounded-full data-[state=active]:text-white"
          >
            Guias
          </TabsTrigger>
          <TabsTrigger
            value="video"
            className="data-[state=active]:bg-forest-900 rounded-full data-[state=active]:text-white"
          >
            Vídeos
          </TabsTrigger>
          <TabsTrigger
            value="checklist"
            className="data-[state=active]:bg-forest-900 rounded-full data-[state=active]:text-white"
          >
            Checklists
          </TabsTrigger>
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
          ) : search || activeTab !== "todos" ? (
            <EmptyState
              icon={IconLibrary}
              title="Nenhum recurso encontrado"
              description="Tente ajustar sua busca ou filtro."
            />
          ) : (
            <EmptyState
              icon={IconLibrary}
              title="Nenhum material disponível ainda"
              description="Os templates, guias e recursos da TBO aparecerão aqui assim que forem publicados."
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
    <Card className="group cursor-pointer overflow-hidden rounded-2xl border-black/[0.06] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,11,11,0.10)]">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-forest-900 text-volt shrink-0 rounded-xl p-2.5">
            <Icon className="size-5" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="bg-volt text-ink rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase">
                {TYPE_LABELS[resource.type]}
              </span>
              <span className="text-forest-700 bg-paper-off rounded-full border border-black/[0.06] px-2.5 py-0.5 text-[10px] font-semibold">
                {resource.category}
              </span>
            </div>
            <h3 className="font-display text-[15px] leading-snug font-bold tracking-tight">{resource.title}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-[var(--tbo-gray-500)]">{resource.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs text-[var(--tbo-gray-500)]">
                <IconDownload className="size-3" />
                {resource.downloadsCount} downloads
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-paper-off hover:text-forest-700 size-7 rounded-full"
                >
                  <IconBookmark className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-paper-off hover:text-forest-700 size-7 rounded-full"
                >
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
