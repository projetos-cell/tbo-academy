import Link from "next/link";
import { SiteNav } from "@/components/brand/site-nav";
import { Ph } from "@/components/brand/photo-placeholder";

export const metadata = {
  title: "Sobre — TBO Academy",
  description: "Tornar o mercado imobiliário acessível a qualquer pessoa — do conceito à decisão.",
};

const STATS = [
  { num: "2019", lab: "ano de fundação" },
  { num: "12.4k", lab: "pessoas formadas" },
  { num: "90+", lab: "cursos no catálogo" },
  { num: "26", lab: "estados alcançados" },
];

const VALUES = [
  { title: "Prática acima de teoria", desc: "Todo curso entrega algo aplicável já na próxima semana." },
  { title: "Acesso para todos", desc: "Uma assinatura justa coloca conteúdo de elite na mão de qualquer pessoa." },
  { title: "Clareza acima de jargão", desc: "Traduzimos o mercado para qualquer ponto de partida, sem complicar." },
];

const TEAM = [
  { name: "Marina Castro", role: "CEO & Conteúdo" },
  { name: "Rafael Diniz", role: "Marketing" },
  { name: "Júlia Antunes", role: "Investimentos" },
  { name: "Eduardo Lemes", role: "Vendas B2B" },
];

export default function SobrePage() {
  return (
    <>
      <header className="subhero">
        <Ph dark label="capa · time TBO / escritório" />
        <div className="amb" aria-hidden="true" />
        <SiteNav active="sobre" />
        <div className="subhero-content">
          <span className="eo-eyebrow">Quem somos</span>
          <h1>Tornar o mercado imobiliário acessível a qualquer pessoa.</h1>
          <p>
            Ensinamos do conceito à decisão — para que iniciantes, investidores, analistas e líderes entendam o setor de
            verdade.
          </p>
        </div>
      </header>

      {/* NÚMEROS */}
      <section className="ed-section">
        <div className="ed-stats">
          {STATS.map((s) => (
            <div key={s.lab}>
              <div className="ed-statnum">{s.num}</div>
              <div className="ed-statlab">{s.lab}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HISTÓRIA */}
      <section className="ed-section soft">
        <div className="ed-split">
          <div>
            <Ph label="foto · time / sala de aula" className="ratio-4x3 rounded-[24px]" />
          </div>
          <div>
            <span className="eo-eyebrow">Nossa história</span>
            <h2 className="font-display text-ink mt-3.5 text-[32px] font-bold tracking-tight">
              De uma sala de treinamento a milhares de pessoas.
            </h2>
            <p className="eo-lead mt-[18px]">
              Começamos formando uma única equipe. O método funcionou tão bem que virou plataforma. Hoje reunimos os
              melhores especialistas do país em um só lugar — do conceito básico à estratégia de quem lidera.
            </p>
            <p className="eo-lead mt-3.5">
              Acreditamos que conhecimento aplicado é o que separa quem só observa o mercado de quem decide com
              segurança nele.
            </p>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="ed-section">
        <div className="ed-head">
          <span className="eo-eyebrow">No que acreditamos</span>
          <h2>Nossos valores</h2>
        </div>
        <div className="ed-grid-3">
          {VALUES.map((v) => (
            <div key={v.title} className="ed-card">
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIME */}
      <section className="ed-section soft">
        <div className="ed-head">
          <span className="eo-eyebrow">Liderança</span>
          <h2>Quem está por trás</h2>
        </div>
        <div className="ed-grid-4">
          {TEAM.map((m) => (
            <div key={m.name} className="ed-card text-center">
              <Ph label="foto" className="mx-auto size-[88px] rounded-full" />
              <h3 className="mt-4">{m.name}</h3>
              <p className="mt-1">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="band">
        <Ph dark label="BAND · cidade" />
        <div className="amb" aria-hidden="true" />
        <div className="band-content">
          <h2 className="eo-h2">Quer levar a TBO para a sua equipe?</h2>
          <Link className="pill pill-white" href="/suporte">
            Falar com nosso time <span className="parrow">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
