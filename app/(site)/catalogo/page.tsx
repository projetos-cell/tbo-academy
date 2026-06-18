"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconX, IconChevronDown, IconClock, IconPlayerPlay, IconLayoutList } from "@tabler/icons-react";
import { SiteNav } from "@/components/brand/site-nav";
import { Ph } from "@/components/brand/photo-placeholder";

type Course = {
  cat: string;
  title: string;
  dur: string;
  aulas: string;
  mods: string;
  desc: string;
  modules: [string, string[]][];
};

const TAGS = ["Todos", "Para começar", "Investir", "Analisar", "Liderar", "Fundamentos", "Habilidades"];

const CURSOS: Course[] = [
  {
    cat: "Para começar",
    title: "Fundamentos do mercado imobiliário",
    dur: "4h 30min",
    aulas: "32",
    mods: "5",
    desc: "Como o setor funciona, do zero. Para quem quer entender o mercado antes de comprar, vender ou investir.",
    modules: [
      ["O que é o mercado", ["Agentes do setor", "Tipos de imóvel"]],
      ["Valor e preço", ["O que forma o preço", "Liquidez"]],
      ["Primeiros passos", ["Definindo seu objetivo", "Por onde continuar"]],
    ],
  },
  {
    cat: "Investir",
    title: "Investimento e análise de imóveis",
    dur: "7h 28min",
    aulas: "105",
    mods: "6",
    desc: "Rentabilidade, risco e leitura de dados para investir com segurança — para investidores e analistas.",
    modules: [
      ["Fundamentos", ["Tipos de investimento", "Indicadores"]],
      ["Rentabilidade", ["Cap rate e yield", "Fluxo de caixa"]],
      ["Risco", ["Cenários", "Diversificação"]],
    ],
  },
  {
    cat: "Liderar",
    title: "Estratégia e gestão no setor",
    dur: "5h 10min",
    aulas: "56",
    mods: "4",
    desc: "Visão de mercado, indicadores e gestão para quem lidera negócios imobiliários.",
    modules: [
      ["Visão de mercado", ["Ciclos", "Posicionamento"]],
      ["Gestão", ["Indicadores", "Equipe"]],
      ["Estratégia", ["Crescimento", "Decisão"]],
    ],
  },
  {
    cat: "Analisar",
    title: "Avaliação e precificação",
    dur: "4h 10min",
    aulas: "38",
    mods: "4",
    desc: "Leia o valor de um imóvel como um especialista, com método e dados de comparáveis.",
    modules: [
      ["Critérios de valor", ["Localização", "Atributos"]],
      ["Comparáveis", ["Coleta de dados", "Ajustes"]],
      ["Precificação", ["Defendendo o preço"]],
    ],
  },
  {
    cat: "Fundamentos",
    title: "Financiamento e crédito",
    dur: "4h 30min",
    aulas: "38",
    mods: "4",
    desc: "Entenda linhas, simulação, score e aprovação de crédito imobiliário sem complicação.",
    modules: [
      ["Linhas de crédito", ["SBPE e FGTS"]],
      ["Aprovação", ["Análise de crédito", "Documentação"]],
      ["Simulação", ["Comparando bancos"]],
    ],
  },
  {
    cat: "Analisar",
    title: "Mercado e tendências",
    dur: "3h 20min",
    aulas: "26",
    mods: "3",
    desc: "Como ler o ciclo imobiliário, índices e tendências para decidir na hora certa.",
    modules: [
      ["Índices", ["IGMI, FipeZap"]],
      ["Ciclos", ["Fases do mercado"]],
      ["Tendências", ["O que observar em 2026"]],
    ],
  },
  {
    cat: "Fundamentos",
    title: "Documentação e jurídico",
    dur: "3h 50min",
    aulas: "30",
    mods: "3",
    desc: "Evite que um negócio caia por causa de papel: domine documentos e contratos.",
    modules: [
      ["Documentos", ["Matrícula e certidões"]],
      ["Contratos", ["Compra e venda", "Locação"]],
      ["Due diligence", ["Checklist"]],
    ],
  },
  {
    cat: "Habilidades",
    title: "Negociação imobiliária",
    dur: "4h 05min",
    aulas: "34",
    mods: "3",
    desc: "Conduza qualquer negociação com técnica — ancoragem, objeções e fechamento.",
    modules: [
      ["Psicologia", ["Ancoragem"]],
      ["Objeções", ["'Está caro'"]],
      ["Fechamento", ["Conduzindo ao sim"]],
    ],
  },
  {
    cat: "Habilidades",
    title: "Marketing e captação",
    dur: "5h 40min",
    aulas: "42",
    mods: "4",
    desc: "Atraia oportunidades com conteúdo e tráfego — do criativo ao resultado.",
    modules: [
      ["Estratégia", ["Público e oferta"]],
      ["Criativos", ["Foto e vídeo", "Copy"]],
      ["Tráfego", ["Métricas", "Escala"]],
    ],
  },
];

function pad(n: number) {
  return (n < 10 ? "0" : "") + n;
}

