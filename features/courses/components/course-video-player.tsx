"use client";

import { IconPlayerPlay, IconVideo } from "@tabler/icons-react";

interface CourseVideoPlayerProps {
  category: string;
  currentModuleTitle: string;
  videoUrl?: string;
}

export function CourseVideoPlayer({ category, currentModuleTitle, videoUrl }: CourseVideoPlayerProps) {
  if (videoUrl) {
    return (
      <div className="bg-card overflow-hidden rounded-2xl border border-black/[0.06] shadow-sm">
        <div className="bg-forest-950 relative aspect-video w-full">
          <iframe
            src={videoUrl}
            title={currentModuleTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div className="bg-forest-900 flex items-center gap-3 px-5 py-3.5">
          <span className="bg-volt text-ink grid size-7 flex-none place-items-center rounded-full">
            <IconPlayerPlay className="size-4 fill-current" />
          </span>
          <div className="min-w-0">
            <span className="text-volt block text-[10px] font-bold tracking-[0.14em] uppercase">{category}</span>
            <p className="truncate text-sm font-semibold text-white">{currentModuleTitle}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card overflow-hidden rounded-2xl border border-black/[0.06] shadow-sm">
      <div className="img-dark relative flex aspect-video items-center justify-center">
        <div
          className="pointer-events-none absolute -top-16 -right-16 size-72 rounded-full blur-2xl"
          style={{ background: "radial-gradient(circle, rgba(186,242,65,.16), transparent 62%)" }}
        />

        <div className="relative z-10 flex flex-col items-center gap-3 px-8 text-center">
          <span className="grid size-14 place-items-center rounded-full border border-white/15 bg-white/[0.08] backdrop-blur-sm">
            <IconVideo className="text-volt size-7" strokeWidth={1.5} />
          </span>
          <span className="text-volt text-xs font-bold tracking-[0.14em] uppercase">Em desenvolvimento</span>
          <p className="font-display text-lg font-bold tracking-tight text-white">Conteúdo em breve</p>
          <p className="max-w-xs text-sm text-white/70">Os vídeos serão integrados na próxima fase da plataforma.</p>
        </div>

        <div className="absolute bottom-4 left-5 z-10">
          <p className="text-volt text-[10px] font-bold tracking-[0.14em] uppercase">Módulo atual</p>
          <p className="text-base font-semibold text-white">{currentModuleTitle}</p>
        </div>
      </div>
    </div>
  );
}
