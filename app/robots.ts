import type { MetadataRoute } from "next";

// Allow all crawlers, including AI/answer-engine crawlers, and point them to the
// sitemap. This supports both traditional SEO and AI discoverability.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://www.soldittoday.com/sitemap.xml",
    host: "https://www.soldittoday.com",
  };
}
