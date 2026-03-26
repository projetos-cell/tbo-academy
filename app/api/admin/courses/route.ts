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

export async function GET() {
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

    const service = createServiceClient() as any;
    const { data: courses, error } = await service
      .from("academy_courses")
      .select(
        `
        *,
        academy_modules (
          id,
          academy_lessons ( id )
        )
      `,
      )
      .order("sort_order", { ascending: true });

    if (error) throw error;

    const enriched = (courses ?? []).map((c: any) => {
      const modules = (c.academy_modules as { id: string; academy_lessons: { id: string }[] }[]) ?? [];
      const module_count = modules.length;
      const lesson_count = modules.reduce(
        (acc: number, m: { academy_lessons?: { id: string }[] }) => acc + (m.academy_lessons?.length ?? 0),
        0,
      );
      const { academy_modules: _modules, ...rest } = c;
      return { ...rest, module_count, lesson_count };
    });

    return NextResponse.json(enriched);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { title, slug, description, category, instructor, thumbnail_url, level, tags } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "title e slug são obrigatórios" }, { status: 400 });
    }

    const service = createServiceClient() as any;

    // Get next sort_order
    const { data: last } = await service
      .from("academy_courses")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const sort_order = ((last?.sort_order as number | null) ?? 0) + 1;

    const { data: course, error } = await service
      .from("academy_courses")
      .insert({
        title,
        slug,
        description: description ?? null,
        category: category ?? null,
        instructor: instructor ?? null,
        thumbnail_url: thumbnail_url ?? null,
        level: level ?? null,
        tags: tags ?? [],
        status: "draft",
        sort_order,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(course, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
