"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical, IconPlus, IconX, IconBook2, IconPhoto } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useAdminCourses } from "@/features/admin/hooks/use-admin-courses";
import {
  useAdminLearningPaths,
  useCreateLearningPath,
  useUpdateLearningPath,
  useDeleteLearningPath,
} from "@/features/admin/hooks/use-admin-learning-paths";
import type { AdminLearningPath, AdminCourse } from "@/features/admin/types";

// ─── Sortable item inside a path ────────────────────────────────

function SortableCourseItem({ course, onRemove }: { course: AdminCourse; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: course.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`bg-card group flex items-center gap-2 rounded-lg border p-2.5 text-sm ${isDragging ? "opacity-40 shadow-lg" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-muted-foreground hover:text-foreground cursor-grab touch-none"
      >
        <IconGripVertical className="size-4" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{course.title}</p>
        <div className="mt-0.5 flex items-center gap-2">
          {course.level && (
            <Badge variant="outline" className="h-4 px-1.5 text-[10px]">
              {course.level}
            </Badge>
          )}
          {course.status && (
            <Badge
              variant="outline"
              className={`h-4 px-1.5 text-[10px] ${
                course.status === "published"
                  ? "border-emerald-300 text-emerald-600"
                  : "text-muted-foreground border-gray-200"
              }`}
            >
              {course.status === "published" ? "Publicado" : "Rascunho"}
            </Badge>
          )}
        </div>
      </div>
      <button
        onClick={onRemove}
        className="text-muted-foreground/40 hover:text-destructive shrink-0 opacity-0 transition-colors group-hover:opacity-100"
      >
        <IconX className="size-3.5" />
      </button>
    </div>
  );
}

// ─── Available course item (left pane) ──────────────────────────

function AvailableCourseItem({ course, onAdd }: { course: AdminCourse; onAdd: () => void }) {
  return (
    <button
      onClick={onAdd}
      className="bg-card hover:border-primary/50 hover:bg-primary/5 group flex w-full items-center gap-2.5 rounded-lg border p-2.5 text-left text-sm transition-colors"
    >
      <div className="bg-muted flex size-8 flex-shrink-0 items-center justify-center rounded-md">
        <IconBook2 className="text-muted-foreground size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{course.title}</p>
        <p className="text-muted-foreground truncate text-xs">{course.category ?? "Sem categoria"}</p>
      </div>
      <IconPlus className="text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-colors" />
    </button>
  );
}

// ─── Learning path row (read view) ──────────────────────────────

function PathRow({ path, onEdit, onDelete }: { path: AdminLearningPath; onEdit: () => void; onDelete: () => void }) {
  const { mutate: updatePath } = useUpdateLearningPath();
  const courseCount = path.courses?.length ?? 0;

  return (
    <div className="bg-card hover:border-primary/30 group flex items-center gap-4 rounded-xl border p-4 transition-colors">
      {/* Thumbnail */}
      <div className="bg-muted flex size-12 shrink-0 items-center justify-center rounded-lg">
        {path.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={path.thumbnail_url} alt="" className="size-full rounded-lg object-cover" />
        ) : (
          <IconPhoto className="text-muted-foreground/40 size-5" />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{path.title}</p>
        <p className="text-muted-foreground mt-0.5 truncate text-xs">
          {path.description ?? "Sem descrição"} · {courseCount} curso{courseCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Status toggle */}
      <Button
        size="sm"
        variant={path.status === "published" ? "outline" : "default"}
        className="shrink-0 gap-1.5"
        onClick={() =>
          updatePath({
            pathId: path.id,
            status: path.status === "published" ? "draft" : "published",
          })
        }
      >
        {path.status === "published" ? <IconEyeOff className="size-3.5" /> : <IconEye className="size-3.5" />}
        {path.status === "published" ? "Despublicar" : "Publicar"}
      </Button>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={onEdit}>
          Editar
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2 text-xs"
          onClick={onDelete}
        >
          Excluir
        </Button>
      </div>
    </div>
  );
}

// ─── Path editor dialog content ─────────────────────────────────

function PathEditorPanel({ path, onClose }: { path: AdminLearningPath | null; onClose: () => void }) {
  const isNew = !path;

  const [title, setTitle] = useState(path?.title ?? "");
  const [slug, setSlug] = useState(path?.slug ?? "");
  const [description, setDescription] = useState(path?.description ?? "");
  const [selectedCourses, setSelectedCourses] = useState<AdminCourse[]>(path?.courses ?? []);
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: allCourses = [], isLoading: coursesLoading } = useAdminCourses();
  const { mutate: createPath, isPending: creating } = useCreateLearningPath();
  const { mutate: updatePath, isPending: updating } = useUpdateLearningPath();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Auto-slug from title
  useEffect(() => {
    if (isNew) {
      setSlug(
        title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      );
    }
  }, [title, isNew]);

  const selectedIds = new Set(selectedCourses.map((c) => c.id));
  const availableCourses = allCourses.filter(
    (c) => !selectedIds.has(c.id) && (!search || c.title.toLowerCase().includes(search.toLowerCase())),
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSelectedCourses((prev) => {
        const oldIdx = prev.findIndex((c) => c.id === active.id);
        const newIdx = prev.findIndex((c) => c.id === over.id);
        return arrayMove(prev, oldIdx, newIdx);
      });
    }
  }

  function handleSave() {
    const data = {
      title,
      slug,
      description: description || undefined,
      course_ids: selectedCourses.map((c) => c.id),
    };
    if (isNew) {
      createPath(data, { onSuccess: onClose });
    } else {
      updatePath({ pathId: path!.id, ...data }, { onSuccess: onClose });
    }
  }

  const activeCourse = activeId ? selectedCourses.find((c) => c.id === activeId) : null;
  const isPending = creating || updating;

  return (
    <div className="bg-card overflow-hidden rounded-xl border">
      {/* Header */}
      <div className="bg-muted/30 flex items-center justify-between border-b px-5 py-4">
        <h3 className="text-sm font-semibold">{isNew ? "Nova Trilha de Aprendizado" : `Editar: ${path!.title}`}</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <IconX className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        {/* Left: metadata + available courses */}
        <div className="space-y-4 p-5">
          <div className="space-y-3">
            <div>
              <label className="text-muted-foreground mb-1 block text-xs font-medium">Título</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Fundamentos do Lançamento"
                className="h-9"
              />
            </div>
            <div>
              <label className="text-muted-foreground mb-1 block text-xs font-medium">Slug</label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ex: fundamentos-lancamento"
                className="h-9 font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-muted-foreground mb-1 block text-xs font-medium">Descrição</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição curta da trilha..."
                className="h-9"
              />
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2 text-xs font-medium">Cursos disponíveis — clique para adicionar</p>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar curso..."
              className="mb-2 h-8 text-xs"
            />
            <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
              {coursesLoading ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)
              ) : availableCourses.length === 0 ? (
                <p className="text-muted-foreground py-6 text-center text-xs">Todos os cursos já foram adicionados.</p>
              ) : (
                availableCourses.map((c) => (
                  <AvailableCourseItem key={c.id} course={c} onAdd={() => setSelectedCourses((prev) => [...prev, c])} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: selected courses (DnD sortable) */}
        <div className="space-y-3 p-5">
          <p className="text-muted-foreground text-xs font-medium">Cursos na trilha — arraste para reordenar</p>

          {selectedCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
              <IconBook2 className="text-muted-foreground/30 size-8" />
              <p className="text-muted-foreground text-xs">Adicione cursos da lista ao lado</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={selectedCourses.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-1.5">
                  {selectedCourses.map((course) => (
                    <SortableCourseItem
                      key={course.id}
                      course={course}
                      onRemove={() => setSelectedCourses((prev) => prev.filter((c) => c.id !== course.id))}
                    />
                  ))}
                </div>
              </SortableContext>

              <DragOverlay>
                {activeCourse && (
                  <div className="bg-card flex items-center gap-2 rounded-lg border p-2.5 text-sm opacity-90 shadow-xl">
                    <IconGripVertical className="text-muted-foreground size-4" />
                    <span className="font-medium">{activeCourse.title}</span>
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-muted/30 flex items-center justify-end gap-2 border-t px-5 py-3">
        <Button variant="ghost" size="sm" onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>
        <Button size="sm" onClick={handleSave} disabled={!title || !slug || isPending}>
          {isPending ? "Salvando..." : isNew ? "Criar Trilha" : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────

export function LearningPathEditor() {
  const [editing, setEditing] = useState<AdminLearningPath | "new" | null>(null);
  const { data: paths = [], isLoading } = useAdminLearningPaths();
  const { mutate: deletePath } = useDeleteLearningPath();

  function confirmDelete(path: AdminLearningPath) {
    if (confirm(`Excluir a trilha "${path.title}"? Esta ação não pode ser desfeita.`)) {
      deletePath(path.id);
    }
  }

  const editingPath = editing === "new" ? null : editing;

  return (
    <div className="space-y-4">
      {/* Editor panel — shown when creating or editing */}
      {editing !== null && <PathEditorPanel path={editingPath} onClose={() => setEditing(null)} />}

      {/* List header */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {isLoading ? "Carregando..." : `${paths.length} trilha${paths.length !== 1 ? "s" : ""}`}
        </p>
        {editing === null && (
          <Button size="sm" className="h-8 gap-1.5" onClick={() => setEditing("new")}>
            <IconPlus className="size-3.5" />
            Nova Trilha
          </Button>
        )}
      </div>

      {/* Path list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : paths.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-12 text-center">
          <IconBook2 className="text-muted-foreground/30 size-10" />
          <div>
            <p className="text-sm font-medium">Nenhuma trilha criada ainda</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Crie trilhas para organizar cursos em sequências de aprendizado.
            </p>
          </div>
          <Button size="sm" onClick={() => setEditing("new")}>
            <IconPlus className="mr-1.5 size-3.5" />
            Criar primeira trilha
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {paths.map((path) => (
            <PathRow key={path.id} path={path} onEdit={() => setEditing(path)} onDelete={() => confirmDelete(path)} />
          ))}
        </div>
      )}
    </div>
  );
}
