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

const VALID_STATUSES = ["pending", "approved", "rejected", "flagged"] as const;
type CommentStatus = (typeof VALID_STATUSES)[number];

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
    const status = searchParams.get("status") as CommentStatus | null;

    const service = createServiceClient() as any;
    let query = service
      .from("academy_comments")
      .select(
        `
        *,
        profiles ( id, full_name, avatar_url ),
        academy_lessons (
          id, title,
          academy_modules (
            id, title,
            academy_courses ( id, title )
          )
        )
      `,
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (status && VALID_STATUSES.includes(status)) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Reshape to match AdminComment type
    const comments = (data ?? []).map((c: any) => ({
      ...c,
      user: c.profiles
        ? {
            email: c.profiles.id,
            full_name: c.profiles.full_name,
            avatar_url: c.profiles.avatar_url,
          }
        : null,
      lesson: c.academy_lessons
        ? {
            title: c.academy_lessons.title,
            module: c.academy_lessons.academy_modules
              ? {
                  title: c.academy_lessons.academy_modules.title,
                  course: c.academy_lessons.academy_modules.academy_courses
                    ? { title: c.academy_lessons.academy_modules.academy_courses.title }
                    : null,
                }
              : null,
          }
        : null,
      profiles: undefined,
      academy_lessons: undefined,
    }));

    return NextResponse.json(comments);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
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
    const { status } = body as { status: CommentStatus; id?: string; ids?: string[] };

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    const service = createServiceClient() as any;

    // Single comment via query param
    const { searchParams } = new URL(req.url);
    const singleId = searchParams.get("id");

    if (singleId) {
      const { data, error } = await service
        .from("academy_comments")
        .update({ status })
        .eq("id", singleId)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    // Batch update
    const { ids } = body as { ids?: string[] };
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "ids é obrigatório" }, { status: 400 });
    }

    const { error } = await service.from("academy_comments").update({ status }).in("id", ids);

    if (error) throw error;

    return NextResponse.json({ ok: true, updated: ids.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
