"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { CourseCard } from "@/features/courses/components/course-card";
import { useCourses, useLearningPaths } from "@/features/courses/hooks/use-courses";
import { MOCK_COURSES, MOCK_LEARNING_PATHS } from "@/features/courses/data/mock-courses";
import type { Course } from "@/features/courses/types";
import { IconRoute, IconBook2, IconTarget, IconArrowRight } from "@tabler/icons-react";

export default function TrilhasPage() {
  const { data: dbCourses, isLoading: coursesLoading } = useCourses();
  const { data: dbPaths, isLoading: pathsLoading } = useLearningPaths();

  const isLoading = coursesLoading || pathsLoading;

  // Use real data if available, fall back to mocks
  const courses: Course[] = dbCourses && dbCourses.length > 0 ? dbCourses : MOCK_COURSES;

  // Build learning path + course list
  const paths =
    dbPaths && dbPaths.length > 0
      ? dbPaths.map((p) => {
          const pathCourses = p.courseIds.map((id) => courses.find((c) => c.id === id)).filter(Boolean) as Course[];
          const completedCourses = pathCourses.filter((c) => c.status === "concluido").length;
          const progress =
            pathCourses.length > 0
              ? Math.round(pathCourses.reduce((acc, c) => acc + (c.progress ?? 0), 0) / pathCourses.length)
              : 0;
          return {
            id: p.id,
            title: p.title,
            description: p.description,
            totalCourses: pathCourses.length,
            completedCourses,
            progress,
            courses: pathCourses,
          };
        })
      : MOCK_LEARNING_PATHS.map((p) => {
          const MOCK_PATH_COURSE_IDS: Record<string, string[]> = {
            lp1: ["c1", "c2"],
            lp2: ["c3", "c4", "c5", "c6"],
            lp3: ["c7", "c8"],
          };
          const courseIds = MOCK_PATH_COURSE_IDS[p.id] ?? [];
          const pathCourses = courseIds.map((id) => courses.find((c) => c.id === id)).filter(Boolean) as Course[];
          return { ...p, courses: pathCourses };
        });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Trilhas de Aprendizado"
          description="Caminhos estruturados para desenvolver competências completas"
        />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Trilhas de Aprendizado"
        description="Caminhos estruturados para desenvolver competências completas"
      />

      {paths.map((path) => (
        <div key={path.id} className="space-y-4">
          <Card className="gap-0 overflow-hidden py-0">
            <div className="border-b border-black/[0.04] bg-gradient-to-r from-[#BAF241]/10 to-black/5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IconRoute className="size-5 text-[#BAF241]" />
                    <h2 className="text-lg font-semibold">{path.title}</h2>
                  </div>
                  <p className="text-muted-foreground max-w-lg text-sm">{path.description}</p>
                  <div className="flex items-center gap-4 pt-1">
                    <Badge variant="secondary" className="gap-1">
                      <IconBook2 className="size-3" />
                      {path.totalCourses} cursos
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <IconTarget className="size-3" />
                      {path.completedCourses} concluídos
                    </Badge>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-bold">{path.progress}%</p>
                  <Progress value={path.progress} className="mt-1 h-2 w-32" />
                </div>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {path.courses.map((course, idx) =>
                  course ? (
                    <div key={course.id} className="relative">
                      {idx > 0 && (
                        <div className="absolute top-1/2 -left-2 hidden -translate-y-1/2 lg:block">
                          <IconArrowRight className="text-muted-foreground size-4" />
                        </div>
                      )}
                      <CourseCard course={course} />
                    </div>
                  ) : null,
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
