"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  IconBook2,
  IconFlame,
  IconClock,
  IconTrophy,
  IconArrowRight,
  IconPlayerPlay,
  IconStar,
} from "@tabler/icons-react";
import { CourseCard } from "@/features/courses/components/course-card";
import { LeaderboardCard } from "@/features/courses/components/leaderboard-card";
import { MOCK_LEADERBOARD } from "@/features/courses/data/mock-courses";
import { useCourses, useMergedLearningPaths } from "@/features/courses/hooks/use-courses";
import { usePreviewStore } from "@/features/diagnostico/stores/preview-store";
import { DiscoveryFeed } from "@/features/academy/components/discovery-feed";
import { Skeleton } from "@/components/ui/skeleton";

export default function AcademyDashboardPage() {
  const isPreview = usePreviewStore((s) => s.isPreview);

  // ─── Preview Mode: show Discovery Feed ─────────────────────
  if (isPreview) {
    return <DiscoveryFeed />;
  }

  // ─── Normal authenticated dashboard ────────────────────────
  return <AuthenticatedDashboard />;
}

function AuthenticatedDashboard() {
  const { data: courses = [], isLoading } = useCourses();
  const learningPaths = useMergedLearningPaths(courses);

  const inProgressCourses = useMemo(() => courses.filter((c) => c.status === "em_andamento"), [courses]);

  const totalHours = useMemo(() => {
    const completed = courses.filter((c) => c.status === "concluido");
    return completed.reduce((acc, c) => {
      const match = c.duration.match(/(\d+)h/);
      return acc + (match ? parseInt(match[1], 10) : 0);
    }, 0);
  }, [courses]);

  const streak = 12; // mock streak

  return (
    <div className="space-y-6">
      {/* Welcome hero — Lumin style */}
      <div className="relative overflow-hidden rounded-2xl bg-black p-6 text-white md:p-8">
        <div className="absolute -top-10 -right-10 size-48 rounded-full bg-[#BAF241]/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-6 size-32 rounded-full bg-[#BAF241]/5 blur-xl" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Badge className="border-0 bg-[#BAF241] font-semibold text-black">
              <IconFlame className="mr-1 size-3" />
              {streak} dias seguidos
            </Badge>
            <h1 className="text-2xl font-bold md:text-3xl">Bem-vindo à TBO Academy</h1>
            <p className="max-w-lg text-sm text-white/60">
              Continue de onde parou. Você está a caminho de dominar novas habilidades criativas.
            </p>
          </div>
          <div className="flex gap-3">
            {inProgressCourses[0] && (
              <Button
                asChild
                className="rounded-xl bg-[#BAF241] font-semibold text-black transition-all hover:bg-[#BAF241]/90 hover:shadow-[0_4px_20px_rgba(186,242,65,0.3)]"
              >
                <Link href={`/cursos/${inProgressCourses[0].id}`}>
                  <IconPlayerPlay className="mr-1 size-4" />
                  Continuar aprendendo
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Quick stats — Lumin alternating black/lime */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { value: inProgressCourses.length, label: "Em andamento", icon: IconBook2, variant: "black" as const },
          {
            value: courses.filter((c) => c.status === "concluido").length,
            label: "Concluídos",
            icon: IconTrophy,
            variant: "lime" as const,
          },
          { value: `${totalHours}h`, label: "Horas de estudo", icon: IconClock, variant: "black" as const },
          { value: streak, label: "Dias de sequência", icon: IconFlame, variant: "lime" as const },
        ].map((stat) => {
          const Icon = stat.icon;
          const isBlack = stat.variant === "black";
          return (
            <div
              key={stat.label}
              className={`group relative cursor-default overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] ${isBlack ? "bg-black text-white" : "bg-[#BAF241] text-black"}`}
            >
              <div
                className={`absolute -top-3 -right-3 size-20 rounded-full opacity-[0.07] transition-transform duration-500 group-hover:scale-125 ${isBlack ? "bg-[#BAF241]" : "bg-black"}`}
              />
              <div
                className={`mb-3 inline-flex items-center justify-center rounded-xl p-2.5 ${isBlack ? "bg-[#BAF241] text-black" : "bg-black text-[#BAF241]"}`}
              >
                <Icon className="size-5" strokeWidth={2.2} />
              </div>
              <p className="text-3xl leading-none font-bold tracking-tight">{stat.value}</p>
              <p className={`mt-1 text-xs font-medium ${isBlack ? "text-white/60" : "text-black/50"}`}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Continue learning + sidebar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Continue where you left off */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Continuar aprendendo</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/meus-cursos">
                Ver todos
                <IconArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)
            ) : inProgressCourses.length === 0 ? (
              <p className="text-muted-foreground col-span-2 py-4 text-sm">
                Nenhum curso em andamento.{" "}
                <Link href="/explorar" className="underline">
                  Explorar cursos
                </Link>
              </p>
            ) : (
              inProgressCourses.map((course) => <CourseCard key={course.id} course={course} basePath="/cursos" />)
            )}
          </div>

          {/* Learning paths */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Trilhas de aprendizado</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/trilhas">
                Ver trilhas
                <IconArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>

          {learningPaths.map((path) => (
            <Card key={path.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold">{path.title}</h3>
                    <p className="text-muted-foreground text-sm">{path.description}</p>
                    <div className="flex items-center gap-4 pt-2">
                      <span className="text-muted-foreground text-xs">
                        {path.completedCourses}/{path.totalCourses} cursos
                      </span>
                      <Progress value={path.progress} className="h-1.5 max-w-[200px] flex-1" />
                      <span className="text-xs font-medium">{path.progress}%</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/trilhas">Continuar</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <LeaderboardCard entries={MOCK_LEADERBOARD} />

          {/* Recent achievement */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <IconStar className="size-4 text-amber-500" />
                Última conquista
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-lg text-white">
                  🏆
                </div>
                <div>
                  <p className="text-sm font-medium">Branding Master</p>
                  <p className="text-muted-foreground text-xs">Concluiu o curso de Branding Estratégico</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Recomendado para você</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {courses
                .filter((c) => c.status === "nao_iniciado")
                .slice(0, 3)
                .map((course) => (
                  <Link
                    key={course.id}
                    href={`/cursos/${course.id}`}
                    className="hover:bg-muted/50 flex items-center gap-3 rounded-lg p-2 transition-colors"
                  >
                    <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
                      <IconBook2 className="text-muted-foreground size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{course.title}</p>
                      <p className="text-muted-foreground text-xs">
                        {course.duration} · {course.instructor}
                      </p>
                    </div>
                  </Link>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
