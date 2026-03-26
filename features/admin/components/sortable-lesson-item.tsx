"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconEdit, IconGripVertical, IconLock, IconLockOpen, IconVideo } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminLesson } from "@/features/admin/types";

interface SortableLessonItemProps {
  lesson: AdminLesson;
  onEdit: (lesson: AdminLesson) => void;
}

export function SortableLessonItem({ lesson, onEdit }: SortableLessonItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="group/lesson hover:bg-muted/40 flex items-center gap-2 px-3 py-2 transition-colors"
    >
      <button
        type="button"
        className="text-muted-foreground/40 hover:text-muted-foreground shrink-0 cursor-grab touch-none transition-colors"
        {...attributes}
        {...listeners}
      >
        <IconGripVertical className="size-3.5" />
      </button>
      <IconVideo className="text-muted-foreground/60 size-3.5 shrink-0" />
      <span className="flex-1 truncate text-sm">{lesson.title}</span>

      {lesson.is_free ? (
        <IconLockOpen className="size-3.5 shrink-0 text-green-500" title="Aula gratuita" />
      ) : (
        <IconLock className="text-muted-foreground/40 size-3.5 shrink-0" title="Aula restrita" />
      )}

      <Badge
        variant={lesson.status === "published" ? "default" : "secondary"}
        className="shrink-0 px-1.5 py-0 text-[10px]"
      >
        {lesson.status === "published" ? "Publicada" : "Rascunho"}
      </Badge>

      <Button
        size="icon"
        variant="ghost"
        className="size-6 shrink-0 opacity-0 transition-opacity group-hover/lesson:opacity-100"
        onClick={() => onEdit(lesson)}
      >
        <IconEdit className="size-3" />
      </Button>
    </li>
  );
}
