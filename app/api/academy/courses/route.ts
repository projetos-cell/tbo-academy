/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const service = createServiceClient() as any;

    // Fetch all published courses with module/lesson counts
    const { data: courses, error } = await service
      .from("academy_courses")
      .select(
        `
        id, title, slug, description, category, instructor,
        thumbnail_url, level, status, sort_order, tags,
        academy_modules ( id, academy_lessons ( id, video_duration_sec ) )
      `,
      )
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    let progressMap: Record<string, { completed: number; total: number }> = {};
    let enrolledCourseIds = new Set<string>();

    if (user) {
      // Fetch user enrollments
      const { data: enrollments } = await service
        .from("academy_enrollments")
        .select("course_id")
        .eq("user_id", user.id);

      enrolledCourseIds = new Set((enrollments ?? []).map((e: any) => e.course_id));

      // Fetch lesson progress
      const lessonIds = (courses ?? []).flatMap((c: any) =>
        (c.academy_modules ?? []).flatMap((m: any) => (m.academy_lessons ?? []).map((l: any) => l.id)),
      );

      if (lessonIds.length > 0) {
        const { data: progress } = await service
          .from("academy_lesson_progress")
          .select("lesson_id, completed")
          .eq("user_id", user.id)
          .in("lesson_id", lessonIds);

        // Build a lesson->course map
        const lessonCourseMap: Record<string, string> = {};
        for (const course of courses ?? []) {
          for (const mod of course.academy_modules ?? []) {
            for (const lesson of mod.academy_lessons ?? []) {
              lessonCourseMap[lesson.id] = course.id;
            }
          }
        }

        for (const p of progress ?? []) {
          const cid = lessonCourseMap[p.lesson_id];
          if (!cid) continue;
          if (!progressMap[cid]) progressMap[cid] = { completed: 0, total: 0 };
          progressMap[cid].total++;
          if (p.completed) progressMap[cid].completed++;
        }
      }
    }

    // Map to client-friendly shape
    const result = (courses ?? []).map((c: any) => {
      const modules = c.academy_modules ?? [];
      const totalLessons = modules.reduce((acc: number, m: any) => acc + (m.academy_lessons?.length ?? 0), 0);
      const totalDurationSec = modules.reduce(
        (acc: number, m: any) =>
          acc + (m.academy_lessons ?? []).reduce((a: number, l: any) => a + (l.video_duration_sec ?? 0), 0),
        0,
      );
      const prog = progressMap[c.id];
      const completedLessons = prog?.completed ?? 0;
      const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      const isEnrolled = enrolledCourseIds.has(c.id);

      // Derive user-facing status
      let userStatus: "em_andamento" | "concluido" | "nao_iniciado" = "nao_iniciado";
      if (isEnrolled) {
        userStatus = progressPct >= 100 ? "concluido" : progressPct > 0 ? "em_andamento" : "nao_iniciado";
      }

      // Format duration
      const hours = Math.floor(totalDurationSec / 3600);
      const mins = Math.floor((totalDurationSec % 3600) / 60);
      const duration = hours > 0 ? `${hours}h ${mins > 0 ? `${mins}min` : ""}`.trim() : mins > 0 ? `${mins}min` : "—";

      return {
        id: c.id,
        title: c.title,
        slug: c.slug,
        description:
          typeof c.description === "string" ? c.description : (c.description?.text ?? c.description?.content ?? ""),
        category: c.category ?? "Geral",
        instructor: c.instructor ?? "TBO",
        thumbnail: c.thumbnail_url ?? "",
        thumbnail_url: c.thumbnail_url,
        duration,
        totalModules: modules.length,
        completedModules: completedLessons,
        progress: progressPct,
        rating: 4.8,
        students: 0,
        level: c.level ?? "iniciante",
        status: userStatus,
        tags: c.tags ?? [],
        isEnrolled,
        sort_order: c.sort_order,
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Erro interno" }, { status: 500 });
  }
}
