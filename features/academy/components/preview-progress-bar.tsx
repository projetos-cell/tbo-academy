"use client";

import { IconCompass, IconArrowRight, IconSparkles } from "@tabler/icons-react";
import { usePreviewSession } from "@/features/academy/hooks/use-preview-session";
import { usePreviewStore } from "@/features/diagnostico/stores/preview-store";
import { cn } from "@/lib/utils";

export function PreviewProgressBar() {
  const isPreview = usePreviewStore((s) => s.isPreview);
  const openPricing = usePreviewStore((s) => s.openPricing);
  const { freeContentCount, exploredCount, diagnosticComplete, unlockedCourseIds } = usePreviewSession();

  if (!isPreview) return null;

  // Total explorable items in preview = unlocked + 5 teasers
  const totalFreeItems = freeContentCount + 5;
  const progressPct = Math.min(100, Math.round((exploredCount / totalFreeItems) * 100));

  return (
    <div className="sticky top-0 z-50 border-b border-[#BAF241]/10 bg-[#000000] px-4 py-2 md:px-6">
      <div className="flex items-center justify-between gap-4">
        {/* Left: status */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#BAF241]/10">
            <IconCompass className="size-3.5 text-[#BAF241]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold tracking-[1px] text-[#BAF241] uppercase">Modo Discovery</span>
              {diagnosticComplete && (
                <span className="text-[8px] font-medium text-white/40">
                  · {freeContentCount} aula{freeContentCount !== 1 ? "s" : ""} grátis desbloqueada
                  {freeContentCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: micro progress */}
        <div className="hidden items-center gap-2 sm:flex">
          {unlockedCourseIds.map((id, i) => (
            <div
              key={id}
              className={cn(
                "size-1.5 rounded-full transition-colors",
                i < exploredCount ? "bg-[#BAF241]" : "bg-white/15",
              )}
            />
          ))}
          {exploredCount > 0 && (
            <span className="ml-1 text-[8px] text-white/30">
              {exploredCount} explorado{exploredCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Right: CTA */}
        <button
          onClick={openPricing}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#BAF241] px-3.5 py-1.5 text-[8px] font-bold tracking-[1px] text-[#000000] uppercase transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(184,247,36,0.2)]"
        >
          <IconSparkles className="size-3" />
          Desbloquear tudo
          <IconArrowRight className="size-2.5" />
        </button>
      </div>

      {/* Progress line */}
      <div className="mt-1.5 h-[2px] overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-[#BAF241]/50 transition-all duration-700 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}
