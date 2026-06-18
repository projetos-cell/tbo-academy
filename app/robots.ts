import type { MetadataRoute } from "next";

const SITE_URL = "https://academy.wearetbo.com.br";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api",
        "/inicio",
        "/explorar",
        "/meus-cursos",
        "/trilhas",
        "/comunidade",
        "/ranking",
        "/certificados",
        "/biblioteca",
        "/aulas-ao-vivo",
        "/feed",
        "/suporte",
        "/configuracoes",
        "/diagnostico",
        "/cursos",
        "/login",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
