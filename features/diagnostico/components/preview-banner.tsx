"use client";

import { IconLock, IconArrowRight } from "@tabler/icons-react";
import { usePreviewStore } from "../stores/preview-store";

export function PreviewBanner() {
  const isPreview = usePreviewStore((s) => s.isPreview);
  const openPricing = usePreviewStore((s) => s.openPricing);

  if (!isPreview) return null;

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-4 bg-[#000000] px-4 py-2.5 text-white md:px-6">
      <div className="flex items-center gap-2">
        <IconLock className="size-3.5 text-[#BAF241]" />
        <span className="text-[10px] font-semibold tracking-[1px] uppercase">
          Modo preview — navegue livremente para conhecer a plataforma
        </span>
      </div>
      <button
        onClick={openPricing}
        className="inline-flex items-center gap-1.5 rounded-md bg-[#BAF241] px-4 py-1.5 text-[9px] font-bold tracking-[1px] text-[#000000] uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        Desbloquear acesso
        <IconArrowRight className="size-3" />
      </button>
    </div>
  );
}
