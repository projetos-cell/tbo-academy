"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  IconAlertTriangle,
  IconArrowRight,
  IconCompass,
  IconEye,
  IconLock,
  IconPlayerPlay,
  IconSparkles,
  IconTarget,
  IconTrendingUp,
  IconBrain,
  IconShieldCheck,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { usePreviewSession } from "@/features/academy/hooks/use-preview-session";
import { usePreviewStore } from "@/features/diagnostico/stores/preview-store";
import { MOCK_COURSES } from "@/features/courses/data/mock-courses";
import { CourseCard } from "@/features/courses/components/course-card";
import type { LevelKey } from "@/features/diagnostico/data/diagnostic-data";

const LEVEL_COLORS: Record<LevelKey, { text: string; bg: string; bar: string }> = {
  cego: { text: "text-red-500", bg: "bg-red-500/10", bar: "bg-red-500" },
  miope: { text: "text-amber-500", bg: "bg-amber-500/10", bar: "bg-amber-500" },
  enxerga: { text: "text-[#BAF241]", bg: "bg-[#BAF241]/10", bar: "bg-[#BAF241]" },
  domina: { text: "text-emerald-500", bg: "bg-emerald-500/10", bar: "bg-emerald-500" },
};

const ETAPA_ICONS = [IconEye, IconTarget, IconTrendingUp, IconBrain, IconShieldCheck];

