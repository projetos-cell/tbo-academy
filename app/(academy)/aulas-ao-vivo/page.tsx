"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

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
      <PageHeader title="Aulas ao Vivo" description="Participe de aulas em tempo real com especialistas do mercado" />

      {/* Hero */}
      {isLoading ? (
        <Skeleton className="h-60 rounded-2xl" />
      ) : (
        nextClass && (
          <div className="relative overflow-hidden rounded-2xl bg-black p-6 text-white sm:p-8">
            <div className="absolute -top-8 -right-8 size-40 rounded-full bg-[#BAF241]/10" />
            <div className="absolute -bottom-4 -left-4 size-24 rounded-full bg-[#BAF241]/5" />
            <Badge className="mb-4 border-0 bg-[#BAF241]/10 text-[10px] font-bold tracking-wider text-[#BAF241] uppercase">
              Próxima Aula
            </Badge>
            <h2 className="mb-2 text-xl font-bold sm:text-2xl">{nextClass.title}</h2>
            <p className="max-w-xl text-sm text-white/60">{nextClass.description}</p>
            <div className="mt-4 flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarFallback className="bg-[#BAF241] text-xs font-bold text-black">
                  {nextClass.instructorInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{nextClass.instructorName}</p>
                <p className="text-xs text-white/50">{nextClass.instructorRole}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1.5">
                <IconCalendar className="size-4" />
                {formatDate(nextClass.scheduledAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <IconClock className="size-4" />
                {formatTime(nextClass.scheduledAt)} · {formatDuration(nextClass.durationMinutes)}
              </span>
              <span className="flex items-center gap-1.5">
                <IconUsers className="size-4" />
                {nextClass.attendeesCount}/{nextClass.maxAttendees} inscritos
              </span>
            </div>
            <div className="mt-5 flex gap-3">
              <Button
                className="gap-1.5 bg-[#BAF241] text-black hover:bg-[#BAF241]/90"
                onClick={() => toggleRegistration({ classId: nextClass.id, isRegistered: nextClass.isRegistered })}
              >
                <IconCalendarEvent className="size-4" />
                {nextClass.isRegistered ? "Inscrito" : "Inscrever-se"}
              </Button>
              <Button variant="outline" className="gap-1.5 border-white/20 text-white hover:bg-white/10">
                <IconBell className="size-4" />
                Lembrete
              </Button>
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
              <Skeleton key={i} className="h-52 rounded-xl" />
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

  return (
    <Card className="group gap-0 overflow-hidden py-0 transition-all duration-200 hover:shadow-md">
      <div className={cn("relative overflow-hidden p-5", isRecorded ? "bg-[#BAF241]" : "bg-black")}>
        <div
          className={cn(
            "absolute -top-4 -right-4 size-20 rounded-full opacity-[0.08]",
            isRecorded ? "bg-black" : "bg-[#BAF241]",
          )}
        />
        <div className="mb-3 flex items-center justify-between">
          <Badge
            className={cn(
              "border-0 text-[10px] font-bold tracking-wider uppercase",
              isRecorded
                ? "bg-black/10 text-black/70"
                : isLive
                  ? "animate-pulse bg-red-500 text-white"
                  : "bg-[#BAF241]/10 text-[#BAF241]",
            )}
          >
            {isLive ? "Ao Vivo" : isRecorded ? "Gravação" : cls.category}
          </Badge>
        </div>
        <h3 className={cn("text-sm leading-snug font-semibold", isRecorded ? "text-black" : "text-white")}>
          {cls.title}
        </h3>
        <div className={cn("mt-2 flex items-center gap-2", isRecorded ? "text-black/50" : "text-white/50")}>
          <Avatar className="size-6">
            <AvatarFallback
              className={cn("text-[9px] font-bold", isRecorded ? "bg-black text-[#BAF241]" : "bg-[#BAF241] text-black")}
            >
              {cls.instructorInitials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs">{cls.instructorName}</span>
        </div>
      </div>
      <CardContent className="space-y-3 p-4">
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span className="flex items-center gap-1">
            <IconCalendar className="size-3" />
            {formatDate(cls.scheduledAt)}
          </span>
          <span className="flex items-center gap-1">
            <IconClock className="size-3" />
            {formatTime(cls.scheduledAt)} · {formatDuration(cls.durationMinutes)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <IconUsers className="size-3" />
            {cls.attendeesCount} participantes
          </span>
          <Button
            size="sm"
            variant={isRecorded ? "outline" : "default"}
            className={cn("gap-1 text-xs", !isRecorded && "bg-[#BAF241] text-black hover:bg-[#BAF241]/90")}
            onClick={onToggle}
          >
            {isRecorded ? (
              <>
                <IconPlayerPlay className="size-3" />
                Assistir
              </>
            ) : (
              <>
                <IconCalendarEvent className="size-3" />
                {cls.isRegistered ? "Inscrito" : "Inscrever"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
