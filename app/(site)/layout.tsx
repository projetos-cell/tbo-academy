import type { Metadata } from "next";
import { SiteFooter } from "@/components/brand/site-footer";

export const metadata: Metadata = {
  title: "TBO Academy — Educação para o mercado imobiliário",
  description:
    "Entenda, invista e cresça no mercado imobiliário. Cursos, trilhas, materiais e certificados — uma assinatura, tudo liberado.",
};

/** Layout do site público (marketing) — moldura editorial + rodapé. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="tbo-site min-h-screen">
      <div className="page">
        {children}
        <SiteFooter />
      </div>
    </div>
  );
}
