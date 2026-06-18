"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { IconArrowLeft, IconPlus, IconLoader2 } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PublishToggle } from "@/features/admin/components/publish-toggle";
import { SortableList } from "@/features/admin/components/sortable-list";
import { SortableModuleItem } from "@/features/admin/components/sortable-module-item";
import { useAdminCourse, useUpdateCourse } from "@/features/admin/hooks/use-admin-courses";
import { useCreateModule } from "@/features/admin/hooks/use-admin-modules";
import { useReorderItems } from "@/features/admin/hooks/use-admin-reorder";
import type { AdminCourse, AdminModule, AdminLesson } from "@/features/admin/types";

const LEVEL_LABELS: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

const STATUS_LABELS: Record<AdminCourse["status"], string> = {
  draft: "Rascunho",
  published: "Publicado",
  archived: "Arquivado",
};

const STATUS_VARIANTS: Record<AdminCourse["status"], "secondary" | "default" | "destructive"> = {
  draft: "secondary",
  published: "default",
  archived: "secondary",
};

// Inline editable field
function InlineField({
  label,
  value,
  onSave,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onSave: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement>(null);

  function handleBlur() {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed !== value) onSave(trimmed || value);
    else setDraft(value);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") ref.current?.blur();
    if (e.key === "Escape") {
      setDraft(value);
      setEditing(false);
    }
  }

  if (editing) {
    return (
      <div className={className}>
        <Label className="text-xs font-medium text-[var(--tbo-gray-600)]">{label}</Label>
        <Input
          ref={ref}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus
          className="mt-1.5 rounded-xl"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <Label className="text-xs font-medium text-[var(--tbo-gray-600)]">{label}</Label>
      <button
        type="button"
        onClick={() => {
          setDraft(value);
          setEditing(true);
          setTimeout(() => ref.current?.focus(), 0);
        }}
        className="hover:bg-paper-off mt-1.5 block w-full truncate rounded-xl border border-transparent px-3 py-2 text-left text-sm transition-colors hover:border-black/[0.08]"
      >
        {value || <span className="text-[var(--tbo-gray-500)]">{placeholder}</span>}
      </button>
    </div>
  );
}

interface CourseEditorProps {
  courseId: string;
}

export function CourseEditor({ courseId }: CourseEditorProps) {
  const { data: course, isLoading, error } = useAdminCourse(courseId);
  const updateCourse = useUpdateCourse();
  const createModule = useCreateModule();
  const reorderItems = useReorderItems();
  const [addingModule, setAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  function handleFieldSave(field: keyof AdminCourse) {
    return (value: string) => {
      if (!course) return;
      const update = { id: course.id, [field]: value };
      toast.promise(updateCourse.mutateAsync(update), {
        loading: "Salvando...",
        success: "Salvo",
        error: (err) => err.message,
      });
    };
  }

  function handleLevelChange(value: string) {
    if (!course) return;
    toast.promise(updateCourse.mutateAsync({ id: course.id, level: value as AdminCourse["level"] }), {
      loading: "Salvando...",
      success: "Salvo",
      error: (err) => err.message,
    });
  }

  async function handleAddModule(e: React.FormEvent) {
    e.preventDefault();
    const title = newModuleTitle.trim();
    if (!title || !course) return;

    toast.promise(createModule.mutateAsync({ course_id: course.id, title }), {
      loading: "Criando módulo...",
      success: "Módulo criado!",
      error: (err) => err.message,
    });

    setNewModuleTitle("");
    setAddingModule(false);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <div className="space-y-3">
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="bg-card flex flex-col items-center gap-4 rounded-2xl border border-black/[0.06] py-16 text-center shadow-sm">
        <p className="text-[var(--tbo-gray-500)]">Curso não encontrado.</p>
        <Link
          href="/admin/cursos"
          className="bg-forest-900 hover:bg-ink inline-flex items-center gap-2 rounded-full py-2 pr-2 pl-4 text-sm font-bold text-white transition-all hover:-translate-y-px"
        >
          Voltar para Cursos
          <span className="bg-volt text-ink grid size-6 place-items-center rounded-full">
            <IconArrowLeft className="size-3.5" />
          </span>
        </Link>
      </div>
    );
  }

  const modules = (
    (course as AdminCourse & { academy_modules?: (AdminModule & { academy_lessons?: AdminLesson[] })[] })
      .academy_modules ?? []
  )
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((m) => ({
      ...m,
      lessons: (m.academy_lessons ?? []).slice().sort((a, b) => a.sort_order - b.sort_order),
    }));

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/cursos"
          className="text-ink hover:bg-paper-off grid size-9 shrink-0 place-items-center rounded-full border border-black/[0.08] transition-colors"
          aria-label="Voltar para Cursos"
        >
          <IconArrowLeft className="size-4" />
        </Link>

        <div className="min-w-0 flex-1">
          <span className="text-forest-500 text-[11px] font-bold tracking-[0.14em] uppercase">Editar curso</span>
          <h1 className="font-display mt-0.5 truncate text-xl font-bold tracking-tight">{course.title}</h1>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant={STATUS_VARIANTS[course.status]} className="px-2 py-0 text-[10px]">
              {STATUS_LABELS[course.status]}
            </Badge>
            <span className="text-xs text-[var(--tbo-gray-500)]">
              {modules.length} módulo{modules.length !== 1 ? "s" : ""} ·{" "}
              {modules.reduce((acc, m) => acc + (m.lessons?.length ?? 0), 0)} aulas
            </span>
          </div>
        </div>

        <PublishToggle course={course} />
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: Modules */}
        <div className="space-y-3">
          <div>
            <span className="text-forest-500 text-[11px] font-bold tracking-[0.14em] uppercase">Conteúdo</span>
            <h2 className="font-display text-lg font-bold tracking-tight">Módulos</h2>
          </div>

          {modules.length === 0 && !addingModule && (
            <div className="bg-paper-off flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-black/[0.12] p-10 text-center">
              <p className="text-sm text-[var(--tbo-gray-500)]">Nenhum módulo ainda.</p>
              <button
                onClick={() => setAddingModule(true)}
                className="bg-forest-900 hover:bg-ink inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-white transition-all hover:-translate-y-px"
              >
                <IconPlus className="size-3.5" />
                Adicionar Módulo
              </button>
            </div>
          )}

          <SortableList
            items={modules}
            onReorder={(reordered) => {
              reorderItems.mutate({
                courseId,
                type: "modules",
                items: reordered.map((m, i) => ({ id: m.id, sort_order: i })),
              });
            }}
            renderItem={(m) => <SortableModuleItem key={m.id} module={m} courseId={courseId} />}
            className="space-y-3"
          />

          {/* Add module form */}
          {addingModule ? (
            <form onSubmit={handleAddModule} className="flex items-center gap-2">
              <Input
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                placeholder="Título do módulo..."
                autoFocus
                className="rounded-xl"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setAddingModule(false);
                    setNewModuleTitle("");
                  }
                }}
              />
              <button
                type="submit"
                disabled={!newModuleTitle.trim() || createModule.isPending}
                className="bg-volt text-ink inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all hover:-translate-y-px disabled:pointer-events-none disabled:opacity-50"
              >
                {createModule.isPending ? <IconLoader2 className="size-4 animate-spin" /> : "Criar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddingModule(false);
                  setNewModuleTitle("");
                }}
                className="hover:bg-paper-off hover:text-ink shrink-0 rounded-full px-3 py-2 text-sm font-medium text-[var(--tbo-gray-600)] transition-colors"
              >
                Cancelar
              </button>
            </form>
          ) : (
            modules.length > 0 && (
              <button
                onClick={() => setAddingModule(true)}
                className="hover:bg-paper-off hover:text-ink flex w-full items-center justify-center gap-1.5 rounded-full border border-black/[0.08] py-2.5 text-sm font-semibold text-[var(--tbo-gray-600)] transition-colors hover:border-black/[0.16]"
              >
                <IconPlus className="size-3.5" />
                Adicionar Módulo
              </button>
            )
          )}
        </div>

        {/* Right: Metadata */}
        <div className="bg-card space-y-4 rounded-2xl border border-black/[0.06] p-5 shadow-sm">
          <div>
            <span className="text-forest-500 text-[11px] font-bold tracking-[0.14em] uppercase">Detalhes</span>
            <h2 className="font-display text-lg font-bold tracking-tight">Informações</h2>
          </div>

          <InlineField
            label="Título"
            value={course.title}
            onSave={handleFieldSave("title")}
            placeholder="Título do curso"
          />

          <InlineField
            label="Slug (URL)"
            value={course.slug}
            onSave={handleFieldSave("slug")}
            placeholder="meu-curso"
          />

          <InlineField
            label="Categoria"
            value={course.category ?? ""}
            onSave={handleFieldSave("category")}
            placeholder="Ex: Gestão, Marketing..."
          />

          <InlineField
            label="Instrutor"
            value={course.instructor ?? ""}
            onSave={handleFieldSave("instructor")}
            placeholder="Nome do instrutor"
          />

          <div>
            <Label className="text-xs font-medium text-[var(--tbo-gray-600)]">Nível</Label>
            <Select value={course.level ?? ""} onValueChange={handleLevelChange}>
              <SelectTrigger className="mt-1.5 rounded-xl">
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LEVEL_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-medium text-[var(--tbo-gray-600)]">Tags</Label>
            <div className="mt-1.5 flex min-h-[38px] flex-wrap gap-1.5 rounded-xl border border-black/[0.08] px-3 py-2">
              {(course.tags ?? []).length === 0 ? (
                <span className="text-xs text-[var(--tbo-gray-500)]">Sem tags</span>
              ) : (
                (course.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="text-forest-700 bg-paper-off rounded-full border border-black/[0.06] px-2.5 py-0.5 text-[11px] font-semibold"
                  >
                    {tag}
                  </span>
                ))
              )}
            </div>
          </div>

          {updateCourse.isPending && (
            <p className="text-forest-600 flex items-center gap-1.5 text-xs font-medium">
              <IconLoader2 className="size-3 animate-spin" />
              Salvando...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
