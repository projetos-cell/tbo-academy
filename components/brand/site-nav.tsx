import Link from "next/link";
import { IconSearch } from "@tabler/icons-react";
import { TboLogo } from "@/components/brand/tbo-logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/catalogo", label: "Cursos", key: "catalogo" },
  { href: "/planos", label: "Planos", key: "planos" },
  { href: "/sobre", label: "Sobre", key: "sobre" },
  { href: "/blog", label: "Blog", key: "blog" },
];

/** Navegação editorial sobreposta ao hero (marketing). */
export function SiteNav({ active }: { active?: string }) {
  return (
    <nav className="eo-nav">
      <Link href="/" aria-label="TBO Academy — início">
        <TboLogo tone="light" />
      </Link>

      <div className="eo-navlinks">
        {LINKS.map((l) => (
          <Link key={l.key} href={l.href} className={cn(active === l.key && "active")}>
            {l.label}
          </Link>
        ))}
      </div>

      <div className="eo-navactions">
        <Link href="/catalogo" className="eo-iconbtn" aria-label="Buscar">
          <IconSearch className="size-[18px]" />
        </Link>
        <Link
          href="/login"
          className="flex items-center text-sm font-semibold text-white transition-opacity hover:opacity-80"
        >
          Entrar
        </Link>
        <Link href="/planos" className="pill pill-white pill-sm">
          Assinar <span className="parrow">→</span>
        </Link>
      </div>
    </nav>
  );
}
