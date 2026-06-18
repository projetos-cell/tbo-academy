"use client";

import { toast } from "sonner";
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useUpdateCourse } from "@/features/admin/hooks/use-admin-courses";
import type { AdminCourse } from "@/features/admin/types";
import { cn } from "@/lib/utils";

interface PublishToggleProps {
  course: AdminCourse;
}

export function PublishToggle({ course }: PublishToggleProps) {
  const updateCourse = useUpdateCourse();
  const isPublished = course.status === "published";

  function handleToggle() {
    const newStatus = isPublished ? "draft" : "published";
    toast.promise(updateCourse.mutateAsync({ id: course.id, status: newStatus }), {
      loading: isPublished ? "Voltando para rascunho..." : "Publicando...",
      success: isPublished ? "Movido para rascunho" : "Curso publicado!",
      error: (err) => err.message,
    });
  }

  return (
    <Button
      size="sm"
      onClick={handleToggle}
      disabled={updateCourse.isPending}
      className={cn(
        "gap-1.5 rounded-full font-bold",
        isPublished ? "bg-volt text-ink hover:bg-volt-600" : "bg-forest-900 hover:bg-ink text-white",
      )}
    >
      {updateCourse.isPending ? (
        <IconLoader2 className="size-3.5 animate-spin" />
      ) : isPublished ? (
        <IconEyeOff className="size-3.5" />
      ) : (
        <IconEye className="size-3.5" />
      )}
      {isPublished ? "Despublicar" : "Publicar"}
    </Button>
  );
}
