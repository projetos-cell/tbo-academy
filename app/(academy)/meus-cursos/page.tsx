"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { CourseCard } from "@/features/courses/components/course-card";
import { EmptyState } from "@/components/shared";
import { useCourses } from "@/features/courses/hooks/use-courses";
import { IconBook2 } from "@tabler/icons-react";

function CoursesGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-72 w-full rounded-[18px]" />
      ))}
    </div>
  );
}

export default function MeusCursosPage() {
  const router = useRouter();
  const { data: dbCourses, isLoading } = useCourses();
  const courses = useMemo(() => dbCourses ?? [], [dbCourses]);

  const inProgress = useMemo(() => courses.filter((c) => c.status === "em_andamento"), [courses]);
  const completed = useMemo(() => courses.filter((c) => c.status === "concluido"), [courses]);
  const notStarted = useMemo(() => courses.filter((c) => c.status === "nao_iniciado"), [courses]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Aprendizado" title="Meus Cursos" description="Acompanhe seu progresso em todos os cursos" />

      <Tabs defaultValue="em_andamento" className="space-y-6">
        <TabsList>
          <TabsTrigger value="em_andamento">Em Andamento ({inProgress.length})</TabsTrigger>
          <TabsTrigger value="concluidos">Concluídos ({completed.length})</TabsTrigger>
          <TabsTrigger value="salvos">Salvos ({notStarted.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="em_andamento">
          {isLoading ? (
            <CoursesGridSkeleton />
          ) : inProgress.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inProgress.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={IconBook2}
              title="Nenhum curso em andamento"
              description="Explore nosso catálogo e comece a aprender."
              cta={{ label: "Explorar cursos", onClick: () => router.push("/explorar") }}
            />
          )}
        </TabsContent>

        <TabsContent value="concluidos">
          {isLoading ? (
            <CoursesGridSkeleton />
          ) : completed.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {completed.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={IconBook2}
              title="Nenhum curso concluído ainda"
              description="Continue aprendendo para conquistar seu primeiro certificado."
            />
          )}
        </TabsContent>

        <TabsContent value="salvos">
          {isLoading ? (
            <CoursesGridSkeleton />
          ) : notStarted.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {notStarted.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <EmptyState icon={IconBook2} title="Nenhum curso salvo" description="Salve cursos para assistir depois." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
