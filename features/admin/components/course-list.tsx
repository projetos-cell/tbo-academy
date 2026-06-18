"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  IconPlus,
  IconSearch,
  IconBook2,
  IconEdit,
  IconTrash,
  IconEye,
  IconEyeOff,
  IconDots,
  IconArrowRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdminCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from "@/features/admin/hooks/use-admin-courses";
import type { AdminCourse } from "@/features/admin/types";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<AdminCourse["status"], string> = {
  draft: "Rascunho",
  published: "Publicado",
  archived: "Arquivado",
};

/** Status pills no padrão DS: volt para publicado, neutro/discreto para os demais. */
const STATUS_PILL: Record<AdminCourse["status"], string> = {
  published: "bg-volt text-ink",
  draft: "bg-paper-off text-forest-700 border border-black/[0.06]",
  archived: "bg-paper-off text-[var(--tbo-gray-500)] border border-black/[0.06]",
};

const LEVEL_LABELS: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

function CourseCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl border-black/[0.06] shadow-sm">
      <Skeleton className="h-36 rounded-none" />
      <CardHeader className="pt-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="size-7 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <Skeleton className="mb-2 h-4 w-1/2 rounded-full" />
        <Skeleton className="h-3 w-2/3" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full rounded-full" />
      </CardFooter>
    </Card>
  );
}

interface NewCourseDialogProps {
  open: boolean;
  onClose: () => void;
}

