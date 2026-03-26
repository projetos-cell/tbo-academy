"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconBook2,
  IconStack2,
  IconMessageCircle,
  IconUsers,
  IconChartBar,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const ADMIN_NAV = [
  {
    label: "Geral",
    items: [
      { href: "/admin", label: "Dashboard", icon: IconLayoutDashboard, exact: true },
      { href: "/admin/analytics", label: "Análises", icon: IconChartBar },
    ],
  },
  {
    label: "Conteúdo",
    items: [
      { href: "/admin/cursos", label: "Cursos", icon: IconBook2 },
      { href: "/admin/trilhas", label: "Trilhas de Aprendizado", icon: IconStack2 },
    ],
  },
  {
    label: "Comunidade",
    items: [
      { href: "/admin/comentarios", label: "Comentários", icon: IconMessageCircle },
      { href: "/admin/usuarios", label: "Usuários", icon: IconUsers },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-[#BAF241]">
            <span className="text-[10px] font-black text-[#02261C]">A</span>
          </div>
          <div>
            <p className="text-xs leading-none font-bold">TBO Academy</p>
            <p className="text-muted-foreground mt-0.5 text-[10px] leading-none">Painel Admin</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {ADMIN_NAV.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
