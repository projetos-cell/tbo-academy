"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconSparkles,
  IconNews,
  IconBook2,
  IconStack2,
  IconBriefcase,
  IconFlask,
  IconUsers,
  IconLibrary,
  IconCertificate,
  IconVideo,
  IconTrophy,
  IconHelpCircle,
  IconStethoscope,
  IconSettings,
  IconLogout,
  IconLock,
  IconArrowRight,
  IconChevronRight,
  IconShieldCog,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { useLogout } from "@/hooks/use-logout";
import { useAcademyEntitlement } from "@/features/academy/hooks/use-academy-entitlement";
import { useAuthStore } from "@/stores/auth-store";
import { hasMinRole } from "@/lib/permissions";
import { usePreviewStore } from "@/features/diagnostico/stores/preview-store";
import { usePreviewSession } from "@/features/academy/hooks/use-preview-session";
import { PricingDialog } from "@/features/diagnostico/components/pricing-dialog";
import type { ProductSlug } from "@/features/academy/hooks/use-academy-entitlement";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  requiredProduct: ProductSlug;
  /** Show "Grátis" badge in preview mode */
  freeInPreview?: boolean;
  /** Show "Preview" badge in preview mode (browse-only) */
  previewBrowse?: boolean;
}

const ACADEMY_NAV: { label: string; items: NavItem[]; separator?: boolean }[] = [
  {
    label: "Principal",
    items: [
      { href: "/explorar", label: "Home", icon: IconHome, requiredProduct: "diagnostic", freeInPreview: true },
      { href: "/feed", label: "Feed", icon: IconNews, requiredProduct: "essencial" },
      { href: "/meus-cursos", label: "Cursos", icon: IconBook2, requiredProduct: "essencial" },
      { href: "/trilhas", label: "Workflows", icon: IconStack2, requiredProduct: "essencial" },
    ],
  },
  {
    label: "Comunidade",
    separator: true,
    items: [
      { href: "/comunidade", label: "Comunidade", icon: IconUsers, requiredProduct: "essencial" },
      { href: "/biblioteca", label: "Biblioteca", icon: IconLibrary, requiredProduct: "essencial" },
      { href: "/certificados", label: "Certificados", icon: IconCertificate, requiredProduct: "essencial" },
      { href: "/aulas-ao-vivo", label: "Aulas ao Vivo", icon: IconVideo, requiredProduct: "essencial" },
      { href: "/ranking", label: "Contest", icon: IconTrophy, requiredProduct: "essencial", previewBrowse: true },
      { href: "/suporte", label: "Suporte", icon: IconHelpCircle, requiredProduct: "diagnostic", freeInPreview: true },
    ],
  },
  {
    label: "Ferramentas",
    items: [
      {
        href: "/diagnostico",
        label: "Diagnóstico",
        icon: IconStethoscope,
        requiredProduct: "diagnostic",
        freeInPreview: true,
      },
      {
        href: "/configuracoes",
        label: "Preferências",
        icon: IconSettings,
        requiredProduct: "diagnostic",
        freeInPreview: true,
      },
    ],
  },
];

const PRODUCT_TIER: Record<ProductSlug, number> = {
  diagnostic: 0,
  essencial: 1,
  profissional: 2,
  enterprise: 3,
};

