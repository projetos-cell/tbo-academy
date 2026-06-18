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
          <span className="text-forest-500 text-xs font-bold tracking-[0.14em] uppercase">Administração</span>
          <DialogTitle className="font-display tracking-tight">Gerenciar Matrículas</DialogTitle>
        </DialogHeader>

        {user && (
          <div className="flex items-center gap-3 border-b border-black/[0.06] pb-4">
            <Avatar className="size-10">
              <AvatarImage src={user.avatar_url ?? undefined} />
              <AvatarFallback className="bg-forest-900 text-volt text-xs font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.full_name ?? "Sem nome"}</p>
              <p className="truncate text-xs text-[var(--tbo-gray-500)]">{user.email}</p>
            </div>
          </div>
        )}

        <div className="flex-1 space-y-1 overflow-y-auto py-1">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)
          ) : publishedCourses.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--tbo-gray-500)]">Nenhum curso disponível.</p>
          ) : (
            publishedCourses.map((course) => {
              const enrolled = enrolledCourseIds.has(course.id);
              const isPending = manageEnrollment.isPending && manageEnrollment.variables?.courseId === course.id;

              return (
                <div
                  key={course.id}
                  className="hover:bg-paper-off flex items-center gap-3 rounded-xl px-3 py-3 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{course.title}</p>
                    {course.category && <p className="text-xs text-[var(--tbo-gray-500)]">{course.category}</p>}
                  </div>
                  {isPending ? (
                    <IconLoader2 className="size-4 animate-spin text-[var(--tbo-gray-500)]" />
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

        <div className="flex items-center justify-between border-t border-black/[0.06] pt-3 text-xs text-[var(--tbo-gray-500)]">
          <span>
            {enrolledCourseIds.size} de {publishedCourses.length} curso(s) matriculado(s)
          </span>
          <button
            onClick={() => onOpenChange(false)}
            className="hover:text-ink flex items-center gap-1 font-semibold transition-colors"
          >
            <IconX className="size-3" />
            Fechar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
