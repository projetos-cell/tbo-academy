"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    variant: "lime" as const,
  },
  {
    icon: IconMail,
    title: "E-mail",
    description: "Envie sua dúvida por e-mail",
    detail: "suporte@agenciatbo.com.br",
    variant: "black" as const,
  },
  {
    icon: IconBrandWhatsapp,
    title: "WhatsApp",
    description: "Atendimento rápido via WhatsApp",
    detail: "Resposta em até 2h",
    variant: "lime" as const,
  },
  {
    icon: IconHeadset,
    title: "Agendar Chamada",
    description: "Agende uma call com o suporte",
    detail: "Slots de 30min disponíveis",
    variant: "black" as const,
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
      <PageHeader title="Suporte" description="Encontre respostas e entre em contato com nosso time" />

      {/* Search hero */}
      <div className="relative overflow-hidden rounded-2xl bg-black p-6 sm:p-8">
        <div className="absolute -top-8 -right-8 size-40 rounded-full bg-[#BAF241]/10" />
        <div className="absolute -bottom-4 -left-4 size-20 rounded-full bg-[#BAF241]/5" />
        <h2 className="mb-1 text-lg font-bold text-white">Como podemos ajudar?</h2>
        <p className="mb-4 text-sm text-white/50">Busque na nossa base de conhecimento</p>
        <div className="relative max-w-lg">
          <IconSearch className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/30" />
          <Input
            placeholder="Buscar artigos, tutoriais, FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-white/10 bg-white/10 pl-9 text-white placeholder:text-white/30 focus-visible:ring-[#BAF241]/50"
          />
        </div>
      </div>

      {/* Support channels */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {SUPPORT_CHANNELS.map((channel) => {
          const Icon = channel.icon;
          const isBlack = channel.variant === "black";
          return (
            <div
              key={channel.title}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
                isBlack ? "bg-black text-white" : "bg-[#BAF241] text-black",
              )}
            >
              <div
                className={cn(
                  "absolute -top-3 -right-3 size-16 rounded-full opacity-[0.07] transition-transform duration-500 group-hover:scale-125",
                  isBlack ? "bg-[#BAF241]" : "bg-black",
                )}
              />
              <div
                className={cn(
                  "mb-3 inline-flex items-center justify-center rounded-xl p-2.5",
                  isBlack ? "bg-[#BAF241] text-black" : "bg-black text-[#BAF241]",
                )}
              >
                <Icon className="size-5" strokeWidth={2.2} />
              </div>
              <p className="text-sm font-semibold">{channel.title}</p>
              <p className={cn("mt-0.5 text-xs", isBlack ? "text-white/60" : "text-black/50")}>{channel.description}</p>
              <p className={cn("mt-2 text-[10px] font-medium", isBlack ? "text-white/40" : "text-black/40")}>
                {channel.detail}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <IconHelpCircle className="size-4 text-[#BAF241]" />
              Perguntas Frequentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)
            ) : filteredFaq.length > 0 ? (
              filteredFaq.map((item) => (
                <div key={item.id} className="rounded-lg border transition-colors">
                  <button
                    onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                    className="hover:bg-muted/50 flex w-full items-center gap-3 p-3 text-left transition-colors"
                  >
                    {openFaq === item.id ? (
                      <IconChevronDown className="size-4 shrink-0 text-[#BAF241]" />
                    ) : (
                      <IconChevronRight className="text-muted-foreground size-4 shrink-0" />
                    )}
                    <span className="flex-1 text-sm font-medium">{item.question}</span>
                    <Badge variant="secondary" className="shrink-0 text-[10px]">
                      {item.category}
                    </Badge>
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
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Categorias de Ajuda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {HELP_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.label}
                    className="hover:bg-muted/50 flex w-full items-center gap-2 rounded-lg p-2.5 text-left transition-colors"
                  >
                    <Icon className="text-muted-foreground size-4" />
                    <span className="flex-1 text-sm">{cat.label}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {cat.count}
                    </Badge>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <div className="rounded-2xl bg-[#BAF241] p-5 text-black">
            <h3 className="mb-1 text-sm font-semibold">Não encontrou o que precisa?</h3>
            <p className="mb-3 text-xs text-black/50">Nossa equipe está pronta para te ajudar</p>
            <Button size="sm" className="w-full gap-1.5 bg-black text-[#BAF241] hover:bg-black/90">
              <IconMessageCircle className="size-4" />
              Abrir Chamado
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
