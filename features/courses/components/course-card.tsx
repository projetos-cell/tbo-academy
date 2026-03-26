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
} from "@tabler/icons-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePreviewStore } from "@/features/diagnostico/stores/preview-store";
import { cn } from "@/lib/utils";
import type { Course } from "../types";

interface CourseCardProps {
  course: Course;
  basePath?: string;
}

const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; gradient: string }> = {
  Introdução: { icon: IconBook2, gradient: "from-black to-zinc-800" },
  Lançamento: { icon: IconRocket, gradient: "from-[#BAF241] to-emerald-500" },
  Branding: { icon: IconBulb, gradient: "from-amber-500 to-orange-500" },
  Marketing: { icon: IconSpeakerphone, gradient: "from-blue-500 to-cyan-600" },
  "Digital 3D": { icon: IconCube, gradient: "from-violet-500 to-purple-600" },
  Audiovisual: { icon: IconMovie, gradient: "from-rose-500 to-pink-600" },
  Processos: { icon: IconSettings, gradient: "from-slate-600 to-zinc-700" },
  Metodologia: { icon: IconDiamond, gradient: "from-black to-[#BAF241]" },
};

const LEVEL_LABELS: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediario",
  avancado: "Avancado",
};

const LEVEL_VARIANTS: Record<string, "default" | "secondary" | "outline"> = {
  iniciante: "secondary",
  intermediario: "default",
  avancado: "outline",
};

export function CourseCard({ course, basePath = "/academy/cursos" }: CourseCardProps) {
  const isPreview = usePreviewStore((s) => s.isPreview);
  const openPricing = usePreviewStore((s) => s.openPricing);

  const config = CATEGORY_CONFIG[course.category] ?? {
    icon: IconBooks,
    gradient: "from-gray-500 to-gray-600",
  };
  const Icon = config.icon;

  const buttonLabel =
    course.status === "concluido" ? "Revisar" : course.status === "em_andamento" ? "Continuar" : "Iniciar";

  const handleLockedClick = (e: React.MouseEvent) => {
    if (isPreview) {
      e.preventDefault();
      openPricing();
    }
  };

  return (
    <Card className="group relative gap-0 overflow-hidden py-0">
      {/* Lock overlay for preview mode */}
      {isPreview && (
        <button
          onClick={handleLockedClick}
          className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100"
        >
          <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-black/80 px-5 py-3 backdrop-blur-md">
            <IconLock className="size-5 text-[#BAF241]" />
            <span className="text-[9px] font-bold tracking-[1px] text-white uppercase">Desbloquear</span>
          </div>
        </button>
      )}

      {/* Thumbnail */}
      <div className={`h-36 bg-gradient-to-br ${config.gradient} relative flex items-center justify-center`}>
        <Icon className="size-14 text-white/90" />
        <Badge className="absolute top-3 left-3 rounded-full border-0 bg-black/70 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          {course.category}
        </Badge>
        {isPreview && (
          <div className="absolute top-2 right-2">
            <IconLock className="size-4 text-white/60" />
          </div>
        )}
      </div>

      <CardContent className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-2 text-sm leading-tight font-semibold">{course.title}</h3>
          <p className="text-muted-foreground mt-1 text-xs">{course.instructor}</p>
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-1.5" />
        </div>

        {/* Meta info */}
        <div className="text-muted-foreground flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <IconClock className="size-3" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <IconBooks className="size-3" />
            {course.completedModules}/{course.totalModules} modulos
          </span>
        </div>

        {/* Rating + Level */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs">
            <IconStar className="size-3.5 fill-amber-500 text-amber-500" />
            <span className="font-medium">{course.rating}</span>
            <span className="text-muted-foreground">({course.students})</span>
          </span>
          <Badge variant={LEVEL_VARIANTS[course.level]}>{LEVEL_LABELS[course.level]}</Badge>
        </div>

        {isPreview ? (
          <Button
            size="sm"
            className="w-full rounded-xl bg-black font-semibold text-[#BAF241] transition-all hover:bg-black/90"
            onClick={handleLockedClick}
          >
            <IconLock className="mr-1 size-3" />
            Desbloquear curso
          </Button>
        ) : (
          <Button
            size="sm"
            className={cn(
              "w-full rounded-xl font-semibold transition-all",
              course.status === "concluido"
                ? "border border-black/10 bg-transparent text-black hover:bg-black/5"
                : "bg-[#BAF241] text-black hover:bg-[#a8e030] hover:shadow-[0_4px_16px_rgba(186,242,65,0.3)]",
            )}
            asChild
          >
            <Link href={`${basePath}/${course.id}`}>{buttonLabel}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
