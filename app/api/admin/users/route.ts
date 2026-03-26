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

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "50", 10);
    const offset = (page - 1) * limit;

    const service = createServiceClient() as any;

    // Fetch profiles with pagination
    let profileQuery = service
      .from("profiles")
      .select("id, full_name, avatar_url, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      profileQuery = profileQuery.ilike("full_name", `%${search}%`);
    }

    const { data: profiles, error: profilesError, count } = await profileQuery;

    if (profilesError) throw profilesError;

    const profileIds = (profiles ?? []).map((p: any) => p.id);

    if (profileIds.length === 0) {
      return NextResponse.json({ users: [], total: count ?? 0 });
    }

    // Fetch auth emails via admin API (service client has access)
    const { data: authUsers, error: authError } = await service.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (authError) throw authError;

    const emailMap: Record<string, string> = {};
    for (const u of authUsers?.users ?? []) {
      emailMap[u.id] = u.email ?? "";
    }

    // Fetch roles for these users
    const { data: members } = await service
      .from("tenant_members")
      .select("user_id, roles ( slug )")
      .in("user_id", profileIds)
      .eq("is_active", true);

    const roleMap: Record<string, string> = {};
    for (const m of members ?? []) {
      const r = (m as any).roles as { slug: string } | null;
      if (r?.slug) roleMap[m.user_id] = r.slug;
    }

    // Fetch enrollment counts
    const { data: enrollments } = await service
      .from("academy_enrollments")
      .select("user_id, course_id")
      .in("user_id", profileIds);

    const enrollmentCountMap: Record<string, number> = {};
    for (const e of enrollments ?? []) {
      enrollmentCountMap[e.user_id] = (enrollmentCountMap[e.user_id] ?? 0) + 1;
    }

    const users = (profiles ?? []).map((p: any) => ({
      id: p.id,
      email: emailMap[p.id] ?? "",
      full_name: p.full_name,
      avatar_url: p.avatar_url,
      role: roleMap[p.id] ?? null,
      enrollment_count: enrollmentCountMap[p.id] ?? 0,
      created_at: p.created_at,
    }));

    return NextResponse.json({ users, total: count ?? 0 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH: Manage enrollments for a user
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
    const { userId, courseId, action } = body as {
      userId: string;
      courseId: string;
      action: "enroll" | "unenroll";
    };

    if (!userId || !courseId || !action) {
      return NextResponse.json({ error: "userId, courseId e action são obrigatórios" }, { status: 400 });
    }

    const service = createServiceClient() as any;

    if (action === "enroll") {
      const { data, error } = await service
        .from("academy_enrollments")
        .upsert({ user_id: userId, course_id: courseId }, { onConflict: "user_id,course_id" })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json(data);
    } else {
      const { error } = await service
        .from("academy_enrollments")
        .delete()
        .eq("user_id", userId)
        .eq("course_id", courseId);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