function NewCourseDialog({ open, onClose }: NewCourseDialogProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState<string>("");
  const createCourse = useCreateCourse();

  function toSlug(str: string) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleTitleChange(v: string) {
    setTitle(v);
    setSlug(toSlug(v));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    toast.promise(
      createCourse.mutateAsync({
        title: title.trim(),
        slug: slug.trim(),
        category: category || undefined,
        level: (level as AdminCourse["level"]) || undefined,
        tags: [],
      }),
      {
        loading: "Criando curso...",
        success: "Curso criado!",
        error: (err) => err.message,
      },
    );

    setTitle("");
    setSlug("");
    setCategory("");
    setLevel("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <span className="text-forest-500 text-xs font-bold tracking-[0.14em] uppercase">Novo curso</span>
          <DialogTitle className="font-display tracking-tight">Criar curso</DialogTitle>
          <DialogDescription>Preencha os dados básicos. Você pode editar tudo depois.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ex: Gestão de Projetos Ágeis"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="gestao-de-projetos-ageis"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex: Gestão" />
            </div>
            <div className="space-y-1.5">
              <Label>Nível</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iniciante">Iniciante</SelectItem>
                  <SelectItem value="intermediario">Intermediário</SelectItem>
                  <SelectItem value="avancado">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" className="rounded-full" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || createCourse.isPending}
              className="bg-forest-900 hover:bg-ink rounded-full text-white"
            >
              Criar Curso
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CourseList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminCourse | null>(null);

  const { data: courses, isLoading } = useAdminCourses();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const filtered = (courses ?? []).filter((c) => {
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase()) ||
      false;

    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function handleTogglePublish(course: AdminCourse) {
    const newStatus = course.status === "published" ? "draft" : "published";
    toast.promise(updateCourse.mutateAsync({ id: course.id, status: newStatus }), {
      loading: newStatus === "published" ? "Publicando..." : "Voltando p/ rascunho...",
      success: newStatus === "published" ? "Curso publicado!" : "Movido para rascunho",
      error: (err) => err.message,
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    toast.promise(deleteCourse.mutateAsync(deleteTarget.id), {
      loading: "Arquivando curso...",
      success: "Curso arquivado",
      error: (err) => err.message,
    });
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-forest-500 text-xs font-bold tracking-[0.14em] uppercase">Conteúdo</span>
          <h1 className="font-display mt-1 text-[28px] font-bold tracking-tight">Cursos</h1>
          <p className="mt-1 text-sm text-[var(--tbo-gray-500)]">
            {courses?.length ?? 0} curso{(courses?.length ?? 0) !== 1 ? "s" : ""} no total
          </p>
        </div>
        <button
          onClick={() => setNewDialogOpen(true)}
          className="bg-forest-900 hover:bg-ink flex items-center gap-2 rounded-full py-2 pr-2 pl-5 text-sm font-bold text-white transition-all hover:-translate-y-px"
        >
          Novo curso
          <span className="bg-volt text-ink grid size-7 place-items-center rounded-full">
            <IconPlus className="size-4" />
          </span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative max-w-sm flex-1">
          <IconSearch className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--tbo-gray-500)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar cursos..."
            className="rounded-full pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="published">Publicados</SelectItem>
            <SelectItem value="draft">Rascunhos</SelectItem>
            <SelectItem value="archived">Arquivados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-black/[0.12] p-12 text-center">
          <span className="bg-forest-900 text-volt grid size-12 place-items-center rounded-full">
            <IconBook2 className="size-6" strokeWidth={1.5} />
          </span>
          <div>
            <p className="font-display text-base font-bold tracking-tight">Nenhum curso encontrado</p>
            <p className="mt-1 text-xs text-[var(--tbo-gray-500)]">
              {search ? "Tente outros termos de busca" : "Crie seu primeiro curso"}
            </p>
          </div>
          {!search && (
            <button
              onClick={() => setNewDialogOpen(true)}
              className="bg-forest-900 hover:bg-ink mt-1 flex items-center gap-2 rounded-full py-1.5 pr-1.5 pl-4 text-xs font-bold text-white transition-all hover:-translate-y-px"
            >
              Novo curso
              <span className="bg-volt text-ink grid size-5 place-items-center rounded-full">
                <IconPlus className="size-3.5" />
              </span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <Card
              key={course.id}
              className="group overflow-hidden rounded-2xl border-black/[0.06] py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,11,11,0.10)]"
            >
              {course.thumbnail_url ? (
                <div
                  className="relative h-36 bg-cover bg-center"
                  style={{ backgroundImage: `url(${course.thumbnail_url})` }}
                >
                  <span
                    className={cn(
                      "absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm",
                      STATUS_PILL[course.status],
                    )}
                  >
                    {STATUS_LABELS[course.status]}
                  </span>
                </div>
              ) : (
                <div className="img-dark relative flex h-36 items-center justify-center">
                  <IconBook2 className="text-volt/90 size-10" strokeWidth={1.5} />
                  <span
                    className={cn(
                      "absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      STATUS_PILL[course.status],
                    )}
                  >
                    {STATUS_LABELS[course.status]}
                  </span>
                </div>
              )}

              <CardHeader className="pt-3 pb-1">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/admin/cursos/${course.id}`}
                    className="font-display line-clamp-2 text-[15px] leading-snug font-bold tracking-tight hover:underline"
                  >
                    {course.title}
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <IconDots className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/cursos/${course.id}`}>
                          <IconEdit className="mr-2 size-3.5" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTogglePublish(course)}>
                        {course.status === "published" ? (
                          <>
                            <IconEyeOff className="mr-2 size-3.5" />
                            Despublicar
                          </>
                        ) : (
                          <>
                            <IconEye className="mr-2 size-3.5" />
                            Publicar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(course)}>
                        <IconTrash className="mr-2 size-3.5" />
                        Arquivar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {course.level && (
                    <span className="text-forest-700 bg-paper-off rounded-full border border-black/[0.06] px-2.5 py-0.5 text-[11px] font-semibold">
                      {LEVEL_LABELS[course.level] ?? course.level}
                    </span>
                  )}
                  {course.category && <span className="text-[11px] text-[var(--tbo-gray-500)]">{course.category}</span>}
                </div>
                <p className="mt-2 text-xs text-[var(--tbo-gray-500)]">
                  {course.module_count ?? 0} módulo{(course.module_count ?? 0) !== 1 ? "s" : ""} ·{" "}
                  {course.lesson_count ?? 0} aula{(course.lesson_count ?? 0) !== 1 ? "s" : ""}
                </p>
              </CardContent>

              <CardFooter className="pt-0 pb-4">
                <Link
                  href={`/admin/cursos/${course.id}`}
                  className="text-ink flex w-full items-center justify-between rounded-full border border-black/10 py-2 pr-2 pl-4 text-xs font-bold transition-all hover:-translate-y-px hover:bg-black/[0.04]"
                >
                  Editar curso
                  <span className="bg-forest-900 text-volt group-hover:bg-volt group-hover:text-ink grid size-6 place-items-center rounded-full transition-colors">
                    <IconArrowRight className="size-3.5" />
                  </span>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <NewCourseDialog open={newDialogOpen} onClose={() => setNewDialogOpen(false)} />

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display tracking-tight">Arquivar curso?</DialogTitle>
            <DialogDescription>
              &ldquo;{deleteTarget?.title}&rdquo; será arquivado e ficará invisível para os alunos. Você pode
              restaurá-lo depois.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" className="rounded-full" onClick={handleDelete}>
              Arquivar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
