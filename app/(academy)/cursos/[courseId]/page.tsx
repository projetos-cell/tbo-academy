"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { OPTIONAL_MODULES } from "@/features/courses/data/mock-courses";
import { EmptyState } from "@/components/shared";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconSchool,
  IconArrowLeft,
  IconArrowRight,
  IconCircleCheck,
  IconPlayerPlay,
  IconLock,
  IconClock,
  IconStar,
  IconBooks,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { ContentGate } from "@/features/academy/components/content-gate";
import { CourseVideoPlayer } from "@/features/courses/components/course-video-player";
import { usePreviewStore } from "@/features/diagnostico/stores/preview-store";
import { usePreviewSession } from "@/features/academy/hooks/use-preview-session";
import { toast } from "sonner";
import { useCourse, type CourseModuleView } from "@/features/courses/hooks/use-course";
import { useCourseProgress } from "@/features/courses/hooks/use-course-progress";
import { trackCourseStarted, trackModuleCompleted } from "@/lib/analytics";

export default function AcademyCourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;
  const isPreview = usePreviewStore((s) => s.isPreview);
  const { isCourseUnlocked, trackCourseExplored } = usePreviewSession();
  const [selectedModule, setSelectedModule] = useState<CourseModuleView | null>(null);
  const { markModuleComplete, markModuleInProgress, isModuleCompleted } = useCourseProgress();

  const { data, isLoading } = useCourse(courseId);
  const course = data?.course ?? null;
  const modules = data?.modules ?? [];

  useEffect(() => {
    if (isPreview && courseId) {
      trackCourseExplored(courseId);
    }
  }, [isPreview, courseId, trackCourseExplored]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-[280px] w-full rounded-2xl" />
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <EmptyState
        icon={IconSchool}
        title="Curso não encontrado"
        description="O curso que você está procurando não existe ou ainda não foi publicado."
        cta={{ label: "Voltar para cursos", onClick: () => window.history.back() }}
      />
    );
  }

  const handleModuleClick = (mod: CourseModuleView) => {
    if (mod.status === "locked") return;
    if (mod.videoUrl) {
      setSelectedModule(mod);
      markModuleInProgress(mod.id);
      if (course) trackCourseStarted(courseId, course.title);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.info("Conteúdo em breve", {
        description: `"${mod.title}" será disponibilizado na próxima fase da plataforma.`,
      });
    }
  };

  const handleMarkComplete = (mod: CourseModuleView) => {
    markModuleComplete(mod.id);
    trackModuleCompleted(mod.id, mod.title, courseId);
    toast.success("Módulo concluído!", { description: `"${mod.title}" marcado como concluído.` });
  };

  const firstPlayable = modules.find((m) => m.status !== "locked" && m.videoUrl);

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/explorar"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <IconArrowLeft className="size-4" />
        Voltar para cursos
      </Link>

      {/* Hero forest — DS subhero */}
      <div className="from-forest-800 to-forest-950 relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br p-8 md:p-10">
        <div
          className="pointer-events-none absolute -top-16 -right-16 size-72 rounded-full blur-2xl"
          style={{ background: "radial-gradient(circle, rgba(186,242,65,.16), transparent 62%)" }}
        />
        <div className="relative z-10 space-y-4">
          <span className="text-volt text-xs font-bold tracking-[0.14em] uppercase">{course.category}</span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">{course.title}</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-white/70">{course.description}</p>
          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-[13px] text-white/90">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-sm">
              <IconClock className="size-3.5" /> {course.duration}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-sm">
              <IconPlayerPlay className="size-3.5" /> {course.totalModules} aulas
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-sm">
              <IconCircleCheck className="size-3.5" /> {course.completedModules} concluídas
            </span>
            <span className="border-volt/40 text-volt inline-flex items-center gap-1.5 rounded-full border bg-white/5 px-3 py-1 backdrop-blur-sm">
              <IconStar className="size-3.5" /> {course.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Video player */}
      {selectedModule && (
        <CourseVideoPlayer
          category={course.category}
          currentModuleTitle={selectedModule.title}
          videoUrl={selectedModule.videoUrl}
        />
      )}

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* ── Conteúdo do curso ── */}
        <div>
          <span className="text-forest-500 text-xs font-bold tracking-[0.14em] uppercase">Conteúdo do curso</span>
          <h2 className="font-display mt-2 mb-5 text-2xl font-bold tracking-tight">Módulos e aulas</h2>

          <ContentGate
            label="Acesse os módulos do curso"
            courseId={courseId}
            previewLevel={isPreview && isCourseUnlocked(courseId) ? "full" : "none"}
          >
            {modules.length === 0 ? (
              <div className="bg-card rounded-2xl border border-black/[0.06] shadow-sm">
                <EmptyState
                  icon={IconBooks}
                  title="Conteúdo em breve"
                  description="As aulas deste curso ainda não foram publicadas. Volte em breve para conferir os módulos."
                  compact
                />
              </div>
            ) : (
            <div className="bg-card overflow-hidden rounded-2xl border border-black/[0.06] shadow-sm">
              {modules.map((mod, i) => {
                const isLocked = mod.status === "locked";
                const dbCompleted = isModuleCompleted(mod.id);
                const isCompleted = dbCompleted || mod.status === "completed";
                const isInProgress = !isCompleted && mod.status === "in_progress";

                return (
                  <button
                    key={mod.id}
                    onClick={() => handleModuleClick(mod)}
                    disabled={isLocked}
                    className={cn(
                      "flex w-full items-center gap-4 border-b border-black/[0.05] px-5 py-4 text-left transition-colors last:border-b-0",
                      isLocked ? "cursor-not-allowed opacity-55" : "hover:bg-paper-off cursor-pointer",
                    )}
                  >
                    {/* Status icon */}
                    <span
                      className={cn(
                        "grid size-9 flex-none place-items-center rounded-full",
                        isCompleted
                          ? "bg-volt text-ink"
                          : isLocked
                            ? "bg-muted text-muted-foreground"
                            : "bg-forest-900 text-volt",
                      )}
                    >
                      {isCompleted ? (
                        <IconCircleCheck className="size-4" />
                      ) : isLocked ? (
                        <IconLock className="size-4" />
                      ) : (
                        <IconPlayerPlay className="size-4 fill-current" />
                      )}
                    </span>

                    <span className="font-mono-tbo w-7 flex-none text-[13px] text-[var(--tbo-forest-400)]">
                      {(i + 1 < 10 ? "0" : "") + (i + 1)}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-semibold">{mod.title}</span>
                      <span className="mt-0.5 flex items-center gap-2 text-xs text-[var(--tbo-gray-500)]">
                        <IconClock className="size-3" /> {mod.duration}
                        {isInProgress && <span className="text-forest-500 font-semibold">· em andamento</span>}
                      </span>
                    </span>

                    {!isLocked && !isCompleted && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkComplete(mod);
                        }}
                        className="text-forest-600 hover:text-ink flex-none text-[11px] font-bold uppercase transition-colors"
                      >
                        Concluir
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            )}
          </ContentGate>

          {/* Módulos opcionais */}
          <div className="mt-10">
            <span className="text-forest-500 text-xs font-bold tracking-[0.14em] uppercase">
              Módulos adicionais · opcionais
            </span>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {OPTIONAL_MODULES.map((o) => (
                <span key={o} className="tagpill">
                  {o}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Aside: matrícula / progresso ── */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="bg-card rounded-2xl border border-black/[0.06] p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-forest-500 text-xs font-bold tracking-[0.14em] uppercase">Seu progresso</span>
              <span className="text-lg font-bold">{course.progress}%</span>
            </div>
            <div className="pbar">
              <span style={{ width: `${course.progress}%` }} />
            </div>

            {firstPlayable && (
              <button
                onClick={() => handleModuleClick(firstPlayable)}
                className="bg-forest-900 hover:bg-ink mt-5 flex w-full items-center justify-between rounded-full py-3 pr-3 pl-5 text-sm font-bold text-white transition-all hover:-translate-y-px"
              >
                {course.status === "em_andamento" ? "Continuar de onde parou" : "Começar agora"}
                <span className="bg-volt text-ink grid size-7 place-items-center rounded-full">
                  <IconArrowRight className="size-4" />
                </span>
              </button>
            )}

            <hr className="my-6 border-black/[0.06]" />

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--tbo-gray-500)]">Instrutor</dt>
                <dd className="font-semibold">{course.instructor}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--tbo-gray-500)]">Duração</dt>
                <dd className="font-semibold">{course.duration}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--tbo-gray-500)]">Aulas</dt>
                <dd className="font-semibold">{course.totalModules}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--tbo-gray-500)]">Nível</dt>
                <dd className="font-semibold capitalize">{course.level}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
