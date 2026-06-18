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
import {
  IconGripVertical,
  IconPlus,
  IconX,
  IconBook2,
  IconPhoto,
  IconEye,
  IconEyeOff,
  IconArrowRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
      className={`bg-card group flex items-center gap-2 rounded-xl border border-black/[0.06] p-2.5 text-sm shadow-sm ${isDragging ? "opacity-40 shadow-lg" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="hover:text-ink cursor-grab touch-none text-[var(--tbo-gray-400)] transition-colors"
      >
        <IconGripVertical className="size-4" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{course.title}</p>
        <div className="mt-0.5 flex items-center gap-2">
          {course.level && (
            <Badge
              variant="outline"
              className="text-forest-700 bg-paper-off h-4 border-black/[0.06] px-1.5 text-[10px] font-semibold"
            >
              {course.level}
            </Badge>
          )}
          {course.status && (
            <Badge
              variant="outline"
              className={`h-4 px-1.5 text-[10px] ${
                course.status === "published"
                  ? "bg-volt text-ink border-transparent"
                  : "border-black/[0.06] text-[var(--tbo-gray-500)]"
              }`}
            >
              {course.status === "published" ? "Publicado" : "Rascunho"}
            </Badge>
          )}
        </div>
      </div>
      <button
        onClick={onRemove}
        className="hover:text-destructive shrink-0 text-[var(--tbo-gray-400)] opacity-0 transition-colors group-hover:opacity-100"
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
      className="bg-card hover:border-forest-900/30 hover:bg-paper-off group flex w-full items-center gap-2.5 rounded-xl border border-black/[0.06] p-2.5 text-left text-sm shadow-sm transition-all"
    >
      <div className="bg-forest-900 flex size-8 flex-shrink-0 items-center justify-center rounded-lg">
        <IconBook2 className="text-volt size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{course.title}</p>
        <p className="truncate text-xs text-[var(--tbo-gray-500)]">{course.category ?? "Sem categoria"}</p>
      </div>
      <span className="bg-paper-off text-ink group-hover:bg-volt grid size-6 shrink-0 place-items-center rounded-full transition-colors">
        <IconPlus className="size-3.5" />
      </span>
    </button>
  );
}

// ─── Learning path row (read view) ──────────────────────────────

function PathRow({ path, onEdit, onDelete }: { path: AdminLearningPath; onEdit: () => void; onDelete: () => void }) {
  const { mutate: updatePath } = useUpdateLearningPath();
  const courseCount = path.courses?.length ?? 0;

  return (
    <div className="bg-card group flex items-center gap-4 rounded-2xl border border-black/[0.06] p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(11,11,11,0.10)]">
      {/* Thumbnail */}
      <div className="img-dark flex size-12 shrink-0 items-center justify-center rounded-xl">
        {path.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={path.thumbnail_url} alt="" className="size-full rounded-xl object-cover" />
        ) : (
          <IconPhoto className="text-volt/80 size-5" />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="font-display truncate text-[15px] font-bold tracking-tight">{path.title}</p>
        <p className="mt-0.5 truncate text-xs text-[var(--tbo-gray-500)]">
          {path.description ?? "Sem descrição"} · {courseCount} curso{courseCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Status toggle */}
      <button
        className={
          path.status === "published"
            ? "text-ink inline-flex shrink-0 items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-xs font-bold transition-all hover:-translate-y-px hover:bg-black/[0.04]"
            : "bg-forest-900 hover:bg-ink inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white transition-all hover:-translate-y-px"
        }
        onClick={() =>
          updatePath({
            pathId: path.id,
            status: path.status === "published" ? "draft" : "published",
          })
        }
      >
        {path.status === "published" ? <IconEyeOff className="size-3.5" /> : <IconEye className="size-3.5" />}
        {path.status === "published" ? "Despublicar" : "Publicar"}
      </button>

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
    <div className="bg-card overflow-hidden rounded-2xl border border-black/[0.06] shadow-sm">
      {/* Header */}
      <div className="bg-paper-off flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
        <div>
          <span className="text-forest-500 text-[10px] font-bold tracking-[0.14em] uppercase">
            {isNew ? "Nova trilha" : "Editar trilha"}
          </span>
          <h3 className="font-display mt-0.5 text-base font-bold tracking-tight">
            {isNew ? "Trilha de Aprendizado" : path!.title}
          </h3>
        </div>
        <button onClick={onClose} className="hover:text-ink text-[var(--tbo-gray-400)] transition-colors">
          <IconX className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 divide-y divide-black/[0.06] lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        {/* Left: metadata + available courses */}
        <div className="space-y-4 p-5">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--tbo-gray-600)]">Título</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Fundamentos do Lançamento"
                className="h-9"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--tbo-gray-600)]">Slug</label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ex: fundamentos-lancamento"
                className="h-9 font-mono text-xs"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[var(--tbo-gray-600)]">Descrição</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição curta da trilha..."
                className="h-9"
              />
            </div>
          </div>

          <div>
            <p className="text-forest-500 mb-2 text-[10px] font-bold tracking-[0.14em] uppercase">
              Cursos disponíveis — clique para adicionar
            </p>
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
          <p className="text-forest-500 text-[10px] font-bold tracking-[0.14em] uppercase">
            Cursos na trilha — arraste para reordenar
          </p>

          {selectedCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-black/10 p-8 text-center">
              <IconBook2 className="size-8 text-[var(--tbo-gray-400)]" />
              <p className="text-xs text-[var(--tbo-gray-500)]">Adicione cursos da lista ao lado</p>
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
                  <div className="bg-card flex items-center gap-2 rounded-xl border border-black/[0.06] p-2.5 text-sm opacity-90 shadow-xl">
                    <IconGripVertical className="size-4 text-[var(--tbo-gray-400)]" />
                    <span className="font-semibold">{activeCourse.title}</span>
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-paper-off flex items-center justify-end gap-2 border-t border-black/[0.06] px-5 py-3">
        <Button variant="ghost" size="sm" onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>
        <button
          onClick={handleSave}
          disabled={!title || !slug || isPending}
          className="bg-forest-900 hover:bg-ink inline-flex items-center gap-2 rounded-full py-2 pr-2 pl-4 text-sm font-bold text-white transition-all hover:-translate-y-px disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending ? "Salvando..." : isNew ? "Criar Trilha" : "Salvar Alterações"}
          <span className="bg-volt text-ink grid size-6 place-items-center rounded-full">
            <IconArrowRight className="size-3.5" />
          </span>
        </button>
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
        <p className="text-sm text-[var(--tbo-gray-500)]">
          {isLoading ? "Carregando..." : `${paths.length} trilha${paths.length !== 1 ? "s" : ""}`}
        </p>
        {editing === null && (
          <button
            onClick={() => setEditing("new")}
            className="bg-forest-900 hover:bg-ink inline-flex items-center gap-2 rounded-full py-2 pr-2 pl-4 text-xs font-bold text-white transition-all hover:-translate-y-px"
          >
            Nova Trilha
            <span className="bg-volt text-ink grid size-6 place-items-center rounded-full">
              <IconPlus className="size-3.5" />
            </span>
          </button>
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
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-black/10 p-12 text-center">
          <IconBook2 className="size-10 text-[var(--tbo-gray-400)]" />
          <div>
            <p className="font-display text-base font-bold tracking-tight">Nenhuma trilha criada ainda</p>
            <p className="mt-1 text-xs text-[var(--tbo-gray-500)]">
              Crie trilhas para organizar cursos em sequências de aprendizado.
            </p>
          </div>
          <button
            onClick={() => setEditing("new")}
            className="bg-forest-900 hover:bg-ink inline-flex items-center gap-2 rounded-full py-2 pr-2 pl-4 text-xs font-bold text-white transition-all hover:-translate-y-px"
          >
            Criar primeira trilha
            <span className="bg-volt text-ink grid size-6 place-items-center rounded-full">
              <IconPlus className="size-3.5" />
            </span>
          </button>
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
