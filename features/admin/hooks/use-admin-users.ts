"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/features/admin/lib/admin-api";
import type { AdminUser, AdminCourse } from "@/features/admin/types";

const USERS_KEY = ["admin", "users"] as const;
const COURSES_KEY = ["admin", "courses"] as const;

interface UsersResponse {
  users: AdminUser[];
  total: number;
}

interface UserEnrollment {
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
}

export function useAdminUsers(options?: { search?: string; page?: number; limit?: number }) {
  const { search = "", page = 1, limit = 50 } = options ?? {};
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  params.set("page", String(page));
  params.set("limit", String(limit));

  return useQuery({
    queryKey: [...USERS_KEY, search, page, limit],
    queryFn: () => adminFetch<UsersResponse>(`/api/admin/users?${params.toString()}`),
    staleTime: 30_000,
  });
}

export function useAdminCoursesList() {
  return useQuery({
    queryKey: COURSES_KEY,
    queryFn: () => adminFetch<AdminCourse[]>("/api/admin/courses"),
    staleTime: 60_000,
  });
}

export function useUserEnrollments(userId: string | null) {
  return useQuery({
    queryKey: ["admin", "user-enrollments", userId],
    queryFn: () => adminFetch<UserEnrollment[]>(`/api/admin/users/enrollments?userId=${userId}`),
    enabled: !!userId,
    staleTime: 15_000,
  });
}

export function useManageEnrollment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, courseId, action }: { userId: string; courseId: string; action: "enroll" | "unenroll" }) =>
      adminFetch("/api/admin/users", {
        method: "PATCH",
        body: JSON.stringify({ userId, courseId, action }),
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
      qc.invalidateQueries({
        queryKey: ["admin", "user-enrollments", variables.userId],
      });
    },
  });
}
