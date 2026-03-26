"use client";

import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { IconBook, IconUsers, IconBookmark, IconMessageCircle, IconCheckbox, IconTrophy } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "@/features/admin/components/stats-card";
import { useAdminAnalytics } from "@/features/admin/hooks/use-admin-analytics";
import type { DaySeries } from "@/features/admin/hooks/use-admin-analytics";

const PERIODS = [
  { label: "7 dias", value: 7 },
  { label: "30 dias", value: 30 },
  { label: "90 dias", value: 90 },
] as const;

function formatDate(dateStr: string, period: number) {
  const d = new Date(dateStr + "T00:00:00");
  if (period <= 7) {
    return d.toLocaleDateString("pt-BR", { weekday: "short" });
  }
  if (period <= 30) {
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  }
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card rounded-lg border px-3 py-2 text-sm shadow-sm">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-semibold">
          {p.value} {p.name}
        </p>
      ))}
    </div>
  );
}

function EnrollmentChart({ data, period, loading }: { data: DaySeries[]; period: number; loading: boolean }) {
  if (loading) return <Skeleton className="h-48 w-full rounded-lg" />;
  const chartData = data.map((d) => ({ ...d, label: formatDate(d.date, period) }));
  return (
    <ResponsiveContainer width="100%" height={192}>
      <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          interval={period <= 7 ? 0 : period <= 30 ? 4 : 13}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<ChartTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          name="matrículas"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function CompletionChart({ data, period, loading }: { data: DaySeries[]; period: number; loading: boolean }) {
  if (loading) return <Skeleton className="h-48 w-full rounded-lg" />;
  const chartData = data.map((d) => ({ ...d, label: formatDate(d.date, period) }));
  return (
    <ResponsiveContainer width="100%" height={192}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          interval={period <= 7 ? 0 : period <= 30 ? 4 : 13}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<ChartTooltip />} />
        <Bar dataKey="value" name="aulas concluídas" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function AnalyticsOverview({ mini = false }: { mini?: boolean }) {
  const [period, setPeriod] = useState<7 | 30 | 90>(30);
  const { data, isLoading } = useAdminAnalytics(period);

  const overview = data?.overview;
  const periodLabel = `vs. ${period} dias anteriores`;

  return (
    <div className="space-y-6">
      {/* Period selector */}
      {!mini && (
        <div className="bg-muted/40 flex w-fit items-center gap-1 rounded-lg p-1">
          {PERIODS.map((p) => (
            <Button
              key={p.value}
              variant={period === p.value ? "default" : "ghost"}
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => setPeriod(p.value as 7 | 30 | 90)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      )}

      {/* Stats cards */}
      <div
        className={`grid gap-4 ${mini ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"}`}
      >
        <StatsCard
          label="Cursos ativos"
          value={overview?.totalCourses ?? 0}
          icon={<IconBook className="size-5" />}
          loading={isLoading}
        />
        <StatsCard
          label="Usuários"
          value={overview?.totalUsers ?? 0}
          icon={<IconUsers className="size-5" />}
          loading={isLoading}
        />
        <StatsCard
          label="Matrículas totais"
          value={overview?.totalEnrollments ?? 0}
          icon={<IconBookmark className="size-5" />}
          loading={isLoading}
        />
        <StatsCard
          label={`Novas matrículas`}
          value={overview?.recentEnrollments ?? 0}
          icon={<IconTrophy className="size-5" />}
          trend={overview?.enrollmentTrend}
          trendLabel={periodLabel}
          loading={isLoading}
        />
        <StatsCard
          label="Aulas concluídas"
          value={overview?.completedLessons ?? 0}
          icon={<IconCheckbox className="size-5" />}
          trend={overview?.completionTrend}
          trendLabel={periodLabel}
          loading={isLoading}
        />
        <StatsCard
          label="Comentários pendentes"
          value={overview?.pendingComments ?? 0}
          icon={<IconMessageCircle className="size-5" />}
          loading={isLoading}
        />
      </div>

      {/* Charts — hidden in mini mode */}
      {!mini && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Enrollment line chart */}
          <div className="bg-card space-y-3 rounded-xl border p-5">
            <div>
              <h3 className="text-sm font-semibold">Novas Matrículas</h3>
              <p className="text-muted-foreground text-xs">Últimos {period} dias</p>
            </div>
            <EnrollmentChart data={data?.enrollmentSeries ?? []} period={period} loading={isLoading} />
          </div>

          {/* Completion bar chart */}
          <div className="bg-card space-y-3 rounded-xl border p-5">
            <div>
              <h3 className="text-sm font-semibold">Aulas Concluídas</h3>
              <p className="text-muted-foreground text-xs">Últimos {period} dias</p>
            </div>
            <CompletionChart data={data?.completionSeries ?? []} period={period} loading={isLoading} />
          </div>
        </div>
      )}

      {/* Top courses */}
      {!mini && (data?.topCourses?.length ?? 0) > 0 && (
        <div className="bg-card space-y-4 rounded-xl border p-5">
          <div>
            <h3 className="text-sm font-semibold">Cursos Mais Acessados</h3>
            <p className="text-muted-foreground text-xs">Últimos {period} dias — por número de matrículas</p>
          </div>
          <div className="space-y-3">
            {data!.topCourses.map((course, i) => {
              const max = data!.topCourses[0].count;
              const pct = max > 0 ? (course.count / max) * 100 : 0;
              return (
                <div key={course.id} className="flex items-center gap-3">
                  <span className="text-muted-foreground w-4 text-right text-xs font-semibold">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{course.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground w-12 text-right text-xs tabular-nums">
                        {course.count} matr.
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
