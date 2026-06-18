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
import { TboMark } from "@/components/brand/tbo-logo";

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
      <SidebarHeader className="border-sidebar-border border-b px-3 pt-3 pb-3">
        <Link
          href="/admin"
          className="flex items-center gap-2.5 px-1 transition-opacity hover:opacity-80"
          aria-label="TBO Academy — Painel Admin"
        >
          <TboMark className="h-7 w-7 shrink-0 text-white" />
          <span className="min-w-0">
            <span className="font-display block truncate text-sm font-extrabold tracking-tight text-white">
              TBO Academy
            </span>
            <span className="text-muted-foreground mt-0.5 block text-[10px] leading-none">Painel Admin</span>
          </span>
        </Link>
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
