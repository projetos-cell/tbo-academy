"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconVideo } from "@tabler/icons-react"

const CATEGORY_GRADIENTS: Record<string, string> = {
  Design: "from-[#BAF241] to-emerald-600",
  Branding: "from-amber-500 to-orange-600",
  "Marketing Digital": "from-blue-500 to-cyan-600",
  Copywriting: "from-emerald-500 to-teal-600",
  "Motion Graphics": "from-pink-500 to-rose-600",
  "UI/UX": "from-teal-500 to-cyan-600",
  "Social Media": "from-pink-500 to-rose-600",
  Gestao: "from-slate-500 to-gray-600",
}

interface CourseVideoPlayerProps {
  category: string
  currentModuleTitle: string
  videoUrl?: string
}

export function CourseVideoPlayer({
  category,
  currentModuleTitle,
  videoUrl,
}: CourseVideoPlayerProps) {
  const gradient = CATEGORY_GRADIENTS[category] ?? "from-gray-500 to-gray-600"

  if (videoUrl) {
    return (
      <Card className="overflow-hidden rounded-2xl border-0 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
        <div className="relative aspect-video w-full">
          <iframe
            src={videoUrl}
            title={currentModuleTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div className="bg-black px-5 py-3">
          <p className="text-sm font-semibold text-white truncate">{currentModuleTitle}</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-0">
      <div
        className={`relative flex aspect-video items-center justify-center bg-gradient-to-br ${gradient}`}
      >
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 flex flex-col items-center gap-3 text-center px-8">
          <IconVideo className="size-12 text-white/70" />
          <p className="text-white font-semibold text-lg">Conteúdo em breve</p>
          <p className="text-white/70 text-sm max-w-xs">
            Os vídeos serão integrados na próxima fase da plataforma.
          </p>
          <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/20">
            Em desenvolvimento
          </Badge>
        </div>

        <div className="absolute bottom-4 left-4 z-10">
          <p className="text-sm text-white/80">Módulo atual</p>
          <p className="text-lg font-semibold text-white">{currentModuleTitle}</p>
        </div>
      </div>
    </Card>
  )
}