function CourseModal({ course, onClose }: { course: Course; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const stats = [
    { ic: <IconClock className="size-[18px]" />, l: "Duração", v: course.dur },
    { ic: <IconPlayerPlay className="size-[18px]" />, l: "Aulas", v: `${course.aulas}+ aulas` },
    { ic: <IconLayoutList className="size-[18px]" />, l: "Módulos", v: `${course.mods} módulos` },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-6 py-12 backdrop-blur-md"
      style={{ background: "rgba(7,28,20,.6)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-forest-950 w-full max-w-[760px] overflow-hidden rounded-[28px] shadow-2xl"
        style={{ animation: "modal-in .3s var(--tbo-ease-out)" }}
      >
        {/* hero */}
        <div className="relative aspect-[16/8]">
          <Ph dark label={`capa · ${course.title.toLowerCase()}`} className="absolute inset-0" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, var(--tbo-forest-950) 2%, rgba(7,28,20,.3) 70%)" }}
          />
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-5 right-5 z-[3] grid size-11 place-items-center rounded-full border border-white/20 text-white"
            style={{ background: "rgba(7,28,20,.55)" }}
          >
            <IconX className="size-5" />
          </button>
          <div className="absolute right-10 bottom-8 left-10 z-[2]">
            <span className="tagpill border-white/30 bg-white/15 text-white">{course.cat}</span>
            <h2 className="font-display mt-3 text-[40px] leading-none font-bold tracking-tight text-white">
              {course.title}
            </h2>
          </div>
        </div>

        {/* body */}
        <div className="px-10 pt-8 pb-10">
          <div className="grid grid-cols-3 gap-6">
            {stats.map((s) => (
              <div key={s.l} className="flex items-center gap-3">
                <span className="border-forest-700 bg-forest-800 text-forest-100 grid size-[46px] place-items-center rounded-xl border">
                  {s.ic}
                </span>
                <span>
                  <span className="text-forest-300 block text-[13px]">{s.l}</span>
                  <span className="block text-[17px] font-extrabold text-white">{s.v}</span>
                </span>
              </div>
            ))}
          </div>

          <p className="text-forest-100 mt-7 text-[17px] leading-relaxed">{course.desc}</p>

          <div className="text-forest-300 mt-8 mb-3.5 text-[13px] font-bold tracking-[0.12em] uppercase">
            Conteúdo do curso
          </div>
          {course.modules.map((m, mi) => (
            <details
              key={m[0]}
              open={mi === 0}
              className="border-forest-700 bg-forest-900 group mb-2.5 overflow-hidden rounded-[14px] border"
            >
              <summary className="flex cursor-pointer list-none items-center gap-4 px-[22px] py-[18px] text-white">
                <span className="font-mono-tbo text-forest-300 text-[13px]">{pad(mi + 1)}</span>
                <span className="font-bold">{m[0]}</span>
                <IconChevronDown className="text-forest-200 ml-auto size-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-[22px] pb-3.5">
                {m[1].map((l) => (
                  <div
                    key={l}
                    className="border-forest-800 text-forest-100 flex gap-3 border-t py-[11px] text-sm first:border-t-0"
                  >
                    <IconPlayerPlay className="mt-0.5 size-3.5" /> {l}
                  </div>
                ))}
              </div>
            </details>
          ))}

          <div className="mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <Link className="pill pill-white w-full justify-between" href="/login">
              Começar agora <span className="parrow">→</span>
            </Link>
            <Link
              className="pill border-forest-600 w-full justify-between border text-white"
              href="/planos"
              style={{ background: "transparent" }}
            >
              Ver planos{" "}
              <span className="parrow" style={{ background: "var(--tbo-volt)", color: "var(--tbo-ink)" }}>
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

export default function CatalogoPage() {
  const [tag, setTag] = useState("Todos");
  const [selected, setSelected] = useState<Course | null>(null);

  const filtered = tag === "Todos" ? CURSOS : CURSOS.filter((c) => c.cat === tag);

  return (
    <>
      <header className="subhero" style={{ minHeight: 340 }}>
        <Ph dark label="capa · cursos" />
        <div className="amb" aria-hidden="true" />
        <SiteNav active="catalogo" />
        <div className="subhero-content">
          <span className="eo-eyebrow">Catálogo</span>
          <h1>Acesso a todos os cursos.</h1>
          <p>
            90+ cursos do básico ao avançado. Uma assinatura, tudo liberado — para qualquer objetivo no mercado
            imobiliário.
          </p>
        </div>
      </header>

      <section className="ed-section">
        <div className="tagrow mb-10">
          {TAGS.map((t) => (
            <button key={t} onClick={() => setTag(t)} className={tag === t ? "tagpill on" : "tagpill"}>
              {t}
            </button>
          ))}
        </div>

        <div className="catalog-grid">
          {filtered.map((c, i) => (
            <button key={c.title} className="ccard text-left" onClick={() => setSelected(c)}>
              <Ph label={`capa · ${c.title.toLowerCase()}`}>
                <span className="ccat">{c.cat}</span>
              </Ph>
              <div className="ccard-body">
                <span className="cnum">{pad(i + 1)}</span>
                <h3 className="eo-h3">{c.title}</h3>
                <p>{c.desc.split(".")[0]}.</p>
                <span className="clink">
                  Ver curso <span className="parrow">→</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selected && <CourseModal course={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
