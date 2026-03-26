"use client";

import { useState } from "react";
import { IconLock, IconPlayerPlay } from "@tabler/icons-react";
import { useAcademyEntitlement } from "@/features/academy/hooks/use-academy-entitlement";
import { usePreviewStore } from "@/features/diagnostico/stores/preview-store";
import { usePreviewSession } from "@/features/academy/hooks/use-preview-session";
import { PricingDialog } from "@/features/diagnostico/components/pricing-dialog";
import { cn } from "@/lib/utils";
import type { ProductSlug } from "@/features/academy/hooks/use-academy-entitlement";

type PreviewLevel = "none" | "teaser" | "full";

interface ContentGateProps {
  children: React.ReactNode;
  requiredProduct?: ProductSlug;
  /** Custom label shown on the upgrade overlay */
  label?: string;
  /** Content to show in teaser mode (replaces blurred children) */
  previewContent?: React.ReactNode;
  /** Preview level for guests: none=blur, teaser=show preview, full=show children */
  previewLevel?: PreviewLevel;
  /** Course ID — used to check if unlocked in preview mode */
  courseId?: string;
}

const PRODUCT_TIER: Record<ProductSlug, number> = {
  diagnostic: 0,
  essencial: 1,
  profissional: 2,
  enterprise: 3,
};

export function ContentGate({
  children,
  requiredProduct = "essencial",
  label = "Desbloqueie este conteúdo",
  previewContent,
  previewLevel = "none",
  courseId,
}: ContentGateProps) {
  const [pricingOpen, setPricingOpen] = useState(false);
  const { product, isLoading } = useAcademyEntitlement();
  const isPreview = usePreviewStore((s) => s.isPreview);
  const { isCourseUnlocked, trackEvent } = usePreviewSession();

  // While loading, render children transparently (skeleton handled by parent)
  if (isLoading) {
    return <>{children}</>;
  }

  const hasAccess = PRODUCT_TIER[product] >= PRODUCT_TIER[requiredProduct];

  // ─── Full access: render children ─────────────────────────────
  if (hasAccess) {
    return <>{children}</>;
  }

  // ─── Preview mode: check unlocked courses ─────────────────────
  if (isPreview && courseId && isCourseUnlocked(courseId)) {
    // Course is unlocked in preview → show full content
    return <>{children}</>;
  }

  // ─── Preview mode: teaser level ───────────────────────────────
  if (isPreview && previewLevel === "teaser" && previewContent) {
    return <>{previewContent}</>;
  }

  // ─── Preview mode: full preview level (no course match) ───────
  if (isPreview && previewLevel === "full") {
    return <>{children}</>;
  }

  // ─── No access: show blurred content with lock overlay ────────
  return (
    <>
      <div className="relative overflow-hidden rounded-xl">
        {/* Blurred preview */}
        <div className={cn("pointer-events-none select-none", "opacity-60 blur-sm saturate-50")} aria-hidden="true">
          {children}
        </div>

        {/* Lock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-white/60 backdrop-blur-[2px] dark:bg-zinc-900/60">
          <div className="flex max-w-xs flex-col items-center gap-3 px-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#000000] text-[#BAF241]">
              <IconLock className="size-5" />
            </div>
            <p className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{label}</p>
            <p className="text-xs leading-relaxed text-zinc-500">
              Este conteúdo está disponível a partir do plano Essencial.
            </p>
            <button
              onClick={() => {
                if (isPreview) {
                  trackEvent("pricing_viewed", { from: "content_gate", courseId });
                }
                setPricingOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[#BAF241] px-5 py-2.5 text-[11px] font-semibold tracking-[1.5px] text-[#000000] uppercase transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(184,247,36,0.25)]"
            >
              Ver planos →
            </button>
          </div>
        </div>
      </div>

      <PricingDialog open={pricingOpen} onOpenChange={setPricingOpen} />
    </>
  );
}
