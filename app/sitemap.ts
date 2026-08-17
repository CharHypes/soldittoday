import type { MetadataRoute } from "next";
import { DPA_PROGRAMS } from "@/lib/dpaPrograms";
import { publishedResources } from "@/lib/resources";

const SITE = "https://www.soldittoday.com";

/**
 * XML sitemap for search engines. Includes the core pages, the indexable DPA
 * program pages (coming-soon ones are excluded, matching their noindex), and
 * the published resource articles.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    "",
    "/meet-charlotte",
    "/team",
    "/buyers",
    "/sellers",
    "/first-time-buyers",
    "/relocation",
    "/communities",
    "/neighborhood-guides",
    "/resources",
    "/preferred-partners",
    "/privacy-policy",
    "/dpa",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${SITE}${p}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.7,
  }));

  const dpaEntries: MetadataRoute.Sitemap = DPA_PROGRAMS.filter(
    (p) => !p.comingSoon
  ).map((p) => ({
    url: `${SITE}/dpa/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const resourceEntries: MetadataRoute.Sitemap = publishedResources.map((r) => ({
    url: `${SITE}/resources/${r.slug}`,
    lastModified: new Date(`${r.updated}T00:00:00`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...dpaEntries, ...resourceEntries];
}
