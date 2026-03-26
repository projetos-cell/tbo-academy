"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/features/courses/components/course-card";
import { CourseStatsCards } from "@/features/courses/components/course-stats-cards";
import { MOCK_COURSES, COURSE_CATEGORIES } from "@/features/courses/data/mock-courses";
import { useCourses } from "@/features/courses/hooks/use-courses";
import type { CourseStatus } from "@/features/courses/types";
import { IconSearch, IconAdjustmentsHorizontal, IconLibrary } from "@tabler/icons-react";

type StatusFilter = CourseStatus | "todos";

export default function ExplorarCursosPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("todos");
  const [level, setLevel] = useState("todos");
  const [status, setStatus] = useState<StatusFilter>("todos");
  const [showFilters, setShowFilters] = useState(false);

  const { data: dbCourses } = useCourses();
  const courses = dbCourses && dbCourses.length > 0 ? dbCourses : MOCK_COURSES;

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      if (
        search &&
        !course.title.toLowerCase().includes(search.toLowerCase()) &&
        !course.instructor.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      if (category !== "todos" && course.category !== category) return false;
      if (level !== "todos" && course.level !== level) return false;
      if (status !== "todos" && course.status !== status) return false;
      return true;
    });
  }, [courses, search, category, level, status]);

  return (
    <div className="space-y-8">
      {/* Hero header — referência style */}
      <div className="relative overflow-hidden rounded-2xl bg-black p-8 md:p-10">
        <div className="absolute -top-20 -right-20 size-64 rounded-full bg-[#BAF241]/8 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 size-48 rounded-full bg-[#BAF241]/5 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <Badge className="gap-1.5 border-0 bg-white/10 text-white/70 backdrop-blur-sm">
              <IconLibrary className="size-3.5" />
              Sua biblioteca de aprendizado
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              <em className="font-black not-italic">Todos</em> os Cursos
            </h1>
            <p className="text-sm text-white/40">{courses.length} cursos disponíveis no Academy Pass</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <IconSearch className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-64 rounded-xl border border-white/10 bg-white/5 pr-4 pl-10 text-sm text-white transition-all placeholder:text-white/30 focus:ring-1 focus:ring-[#BAF241]/40 focus:outline-none"
              />
            </div>
            {/* Filters toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-10 gap-2 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <IconAdjustmentsHorizontal className="size-4" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className="animate-in fade-in slide-in-from-top-2 relative z-10 mt-6 flex flex-wrap gap-2 duration-200">
            {/* Category pills */}
            <button
              onClick={() => setCategory("todos")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                category === "todos" ? "bg-[#BAF241] text-black" : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              Todos
            </button>
            {COURSE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat === category ? "todos" : cat)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  category === cat ? "bg-[#BAF241] text-black" : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}

            <div className="mx-1 h-6 w-px self-center bg-white/10" />

            {/* Status pills */}
            {(["todos", "em_andamento", "concluido", "nao_iniciado"] as const).map((s) => {
              const labels: Record<string, string> = {
                todos: "Todos",
                em_andamento: "Em Andamento",
                concluido: "Concluídos",
                nao_iniciado: "Não Iniciados",
              };
              return (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    status === s ? "bg-white text-black" : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {labels[s]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats */}
      <CourseStatsCards courses={courses} />

      {/* Course grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <p className="text-muted-foreground">Nenhum curso encontrado com os filtros selecionados.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 rounded-xl"
            onClick={() => {
              setSearch("");
              setCategory("todos");
              setLevel("todos");
              setStatus("todos");
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
