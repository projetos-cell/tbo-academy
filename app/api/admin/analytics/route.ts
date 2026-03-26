/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { SUPER_ADMIN_EMAILS, hasMinRole, type RoleSlug } from "@/lib/permissions";

async function getAdminRole(userId: string, email: string): Promise<RoleSlug> {
  if (SUPER_ADMIN_EMAILS.includes(email.toLowerCase())) return "founder";

  const supabase = await createClient();
  const { data: member } = await supabase
    .from("tenant_members")
    .select("roles ( slug )")
    .eq("user_id", userId)
    .eq("is_active", true)
    .maybeSingle();

  const roles = (member as Record<string, unknown>)?.roles as { slug: string } | null;
  return (roles?.slug as RoleSlug) ?? "colaborador";
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const role = await getAdminRole(user.id, user.email ?? "");
    if (!hasMinRole(role, "diretoria")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") ?? "30"; // days
    const days = parseInt(period, 10);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const prevSince = new Date(Date.now() - days * 2 * 24 * 60 * 60 * 1000).toISOString();

    const service = createServiceClient() as any;

    // Parallel queries for current period
    const [
      { count: totalCourses },
      { count: totalUsers },
      { count: totalEnrollments },
      { count: recentEnrollments },
      { count: prevEnrollments },
      { count: completedLessons },
      { count: prevCompletedLessons },
      { count: pendingComments },
      { data: topCourses },
      { data: dailyEnrollments },
      { data: dailyCompletions },
    ] = await Promise.all([
      service.from("academy_courses").select("*", { count: "exact", head: true }).neq("status", "archived"),
      service.from("profiles").select("*", { count: "exact", head: true }),
      service.from("academy_enrollments").select("*", { count: "exact", head: true }),
      service.from("academy_enrollments").select("*", { count: "exact", head: true }).gte("enrolled_at", since),
      service
        .from("academy_enrollments")
        .select("*", { count: "exact", head: true })
        .gte("enrolled_at", prevSince)
        .lt("enrolled_at", since),
      service
        .from("academy_lesson_progress")
        .select("*", { count: "exact", head: true })
        .eq("completed", true)
        .gte("updated_at", since),
      service
        .from("academy_lesson_progress")
        .select("*", { count: "exact", head: true })
        .eq("completed", true)
        .gte("updated_at", prevSince)
        .lt("updated_at", since),
      service.from("academy_comments").select("*", { count: "exact", head: true }).eq("status", "pending"),
      service
        .from("academy_enrollments")
        .select("course_id, academy_courses!inner(title, slug, thumbnail_url)")
        .gte("enrolled_at", since),
      service
        .from("academy_enrollments")
        .select("enrolled_at")
        .gte("enrolled_at", since)
        .order("enrolled_at", { ascending: true }),
      service
        .from("academy_lesson_progress")
        .select("updated_at")
        .eq("completed", true)
        .gte("updated_at", since)
        .order("updated_at", { ascending: true }),
    ]);

    // Aggregate top courses
    const courseCountMap: Record<string, { count: number; title: string; slug: string; thumbnail_url: string | null }> =
      {};
    for (const e of topCourses ?? []) {
      const c = (e as any).academy_courses as { title: string; slug: string; thumbnail_url: string | null };
      if (!c) continue;
      const key = (e as any).course_id;
      if (!courseCountMap[key]) {
        courseCountMap[key] = { count: 0, title: c.title, slug: c.slug, thumbnail_url: c.thumbnail_url };
      }
      courseCountMap[key].count++;
    }
    const topCoursesRanked = Object.entries(courseCountMap)
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Build daily series (bucketed by date)
    function bucketByDay(
      items: Array<{ enrolled_at?: string; updated_at?: string }>,
      dateKey: "enrolled_at" | "updated_at",
    ) {
      const buckets: Record<string, number> = {};
      for (const item of items ?? []) {
        const raw = item[dateKey];
        if (!raw) continue;
        const day = raw.slice(0, 10);
        buckets[day] = (buckets[day] ?? 0) + 1;
      }
      // Fill all days in range
      const result: Array<{ date: string; value: number }> = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const day = d.toISOString().slice(0, 10);
        result.push({ date: day, value: buckets[day] ?? 0 });
      }
      return result;
    }

    const enrollmentSeries = bucketByDay(dailyEnrollments ?? [], "enrolled_at");
    const completionSeries = bucketByDay(dailyCompletions ?? [], "updated_at");

    // Trend calcs
    function trend(current: number, previous: number) {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    }

    return NextResponse.json({
      overview: {
        totalCourses: totalCourses ?? 0,
        totalUsers: totalUsers ?? 0,
        totalEnrollments: totalEnrollments ?? 0,
        recentEnrollments: recentEnrollments ?? 0,
        completedLessons: completedLessons ?? 0,
        pendingComments: pendingComments ?? 0,
        enrollmentTrend: trend(recentEnrollments ?? 0, prevEnrollments ?? 0),
        completionTrend: trend(completedLessons ?? 0, prevCompletedLessons ?? 0),
      },
      topCourses: topCoursesRanked,
      enrollmentSeries,
      completionSeries,
      period: days,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
