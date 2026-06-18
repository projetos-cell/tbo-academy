"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { useLeaderboard } from "@/features/courses/hooks/use-leaderboard";
import { IconTrophy, IconMedal, IconFlame, IconTarget } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const RANK_CONFIG = [{ label: "1º lugar" }, { label: "2º lugar" }, { label: "3º lugar" }];

export default function RankingPage() {
  const { leaderboard, isLoading } = useLeaderboard();
  const topThree = leaderboard.slice(0, 3);
  const maxPoints = leaderboard[0]?.points ?? 1;

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Comunidade" title="Ranking" description="Os maiores aprendizes da TBO Academy" />

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4">
        {isLoading &&
          [0, 1, 2].map((i) => <Skeleton key={i} className={cn("h-48 rounded-2xl", i === 1 && "-mt-4 h-56")} />)}
        {!isLoading &&
          [1, 0, 2].map((idx) => {
            const entry = topThree[idx];
            if (!entry) return <div key={idx} />;
            const config = RANK_CONFIG[idx];
            const isFirst = idx === 0;

            return (
              <div
                key={entry.id}
                className={cn(
                  "group relative overflow-hidden rounded-2xl p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,11,11,0.10)]",
                  isFirst
                    ? "from-forest-800 to-forest-950 -mt-4 bg-gradient-to-br text-white"
                    : "bg-card text-ink border border-black/[0.06]",
                )}
              >
                {/* glow volt no pódio campeão / acento sutil nos demais */}
                {isFirst ? (
                  <div
                    className="pointer-events-none absolute -top-12 -right-12 size-44 rounded-full blur-2xl"
                    style={{ background: "radial-gradient(circle, rgba(186,242,65,.16), transparent 62%)" }}
                  />
                ) : (
                  <div className="bg-volt/10 pointer-events-none absolute -top-4 -right-4 size-24 rounded-full" />
                )}

                <span
                  className={cn(
                    "relative inline-flex items-center justify-center text-xs font-bold tracking-[0.14em] uppercase",
                    isFirst ? "text-volt" : "text-forest-500",
                  )}
                >
                  {config?.label}
                </span>

                <Avatar
                  className={cn(
                    "relative mx-auto mt-3 mb-2 size-16 ring-2",
                    isFirst ? "ring-volt size-20" : "ring-volt/40",
                  )}
                >
                  <AvatarFallback
                    className={cn("text-lg font-bold", isFirst ? "bg-white/10 text-white" : "bg-forest-900 text-volt")}
                  >
                    {entry.avatar}
                  </AvatarFallback>
                </Avatar>

                <h3 className="font-display relative font-bold tracking-tight">{entry.name}</h3>
                <p
                  className={cn(
                    "font-display relative mt-1 text-3xl font-bold tracking-tight",
                    isFirst ? "text-volt" : "text-ink",
                  )}
                >
                  {entry.points.toLocaleString("pt-BR")}
                </p>
                <p className={cn("relative text-xs", isFirst ? "text-white/55" : "text-[var(--tbo-gray-500)]")}>
                  pontos
                </p>
              </div>
            );
          })}
      </div>

      {/* Full list */}
      <div className="bg-card overflow-hidden rounded-2xl border border-black/[0.06] shadow-sm">
        <div className="flex items-center gap-2 border-b border-black/[0.06] px-5 py-4">
          <span className="bg-volt text-ink grid size-7 place-items-center rounded-full">
            <IconTrophy className="size-4" />
          </span>
          <span className="text-forest-500 text-xs font-bold tracking-[0.14em] uppercase">Classificação Completa</span>
        </div>
        <div className="space-y-1 p-3">
          {isLoading &&
            Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl p-3">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-1.5 w-full" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          {!isLoading &&
            leaderboard.map((entry) => {
              const isPodium = entry.rank <= 3;
              return (
                <div
                  key={entry.id}
                  className="hover:bg-paper-off flex items-center gap-4 rounded-xl p-3 transition-colors"
                >
                  <span
                    className={cn(
                      "font-display w-7 flex-none text-center text-sm font-bold tracking-tight",
                      isPodium ? "text-forest-600" : "text-[var(--tbo-gray-500)]",
                    )}
                  >
                    {entry.rank}
                  </span>
                  <Avatar>
                    <AvatarFallback className={cn(isPodium && "bg-forest-900 text-volt")}>
                      {entry.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{entry.name}</p>
                    <div className="pbar mt-1.5">
                      <span style={{ width: `${(entry.points / maxPoints) * 100}%` }} />
                    </div>
                  </div>
                  <span className="bg-paper-off shrink-0 rounded-full border border-black/[0.06] px-3 py-1 text-xs font-bold">
                    <span className="font-display tracking-tight">{entry.points.toLocaleString("pt-BR")}</span>
                    <span className="text-[var(--tbo-gray-500)]"> pts</span>
                  </span>
                </div>
              );
            })}
          {!isLoading && leaderboard.length === 0 && (
            <p className="py-6 text-center text-sm text-[var(--tbo-gray-500)]">
              Nenhum dado de ranking disponível ainda.
            </p>
          )}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Sua posição", sub: "#4 no ranking geral", icon: IconMedal, variant: "volt" as const },
          { label: "Sequência atual", sub: "12 dias seguidos", icon: IconFlame, variant: "forest" as const },
          { label: "Meta semanal", sub: "3/5 módulos concluídos", icon: IconTarget, variant: "volt" as const },
        ].map((stat) => {
          const Icon = stat.icon;
          const isForest = stat.variant === "forest";
          return (
            <div
              key={stat.label}
              className={cn(
                "group relative overflow-hidden rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,11,11,0.10)]",
                isForest
                  ? "from-forest-800 to-forest-950 bg-gradient-to-br text-white"
                  : "bg-card text-ink border border-black/[0.06]",
              )}
            >
              {isForest ? (
                <div
                  className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125"
                  style={{ background: "radial-gradient(circle, rgba(186,242,65,.18), transparent 62%)" }}
                />
              ) : (
                <div className="bg-volt/10 pointer-events-none absolute -top-3 -right-3 size-20 rounded-full transition-transform duration-500 group-hover:scale-125" />
              )}
              <div
                className={cn(
                  "relative mb-3 inline-flex items-center justify-center rounded-xl p-2.5",
                  isForest ? "bg-volt text-ink" : "bg-forest-900 text-volt",
                )}
              >
                <Icon className="size-5" strokeWidth={2.2} />
              </div>
              <p className="relative text-sm font-semibold">{stat.label}</p>
              <p className={cn("relative mt-0.5 text-xs", isForest ? "text-white/60" : "text-[var(--tbo-gray-500)]")}>
                {stat.sub}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
