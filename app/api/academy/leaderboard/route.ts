import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Use untyped client to avoid deeply nested type issues
async function createUntyped() {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {}
      },
    },
  });
}

export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = (await createUntyped()) as any;

    // Fetch all completed module progress
    const { data: progressData, error: progressError } = await supabase
      .from("academy_user_progress")
      .select("user_id, module_id, status")
      .eq("status", "completed");

    if (progressError || !progressData || progressData.length === 0) {
      return NextResponse.json({ leaderboard: [] });
    }

    // Fetch module → course mapping
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const moduleIds = [...new Set(progressData.map((r: any) => r.module_id))];
    const { data: modulesData } = await supabase.from("academy_modules").select("id, course_id").in("id", moduleIds);

    const moduleCourseMap: Record<string, string> = {};
    for (const m of modulesData ?? []) {
      moduleCourseMap[m.id] = m.course_id;
    }

    // Fetch course total_modules
    const courseIds = [...new Set(Object.values(moduleCourseMap))];
    const { data: coursesData } =
      courseIds.length > 0
        ? await supabase.from("academy_courses").select("id, total_modules").in("id", courseIds)
        : { data: [] };

    const courseTotals: Record<string, number> = {};
    for (const c of coursesData ?? []) {
      courseTotals[c.id] = c.total_modules ?? 0;
    }

    // Aggregate per user
    const userModules: Record<string, Set<string>> = {};
    const userCourseModules: Record<string, Record<string, Set<string>>> = {};

    for (const row of progressData) {
      const userId = row.user_id;
      const moduleId = row.module_id;
      const courseId = moduleCourseMap[moduleId];

      if (!userModules[userId]) userModules[userId] = new Set();
      userModules[userId].add(moduleId);

      if (courseId) {
        if (!userCourseModules[userId]) userCourseModules[userId] = {};
        if (!userCourseModules[userId][courseId]) userCourseModules[userId][courseId] = new Set();
        userCourseModules[userId][courseId].add(moduleId);
      }
    }

    // Calculate points: 10 per module, 50 bonus per fully completed course
    const entries = Object.entries(userModules)
      .map(([userId, modules]) => {
        const completedCourses = Object.entries(userCourseModules[userId] ?? {}).filter(([courseId, mods]) => {
          const total = courseTotals[courseId] ?? 0;
          return total > 0 && mods.size >= total;
        }).length;

        return {
          user_id: userId,
          points: modules.size * 10 + completedCourses * 50,
          completed_modules: modules.size,
          completed_courses: completedCourses,
        };
      })
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);

    // Fetch user profiles
    const userIds = entries.map((e) => e.user_id);
    const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", userIds);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));

    const leaderboard = entries.map((entry, idx) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const profile = profileMap.get(entry.user_id) as any;
      const name: string = profile?.full_name ?? `Usuário ${entry.user_id.slice(0, 4).toUpperCase()}`;
      const avatar = name
        .split(" ")
        .slice(0, 2)
        .map((n: string) => n[0] ?? "")
        .join("")
        .toUpperCase();

      return {
        id: entry.user_id,
        name,
        avatar,
        points: entry.points,
        rank: idx + 1,
      };
    });

    return NextResponse.json({ leaderboard });
  } catch (err) {
    console.error("Leaderboard error:", err);
    return NextResponse.json({ leaderboard: [] });
  }
}
