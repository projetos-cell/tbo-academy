import Link from "next/link";
import { TboLogo } from "@/components/brand/tbo-logo";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Plataforma",
    links: [
      { label: "Catálogo", href: "/catalogo" },
      { label: "Planos", href: "/planos" },
      { label: "Trilhas", href: "/trilhas" },
      { label: "Área do aluno", href: "/explorar" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre", href: "/sobre" },
      { label: "Blog", href: "/blog" },
      { label: "Para empresas", href: "/planos" },
      { label: "Carreiras", href: "#" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Artigos", href: "/blog" },
      { label: "Materiais", href: "#" },
      { label: "Webinars", href: "#" },
      { label: "Glossário", href: "#" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { label: "Central de ajuda", href: "/suporte" },
      { label: "Contato", href: "#" },
      { label: "Termos", href: "#" },
      { label: "Privacidade", href: "#" },
    ],
  },
];

/** Rodapé editorial compartilhado (marketing). */
export function SiteFooter() {
  return (
    <footer className="eo-footer">
      <div className="eo-footer-grid">
        <div>
          <TboLogo tone="light" className="text-2xl" />
          <p className="text-forest-200 mt-4 max-w-[240px] text-[13.5px] leading-relaxed">
            Educação para quem quer entender, investir e crescer no mercado imobiliário.
          </p>
          <div className="eo-socials">
            <span>in</span>
            <span>▶</span>
            <span>◎</span>
            <span>✦</span>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} className="eo-footer-col">
            <h5>{col.title}</h5>
            {col.links.map((l) => (
              <Link key={l.label} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="eo-footer-bottom">
        <span>© 2026 TBO Academy. Todos os direitos reservados.</span>
        <span className="flex gap-[22px]">
          <Link href="#">Termos</Link>
          <Link href="#">Privacidade</Link>
          <Link href="#">Cookies</Link>
        </span>
      </div>
    </footer>
  );
}
