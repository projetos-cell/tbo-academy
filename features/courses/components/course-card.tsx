"use client";

import {
  IconBook2,
  IconRocket,
  IconBulb,
  IconSpeakerphone,
  IconCube,
  IconMovie,
  IconSettings,
  IconDiamond,
  IconStar,
  IconClock,
  IconBooks,
  IconLock,
  IconArrowRight,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePreviewStore } from "@/features/diagnostico/stores/preview-store";
import { cn } from "@/lib/utils";
import type { Course } from "../types";

interface CourseCardProps {
  course: Course;
  basePath?: string;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Introdução: IconBook2,
  Lançamento: IconRocket,
  Branding: IconBulb,
  Marketing: IconSpeakerphone,
  "Digital 3D": IconCube,
  Audiovisual: IconMovie,
  Processos: IconSettings,
  Metodologia: IconDiamond,
};

const LEVEL_LABELS: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

export function CourseCard({ course, basePath = "/cursos" }: CourseCardProps) {
  const isPreview = usePreviewStore((s) => s.isPreview);
  const openPricing = usePreviewStore((s) => s.openPricing);

  const Icon = CATEGORY_ICONS[course.category] ?? IconBooks;

  const buttonLabel =
    course.status === "concluido" ? "Revisar" : course.status === "em_andamento" ? "Continuar" : "Iniciar";
  const isReview = course.status === "concluido";

  const handleLockedClick = (e: React.MouseEvent) => {
    if (isPreview) {
      e.preventDefault();
      openPricing();
    }
  };

  return (
    <div className="group bg-card relative flex flex-col overflow-hidden rounded-[18px] border border-black/[0.06] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,11,11,0.10)]">
      {/* Lock overlay for preview mode */}
      {isPreview && (
        <button
          onClick={handleLockedClick}
          className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100"
        >
          <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-black/80 px-5 py-3 backdrop-blur-md">
            <IconLock className="text-volt size-5" />
            <span className="text-[9px] font-bold tracking-[1px] text-white uppercase">Desbloquear</span>
          </div>
        </button>
      )}

      {/* Thumbnail — forest treatment do DS */}
      <div className="img-dark relative flex aspect-[16/10] items-center justify-center">
        <Icon className="text-volt/90 size-12" strokeWidth={1.5} />
        <span className="absolute top-3 left-3 rounded-full border border-white/25 bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          {course.category}
        </span>
        {isPreview && (
          <div className="absolute top-3 right-3">
            <IconLock className="size-4 text-white/60" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display line-clamp-2 text-[17px] leading-tight font-bold tracking-tight">{course.title}</h3>
        <p className="mt-1 text-xs text-[var(--tbo-gray-500)]">{course.instructor}</p>

        {/* Progress — barra volt do DS */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--tbo-gray-500)]">Progresso</span>
            <span className="font-semibold">{course.progress}%</span>
          </div>
          <div className="pbar">
            <span style={{ width: `${course.progress}%` }} />
          </div>
        </div>

        {/* Meta info */}
        <div className="mt-3 flex items-center gap-3 text-xs text-[var(--tbo-gray-500)]">
          <span className="flex items-center gap-1">
            <IconClock className="size-3" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <IconBooks className="size-3" />
            {course.completedModules}/{course.totalModules} aulas
          </span>
        </div>

        {/* Rating + Level */}
        <div className="mt-3 mb-4 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs">
            <IconStar className="size-3.5 fill-amber-500 text-amber-500" />
            <span className="font-semibold">{course.rating}</span>
            <span className="text-[var(--tbo-gray-500)]">({course.students})</span>
          </span>
          <span className="text-forest-700 bg-paper-off rounded-full border border-black/[0.06] px-2.5 py-0.5 text-[11px] font-semibold">
            {LEVEL_LABELS[course.level]}
          </span>
        </div>

        {/* CTA — pill do DS */}
        <div className="mt-auto">
          {isPreview ? (
            <button
              onClick={handleLockedClick}
              className="bg-ink text-volt flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold transition-all hover:-translate-y-px"
            >
              <IconLock className="size-3.5" />
              Desbloquear curso
            </button>
          ) : (
            <Link
              href={`${basePath}/${course.id}`}
              className={cn(
                "flex w-full items-center justify-between rounded-full py-2.5 pr-2.5 pl-5 text-sm font-bold transition-all hover:-translate-y-px",
                isReview
                  ? "text-ink border border-black/10 bg-transparent hover:bg-black/[0.04]"
                  : "bg-forest-900 hover:bg-ink text-white",
              )}
            >
              {buttonLabel}
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-full",
                  isReview ? "bg-ink text-volt" : "bg-volt text-ink",
                )}
              >
                <IconArrowRight className="size-4" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
