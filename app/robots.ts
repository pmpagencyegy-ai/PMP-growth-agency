import type { MetadataRoute } from "next";
import { indexable, origin } from "@/lib/content";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(indexable ? { allow: "/", disallow: "/api/" } : { disallow: "/" }),
    },
    ...(origin && indexable ? { sitemap: `${origin}/sitemap.xml` } : {}),
  };
}
