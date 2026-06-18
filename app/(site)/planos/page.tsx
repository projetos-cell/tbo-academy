import Link from "next/link";
import { SiteNav } from "@/components/brand/site-nav";
import { Ph } from "@/components/brand/photo-placeholder";

export const metadata = {
  title: "Planos e preços — TBO Academy",
  description: "Um preço. Todo o catálogo. Acesso aos cursos, comunidade e suporte por 1 ano.",
};

const INCLUDES = [
  "Acesso a todos os cursos e trilhas",
  "Comunidade e mentoria",
  "Suporte por 1 ano",
  "Certificados verificáveis",
  "Atualizações e novos cursos incluídos",
];

const FAQ = [
  {
    q: "Preciso ter experiência no mercado?",
    a: "Não. Há trilhas do zero para quem está chegando agora e conteúdos avançados para analistas, investidores e gestores.",
    open: true,
  },
  {
    q: "Quanto tempo tenho de acesso?",
    a: "O acesso vale por 1 ano a partir da matrícula, com todas as atualizações e novos cursos incluídos no período.",
  },
  {
    q: "Como funciona o pagamento?",
    a: "Em até 12x de R$ 309,96 no cartão, ou R$ 2.997 à vista. Emitimos nota fiscal para pessoa física e jurídica.",
  },
  {
    q: "Emitem nota fiscal para empresas?",
    a: "Sim, para todos os planos. O plano Empresas inclui faturamento e gestão centralizada.",
  },
];

export default function PlanosPage() {
  return (
    <>
      <header className="subhero">
        <Ph dark label="capa · planos" />
        <div className="amb" aria-hidden="true" />
        <SiteNav active="planos" />
        <div className="subhero-content">
          <span className="eo-eyebrow">Planos</span>
          <h1>Um preço. Todo o catálogo.</h1>
          <p>Acesso aos conteúdos, à comunidade e ao suporte por 1 ano. Um único plano, tudo incluído.</p>
        </div>
      </header>

      {/* PREÇO */}
      <section className="ed-section">
        <div className="mx-auto max-w-[540px]">
          <div className="price-card feat">
            <span className="feat-badge">Acesso completo</span>
            <span className="price-tag">Plano anual · 1 ano de acesso</span>
            <div className="price-num" style={{ fontSize: 42 }}>
              12x R$ 309,96
            </div>
            <p className="text-forest-200 mt-2 text-[15px]">
              ou <b className="text-white">R$ 2.997</b> à vista
            </p>
            <Link className="pill pill-white w-full justify-between" href="/login">
              Começar agora <span className="parrow">→</span>
            </Link>
            <hr />
            <ul className="ed-list">
              {INCLUDES.map((i) => (
                <li key={i} className="text-forest-100">
                  <span className="ed-check">✓</span> {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="ed-section soft">
        <div className="ed-head">
          <span className="eo-eyebrow">Dúvidas</span>
          <h2>Perguntas frequentes</h2>
        </div>
        <div className="max-w-[760px]">
          {FAQ.map((f) => (
            <details key={f.q} className="ed-acc" open={f.open}>
              <summary>
                <span className="atitle">{f.q}</span>
                <span className="achev">⌄</span>
              </summary>
              <div className="abody">
                <p className="my-3 text-[var(--tbo-gray-600)]">{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA EMPRESAS */}
      <section className="band">
        <Ph dark label="BAND · equipe / escritório" />
        <div className="amb" aria-hidden="true" />
        <div className="band-content">
          <h2 className="eo-h2">Capacite sua equipe inteira com um único contrato.</h2>
          <p className="eo-lead">Imobiliárias, incorporadoras, proptechs e bancos treinam seus times com a TBO.</p>
          <Link className="pill pill-white" href="/suporte">
            Solicitar proposta <span className="parrow">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
