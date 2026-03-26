"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { IconArrowLeft, IconPlus, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
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
  archived: "destructive",
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
        <Label className="text-muted-foreground text-xs">{label}</Label>
        <Input
          ref={ref}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus
          className="mt-1"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <button
        type="button"
        onClick={() => {
          setDraft(value);
          setEditing(true);
          setTimeout(() => ref.current?.focus(), 0);
        }}
        className="hover:border-border hover:bg-muted/40 mt-1 block w-full truncate rounded-md border border-transparent px-3 py-2 text-left text-sm transition-colors"
      >
        {value || <span className="text-muted-foreground">{placeholder}</span>}
      </button>
    </div>
  );
}

interface CourseEditorProps {
  courseId: string;
}

export function CourseEditor({ courseId }: CourseEditorProps) {
  const router = useRouter();
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
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
          <div className="space-y-3">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="space-y-3 py-16 text-center">
        <p className="text-muted-foreground">Curso não encontrado.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/cursos">
            <IconArrowLeft className="mr-1.5 size-4" />
            Voltar para Cursos
          </Link>
        </Button>
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
        <Button asChild variant="ghost" size="icon" className="shrink-0">
          <Link href="/admin/cursos">
            <IconArrowLeft className="size-4" />
          </Link>
        </Button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-bold">{course.title}</h1>
          <div className="mt-0.5 flex items-center gap-2">
            <Badge variant={STATUS_VARIANTS[course.status]} className="px-1.5 py-0 text-[10px]">
              {STATUS_LABELS[course.status]}
            </Badge>
            <span className="text-muted-foreground text-xs">
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
          <h2 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">Módulos</h2>

          {modules.length === 0 && !addingModule && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-10 text-center">
              <p className="text-muted-foreground text-sm">Nenhum módulo ainda.</p>
              <Button size="sm" onClick={() => setAddingModule(true)}>
                <IconPlus className="mr-1 size-3.5" />
                Adicionar Módulo
              </Button>
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
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setAddingModule(false);
                    setNewModuleTitle("");
                  }
                }}
              />
              <Button type="submit" size="sm" disabled={!newModuleTitle.trim() || createModule.isPending}>
                {createModule.isPending ? <IconLoader2 className="size-4 animate-spin" /> : "Criar"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setAddingModule(false);
                  setNewModuleTitle("");
                }}
              >
                Cancelar
              </Button>
            </form>
          ) : (
            modules.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground hover:text-foreground w-full gap-1.5"
                onClick={() => setAddingModule(true)}
              >
                <IconPlus className="size-3.5" />
                Adicionar Módulo
              </Button>
            )
          )}
        </div>

        {/* Right: Metadata */}
        <div className="bg-card space-y-4 rounded-xl border p-4">
          <h2 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">Informações</h2>

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
            <Label className="text-muted-foreground text-xs">Nível</Label>
            <Select value={course.level ?? ""} onValueChange={handleLevelChange}>
              <SelectTrigger className="mt-1">
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
            <Label className="text-muted-foreground text-xs">Tags</Label>
            <div className="mt-1 flex min-h-[36px] flex-wrap gap-1.5 rounded-md border px-3 py-2">
              {(course.tags ?? []).length === 0 ? (
                <span className="text-muted-foreground text-xs">Sem tags</span>
              ) : (
                (course.tags ?? []).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))
              )}
            </div>
          </div>

          {updateCourse.isPending && (
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <IconLoader2 className="size-3 animate-spin" />
              Salvando...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
