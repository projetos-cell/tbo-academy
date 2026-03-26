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
    const { module_id, title } = body;

    if (!module_id || !title) {
      return NextResponse.json({ error: "module_id e title são obrigatórios" }, { status: 400 });
    }

    const service = createServiceClient() as any;

    // Get next sort_order for this module
    const { data: last } = await service
      .from("academy_lessons")
      .select("sort_order")
      .eq("module_id", module_id)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const sort_order = ((last?.sort_order as number | null) ?? 0) + 1;

    const { data: lesson, error } = await service
      .from("academy_lessons")
      .insert({
        module_id,
        title,
        description: body.description ?? null,
        video_url: body.video_url ?? null,
        video_duration_sec: body.video_duration_sec ?? null,
        is_free: body.is_free ?? false,
        status: "draft",
        sort_order,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(lesson, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
