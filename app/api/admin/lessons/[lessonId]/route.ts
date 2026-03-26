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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ lessonId: string }> }) {
  try {
    const { lessonId } = await params;
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
    const service = createServiceClient() as any;

    const { data: lesson, error } = await service
      .from("academy_lessons")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", lessonId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(lesson);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ lessonId: string }> }) {
  try {
    const { lessonId } = await params;
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

    const { error } = await service.from("academy_lessons").delete().eq("id", lessonId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
