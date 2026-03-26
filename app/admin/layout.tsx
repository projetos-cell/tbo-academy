import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Header } from "@/components/layout/header";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { createClient } from "@/lib/supabase/server";
import { SUPER_ADMIN_EMAILS, hasMinRole, type RoleSlug } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Determine role
  let role: RoleSlug = "colaborador";

  if (SUPER_ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? "")) {
    role = "founder";
  } else {
    const { data: member } = await supabase
      .from("tenant_members")
      .select("roles ( slug )")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    const slug = (member as Record<string, unknown>)?.roles as { slug: string } | null;
    if (slug?.slug) {
      role = slug.slug as RoleSlug;
    }
  }

  if (!hasMinRole(role, "diretoria")) {
    redirect("/");
  }

  const cookieStore = await cookies();
  const sidebarCookie = cookieStore.get("sidebar_state");
  const defaultOpen = sidebarCookie ? sidebarCookie.value === "true" : true;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AdminSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
