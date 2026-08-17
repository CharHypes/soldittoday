import type { MetadataRoute } from "next";

const SITE = "https://www.soldittoday.com";

/**
 * robots.txt. Allows all reputable crawlers and points them at the sitemap.
 * Coming-soon / placeholder pages carry their own noindex, so they are handled
 * at the page level rather than blocked here.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
