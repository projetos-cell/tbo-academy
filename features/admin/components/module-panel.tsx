"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  IconChevronDown,
  IconChevronRight,
  IconPlus,
  IconTrash,
  IconEdit,
  IconGripVertical,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LessonEditorDialog } from "@/features/admin/components/lesson-editor-dialog";
import { SortableList } from "@/features/admin/components/sortable-list";
import { SortableLessonItem } from "@/features/admin/components/sortable-lesson-item";
import { useUpdateModule, useDeleteModule } from "@/features/admin/hooks/use-admin-modules";
import { useReorderItems } from "@/features/admin/hooks/use-admin-reorder";
import type { AdminModule, AdminLesson } from "@/features/admin/types";

interface ModulePanelProps {
  module: AdminModule & { lessons?: AdminLesson[] };
  courseId: string;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function ModulePanel({ module, courseId, dragHandleProps }: ModulePanelProps) {
  const [expanded, setExpanded] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(module.title);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<AdminLesson | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const updateModule = useUpdateModule();
  const deleteModule = useDeleteModule();
  const reorderItems = useReorderItems();

  const lessons = module.lessons ?? [];

  function handleTitleBlur() {
    setEditingTitle(false);
    const trimmed = titleValue.trim();
    if (!trimmed || trimmed === module.title) {
      setTitleValue(module.title);
      return;
    }
    toast.promise(updateModule.mutateAsync({ id: module.id, courseId, title: trimmed }), {
      loading: "Salvando...",
      success: "Módulo atualizado",
      error: (err) => err.message,
    });
  }

  function handleTitleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") titleRef.current?.blur();
    if (e.key === "Escape") {
      setTitleValue(module.title);
      setEditingTitle(false);
    }
  }

  function handleDeleteModule() {
    toast.promise(deleteModule.mutateAsync({ id: module.id, courseId }), {
      loading: "Excluindo módulo...",
      success: "Módulo excluído",
      error: (err) => err.message,
    });
    setDeleteOpen(false);
  }

  function openEditLesson(lesson: AdminLesson) {
    setEditingLesson(lesson);
    setLessonDialogOpen(true);
  }

  function openNewLesson() {
    setEditingLesson(null);
    setLessonDialogOpen(true);
  }

  return (
    <div className="bg-card rounded-lg border">
      {/* Module header */}
      <div className="group flex items-center gap-2 p-3">
        {/* Drag handle */}
        <div
          {...dragHandleProps}
          className="text-muted-foreground hover:text-foreground cursor-grab touch-none transition-colors"
        >
          <IconGripVertical className="size-4" />
        </div>

        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? <IconChevronDown className="size-4" /> : <IconChevronRight className="size-4" />}
        </button>

        {/* Title — click to edit */}
        {editingTitle ? (
          <Input
            ref={titleRef}
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            className="h-7 flex-1 text-sm font-medium"
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditingTitle(true);
              setTimeout(() => titleRef.current?.focus(), 0);
            }}
            className="hover:text-muted-foreground flex-1 truncate text-left text-sm font-medium transition-colors"
          >
            {module.title}
          </button>
        )}

        <span className="text-muted-foreground shrink-0 text-xs">
          {lessons.length} aula{lessons.length !== 1 ? "s" : ""}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            onClick={() => {
              setEditingTitle(true);
              setTimeout(() => titleRef.current?.focus(), 0);
            }}
          >
            <IconEdit className="size-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-destructive hover:text-destructive size-7"
            onClick={() => setDeleteOpen(true)}
          >
            <IconTrash className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Lessons list */}
      {expanded && (
        <div className="border-t">
          {lessons.length === 0 ? (
            <div className="text-muted-foreground px-4 py-4 text-center text-xs">
              Nenhuma aula ainda.{" "}
              <button
                type="button"
                onClick={openNewLesson}
                className="hover:text-foreground underline underline-offset-2"
              >
                Adicionar aula
              </button>
            </div>
          ) : (
            <SortableList
              items={lessons.slice().sort((a, b) => a.sort_order - b.sort_order)}
              onReorder={(reordered) => {
                reorderItems.mutate({
                  courseId,
                  type: "lessons",
                  items: reordered.map((l, i) => ({ id: l.id, sort_order: i })),
                });
              }}
              renderItem={(lesson) => <SortableLessonItem key={lesson.id} lesson={lesson} onEdit={openEditLesson} />}
              className="divide-y"
            />
          )}

          <div className="border-t p-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground w-full gap-1.5 text-xs"
              onClick={openNewLesson}
            >
              <IconPlus className="size-3.5" />
              Adicionar Aula
            </Button>
          </div>
        </div>
      )}

      {/* Lesson dialog */}
      <LessonEditorDialog
        open={lessonDialogOpen}
        onClose={() => {
          setLessonDialogOpen(false);
          setEditingLesson(null);
        }}
        moduleId={module.id}
        courseId={courseId}
        lesson={editingLesson}
      />

      {/* Delete confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir módulo?</DialogTitle>
            <DialogDescription>
              &ldquo;{module.title}&rdquo; e todas as suas aulas serão excluídos permanentemente. Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteModule}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
