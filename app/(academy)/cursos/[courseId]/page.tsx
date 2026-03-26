"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { MOCK_COURSES, MOCK_MODULES } from "@/features/courses/data/mock-courses"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { EmptyState } from "@/components/shared"
import {
  IconSchool,
  IconArrowLeft,
  IconBook2,
  IconCircleCheck,
  IconPlayerPlay,
  IconLock,
  IconClock,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { ContentGate } from "@/features/academy/components/content-gate"
import { CourseVideoPlayer } from "@/features/courses/components/course-video-player"
import { usePreviewStore } from "@/features/diagnostico/stores/preview-store"
import { usePreviewSession } from "@/features/academy/hooks/use-preview-session"
import type { CourseModule } from "@/features/courses/types"
import { toast } from "sonner"

const CATEGORY_GRADIENTS: Record<string, string> = {
  "Introdução": "from-black via-zinc-900 to-zinc-800",
  "Lançamento": "from-emerald-600 via-[#BAF241]/80 to-[#BAF241]/40",
  Branding: "from-amber-600 via-orange-500 to-amber-400/60",
  Marketing: "from-blue-700 via-blue-500 to-cyan-400/40",
  "Digital 3D": "from-violet-700 via-purple-500 to-violet-400/40",
  Audiovisual: "from-rose-700 via-pink-500 to-rose-400/40",
  Processos: "from-slate-700 via-zinc-600 to-slate-500/40",
  Metodologia: "from-black via-zinc-900 to-[#BAF241]/20",
}

export default function AcademyCourseDetailPage() {
  const params = useParams<{ courseId: string }>()
  const courseId = params.courseId
  const isPreview = usePreviewStore((s) => s.isPreview)
  const { isCourseUnlocked, trackCourseExplored } = usePreviewSession()
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null)

  const course = useMemo(
    () => MOCK_COURSES.find((c) => c.id === courseId),
    [courseId]
  )

  const modules = useMemo(
    () =>
      MOCK_MODULES.filter((m) => m.courseId === courseId).sort(
        (a, b) => a.order - b.order
      ),
    [courseId]
  )

  useEffect(() => {
    if (isPreview && courseId) {
      trackCourseExplored(courseId)
    }
  }, [isPreview, courseId, trackCourseExplored])

  if (!course) {
    return (
      <EmptyState
        icon={IconSchool}
        title="Curso não encontrado"
        description="O curso que você está procurando não existe ou foi removido."
        cta={{ label: "Voltar para Academy", onClick: () => window.history.back() }}
      />
    )
  }

  const gradient = CATEGORY_GRADIENTS[course.category] ?? "from-gray-700 to-gray-500"

  const handleModuleClick = (mod: CourseModule) => {
    if (mod.status === "locked") return
    if (mod.videoUrl) {
      setSelectedModule(mod)
    } else {
      toast.info("Conteúdo em breve", {
        description: `"${mod.title}" será disponibilizado na próxima fase da plataforma.`,
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/explorar"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <IconArrowLeft className="size-4" />
        Voltar para cursos
      </Link>

      {/* Hero */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-8 md:p-10 min-h-[280px] flex flex-col justify-end`}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute -right-10 -top-10 size-48 rounded-full bg-white/5 blur-2xl" />

        <div className="relative z-10 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {course.title}
          </h1>
          <p className="text-white/60 text-sm max-w-2xl leading-relaxed">
            {course.description}
          </p>
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <Badge className="bg-white/10 text-white border-0 backdrop-blur-sm gap-1.5 rounded-full px-3 py-1">
              <IconBook2 className="size-3.5" />
              {course.totalModules} aulas
            </Badge>
            <Badge className="bg-white/10 text-white border-0 backdrop-blur-sm gap-1.5 rounded-full px-3 py-1">
              <IconCircleCheck className="size-3.5" />
              {course.completedModules} concluídas
            </Badge>
            <Badge
              className={cn(
                "border-0 backdrop-blur-sm rounded-full px-3 py-1",
                course.progress === 100
                  ? "bg-[#BAF241]/20 text-[#BAF241]"
                  : course.progress > 0
                    ? "bg-white/10 text-white"
                    : "bg-white/10 text-white/60"
              )}
            >
              {course.progress}% completo
            </Badge>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground">Seu progresso no curso</p>
          <span className="text-sm font-bold">{course.progress}%</span>
        </div>
        <Progress value={course.progress} className="h-2" />
      </div>

      {/* Video player */}
      {selectedModule && (
        <CourseVideoPlayer
          category={course.category}
          currentModuleTitle={selectedModule.title}
          videoUrl={selectedModule.videoUrl}
        />
      )}

      {/* Modules grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Módulos</h2>

        <ContentGate
          label="Acesse os módulos do curso"
          courseId={courseId}
          previewLevel={isPreview && isCourseUnlocked(courseId) ? "full" : "none"}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((mod) => {
              const isLocked = mod.status === "locked"
              const isCompleted = mod.status === "completed"
              const isInProgress = mod.status === "in_progress"

              return (
                <button
                  key={mod.id}
                  onClick={() => handleModuleClick(mod)}
                  disabled={isLocked}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl text-left transition-all duration-300",
                    isLocked
                      ? "cursor-not-allowed opacity-60"
                      : "hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] cursor-pointer"
                  )}
                >
                  {/* Thumbnail */}
                  <div className={`relative aspect-[4/3] bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

                    {isLocked && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="flex size-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                          <IconLock className="size-4 text-white/60" />
                        </div>
                      </div>
                    )}

                    <Badge className="absolute top-3 left-3 z-10 bg-black/40 text-white border-0 backdrop-blur-sm text-[10px] font-semibold rounded-md px-2">
                      Módulo {mod.order}
                    </Badge>

                    {(isCompleted || isInProgress) && (
                      <div className="absolute bottom-3 right-3 z-10">
                        <div className={cn(
                          "flex size-6 items-center justify-center rounded-full",
                          isCompleted ? "bg-[#BAF241]" : "bg-white/20 backdrop-blur-sm"
                        )}>
                          {isCompleted ? (
                            <IconCircleCheck className="size-4 text-black" />
                          ) : (
                            <IconPlayerPlay className="size-3.5 text-white fill-white" />
                          )}
                        </div>
                      </div>
                    )}

                    <p className="relative z-10 text-center text-white/80 text-xs font-bold uppercase tracking-wider px-4 leading-tight">
                      {mod.title.length > 30 ? mod.title.substring(0, 30) + "..." : mod.title}
                    </p>
                  </div>

                  {/* Info */}
                  <div className="p-3 bg-white">
                    <p className="text-sm font-semibold text-black truncate">
                      {mod.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <IconClock className="size-3" />
                        {mod.duration}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </ContentGate>
      </div>

      {/* Course info cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]">
          <p className="text-xs text-muted-foreground mb-1">Instrutor</p>
          <p className="text-sm font-semibold">{course.instructor}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]">
          <p className="text-xs text-muted-foreground mb-1">Duração total</p>
          <p className="text-sm font-semibold">{course.duration}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]">
          <p className="text-xs text-muted-foreground mb-1">Nível</p>
          <p className="text-sm font-semibold capitalize">{course.level}</p>
        </div>
      </div>
    </div>
  )
}
