import type { MetadataRoute } from "next";

const SITE_URL = "https://academy.wearetbo.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-06-17");

  const routes = ["", "/catalogo", "/planos", "/sobre", "/blog"];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
