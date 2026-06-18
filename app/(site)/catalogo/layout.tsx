import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo — TBO Academy",
  description:
    "Explore todos os cursos e trilhas da TBO Academy — do básico ao avançado, para começar, investir, analisar ou liderar no mercado imobiliário.",
};

/** Layout server component só para expor metadata da página de catálogo (que é "use client"). */
export default function CatalogoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
