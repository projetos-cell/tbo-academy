/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * Public (anonymous) endpoint that returns a single PUBLISHED course with its
 * modules and lessons. No auth required — the app runs in guest mode and the
 * per-lesson gating is handled client-side by <ContentGate />.
 *
 * Shape returned:
 *   {
 *     course: Course,            // features/courses/types -> Course
 *     modules: CourseModule[],   // flattened published lessons (ordered)
 *   }
 *
 * Mapping notes (DB -> client):
 *   - academy_modules  = course sections (container, has sort_order)
 *   - academy_lessons  = the playable items the UI calls "módulos" (CourseModule)
 *   - A guest has no progress, so every lesson defaults to a clean, playable,
 *     non-locked state ("nao_iniciado"). Completion/lock state is layered on
 *     client-side by useCourseProgress + ContentGate.
 */

function formatDuration(totalSec: number): string {
  if (!totalSec || totalSec <= 0) return "—";
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  if (hours > 0) return `${hours}h ${mins > 0 ? `${mins}min` : ""}`.trim();
  return mins > 0 ? `${mins}min` : "—";
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await params;
    const service = createServiceClient() as any;

    const { data: course, error } = await service
      .from("academy_courses")
      .select(
        `
        id, title, slug, description, category, instructor,
        thumbnail_url, level, status, sort_order, tags, total_modules,
        academy_modules (
          id, course_id, title, sort_order,
          academy_lessons (
            id, module_id, title, video_url, video_duration_sec,
            sort_order, is_free, status
          )
        )
      `,
      )
      .eq("id", courseId)
      .eq("status", "published")
      .maybeSingle();

    if (error) throw error;
    if (!course) {
      return NextResponse.json({ error: "Curso não encontrado" }, { status: 404 });
    }

    // ── Modules (DB sections) ordered by sort_order ──
    const dbModules = [...((course.academy_modules ?? []) as any[])].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    );

    // ── Flatten lessons across modules into CourseModule[] (the page's shape) ──
    // Only published lessons are exposed. Global order = module order, then lesson order.
    const modules: any[] = [];
    let order = 1;
    let totalDurationSec = 0;

    for (const m of dbModules) {
      const lessons = [...((m.academy_lessons ?? []) as any[])]
        .filter((l) => l.status === "published")
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

      for (const l of lessons) {
        totalDurationSec += l.video_duration_sec ?? 0;
        modules.push({
          id: l.id,
          courseId: course.id,
          title: l.title,
          duration: formatDuration(l.video_duration_sec ?? 0),
          order: order++,
          // Guest default: clean, clickable, non-locked. Completion is derived
          // client-side from useCourseProgress; ContentGate handles access.
          status: "nao_iniciado",
          videoUrl: l.video_url ?? undefined,
        });
      }
    }

    const totalLessons = modules.length;

    const description =
      typeof course.description === "string"
        ? course.description
        : (course.description?.text ?? course.description?.content ?? "");

    const result = {
      course: {
        id: course.id,
        title: course.title,
        description,
        category: course.category ?? "Geral",
        instructor: course.instructor ?? "TBO",
        thumbnail: course.thumbnail_url ?? "",
        duration: formatDuration(totalDurationSec),
        totalModules: totalLessons,
        completedModules: 0,
        progress: 0,
        rating: 4.8,
        students: 0,
        level: course.level ?? "iniciante",
        status: "nao_iniciado",
        tags: course.tags ?? [],
      },
      modules,
    };

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Erro interno" }, { status: 500 });
  }
}
