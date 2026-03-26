"use client";

import { toast } from "sonner";
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useUpdateCourse } from "@/features/admin/hooks/use-admin-courses";
import type { AdminCourse } from "@/features/admin/types";

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
      variant={isPublished ? "outline" : "default"}
      size="sm"
      onClick={handleToggle}
      disabled={updateCourse.isPending}
      className="gap-1.5"
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
