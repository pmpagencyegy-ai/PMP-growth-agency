import type { MetadataRoute } from "next";
import { c, origin, projects, indexable } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!origin || !indexable) return [];
  return [
    "",
    "/work",
    "/services",
    "/about",
    "/contact",
    "/privacy",
    ...c.services.map((s) => `/services/${s.slug}`),
    ...projects.map((p) => `/work/${p.slug}`),
  ].map((path) => ({ url: `${origin}/en${path}` }));
}
