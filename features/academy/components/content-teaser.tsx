"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  IconClock,
  IconLock,
  IconPlayerPlay,
  IconArrowRight,
  IconCheck,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { PricingDialog } from "@/features/diagnostico/components/pricing-dialog"

interface ContentTeaserProps {
  /** Course/module title */
  title: string
  /** Category for visual theming */
  category: string
  /** Total duration of full content */
  duration: string
  /** Key takeaways from the content */
  takeaways: string[]
  /** Summary text (2-3 sentences) */
  summary: string
  /** Whether the teaser video has been "watched" */
  teaserWatched?: boolean
  /** Callback when teaser play is clicked */
  onTeaserPlay?: () => void
}

const CATEGORY_COLORS: Record<string, { gradient: string; accent: string }> = {
  Design: { gradient: "from-violet-500/20 to-violet-600/5", accent: "text-violet-500" },
  Branding: { gradient: "from-emerald-500/20 to-emerald-600/5", accent: "text-emerald-500" },
  "Marketing Digital": { gradient: "from-blue-500/20 to-blue-600/5", accent: "text-blue-500" },
  Copywriting: { gradient: "from-amber-500/20 to-amber-600/5", accent: "text-amber-500" },
  "Motion Graphics": { gradient: "from-orange-500/20 to-orange-600/5", accent: "text-orange-500" },
  "UI/UX": { gradient: "from-pink-500/20 to-pink-600/5", accent: "text-pink-500" },
  "Social Media": { gradient: "from-cyan-500/20 to-cyan-600/5", accent: "text-cyan-500" },
  Gestao: { gradient: "from-zinc-500/20 to-zinc-600/5", accent: "text-zinc-500" },
}

const DEFAULT_COLORS = { gradient: "from-zinc-500/20 to-zinc-600/5", accent: "text-zinc-500" }

export function ContentTeaser({
  title,
  category,
  duration,
  takeaways,
  summary,
  teaserWatched = false,
  onTeaserPlay,
}: ContentTeaserProps) {
  const [pricingOpen, setPricingOpen] = useState(false)
  const colors = CATEGORY_COLORS[category] ?? DEFAULT_COLORS

  return (
    <>
      <div className="space-y-4 animate-in fade-in duration-300">
        {/* ─── Teaser Video Placeholder ────────────────────────── */}
        <div
          className={cn(
            "relative overflow-hidden rounded-xl bg-gradient-to-br",
            colors.gradient,
            "aspect-video flex items-center justify-center group cursor-pointer"
          )}
          onClick={onTeaserPlay}
        >
          {/* Simulated video timeline */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-black/10">
            <div
              className={cn(
                "h-full bg-[#b8f724] transition-all duration-500",
                teaserWatched ? "w-full" : "w-0"
              )}
            />
          </div>

          {/* Fade overlay at end */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Play button */}
          <div className="relative flex flex-col items-center gap-3">
            <div className="flex size-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
              <IconPlayerPlay className="size-7 text-[#0a1f1d] ml-1" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-white drop-shadow-md">
                {teaserWatched ? "Teaser assistido" : "Assistir teaser"}
              </p>
              <p className="text-[10px] text-white/70 drop-shadow-md">
                2 minutos · Conteúdo completo: {duration}
              </p>
            </div>
          </div>

          {/* Teaser badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm text-[8px]">
              <IconClock className="size-2.5 mr-1" />
              Teaser · 2 min
            </Badge>
          </div>

          {/* Lock indicator */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm text-[8px]">
              <IconLock className="size-2.5 mr-1" />
              Preview
            </Badge>
          </div>
        </div>

        {/* ─── Content Summary ─────────────────────────────────── */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold tracking-tight mb-1">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {summary}
              </p>
            </div>

            {/* Key Takeaways */}
            {takeaways.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-semibold tracking-[2px] uppercase text-muted-foreground">
                  O que você vai aprender
                </h4>
                <div className="space-y-1.5">
                  {takeaways.map((takeaway, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <IconCheck className="size-3.5 shrink-0 mt-0.5 text-[#b8f724]" />
                      <span className="text-[11px] text-foreground leading-snug">
                        {takeaway}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unlock CTA */}
            <div className="flex items-center gap-3 rounded-lg bg-[#b8f724]/5 border border-[#b8f724]/20 p-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0a1f1d]">
                <IconLock className="size-3.5 text-[#b8f724]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold tracking-tight">
                  Quer o conteúdo completo?
                </p>
                <p className="text-[9px] text-muted-foreground">
                  Desbloqueie todas as aulas, certificados e mentorias.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setPricingOpen(true)}
                className="bg-[#b8f724] text-[#0a1f1d] hover:bg-[#b8f724]/90 text-[9px] shrink-0"
              >
                Ver planos
                <IconArrowRight className="size-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <PricingDialog open={pricingOpen} onOpenChange={setPricingOpen} />
    </>
  )
}
