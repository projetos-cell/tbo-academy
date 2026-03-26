"use client";

import { IconTrendingUp, IconTrendingDown, IconMinus } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  trend?: number; // percentage change vs previous period
  trendLabel?: string;
  loading?: boolean;
  format?: "number" | "integer";
}

function TrendBadge({ trend, label }: { trend: number; label?: string }) {
  const isUp = trend > 0;
  const isFlat = trend === 0;
  const color = isFlat ? "text-muted-foreground" : isUp ? "text-emerald-600" : "text-red-500";

  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${color}`}>
      {isFlat ? (
        <IconMinus className="size-3" />
      ) : isUp ? (
        <IconTrendingUp className="size-3" />
      ) : (
        <IconTrendingDown className="size-3" />
      )}
      {isFlat ? "Estável" : `${isUp ? "+" : ""}${trend}%`}
      {label && <span className="text-muted-foreground ml-0.5 font-normal">{label}</span>}
    </span>
  );
}

export function StatsCard({ label, value, icon, trend, trendLabel, loading }: StatsCardProps) {
  return (
    <div className="bg-card flex flex-col gap-3 rounded-xl border p-5">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm font-medium">{label}</span>
        <span className="text-muted-foreground/60">{icon}</span>
      </div>
      {loading ? (
        <>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-16" />
        </>
      ) : (
        <>
          <span className="text-3xl font-bold tracking-tight tabular-nums">
            {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
          </span>
          {trend !== undefined && <TrendBadge trend={trend} label={trendLabel} />}
        </>
      )}
    </div>
  );
}
