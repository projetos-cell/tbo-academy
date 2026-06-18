"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared";
import { useLiveClasses } from "@/features/live-classes/hooks/use-live-classes";
import type { LiveClass } from "@/features/live-classes/types";
import {
  IconVideo,
  IconCalendar,
  IconClock,
  IconUsers,
  IconBell,
  IconPlayerPlay,
  IconCalendarEvent,
  IconBulb,
  IconCube,
  IconMovie,
  IconPalette,
  IconSparkles,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Direção Criativa": IconSparkles,
  Archviz: IconCube,
  Branding: IconBulb,
  "Direção de Arte": IconPalette,
  Audiovisual: IconMovie,
};

const MOCK_CLASSES: LiveClass[] = [
  {
    id: "1",
    title: "Direção Criativa para Lançamentos AAA",
    description: "Como construir uma narrativa visual que posiciona o empreendimento no topo do mercado",
    instructorName: "Marco Andolfato",
    instructorInitials: "MA",
    instructorRole: "Diretor Criativo",
    category: "Direção Criativa",
    scheduledAt: "2026-03-28T14:00:00Z",
    durationMinutes: 90,
    maxAttendees: 60,
    attendeesCount: 42,
    status: "upcoming",
    isRegistered: false,
  },
  {
    id: "2",
    title: "Archviz: Do Briefing ao Render Final",
    description: "Workshop prático cobrindo todo o pipeline de produção de imagens 3D para incorporadoras",
    instructorName: "Rafael Oliveira",
    instructorInitials: "RO",
    instructorRole: "Lead 3D Artist",
    category: "Archviz",
    scheduledAt: "2026-03-31T10:00:00Z",
    durationMinutes: 120,
    maxAttendees: 50,
    attendeesCount: 38,
    status: "upcoming",
    isRegistered: false,
  },
  {
    id: "3",
    title: "Branding Imobiliário: Tendências 2026",
    description: "Análise das principais tendências de branding no mercado imobiliário brasileiro",
    instructorName: "Ruy Lima",
    instructorInitials: "RL",
    instructorRole: "Diretor de Estratégia",
    category: "Branding",
    scheduledAt: "2026-04-02T15:00:00Z",
    durationMinutes: 60,
    maxAttendees: 80,
    attendeesCount: 28,
    status: "upcoming",
    isRegistered: false,
  },
  {
    id: "4",
    title: "Masterclass: Paleta Cromática em Empreendimentos Premium",
    description: "Como definir e aplicar paletas de cores que transmitem sofisticação e exclusividade",
    instructorName: "Ana Silva",
    instructorInitials: "AS",
    instructorRole: "Diretora de Arte",
    category: "Direção de Arte",
    scheduledAt: "2026-03-15T14:00:00Z",
    durationMinutes: 90,
    maxAttendees: 60,
    attendeesCount: 55,
    status: "recorded",
    isRegistered: false,
  },
  {
    id: "5",
    title: "Storytelling em Vídeos de Lançamento",
    description: "Técnicas narrativas para criar filmes de lançamento que geram conexão emocional",
    instructorName: "Carlos Mendes",
    instructorInitials: "CM",
    instructorRole: "Diretor de Audiovisual",
    category: "Audiovisual",
    scheduledAt: "2026-03-10T10:00:00Z",
    durationMinutes: 120,
    maxAttendees: 50,
    attendeesCount: 47,
    status: "recorded",
    isRegistered: false,
  },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatDuration(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h${m}` : `${h}h`;
  }
  return `${minutes}min`;
}

export default function AulasAoVivoPage() {
  const { upcoming: dbUpcoming, recorded: dbRecorded, isLoading, toggleRegistration } = useLiveClasses();

  const upcoming = dbUpcoming.length > 0 ? dbUpcoming : MOCK_CLASSES.filter((c) => c.status === "upcoming");
  const recorded = dbRecorded.length > 0 ? dbRecorded : MOCK_CLASSES.filter((c) => c.status === "recorded");
  const nextClass = upcoming[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Aulas ao vivo"
        title="Aulas ao Vivo"
        description="Participe de aulas em tempo real com especialistas do mercado"
      />

      {/* Hero — forest treatment do DS com glow volt */}
      {isLoading ? (
        <Skeleton className="h-60 rounded-2xl" />
      ) : (
        nextClass && (
          <div className="from-forest-800 to-forest-950 relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white sm:p-8">
            <div
              className="pointer-events-none absolute -top-16 -right-16 size-72 rounded-full blur-2xl"
              style={{ background: "radial-gradient(circle, rgba(186,242,65,.16), transparent 62%)" }}
            />
            <div className="relative z-10">
              <span className="text-volt text-xs font-bold tracking-[0.14em] uppercase">Próxima Aula</span>
              <h2 className="font-display mt-3 mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
                {nextClass.title}
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-white/70">{nextClass.description}</p>
              <div className="mt-4 flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-volt text-ink text-xs font-bold">
                    {nextClass.instructorInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{nextClass.instructorName}</p>
                  <p className="text-xs text-white/50">{nextClass.instructorRole}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2.5 text-[13px] text-white/90">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-sm">
                  <IconCalendar className="size-3.5" />
                  {formatDate(nextClass.scheduledAt)}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-sm">
                  <IconClock className="size-3.5" />
                  {formatTime(nextClass.scheduledAt)} · {formatDuration(nextClass.durationMinutes)}
                </span>
                <span className="border-volt/40 text-volt inline-flex items-center gap-1.5 rounded-full border bg-white/5 px-3 py-1 backdrop-blur-sm">
                  <IconUsers className="size-3.5" />
                  {nextClass.attendeesCount}/{nextClass.maxAttendees} inscritos
                </span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  className="bg-volt text-ink inline-flex items-center gap-2 rounded-full py-2.5 pr-2.5 pl-5 text-sm font-bold transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(186,242,65,0.35)]"
                  onClick={() => toggleRegistration({ classId: nextClass.id, isRegistered: nextClass.isRegistered })}
                >
                  {nextClass.isRegistered ? "Inscrito" : "Inscrever-se"}
                  <span className="bg-ink text-volt grid size-7 place-items-center rounded-full">
                    <IconCalendarEvent className="size-4" />
                  </span>
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-px hover:bg-white/10">
                  <IconBell className="size-4" />
                  Lembrete
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {/* Tabs */}
      <Tabs defaultValue="proximas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="proximas">Próximas ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="gravadas">Gravações ({recorded.length})</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="proximas">
              {upcoming.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {upcoming.map((cls) => (
                    <ClassCard
                      key={cls.id}
                      cls={cls}
                      onToggle={() => toggleRegistration({ classId: cls.id, isRegistered: cls.isRegistered })}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={IconVideo}
                  title="Nenhuma aula agendada"
                  description="Novas aulas ao vivo serão anunciadas em breve."
                />
              )}
            </TabsContent>
            <TabsContent value="gravadas">
              {recorded.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {recorded.map((cls) => (
                    <ClassCard key={cls.id} cls={cls} onToggle={() => {}} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={IconVideo}
                  title="Nenhuma gravação disponível"
                  description="As gravações ficarão disponíveis após as aulas ao vivo."
                />
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}

function ClassCard({ cls, onToggle }: { cls: LiveClass; onToggle: () => void }) {
  const isRecorded = cls.status === "recorded";
  const isLive = cls.status === "live";
  const Icon = CATEGORY_ICONS[cls.category] ?? IconVideo;

  const occupancy = cls.maxAttendees > 0 ? Math.min(100, Math.round((cls.attendeesCount / cls.maxAttendees) * 100)) : 0;

  return (
    <div className="group bg-card flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,11,11,0.10)]">
      {/* Thumbnail — forest treatment do DS */}
      <div className="img-dark relative flex aspect-[16/10] items-center justify-center">
        <Icon className="text-volt/90 size-12" strokeWidth={1.5} />
        <span
          className={cn(
            "absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm",
            isLive
              ? "animate-pulse bg-red-500 text-white"
              : isRecorded
                ? "bg-volt text-ink"
                : "border border-white/25 bg-black/40 text-white",
          )}
        >
          {isLive && <span className="size-1.5 rounded-full bg-white" />}
          {isLive ? "Ao Vivo" : isRecorded ? "Gravação" : cls.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display line-clamp-2 text-[17px] leading-tight font-bold tracking-tight">{cls.title}</h3>

        <div className="mt-2 flex items-center gap-2 text-[var(--tbo-gray-500)]">
          <Avatar className="size-6">
            <AvatarFallback className="bg-forest-900 text-volt text-[9px] font-bold">
              {cls.instructorInitials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs">{cls.instructorName}</span>
        </div>

        {/* Lotação — barra volt do DS */}
        {!isRecorded && (
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--tbo-gray-500)]">Inscritos</span>
              <span className="font-semibold">
                {cls.attendeesCount}/{cls.maxAttendees}
              </span>
            </div>
            <div className="pbar">
              <span style={{ width: `${occupancy}%` }} />
            </div>
          </div>
        )}

        {/* Meta info */}
        <div className="mt-3 flex items-center gap-3 text-xs text-[var(--tbo-gray-500)]">
          <span className="flex items-center gap-1">
            <IconCalendar className="size-3" />
            {formatDate(cls.scheduledAt)}
          </span>
          <span className="flex items-center gap-1">
            <IconClock className="size-3" />
            {formatTime(cls.scheduledAt)} · {formatDuration(cls.durationMinutes)}
          </span>
        </div>

        {isRecorded && (
          <div className="mt-3 flex items-center gap-1 text-xs text-[var(--tbo-gray-500)]">
            <IconUsers className="size-3" />
            {cls.attendeesCount} participantes
          </div>
        )}

        {/* CTA — pill do DS */}
        <div className="mt-4">
          {isRecorded ? (
            <button
              onClick={onToggle}
              className="text-ink flex w-full items-center justify-center gap-2 rounded-full border border-black/10 py-2.5 text-sm font-bold transition-all hover:-translate-y-px hover:bg-black/[0.04]"
            >
              <IconPlayerPlay className="size-4" />
              Assistir
            </button>
          ) : (
            <button
              onClick={onToggle}
              className="bg-forest-900 hover:bg-ink flex w-full items-center justify-between rounded-full py-2.5 pr-2.5 pl-5 text-sm font-bold text-white transition-all hover:-translate-y-px"
            >
              {cls.isRegistered ? "Inscrito" : "Inscrever-se"}
              <span className="bg-volt text-ink grid size-7 place-items-center rounded-full">
                <IconCalendarEvent className="size-4" />
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
