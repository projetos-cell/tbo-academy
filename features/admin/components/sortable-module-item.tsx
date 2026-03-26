"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ModulePanel } from "@/features/admin/components/module-panel";
import type { AdminModule, AdminLesson } from "@/features/admin/types";

interface SortableModuleItemProps {
  module: AdminModule & { lessons?: AdminLesson[] };
  courseId: string;
}

export function SortableModuleItem({ module, courseId }: SortableModuleItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ModulePanel module={module} courseId={courseId} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
}
