"use client";

import { useQuery } from "@tanstack/react-query";
import { adminFetch } from "@/features/admin/lib/admin-api";

export interface AnalyticsOverview {
  totalCourses: number;
  totalUsers: number;
  totalEnrollments: number;
  recentEnrollments: number;
  completedLessons: number;
  pendingComments: number;
  enrollmentTrend: number;
  completionTrend: number;
}

export interface TopCourse {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  count: number;
}

export interface DaySeries {
  date: string;
  value: number;
}

export interface AnalyticsData {
  overview: AnalyticsOverview;
  topCourses: TopCourse[];
  enrollmentSeries: DaySeries[];
  completionSeries: DaySeries[];
  period: number;
}

export function useAdminAnalytics(period: 7 | 30 | 90 = 30) {
  return useQuery({
    queryKey: ["admin", "analytics", period],
    queryFn: () => adminFetch<AnalyticsData>(`/api/admin/analytics?period=${period}`),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
