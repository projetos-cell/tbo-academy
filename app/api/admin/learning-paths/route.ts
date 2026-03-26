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

    const service = createServiceClient() as any;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = service
      .from("academy_learning_paths")
      .select(
        `
        *,
        academy_learning_path_courses (
          sort_order,
          academy_courses ( id, title, slug, thumbnail_url, status, level )
        )
      `,
      )
      .order("sort_order", { ascending: true });

    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) throw error;

    // Flatten nested courses
    const paths = (data ?? []).map((p: any) => {
      const courses = (p.academy_learning_path_courses ?? [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((lpc: any) => lpc.academy_courses)
        .filter(Boolean);
      const { academy_learning_path_courses: _, ...rest } = p;
      return { ...rest, courses };
    });

    return NextResponse.json(paths);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Erro interno" }, { status: 500 });
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
    const { title, slug, description, thumbnail_url, status = "draft", course_ids = [] } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "title e slug são obrigatórios" }, { status: 400 });
    }

    const service = createServiceClient() as any;

    // Get max sort_order
    const { data: maxRow } = await service
      .from("academy_learning_paths")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const sort_order = (maxRow?.sort_order ?? -1) + 1;

    const { data: path, error } = await service
      .from("academy_learning_paths")
      .insert({ title, slug, description, thumbnail_url, status, sort_order })
      .select()
      .single();
    if (error) throw error;

    // Insert course associations
    if (course_ids.length > 0) {
      const links = course_ids.map((cid: string, i: number) => ({
        learning_path_id: path.id,
        course_id: cid,
        sort_order: i,
      }));
      const { error: linkError } = await service.from("academy_learning_path_courses").insert(links);
      if (linkError) throw linkError;
    }

    return NextResponse.json(path, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Erro interno" }, { status: 500 });
  }
}
