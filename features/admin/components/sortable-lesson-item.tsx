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
      className="group/lesson hover:bg-paper-off flex items-center gap-2 px-3 py-2 transition-colors"
    >
      <button
        type="button"
        className="hover:text-ink shrink-0 cursor-grab touch-none text-[var(--tbo-gray-500)]/40 transition-colors"
        {...attributes}
        {...listeners}
      >
        <IconGripVertical className="size-3.5" />
      </button>
      <IconVideo className="text-forest-500/70 size-3.5 shrink-0" />
      <span className="flex-1 truncate text-sm">{lesson.title}</span>

      {lesson.is_free ? (
        <IconLockOpen className="text-forest-600 size-3.5 shrink-0" title="Aula gratuita" />
      ) : (
        <IconLock className="size-3.5 shrink-0 text-[var(--tbo-gray-500)]/40" title="Aula restrita" />
      )}

      <Badge
        variant="outline"
        className={
          lesson.status === "published"
            ? "bg-volt text-ink shrink-0 border-0 px-1.5 py-0 text-[10px] font-bold"
            : "bg-paper-off shrink-0 border border-black/[0.06] px-1.5 py-0 text-[10px] font-semibold text-[var(--tbo-gray-600)]"
        }
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
