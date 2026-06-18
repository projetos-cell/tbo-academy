import Link from "next/link";
import { SiteNav } from "@/components/brand/site-nav";
import { Ph } from "@/components/brand/photo-placeholder";

const CATALOG = [
  {
    cat: "Para começar",
    num: "01",
    title: "Fundamentos do mercado imobiliário",
    desc: "Como o setor funciona, do zero — para quem está chegando agora.",
  },
  {
    cat: "Investir & analisar",
    num: "02",
    title: "Investimento e análise de imóveis",
    desc: "Rentabilidade, risco e leitura de dados para decidir com segurança.",
  },
  {
    cat: "Liderar",
    num: "03",
    title: "Estratégia e gestão no setor",
    desc: "Visão de mercado, indicadores e gestão para quem lidera negócios.",
  },
];

const TESTIMONIALS = [
  { name: "Camila Reis", role: "Começando do zero", quote: "Saí da curiosidade ao primeiro investimento." },
  { name: "André Lima", role: "Investidor", quote: "Montei minha carteira de imóveis com critério." },
  { name: "Tiago Moraes", role: "Analista de mercado", quote: "Aprofundei minha leitura de dados do setor." },
  { name: "Júlia Antunes", role: "CEO, proptech", quote: "Entendi o mercado para liderar melhor." },
];

const STATS = [
  { big: "12.4k", lab: "pessoas formadas em todo o Brasil" },
  { big: "90+", lab: "cursos do básico ao avançado" },
  { big: "4.9★", lab: "avaliação média da plataforma" },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <header className="hero">
        <Ph dark label="HERO · pessoa estudando / imóvel com luz natural" />
        <div className="amb" aria-hidden="true" />
        <SiteNav />
        <div className="hero-content">
          <h1 className="eo-h1 eo-display">Entenda o mercado imobiliário de verdade.</h1>
          <p className="eo-lead">
            Para qualquer pessoa que queira entrar, investir e crescer no setor — de quem está começando do zero a
            analistas, investidores e CEOs. No seu ritmo, com certificado.
          </p>
          <Link className="pill pill-white" href="/catalogo">
            Explorar cursos <span className="parrow">→</span>
          </Link>
        </div>
        <a className="scrollcue" href="#catalogo" aria-label="Rolar">
          ⌄
        </a>
      </header>

      {/* CATÁLOGO */}
      <section className="eo-section" id="catalogo">
        <div className="catalog-head">
          <div>
            <span className="eo-eyebrow">Catálogo</span>
            <h2 className="eo-h2 mt-4 max-w-[560px]">Do primeiro conceito à decisão de quem lidera.</h2>
          </div>
          <div className="catalog-head-right">
            <p className="eo-lead">
              Trilhas para qualquer objetivo no mercado imobiliário — comece do zero ou aprofunde a sua especialização.
            </p>
            <Link className="pill pill-dark" href="/catalogo">
              Ver todos os cursos <span className="parrow">→</span>
            </Link>
          </div>
        </div>
        <div className="catalog-grid">
          {CATALOG.map((c) => (
            <Link key={c.num} className="ccard" href="/catalogo">
              <Ph label={`capa · ${c.title.toLowerCase()}`}>
                <span className="ccat">{c.cat}</span>
              </Ph>
              <div className="ccard-body">
                <span className="cnum">{c.num}</span>
                <h3 className="eo-h3">{c.title}</h3>
                <p>{c.desc}</p>
                <span className="clink">
                  Ver curso <span className="parrow">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BAND MÉTODO */}
      <section className="band">
        <Ph dark label="BAND · skyline ao entardecer / cidade" />
        <div className="amb" aria-hidden="true" />
        <div className="band-content">
          <h2 className="eo-h2">A maioria entra no mercado no improviso. Os melhores partem de um método.</h2>
          <p className="eo-lead">
            Conteúdo estruturado, dados de mercado e mentoria ao vivo para você decidir melhor — começando, investindo,
            analisando ou liderando.
          </p>
          <Link className="pill pill-white" href="/sobre">
            Conhecer o método <span className="parrow">→</span>
          </Link>
        </div>
      </section>

      {/* TESTEMUNHOS */}
      <section className="eo-section">
        <span className="eo-eyebrow">Histórias</span>
        <h2 className="eo-h2 mt-4 max-w-[640px]">Veja o impacto na trajetória de quem aprende aqui.</h2>
        <p className="eo-lead mt-3.5">Iniciantes, analistas, investidores e executivos da comunidade TBO Academy.</p>
        <div className="tcards">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="tcard">
              <Ph label={`retrato · ${t.role.toLowerCase()}`} />
              <p>
                <strong>{t.name}</strong> · {t.role}
                <br />“{t.quote}”
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* STATBAND */}
      <section className="statband">
        <div className="amb" aria-hidden="true" />
        <div className="statband-grid">
          <div>
            <span className="eo-eyebrow text-volt">Comunidade</span>
            <h2 className="eo-h2 mt-4">Mais de 12 mil pessoas já entraram no mercado imobiliário com a TBO.</h2>
            <p className="eo-lead mt-4">
              Junte-se à maior comunidade de educação imobiliária do Brasil — de iniciantes a executivos.
            </p>
            <div className="statchips">
              <span className="statchip">App iOS e Android</span>
              <span className="statchip">Comunidade ativa</span>
              <span className="statchip">Certificado válido</span>
            </div>
            <Link className="pill pill-white mt-7" href="/planos">
              Conhecer os planos <span className="parrow">→</span>
            </Link>
          </div>
          <div className="stat-panel">
            {STATS.map((s) => (
              <div key={s.lab} className="stat-row">
                <span className="big">{s.big}</span>
                <span className="lab">{s.lab}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
