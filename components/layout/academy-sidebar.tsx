"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconSchool,
  IconBook2,
  IconRoute,
  IconCertificate,
  IconTrophy,
  IconSettings,
  IconCompass,
  IconLogout,
  IconStethoscope,
  IconLock,
  IconSparkles,
  IconArrowRight,
} from "@tabler/icons-react"
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
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher"
import { useLogout } from "@/hooks/use-logout"
import { useAcademyEntitlement } from "@/features/academy/hooks/use-academy-entitlement"
import { usePreviewStore } from "@/features/diagnostico/stores/preview-store"
import { usePreviewSession } from "@/features/academy/hooks/use-preview-session"
import { PricingDialog } from "@/features/diagnostico/components/pricing-dialog"
import type { ProductSlug } from "@/features/academy/hooks/use-academy-entitlement"
import { cn } from "@/lib/utils"

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  requiredProduct: ProductSlug
  /** Show "Grátis" badge in preview mode */
  freeInPreview?: boolean
  /** Show "Preview" badge in preview mode (browse-only) */
  previewBrowse?: boolean
}

const ACADEMY_NAV: { label: string; items: NavItem[] }[] = [
  {
    label: "Principal",
    items: [
      { href: "/", label: "Dashboard", icon: IconSchool, requiredProduct: "diagnostic", freeInPreview: true },
      { href: "/explorar", label: "Explorar Cursos", icon: IconCompass, requiredProduct: "diagnostic", freeInPreview: true },
      { href: "/meus-cursos", label: "Meus Cursos", icon: IconBook2, requiredProduct: "essencial" },
      { href: "/trilhas", label: "Trilhas", icon: IconRoute, requiredProduct: "essencial" },
      { href: "/diagnostico", label: "Diagnóstico", icon: IconStethoscope, requiredProduct: "diagnostic", freeInPreview: true },
    ],
  },
  {
    label: "Conquistas",
    items: [
      { href: "/certificados", label: "Certificados", icon: IconCertificate, requiredProduct: "essencial" },
      { href: "/ranking", label: "Ranking", icon: IconTrophy, requiredProduct: "essencial", previewBrowse: true },
    ],
  },
  {
    label: "Configurações",
    items: [
      { href: "/configuracoes", label: "Preferências", icon: IconSettings, requiredProduct: "diagnostic", freeInPreview: true },
    ],
  },
]

const PRODUCT_TIER: Record<ProductSlug, number> = {
  diagnostic: 0,
  essencial: 1,
  profissional: 2,
  enterprise: 3,
}

export function AcademySidebar() {
  const pathname = usePathname()
  const logout = useLogout()
  const [pricingOpen, setPricingOpen] = useState(false)
  const { product } = useAcademyEntitlement()
  const isPreview = usePreviewStore((s) => s.isPreview)
  const openPricing = usePreviewStore((s) => s.openPricing)
  const { freeContentCount, diagnosticComplete } = usePreviewSession()

  const overallProgress = 47

  const canAccess = (requiredProduct: ProductSlug) =>
    PRODUCT_TIER[product] >= PRODUCT_TIER[requiredProduct]

  return (
    <>
      <Sidebar variant="inset">
        <SidebarHeader className="border-b px-2 py-2">
          <WorkspaceSwitcher />
        </SidebarHeader>

        <SidebarContent>
          {/* Preview mode: discovery card */}
          {isPreview ? (
            <div className="mx-3 mt-3 rounded-lg bg-gradient-to-br from-[#b8f724]/10 to-[#0a1f1d]/10 p-3 border border-[#b8f724]/20">
              <div className="flex items-center gap-2 mb-2">
                <IconSparkles className="size-3.5 text-[#b8f724]" />
                <p className="text-[10px] font-bold tracking-[1px] uppercase text-[#b8f724]">
                  Modo Discovery
                </p>
              </div>
              {diagnosticComplete ? (
                <>
                  <p className="text-[10px] text-muted-foreground mb-2">
                    {freeContentCount} aula{freeContentCount !== 1 ? "s" : ""} grátis
                    desbloqueada{freeContentCount !== 1 ? "s" : ""}
                  </p>
                  <button
                    onClick={openPricing}
                    className="w-full rounded-md bg-[#b8f724] px-3 py-1.5 text-[8px] font-bold tracking-[1px] uppercase text-[#0a1f1d] transition-all hover:-translate-y-0.5 hover:shadow-sm flex items-center justify-center gap-1"
                  >
                    Desbloquear tudo
                    <IconArrowRight className="size-2.5" />
                  </button>
                </>
              ) : (
                <>
                  <p className="text-[10px] text-muted-foreground mb-2">
                    Faça o diagnóstico para desbloquear aulas grátis
                  </p>
                  <Link
                    href="/diagnostico"
                    className="w-full rounded-md bg-[#b8f724] px-3 py-1.5 text-[8px] font-bold tracking-[1px] uppercase text-[#0a1f1d] transition-all hover:-translate-y-0.5 hover:shadow-sm flex items-center justify-center gap-1"
                  >
                    Fazer diagnóstico
                    <IconArrowRight className="size-2.5" />
                  </Link>
                </>
              )}
            </div>
          ) : (
            /* Normal mode: progress card */
            <div className="mx-3 mt-3 rounded-lg bg-gradient-to-br from-[#b8f724]/10 to-[#0a1f1d]/10 p-3 border border-[#b8f724]/20">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Progresso geral
              </p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold">{overallProgress}%</span>
                <span className="text-xs text-muted-foreground">3 de 8 cursos</span>
              </div>
              <Progress value={overallProgress} className="h-1.5" />
            </div>
          )}

          {/* Navigation groups */}
          {ACADEMY_NAV.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const isActive =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href)
                    const hasAccess = canAccess(item.requiredProduct)

                    // In preview mode, free items are always accessible
                    const isFreeInPreview = isPreview && item.freeInPreview
                    const isPreviewBrowse = isPreview && item.previewBrowse

                    if (!hasAccess && !isFreeInPreview && !isPreviewBrowse) {
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            onClick={() => setPricingOpen(true)}
                            className="opacity-50 cursor-pointer"
                          >
                            <item.icon className="size-4" />
                            <span className="flex-1">{item.label}</span>
                            <IconLock className="size-3 text-muted-foreground shrink-0" />
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    }

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.href}>
                            <item.icon className="size-4" />
                            <span className="flex-1">{item.label}</span>
                            {isPreview && item.freeInPreview && (
                              <Badge
                                className="bg-[#b8f724]/10 text-[#b8f724] border-0 text-[7px] font-bold tracking-wider uppercase px-1.5 py-0"
                              >
                                Grátis
                              </Badge>
                            )}
                            {isPreviewBrowse && (
                              <Badge
                                variant="secondary"
                                className="text-[7px] font-bold tracking-wider uppercase px-1.5 py-0"
                              >
                                Preview
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="space-y-1 border-t p-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={logout}
          >
            <IconLogout className="size-4" />
            Sair
          </Button>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <PricingDialog open={pricingOpen} onOpenChange={setPricingOpen} />
    </>
  )
}