export function DiscoveryFeed() {
  const { weakAreas, totalScore100, totalLevel, unlockedCourseIds, diagnosticComplete, freeContentCount } =
    usePreviewSession();
  const openPricing = usePreviewStore((s) => s.openPricing);

  // Courses unlocked for this user
  const unlockedCourses = MOCK_COURSES.filter((c) => unlockedCourseIds.includes(c.id));

  // Courses NOT unlocked for teaser display
  const teaserCourses = MOCK_COURSES.filter((c) => !unlockedCourseIds.includes(c.id)).slice(0, 3);

  if (!diagnosticComplete) {
    return <DiscoveryFeedNoDiagnostic />;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
      {/* ─── Hero: Diagnostic Summary ─────────────────────────── */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-black via-black to-black p-6 text-white md:p-8">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-3">
            <Badge className="border-0 bg-white/20 text-white backdrop-blur-sm">
              <IconSparkles className="mr-1 size-3" />
              Baseado no seu diagnóstico
            </Badge>
            <Badge
              className={cn(
                "border-0 backdrop-blur-sm",
                totalLevel.cls === "cego" && "bg-red-500/20 text-red-300",
                totalLevel.cls === "miope" && "bg-amber-500/20 text-amber-300",
                totalLevel.cls === "enxerga" && "bg-[#BAF241]/20 text-[#BAF241]",
                totalLevel.cls === "domina" && "bg-emerald-500/20 text-emerald-300",
              )}
            >
              Score: {totalScore100}/100 · {totalLevel.name}
            </Badge>
          </div>

          <h1 className="mb-2 text-2xl font-bold md:text-3xl">
            Seu diagnóstico revelou {weakAreas.length} área{weakAreas.length !== 1 ? "s" : ""} crítica
            {weakAreas.length !== 1 ? "s" : ""}
          </h1>
          <p className="max-w-lg text-sm text-white/70">
            Desbloqueamos {freeContentCount} aula{freeContentCount !== 1 ? "s" : ""} gratuita
            {freeContentCount !== 1 ? "s" : ""} para você começar a resolver agora. Explore, assista, e sinta o que a
            Academy pode fazer pela sua operação.
          </p>
        </div>
      </div>

      {/* ─── Weak Areas Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {weakAreas.map((area) => {
          const c = LEVEL_COLORS[area.level.cls];
          const Icon = ETAPA_ICONS[area.etapaIndex] ?? IconAlertTriangle;
          return (
            <Card
              key={area.etapaIndex}
              className="relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={cn("absolute inset-x-0 top-0 h-[3px]", c.bar)} />
              <CardContent className="p-4">
                <div className="mb-3 flex items-center gap-2.5">
                  <div className={cn("flex size-9 items-center justify-center rounded-lg", c.bg)}>
                    <Icon className={cn("size-4", c.text)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-xs font-bold tracking-tight">{area.title}</h4>
                    <span className={cn("text-[9px] font-semibold tracking-wide uppercase", c.text)}>
                      {area.level.name} · {area.score100}/100
                    </span>
                  </div>
                </div>
                <Progress value={area.score100} className="mb-3 h-1.5" />
                {area.recommendedTrail && (
                  <p className="text-muted-foreground text-[10px] leading-relaxed">
                    Trilha recomendada:{" "}
                    <span className="text-foreground font-semibold">{area.recommendedTrail.name}</span>
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ─── Unlocked Content (free) ──────────────────────────── */}
      {unlockedCourses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-[#BAF241]/10">
              <IconPlayerPlay className="size-3.5 text-[#BAF241]" />
            </div>
            <h2 className="text-sm font-bold tracking-tight uppercase">Conteúdo desbloqueado para você</h2>
            <Badge variant="secondary" className="border-0 bg-[#BAF241]/10 text-[9px] text-[#BAF241]">
              Grátis
            </Badge>
          </div>
          <p className="text-muted-foreground -mt-2 text-xs">
            Baseado nas suas áreas mais fracas, liberamos acesso completo a essas aulas.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unlockedCourses.map((course) => (
              <div key={course.id} className="relative">
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge className="border-0 bg-[#BAF241] text-[8px] font-bold tracking-wider text-black uppercase shadow-sm">
                    Grátis
                  </Badge>
                </div>
                <CourseCard course={course} basePath="/cursos" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Teaser Courses (locked, browse only) ─────────────── */}
      {teaserCourses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-muted flex size-6 items-center justify-center rounded-md">
              <IconCompass className="text-muted-foreground size-3.5" />
            </div>
            <h2 className="text-sm font-bold tracking-tight uppercase">Explore mais cursos</h2>
          </div>
          <p className="text-muted-foreground -mt-2 text-xs">
            Navegue livremente. Assista ao teaser de 2 minutos de cada curso.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teaserCourses.map((course) => (
              <div key={course.id} className="relative">
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge
                    variant="secondary"
                    className="border-0 bg-zinc-100 text-[8px] font-bold tracking-wider text-zinc-500 uppercase dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    <IconLock className="mr-0.5 size-2.5" />
                    Teaser
                  </Badge>
                </div>
                <CourseCard course={course} basePath="/cursos" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Conversion CTA ───────────────────────────────────── */}
      <Card className="overflow-hidden bg-gradient-to-r from-[#BAF241]/10 to-transparent">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
          <div className="flex-1 space-y-1">
            <h3 className="text-base font-bold tracking-tight">Gostou do que viu?</h3>
            <p className="text-muted-foreground max-w-md text-xs">
              Suas {weakAreas.length} áreas críticas precisam de atenção. Com o plano Essencial, você desbloqueia todas
              as trilhas recomendadas, certificados e mentoria.
            </p>
          </div>
          <Button onClick={openPricing} className="shrink-0 bg-[#BAF241] text-black hover:bg-[#BAF241]/90">
            Ver planos
            <IconArrowRight className="ml-1 size-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Fallback when no diagnostic was completed ──────────────────
function DiscoveryFeedNoDiagnostic() {
  const openPricing = usePreviewStore((s) => s.openPricing);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-black via-black to-black p-6 text-white md:p-8">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="relative z-10 space-y-3">
          <Badge className="border-0 bg-white/20 text-white backdrop-blur-sm">
            <IconCompass className="mr-1 size-3" />
            Modo Descoberta
          </Badge>
          <h1 className="text-2xl font-bold md:text-3xl">Bem-vindo à TBO Academy</h1>
          <p className="max-w-lg text-sm text-white/70">
            Explore a plataforma livremente. Para desbloquear conteúdo personalizado, faça o diagnóstico gratuito.
          </p>
          <div className="flex gap-3 pt-2">
            <Button asChild className="bg-[#BAF241] text-black hover:bg-[#BAF241]/90">
              <Link href="/diagnostico">
                <IconTarget className="mr-1 size-4" />
                Fazer diagnóstico grátis
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* All courses as teasers */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold tracking-tight uppercase">Cursos disponíveis</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_COURSES.slice(0, 6).map((course) => (
            <div key={course.id} className="relative">
              <div className="absolute -top-2 -right-2 z-10">
                <Badge
                  variant="secondary"
                  className="border-0 bg-zinc-100 text-[8px] font-bold tracking-wider text-zinc-500 uppercase dark:bg-zinc-800 dark:text-zinc-400"
                >
                  <IconLock className="mr-0.5 size-2.5" />
                  Preview
                </Badge>
              </div>
              <CourseCard course={course} basePath="/cursos" />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Card className="overflow-hidden bg-gradient-to-r from-[#BAF241]/10 to-transparent">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
          <div className="flex-1 space-y-1">
            <h3 className="text-base font-bold tracking-tight">Descubra seu nível de maturidade</h3>
            <p className="text-muted-foreground max-w-md text-xs">
              Faça o diagnóstico gratuito e desbloqueie aulas personalizadas para as suas áreas mais fracas.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button asChild variant="outline">
              <Link href="/diagnostico">Fazer diagnóstico</Link>
            </Button>
            <Button onClick={openPricing} className="bg-[#BAF241] text-black hover:bg-[#BAF241]/90">
              Ver planos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
