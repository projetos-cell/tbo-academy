"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { trackCheckoutInitiated } from "@/lib/analytics"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { IconCheck, IconCrown, IconLoader2, IconRocket, IconStar } from "@tabler/icons-react"

interface PricingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PLANS = [
  {
    id: "essencial",
    name: "Essencial",
    price: "R$ 197",
    period: "/mês",
    description: "Para quem está começando e quer construir repertório sólido.",
    icon: IconStar,
    featured: false,
    features: [
      "Acesso a 2 trilhas de conhecimento",
      "Diagnóstico de maturidade completo",
      "Conteúdo atualizado mensalmente",
      "Certificado de conclusão por módulo",
      "Comunidade de incorporadores",
    ],
  },
  {
    id: "profissional",
    name: "Profissional",
    price: "R$ 497",
    period: "/mês",
    description: "Para quem quer dominar todas as alavancas do marketing imobiliário.",
    icon: IconRocket,
    featured: true,
    features: [
      "Acesso a todas as trilhas",
      "Diagnóstico + plano de ação personalizado",
      "Masterclasses ao vivo mensais",
      "Templates e frameworks exclusivos",
      "Mentoria em grupo (2x/mês)",
      "Acesso à biblioteca de cases",
      "Suporte prioritário",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Sob consulta",
    period: "",
    description: "Para incorporadoras que querem capacitar a equipe inteira.",
    icon: IconCrown,
    featured: false,
    features: [
      "Tudo do plano Profissional",
      "Licenças ilimitadas por CNPJ",
      "Diagnóstico por departamento",
      "Mentoria individual (4x/mês)",
      "Workshops in-company",
      "Dashboard de progresso da equipe",
      "Onboarding dedicado",
      "SLA de atendimento",
    ],
  },
] as const

export function PricingDialog({ open, onOpenChange }: PricingDialogProps) {
  const router = useRouter()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  async function handleCheckout(planId: string) {
    if (planId === "enterprise") {
      // Redirect to contact for enterprise
      window.open("mailto:contato@tbo.com.br?subject=TBO Academy Enterprise", "_blank")
      return
    }

    setLoadingPlan(planId)
    trackCheckoutInitiated(planId)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Erro ao iniciar checkout")
      if (data.url) {
        router.push(data.url)
      }
    } catch (err) {
      console.error("Checkout error:", err)
      alert(err instanceof Error ? err.message : "Erro ao iniciar checkout")
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden border-0">
        {/* Header */}
        <div className="bg-[#000000] px-8 py-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold tracking-tight uppercase text-white">
              TBO Academy
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400 mt-1">
              Escolha o plano que faz sentido para o seu momento. Cancele quando
              quiser.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 gap-0 divide-y md:grid-cols-3 md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800">
          {PLANS.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative flex flex-col p-6",
                  plan.featured && "bg-[#BAF241]/[0.03]"
                )}
              >
                {plan.featured && (
                  <div className="absolute top-0 inset-x-0 h-[3px] bg-[#BAF241]" />
                )}

                {/* Plan header */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon
                      className={cn(
                        "size-5",
                        plan.featured ? "text-[#BAF241]" : "text-zinc-400"
                      )}
                    />
                    <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-zinc-500">
                      {plan.name}
                    </span>
                    {plan.featured && (
                      <span className="text-[7px] font-bold tracking-[1px] uppercase bg-[#BAF241] text-[#000000] px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold tracking-tight">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-xs text-zinc-400">{plan.period}</span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[10px] text-zinc-500 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="flex-1 space-y-2 mb-5">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <IconCheck
                        className={cn(
                          "size-3.5 shrink-0 mt-0.5",
                          plan.featured ? "text-[#BAF241]" : "text-emerald-500"
                        )}
                      />
                      <span className="text-[10px] text-zinc-600 leading-snug dark:text-zinc-400">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  disabled={loadingPlan !== null}
                  onClick={() => handleCheckout(plan.id)}
                  className={cn(
                    "w-full rounded-lg py-3 text-[10px] font-bold tracking-[1.5px] uppercase transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0",
                    plan.featured
                      ? "bg-[#BAF241] text-[#000000] hover:shadow-[0_6px_24px_rgba(184,247,36,0.25)]"
                      : plan.id === "enterprise"
                        ? "bg-[#000000] text-white hover:shadow-lg"
                        : "border border-zinc-200 text-zinc-600 hover:border-[#BAF241] hover:text-[#BAF241] dark:border-zinc-700 dark:text-zinc-400"
                  )}
                >
                  {loadingPlan === plan.id && (
                    <IconLoader2 className="size-3 animate-spin" />
                  )}
                  {plan.id === "enterprise" ? "Falar com consultor" : "Começar agora"}
                </button>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-200 px-8 py-4 text-center dark:border-zinc-800">
          <p className="text-[9px] text-zinc-400">
            Todos os planos incluem 7 dias de teste grátis. Sem fidelidade.
            Cancele a qualquer momento.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
