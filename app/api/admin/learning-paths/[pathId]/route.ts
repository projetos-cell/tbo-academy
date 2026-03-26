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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ pathId: string }> }) {
  try {
    const { pathId } = await params;
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
    const { course_ids, ...fields } = body;

    const service = createServiceClient() as any;

    // Update path metadata
    const updateFields = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));
    if (Object.keys(updateFields).length > 0) {
      const { error } = await service
        .from("academy_learning_paths")
        .update({ ...updateFields, updated_at: new Date().toISOString() })
        .eq("id", pathId);
      if (error) throw error;
    }

    // Replace course associations if provided
    if (Array.isArray(course_ids)) {
      await service.from("academy_learning_path_courses").delete().eq("learning_path_id", pathId);

      if (course_ids.length > 0) {
        const links = course_ids.map((cid: string, i: number) => ({
          learning_path_id: pathId,
          course_id: cid,
          sort_order: i,
        }));
        const { error: linkError } = await service.from("academy_learning_path_courses").insert(links);
        if (linkError) throw linkError;
      }
    }

    const { data: updated } = await service.from("academy_learning_paths").select("*").eq("id", pathId).single();

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ pathId: string }> }) {
  try {
    const { pathId } = await params;
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

    // Remove associations first
    await service.from("academy_learning_path_courses").delete().eq("learning_path_id", pathId);

    const { error } = await service.from("academy_learning_paths").delete().eq("id", pathId);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Erro interno" }, { status: 500 });
  }
}
