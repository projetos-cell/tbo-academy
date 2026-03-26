"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/shared/page-header"
import { useLeaderboard } from "@/features/courses/hooks/use-leaderboard"
import {
  IconTrophy,
  IconMedal,
  IconFlame,
  IconTarget,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

const RANK_CONFIG = [
  { color: "text-amber-500", bg: "bg-[#BAF241]", icon: "🥇" },
  { color: "text-gray-400", bg: "bg-black", icon: "🥈" },
  { color: "text-orange-600", bg: "bg-[#BAF241]", icon: "🥉" },
]

export default function RankingPage() {
  const { leaderboard, isLoading } = useLeaderboard()
  const topThree = leaderboard.slice(0, 3)
  const maxPoints = leaderboard[0]?.points ?? 1

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ranking"
        description="Os maiores aprendizes da TBO Academy"
      />

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4">
        {isLoading && [0, 1, 2].map((i) => (
          <Skeleton key={i} className={cn("rounded-2xl h-44", i === 1 && "-mt-4 h-52")} />
        ))}
        {!isLoading && [1, 0, 2].map((idx) => {
          const entry = topThree[idx]
          if (!entry) return <div key={idx} />
          const config = RANK_CONFIG[idx]
          const isFirst = idx === 0

          return (
            <div
              key={entry.id}
              className={cn(
                "relative overflow-hidden rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
                isFirst
                  ? "bg-[#BAF241] text-black -mt-4"
                  : "bg-black text-white"
              )}
            >
              <div className={cn("absolute -right-4 -top-4 size-24 rounded-full opacity-[0.06]", isFirst ? "bg-black" : "bg-[#BAF241]")} />
              <span className="text-3xl mb-2 block">{config?.icon}</span>
              <Avatar className={cn("size-16 mb-2 mx-auto", isFirst && "size-20")}>
                <AvatarFallback className={cn("text-lg font-bold", isFirst ? "bg-black/10" : "bg-white/10")}>
                  {entry.avatar}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold">{entry.name}</h3>
              <p className="text-2xl font-bold mt-1">
                {entry.points.toLocaleString("pt-BR")}
              </p>
              <p className={cn("text-xs", isFirst ? "text-black/50" : "text-white/50")}>pontos</p>
            </div>
          )
        })}
      </div>

      {/* Full list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <IconTrophy className="size-4 text-amber-500" />
            Classificação Completa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading && Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg p-3">
              <Skeleton className="w-6 h-4" />
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-1.5 w-full" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
          {!isLoading && leaderboard.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 rounded-lg p-3 hover:bg-muted/50 transition-colors"
            >
              <span className="w-6 text-center text-sm font-bold text-muted-foreground">
                {entry.rank}
              </span>
              <Avatar>
                <AvatarFallback>{entry.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{entry.name}</p>
                <Progress
                  value={(entry.points / maxPoints) * 100}
                  className="h-1.5 mt-1"
                />
              </div>
              <Badge variant="secondary" className="shrink-0">
                {entry.points.toLocaleString("pt-BR")} pts
              </Badge>
            </div>
          ))}
          {!isLoading && leaderboard.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum dado de ranking disponível ainda.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Stats cards — Lumin style */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Sua posição", sub: "#4 no ranking geral", icon: IconMedal, variant: "lime" as const },
          { label: "Sequência atual", sub: "12 dias seguidos", icon: IconFlame, variant: "black" as const },
          { label: "Meta semanal", sub: "3/5 módulos concluídos", icon: IconTarget, variant: "lime" as const },
        ].map((stat) => {
          const Icon = stat.icon
          const isBlack = stat.variant === "black"
          return (
            <div
              key={stat.label}
              className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] group ${isBlack ? "bg-black text-white" : "bg-[#BAF241] text-black"}`}
            >
              <div className={`absolute -right-3 -top-3 size-20 rounded-full opacity-[0.07] transition-transform duration-500 group-hover:scale-125 ${isBlack ? "bg-[#BAF241]" : "bg-black"}`} />
              <div className={`inline-flex items-center justify-center rounded-xl p-2.5 mb-3 ${isBlack ? "bg-[#BAF241] text-black" : "bg-black text-[#BAF241]"}`}>
                <Icon className="size-5" strokeWidth={2.2} />
              </div>
              <p className="text-sm font-semibold">{stat.label}</p>
              <p className={`text-xs mt-0.5 ${isBlack ? "text-white/60" : "text-black/50"}`}>{stat.sub}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