export function AcademySidebar() {
  const pathname = usePathname();
  const logout = useLogout();
  const [pricingOpen, setPricingOpen] = useState(false);
  const { product } = useAcademyEntitlement();
  const isPreview = usePreviewStore((s) => s.isPreview);
  const openPricing = usePreviewStore((s) => s.openPricing);
  const { freeContentCount, diagnosticComplete } = usePreviewSession();

  const overallProgress = 47;
  const role = useAuthStore((s) => s.role);
  const isAcademyAdmin = role !== null && hasMinRole(role, "diretoria");

  const canAccess = (requiredProduct: ProductSlug) => PRODUCT_TIER[product] >= PRODUCT_TIER[requiredProduct];

  return (
    <>
      <Sidebar variant="inset">
        <SidebarContent>
          {/* Preview mode: discovery card */}
          {isPreview ? (
            <div className="mx-3 mt-3 rounded-lg border border-[#BAF241]/20 bg-gradient-to-br from-[#BAF241]/10 to-white/5 p-3">
              <div className="mb-2 flex items-center gap-2">
                <IconSparkles className="size-3.5 text-[#BAF241]" />
                <p className="text-[10px] font-bold tracking-[1px] text-[#BAF241] uppercase">Modo Discovery</p>
              </div>
              {diagnosticComplete ? (
                <>
                  <p className="text-muted-foreground mb-2 text-[10px]">
                    {freeContentCount} aula{freeContentCount !== 1 ? "s" : ""} grátis desbloqueada
                    {freeContentCount !== 1 ? "s" : ""}
                  </p>
                  <button
                    onClick={openPricing}
                    className="flex w-full items-center justify-center gap-1 rounded-md bg-[#BAF241] px-3 py-1.5 text-[8px] font-bold tracking-[1px] text-[#02261C] uppercase transition-all hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    Desbloquear tudo
                    <IconArrowRight className="size-2.5" />
                  </button>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground mb-2 text-[10px]">
                    Faça o diagnóstico para desbloquear aulas grátis
                  </p>
                  <Link
                    href="/diagnostico"
                    className="flex w-full items-center justify-center gap-1 rounded-md bg-[#BAF241] px-3 py-1.5 text-[8px] font-bold tracking-[1px] text-[#02261C] uppercase transition-all hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    Fazer diagnóstico
                    <IconArrowRight className="size-2.5" />
                  </Link>
                </>
              )}
            </div>
          ) : (
            /* Normal mode: progress card */
            <div className="mx-3 mt-3 rounded-lg border border-[#BAF241]/20 bg-gradient-to-br from-[#BAF241]/10 to-white/5 p-3">
              <p className="text-muted-foreground mb-1 text-xs font-medium">Progresso geral</p>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-lg font-bold">{overallProgress}%</span>
                <span className="text-muted-foreground text-xs">3 de 8 cursos</span>
              </div>
              <Progress value={overallProgress} className="h-1.5 bg-[#BAF241]/20 [&>div]:bg-[#BAF241]" />
            </div>
          )}

          {/* Navigation groups */}
          {ACADEMY_NAV.map((group) => (
            <SidebarGroup
              key={group.label}
              className={group.separator ? "border-sidebar-border mt-1 border-t pt-1" : ""}
            >
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                    const hasAccess = canAccess(item.requiredProduct);

                    // In preview mode, free items are always accessible
                    const isFreeInPreview = isPreview && item.freeInPreview;
                    const isPreviewBrowse = isPreview && item.previewBrowse;

                    if (!hasAccess && !isFreeInPreview && !isPreviewBrowse) {
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton onClick={() => setPricingOpen(true)} className="cursor-pointer opacity-50">
                            <item.icon className="size-4" />
                            <span className="flex-1">{item.label}</span>
                            <IconLock className="text-muted-foreground size-3 shrink-0" />
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    }

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.href}>
                            <item.icon className="size-4" />
                            <span className="flex-1">{item.label}</span>
                            {isPreview && item.freeInPreview && (
                              <Badge className="border-0 bg-[#BAF241]/10 px-1.5 py-0 text-[7px] font-bold tracking-wider text-[#BAF241] uppercase">
                                Grátis
                              </Badge>
                            )}
                            {isPreviewBrowse && (
                              <Badge
                                variant="secondary"
                                className="px-1.5 py-0 text-[7px] font-bold tracking-wider uppercase"
                              >
                                Preview
                              </Badge>
                            )}
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

        <SidebarFooter className="space-y-1 border-t p-2">
          {isAcademyAdmin && (
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href="/admin">
                <IconShieldCog className="size-4" />
                Painel Admin
              </Link>
            </Button>
          )}
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={logout}>
            <IconLogout className="size-4" />
            Sair
          </Button>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <PricingDialog open={pricingOpen} onOpenChange={setPricingOpen} />
    </>
  );
}
