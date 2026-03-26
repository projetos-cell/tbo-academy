"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { usePreviewSession } from "@/features/academy/hooks/use-preview-session"
import { usePreviewStore } from "@/features/diagnostico/stores/preview-store"
import { MOCK_COURSES } from "@/features/courses/data/mock-courses"
import { CourseCard } from "@/features/courses/components/course-card"
import type { LevelKey } from "@/features/diagnostico/data/diagnostic-data"

const LEVEL_COLORS: Record<LevelKey, { text: string; bg: string; bar: string }> = {
  cego: { text: "text-red-500", bg: "bg-red-500/10", bar: "bg-red-500" },
  miope: { text: "text-amber-500", bg: "bg-amber-500/10", bar: "bg-amber-500" },
  enxerga: { text: "text-[#b8f724]", bg: "bg-[#b8f724]/10", bar: "bg-[#b8f724]" },
  domina: { text: "text-emerald-500", bg: "bg-emerald-500/10", bar: "bg-emerald-500" },
}

const ETAPA_ICONS = [IconEye, IconTarget, IconTrendingUp, IconBrain, IconShieldCheck]

export function DiscoveryFeed() {
  const {
    weakAreas,
    totalScore100,
    totalLevel,
    unlockedCourseIds,
    diagnosticComplete,
    freeContentCount,
  } = usePreviewSession()
  const openPricing = usePreviewStore((s) => s.openPricing)

  // Courses unlocked for this user
  const unlockedCourses = MOCK_COURSES.filter((c) =>
    unlockedCourseIds.includes(c.id)
  )

  // Courses NOT unlocked for teaser display
  const teaserCourses = MOCK_COURSES.filter(
    (c) => !unlockedCourseIds.includes(c.id)
  ).slice(0, 3)

  if (!diagnosticComplete) {
    return <DiscoveryFeedNoDiagnostic />
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ─── Hero: Diagnostic Summary ─────────────────────────── */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0a1f1d] via-[#0d2e2b] to-[#112e1e] p-6 text-white md:p-8">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
              <IconSparkles className="size-3 mr-1" />
              Baseado no seu diagnóstico
            </Badge>
            <Badge
              className={cn(
                "border-0 backdrop-blur-sm",
                totalLevel.cls === "cego" && "bg-red-500/20 text-red-300",
                totalLevel.cls === "miope" && "bg-amber-500/20 text-amber-300",
                totalLevel.cls === "enxerga" && "bg-[#b8f724]/20 text-[#b8f724]",
                totalLevel.cls === "domina" && "bg-emerald-500/20 text-emerald-300"
              )}
            >
              Score: {totalScore100}/100 · {totalLevel.name}
            </Badge>
          </div>

          <h1 className="text-2xl font-bold md:text-3xl mb-2">
            Seu diagnóstico revelou {weakAreas.length} área{weakAreas.length !== 1 ? "s" : ""} crítica{weakAreas.length !== 1 ? "s" : ""}
          </h1>
          <p className="max-w-lg text-sm text-white/70">
            Desbloqueamos {freeContentCount} aula{freeContentCount !== 1 ? "s" : ""} gratuita{freeContentCount !== 1 ? "s" : ""} para
            você começar a resolver agora. Explore, assista, e sinta o que a
            Academy pode fazer pela sua operação.
          </p>
        </div>
      </div>

      {/* ─── Weak Areas Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {weakAreas.map((area) => {
          const c = LEVEL_COLORS[area.level.cls]
          const Icon = ETAPA_ICONS[area.etapaIndex] ?? IconAlertTriangle
          return (
            <Card
              key={area.etapaIndex}
              className="relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={cn("absolute inset-x-0 top-0 h-[3px]", c.bar)} />
              <CardContent className="p-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg",
                      c.bg
                    )}
                  >
                    <Icon className={cn("size-4", c.text)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold tracking-tight truncate">
                      {area.title}
                    </h4>
                    <span
                      className={cn(
                        "text-[9px] font-semibold uppercase tracking-wide",
                        c.text
                      )}
                    >
                      {area.level.name} · {area.score100}/100
                    </span>
                  </div>
                </div>
                <Progress
                  value={area.score100}
                  className="h-1.5 mb-3"
                />
                {area.recommendedTrail && (
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Trilha recomendada:{" "}
                    <span className="font-semibold text-foreground">
                      {area.recommendedTrail.name}
                    </span>
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* ─── Unlocked Content (free) ──────────────────────────── */}
      {unlockedCourses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-[#b8f724]/10">
              <IconPlayerPlay className="size-3.5 text-[#b8f724]" />
            </div>
            <h2 className="text-sm font-bold tracking-tight uppercase">
              Conteúdo desbloqueado para você
            </h2>
            <Badge
              variant="secondary"
              className="bg-[#b8f724]/10 text-[#b8f724] border-0 text-[9px]"
            >
              Grátis
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground -mt-2">
            Baseado nas suas áreas mais fracas, liberamos acesso completo a
            essas aulas.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unlockedCourses.map((course) => (
              <div key={course.id} className="relative">
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge className="bg-[#b8f724] text-[#0a1f1d] border-0 text-[8px] font-bold tracking-wider uppercase shadow-sm">
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
            <div className="flex size-6 items-center justify-center rounded-md bg-muted">
              <IconCompass className="size-3.5 text-muted-foreground" />
            </div>
            <h2 className="text-sm font-bold tracking-tight uppercase">
              Explore mais cursos
            </h2>
          </div>
          <p className="text-xs text-muted-foreground -mt-2">
            Navegue livremente. Assista ao teaser de 2 minutos de cada curso.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teaserCourses.map((course) => (
              <div key={course.id} className="relative">
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge
                    variant="secondary"
                    className="bg-zinc-100 text-zinc-500 border-0 text-[8px] font-bold tracking-wider uppercase dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    <IconLock className="size-2.5 mr-0.5" />
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
      <Card className="overflow-hidden border-[#b8f724]/30 bg-gradient-to-r from-[#b8f724]/5 to-transparent">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
          <div className="flex-1 space-y-1">
            <h3 className="text-base font-bold tracking-tight">
              Gostou do que viu?
            </h3>
            <p className="text-xs text-muted-foreground max-w-md">
              Suas {weakAreas.length} áreas críticas precisam de atenção. Com o
              plano Essencial, você desbloqueia todas as trilhas recomendadas,
              certificados e mentoria.
            </p>
          </div>
          <Button
            onClick={openPricing}
            className="bg-[#b8f724] text-[#0a1f1d] hover:bg-[#b8f724]/90 shrink-0"
          >
            Ver planos
            <IconArrowRight className="size-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Fallback when no diagnostic was completed ──────────────────
function DiscoveryFeedNoDiagnostic() {
  const openPricing = usePreviewStore((s) => s.openPricing)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0a1f1d] via-[#0d2e2b] to-[#112e1e] p-6 text-white md:p-8">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="relative z-10 space-y-3">
          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
            <IconCompass className="size-3 mr-1" />
            Modo Descoberta
          </Badge>
          <h1 className="text-2xl font-bold md:text-3xl">
            Bem-vindo à TBO Academy
          </h1>
          <p className="max-w-lg text-sm text-white/70">
            Explore a plataforma livremente. Para desbloquear conteúdo
            personalizado, faça o diagnóstico gratuito.
          </p>
          <div className="flex gap-3 pt-2">
            <Button asChild className="bg-[#b8f724] text-[#0a1f1d] hover:bg-[#b8f724]/90">
              <Link href="/diagnostico">
                <IconTarget className="size-4 mr-1" />
                Fazer diagnóstico grátis
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* All courses as teasers */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold tracking-tight uppercase">
          Cursos disponíveis
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_COURSES.slice(0, 6).map((course) => (
            <div key={course.id} className="relative">
              <div className="absolute -top-2 -right-2 z-10">
                <Badge
                  variant="secondary"
                  className="bg-zinc-100 text-zinc-500 border-0 text-[8px] font-bold tracking-wider uppercase dark:bg-zinc-800 dark:text-zinc-400"
                >
                  <IconLock className="size-2.5 mr-0.5" />
                  Preview
                </Badge>
              </div>
              <CourseCard course={course} basePath="/cursos" />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Card className="overflow-hidden border-[#b8f724]/30 bg-gradient-to-r from-[#b8f724]/5 to-transparent">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
          <div className="flex-1 space-y-1">
            <h3 className="text-base font-bold tracking-tight">
              Descubra seu nível de maturidade
            </h3>
            <p className="text-xs text-muted-foreground max-w-md">
              Faça o diagnóstico gratuito e desbloqueie aulas personalizadas
              para as suas áreas mais fracas.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button asChild variant="outline">
              <Link href="/diagnostico">Fazer diagnóstico</Link>
            </Button>
            <Button
              onClick={openPricing}
              className="bg-[#b8f724] text-[#0a1f1d] hover:bg-[#b8f724]/90"
            >
              Ver planos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
