import Link from "next/link";
import { SiteNav } from "@/components/brand/site-nav";
import { Ph } from "@/components/brand/photo-placeholder";

export const metadata = {
  title: "Blog — TBO Academy",
  description: "Ideias, análises e fundamentos para entender o mercado imobiliário.",
};

const TAGS = ["Todos", "Fundamentos", "Investimento", "Mercado", "Gestão", "Carreira"];

const POSTS = [
  { tag: "Fundamentos", title: "O que é cap rate e por que ele importa", author: "Júlia Antunes", time: "6 min" },
  { tag: "Investimento", title: "Renda passiva com imóveis: por onde começar", author: "Júlia Antunes", time: "7 min" },
  { tag: "Mercado", title: "Tendências do mercado imobiliário para 2026", author: "Tiago Moraes", time: "8 min" },
  { tag: "Carreira", title: "Quero entrar no setor: o primeiro passo", author: "Marina Castro", time: "5 min" },
  { tag: "Gestão", title: "Indicadores que todo gestor deveria acompanhar", author: "Eduardo Lemes", time: "6 min" },
  { tag: "Fundamentos", title: "Financiamento explicado para iniciantes", author: "Bruno Tavares", time: "6 min" },
];

export default function BlogPage() {
  return (
    <>
      <header className="subhero" style={{ minHeight: 320 }}>
        <Ph dark label="capa · blog" />
        <div className="amb" aria-hidden="true" />
        <SiteNav active="blog" />
        <div className="subhero-content">
          <span className="eo-eyebrow">Blog</span>
          <h1>Ideias para entender o mercado imobiliário.</h1>
        </div>
      </header>

      {/* FILTROS + DESTAQUE */}
      <section className="ed-section">
        <div className="tagrow mb-10">
          {TAGS.map((t, i) => (
            <span key={t} className={i === 0 ? "tagpill on" : "tagpill"}>
              {t}
            </span>
          ))}
        </div>
        <Link href="#" className="ed-card grid grid-cols-1 gap-0 overflow-hidden !p-0 md:grid-cols-[1.2fr_1fr]">
          <Ph label="imagem · post em destaque" className="min-h-[320px]" />
          <div className="flex flex-col justify-center p-11">
            <span className="tagpill self-start">Mercado</span>
            <h2 className="font-display mt-4 text-[30px] font-bold tracking-tight">
              Como avaliar um imóvel em 2026 sem se enganar
            </h2>
            <p className="eo-lead mt-3.5">
              O guia de avaliação para qualquer perfil: dados de mercado, comparáveis e a leitura que sustenta o preço.
            </p>
            <div className="pmeta mt-[18px]">Júlia Antunes · 12 jun 2026 · 8 min</div>
          </div>
        </Link>
      </section>

      {/* GRID */}
      <section className="ed-section tight">
        <div className="ed-grid-3">
          {POSTS.map((p) => (
            <Link key={p.title} href="#" className="post-card">
              <Ph label="imagem do post" />
              <span className="tagpill mt-4 inline-block">{p.tag}</span>
              <h3>{p.title}</h3>
              <div className="pmeta">
                {p.author} · {p.time}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link className="pill pill-dark" href="#">
            Ver mais artigos <span className="parrow">→</span>
          </Link>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="band">
        <Ph dark label="BAND · cidade" />
        <div className="amb" aria-hidden="true" />
        <div className="band-content">
          <h2 className="eo-h2">Receba 1 ideia por semana.</h2>
          <p className="eo-lead">Análises e fundamentos do mercado imobiliário, direto no seu e-mail.</p>
          <form className="ed-card mt-6 flex max-w-[460px] items-center gap-2 !p-2" action="#">
            <input
              placeholder="Seu melhor e-mail"
              className="text-ink flex-1 border-0 bg-transparent px-3.5 text-[15px] outline-none"
            />
            <button type="submit" className="pill pill-dark pill-sm">
              Assinar <span className="parrow">→</span>
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
