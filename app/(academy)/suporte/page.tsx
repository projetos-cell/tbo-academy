"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { useSupport } from "@/features/support/hooks/use-support";
import type { FaqItem } from "@/features/support/types";
import {
  IconHelpCircle,
  IconSearch,
  IconMessageCircle,
  IconMail,
  IconBook,
  IconChevronDown,
  IconChevronRight,
  IconBrandWhatsapp,
  IconHeadset,
  IconFileText,
  IconBulb,
  IconShieldCheck,
  IconCreditCard,
  IconArrowRight,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const MOCK_FAQ: FaqItem[] = [
  {
    id: "1",
    question: "Como faço para acessar meus cursos?",
    answer:
      'Após o login, acesse a seção "Meus Cursos" no menu lateral. Lá você encontra todos os cursos em andamento, concluídos e salvos. Clique em qualquer curso para continuar de onde parou.',
    category: "Acesso",
    sortOrder: 1,
  },
  {
    id: "2",
    question: "Como funciona o sistema de certificados?",
    answer:
      'Ao concluir 100% de um curso (assistir todas as aulas e completar os exercícios), seu certificado é gerado automaticamente. Acesse a seção "Certificados" para baixar ou compartilhar.',
    category: "Certificados",
    sortOrder: 2,
  },
  {
    id: "3",
    question: "Posso assistir às aulas ao vivo depois?",
    answer:
      'Sim! Todas as aulas ao vivo ficam gravadas e disponíveis na aba "Gravações" dentro da seção "Aulas ao Vivo". Você pode assistir quantas vezes quiser.',
    category: "Aulas ao Vivo",
    sortOrder: 3,
  },
  {
    id: "4",
    question: "Como funciona o ranking e os pontos?",
    answer:
      "Você ganha pontos ao completar aulas, módulos e cursos. Ações como manter uma sequência de estudos e interagir na comunidade também geram pontos. O ranking é atualizado em tempo real.",
    category: "Gamificação",
    sortOrder: 4,
  },
  {
    id: "5",
    question: "Como altero meu plano de assinatura?",
    answer:
      'Acesse "Preferências" no menu lateral, vá até a aba de assinatura e clique em "Alterar plano". Upgrades são aplicados imediatamente, e downgrades entram em vigor no próximo ciclo de cobrança.',
    category: "Assinatura",
    sortOrder: 5,
  },
  {
    id: "6",
    question: "Esqueci minha senha, como recuperar?",
    answer:
      'Na tela de login, clique em "Esqueci minha senha". Você receberá um e-mail com um link para redefinir. O link expira em 24 horas. Caso não receba, verifique sua pasta de spam.',
    category: "Acesso",
    sortOrder: 6,
  },
  {
    id: "7",
    question: "Os materiais da Biblioteca podem ser usados em projetos?",
    answer:
      "Sim, todos os templates e materiais da Biblioteca são de uso livre para projetos internos da TBO. Para uso externo ou redistribuição, consulte os termos de cada recurso.",
    category: "Biblioteca",
    sortOrder: 7,
  },
  {
    id: "8",
    question: "Como participo da Comunidade?",
    answer:
      'Acesse a seção "Comunidade" no menu lateral. Lá você pode criar tópicos, responder discussões e interagir com outros profissionais. Mantenha sempre o respeito e contribua com conteúdo relevante.',
    category: "Comunidade",
    sortOrder: 8,
  },
];

const SUPPORT_CHANNELS = [
  {
    icon: IconMessageCircle,
    title: "Chat ao Vivo",
    description: "Fale com nosso time em tempo real",
    detail: "Seg a Sex, 9h às 18h",
    variant: "volt" as const,
  },
  {
    icon: IconMail,
    title: "E-mail",
    description: "Envie sua dúvida por e-mail",
    detail: "suporte@agenciatbo.com.br",
    variant: "forest" as const,
  },
  {
    icon: IconBrandWhatsapp,
    title: "WhatsApp",
    description: "Atendimento rápido via WhatsApp",
    detail: "Resposta em até 2h",
    variant: "volt" as const,
  },
  {
    icon: IconHeadset,
    title: "Agendar Chamada",
    description: "Agende uma call com o suporte",
    detail: "Slots de 30min disponíveis",
    variant: "forest" as const,
  },
];

const HELP_CATEGORIES = [
  { icon: IconBook, label: "Cursos e Aulas", count: 12 },
  { icon: IconShieldCheck, label: "Conta e Acesso", count: 8 },
  { icon: IconCreditCard, label: "Assinatura e Pagamento", count: 6 },
  { icon: IconFileText, label: "Certificados", count: 4 },
  { icon: IconBulb, label: "Dicas e Boas Práticas", count: 9 },
];

export default function SuportePage() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const { faq: dbFaq, isLoading } = useSupport();

  const faqItems = dbFaq.length > 0 ? dbFaq : MOCK_FAQ;

  const filteredFaq = search
    ? faqItems.filter(
        (item) =>
          item.question.toLowerCase().includes(search.toLowerCase()) ||
          item.answer.toLowerCase().includes(search.toLowerCase()),
      )
    : faqItems;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Central de ajuda"
        title="Suporte"
        description="Encontre respostas e entre em contato com nosso time"
      />

      {/* Search hero — banda forest do DS */}
      <div className="from-forest-800 to-forest-950 relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -top-16 -right-16 size-72 rounded-full blur-2xl"
          style={{ background: "radial-gradient(circle, rgba(186,242,65,.16), transparent 62%)" }}
        />
        <div className="relative z-10">
          <span className="text-volt text-xs font-bold tracking-[0.14em] uppercase">Base de conhecimento</span>
          <h2 className="font-display mt-2 mb-1 text-2xl font-bold tracking-tight text-white">Como podemos ajudar?</h2>
          <p className="mb-5 text-sm text-white/60">Busque artigos, tutoriais e respostas rápidas</p>
          <div className="relative max-w-lg">
            <IconSearch className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/40" />
            <Input
              placeholder="Buscar artigos, tutoriais, FAQs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-white/15 bg-white/10 pl-9 text-white placeholder:text-white/40 focus-visible:ring-[var(--tbo-volt)]/50"
            />
          </div>
        </div>
      </div>

      {/* Support channels */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {SUPPORT_CHANNELS.map((channel) => {
          const Icon = channel.icon;
          const isForest = channel.variant === "forest";
          return (
            <button
              key={channel.title}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,11,11,0.10)]",
                isForest ? "bg-forest-900 text-white" : "bg-volt text-ink",
              )}
            >
              <div
                className={cn(
                  "absolute -top-3 -right-3 size-16 rounded-full opacity-[0.08] transition-transform duration-500 group-hover:scale-125",
                  isForest ? "bg-volt" : "bg-ink",
                )}
              />
              <div
                className={cn(
                  "mb-3 inline-flex items-center justify-center rounded-xl p-2.5",
                  isForest ? "bg-volt text-ink" : "bg-ink text-volt",
                )}
              >
                <Icon className="size-5" strokeWidth={2.2} />
              </div>
              <p className="text-sm font-semibold">{channel.title}</p>
              <p className={cn("mt-0.5 text-xs", isForest ? "text-white/60" : "text-ink/55")}>{channel.description}</p>
              <p className={cn("mt-2 text-[10px] font-medium", isForest ? "text-white/40" : "text-ink/45")}>
                {channel.detail}
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* FAQ */}
        <div className="bg-card rounded-2xl border border-black/[0.06] p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="bg-volt text-ink grid size-7 place-items-center rounded-full">
              <IconHelpCircle className="size-4" />
            </span>
            <h2 className="font-display text-lg font-bold tracking-tight">Perguntas Frequentes</h2>
          </div>
          <div className="space-y-2">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)
            ) : filteredFaq.length > 0 ? (
              filteredFaq.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-xl border border-black/[0.06] transition-colors">
                  <button
                    onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                    className="hover:bg-paper-off flex w-full items-center gap-3 p-3 text-left transition-colors"
                  >
                    {openFaq === item.id ? (
                      <IconChevronDown className="text-volt size-4 shrink-0" />
                    ) : (
                      <IconChevronRight className="text-muted-foreground size-4 shrink-0" />
                    )}
                    <span className="flex-1 text-sm font-medium">{item.question}</span>
                    <span className="tagpill shrink-0 !px-2.5 !py-1 !text-[10px]">{item.category}</span>
                  </button>
                  {openFaq === item.id && (
                    <div className="px-3 pb-3 pl-10">
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground text-sm">Nenhum resultado para &quot;{search}&quot;</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Tente termos diferentes ou entre em contato conosco
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-card rounded-2xl border border-black/[0.06] p-5 shadow-sm">
            <span className="text-forest-500 text-xs font-bold tracking-[0.14em] uppercase">Categorias de Ajuda</span>
            <div className="mt-3 space-y-1">
              {HELP_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.label}
                    className="hover:bg-paper-off flex w-full items-center gap-2 rounded-xl p-2.5 text-left transition-colors"
                  >
                    <Icon className="text-forest-500 size-4" />
                    <span className="flex-1 text-sm">{cat.label}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {cat.count}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA card — banda forest com glow volt */}
          <div className="from-forest-800 to-forest-950 relative overflow-hidden rounded-2xl bg-gradient-to-br p-5">
            <div
              className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full blur-2xl"
              style={{ background: "radial-gradient(circle, rgba(186,242,65,.16), transparent 62%)" }}
            />
            <div className="relative z-10">
              <span className="text-volt text-xs font-bold tracking-[0.14em] uppercase">Fale conosco</span>
              <h3 className="font-display mt-2 mb-1 text-base font-bold tracking-tight text-white">
                Não encontrou o que precisa?
              </h3>
              <p className="mb-4 text-xs text-white/60">Nossa equipe está pronta para te ajudar</p>
              <button className="text-ink flex w-full items-center justify-between rounded-full bg-white py-2.5 pr-2.5 pl-5 text-sm font-bold transition-all hover:-translate-y-px hover:bg-white/90">
                Abrir Chamado
                <span className="bg-volt text-ink grid size-7 place-items-center rounded-full">
                  <IconArrowRight className="size-4" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
