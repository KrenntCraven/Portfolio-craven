import type { MetadataRoute } from "next";
import { SITE_URL } from "./seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Non-content API routes add no SEO value and shouldn't be crawled.
      disallow: ["/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
