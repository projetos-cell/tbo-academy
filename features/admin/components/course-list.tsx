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
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

const STATUS_LABELS: Record<AdminCourse["status"], string> = {
  draft: "Rascunho",
  published: "Publicado",
  archived: "Arquivado",
};

const STATUS_VARIANTS: Record<AdminCourse["status"], "secondary" | "default" | "destructive"> = {
  draft: "secondary",
  published: "default",
  archived: "destructive",
};

const LEVEL_LABELS: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

function CourseCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <Skeleton className="mb-2 h-4 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-8 w-full" />
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
          <DialogTitle>Novo Curso</DialogTitle>
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!title.trim() || createCourse.isPending}>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cursos</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {courses?.length ?? 0} curso{(courses?.length ?? 0) !== 1 ? "s" : ""} no total
          </p>
        </div>
        <Button onClick={() => setNewDialogOpen(true)}>
          <IconPlus className="mr-1.5 size-4" />
          Novo Curso
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative max-w-sm flex-1">
          <IconSearch className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar cursos..."
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
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
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-12 text-center">
          <IconBook2 className="text-muted-foreground/40 size-10" />
          <div>
            <p className="text-sm font-medium">Nenhum curso encontrado</p>
            <p className="text-muted-foreground mt-1 text-xs">
              {search ? "Tente outros termos de busca" : "Crie seu primeiro curso"}
            </p>
          </div>
          {!search && (
            <Button size="sm" onClick={() => setNewDialogOpen(true)}>
              <IconPlus className="mr-1 size-3.5" />
              Novo Curso
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <Card key={course.id} className="group overflow-hidden transition-shadow hover:shadow-md">
              {course.thumbnail_url ? (
                <div
                  className="bg-muted h-36 bg-cover bg-center"
                  style={{ backgroundImage: `url(${course.thumbnail_url})` }}
                />
              ) : (
                <div className="bg-muted flex h-36 items-center justify-center">
                  <IconBook2 className="text-muted-foreground/30 size-10" />
                </div>
              )}

              <CardHeader className="pt-3 pb-1">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/admin/cursos/${course.id}`}
                    className="line-clamp-2 text-sm leading-snug font-semibold hover:underline"
                  >
                    {course.title}
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
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
                  <Badge variant={STATUS_VARIANTS[course.status]} className="px-1.5 py-0 text-[10px]">
                    {STATUS_LABELS[course.status]}
                  </Badge>
                  {course.level && (
                    <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                      {LEVEL_LABELS[course.level] ?? course.level}
                    </Badge>
                  )}
                  {course.category && <span className="text-muted-foreground text-[11px]">{course.category}</span>}
                </div>
                <p className="text-muted-foreground mt-2 text-xs">
                  {course.module_count ?? 0} módulo{(course.module_count ?? 0) !== 1 ? "s" : ""} ·{" "}
                  {course.lesson_count ?? 0} aula{(course.lesson_count ?? 0) !== 1 ? "s" : ""}
                </p>
              </CardContent>

              <CardFooter className="pt-0">
                <Button asChild size="sm" variant="outline" className="w-full text-xs">
                  <Link href={`/admin/cursos/${course.id}`}>
                    <IconEdit className="mr-1.5 size-3" />
                    Editar Curso
                  </Link>
                </Button>
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
            <DialogTitle>Arquivar curso?</DialogTitle>
            <DialogDescription>
              &ldquo;{deleteTarget?.title}&rdquo; será arquivado e ficará invisível para os alunos. Você pode
              restaurá-lo depois.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Arquivar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
