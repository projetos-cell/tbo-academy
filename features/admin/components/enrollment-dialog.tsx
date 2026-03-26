"use client";

import { toast } from "sonner";
import { IconLoader2, IconX } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAdminCoursesList, useUserEnrollments, useManageEnrollment } from "@/features/admin/hooks/use-admin-users";
import type { AdminUser } from "@/features/admin/types";

interface EnrollmentDialogProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnrollmentDialog({ user, open, onOpenChange }: EnrollmentDialogProps) {
  const { data: courses, isLoading: loadingCourses } = useAdminCoursesList();
  const { data: enrollments, isLoading: loadingEnrollments } = useUserEnrollments(open ? (user?.id ?? null) : null);
  const manageEnrollment = useManageEnrollment();

  const enrolledCourseIds = new Set((enrollments ?? []).map((e) => e.course_id));
  const isLoading = loadingCourses || loadingEnrollments;

  function handleToggle(courseId: string, currentlyEnrolled: boolean) {
    if (!user) return;
    const action = currentlyEnrolled ? "unenroll" : "enroll";
    const label = currentlyEnrolled ? "Matrícula removida" : "Matriculado com sucesso";

    toast.promise(manageEnrollment.mutateAsync({ userId: user.id, courseId, action }), {
      loading: currentlyEnrolled ? "Removendo matrícula..." : "Matriculando...",
      success: label,
      error: (err) => err.message,
    });
  }

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() ?? "??");

  const publishedCourses = (courses ?? []).filter((c) => c.status !== "archived");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] max-w-lg flex-col">
        <DialogHeader>
          <DialogTitle>Gerenciar Matrículas</DialogTitle>
        </DialogHeader>

        {user && (
          <div className="flex items-center gap-3 border-b pb-4">
            <Avatar className="size-10">
              <AvatarImage src={user.avatar_url ?? undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.full_name ?? "Sem nome"}</p>
              <p className="text-muted-foreground truncate text-xs">{user.email}</p>
            </div>
          </div>
        )}

        <div className="flex-1 space-y-1 overflow-y-auto py-1">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)
          ) : publishedCourses.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">Nenhum curso disponível.</p>
          ) : (
            publishedCourses.map((course) => {
              const enrolled = enrolledCourseIds.has(course.id);
              const isPending = manageEnrollment.isPending && manageEnrollment.variables?.courseId === course.id;

              return (
                <div
                  key={course.id}
                  className="hover:bg-muted/50 flex items-center gap-3 rounded-lg px-3 py-3 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{course.title}</p>
                    {course.category && <p className="text-muted-foreground text-xs">{course.category}</p>}
                  </div>
                  {isPending ? (
                    <IconLoader2 className="text-muted-foreground size-4 animate-spin" />
                  ) : (
                    <Switch
                      checked={enrolled}
                      onCheckedChange={() => handleToggle(course.id, enrolled)}
                      disabled={manageEnrollment.isPending}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="text-muted-foreground flex items-center justify-between border-t pt-3 text-xs">
          <span>
            {enrolledCourseIds.size} de {publishedCourses.length} curso(s) matriculado(s)
          </span>
          <button
            onClick={() => onOpenChange(false)}
            className="hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <IconX className="size-3" />
            Fechar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
