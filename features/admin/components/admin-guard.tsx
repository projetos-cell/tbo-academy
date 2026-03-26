import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SUPER_ADMIN_EMAILS, hasMinRole, type RoleSlug } from "@/lib/permissions";

/**
 * Server component wrapper that enforces founder/diretoria role.
 * Redirects to "/" if the current user doesn't have admin access.
 */
export async function AdminGuard({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Super-admin bypass
  if (SUPER_ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
    return <>{children}</>;
  }

  // Check role via tenant_members
  const { data: member } = await supabase
    .from("tenant_members")
    .select("roles ( slug )")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  const slug = (member as Record<string, unknown>)?.roles as { slug: string } | null;
  const role = (slug?.slug ?? "colaborador") as RoleSlug;

  if (!hasMinRole(role, "diretoria")) {
    redirect("/");
  }

  return <>{children}</>;
}
