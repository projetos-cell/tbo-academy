/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  try {
    const service = createServiceClient() as any;

    const { data, error } = await service
      .from("academy_learning_paths")
      .select(
        `
        id, title, slug, description, thumbnail_url, sort_order, status,
        academy_learning_path_courses (
          sort_order,
          course_id
        )
      `,
      )
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    const paths = (data ?? []).map((p: any) => {
      const courseLinks = (p.academy_learning_path_courses ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order);
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description ?? "",
        thumbnail_url: p.thumbnail_url,
        sort_order: p.sort_order,
        status: p.status,
        courseIds: courseLinks.map((lpc: any) => lpc.course_id),
        totalCourses: courseLinks.length,
      };
    });

    return NextResponse.json(paths);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Erro interno" }, { status: 500 });
  }
}
