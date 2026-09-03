import type { MetadataRoute } from "next";
import { cityPages } from "@/lib/data";
import { publishedResources } from "@/lib/resources";
import { DPA_PROGRAMS } from "@/lib/dpaPrograms";

const SITE = "https://www.soldittoday.com";
const LAST = "2026-08-16";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths: { p: string; pr: number }[] = [
    { p: "", pr: 1 },
    { p: "/search", pr: 0.9 },
    { p: "/dpa", pr: 0.9 },
    { p: "/buyers", pr: 0.8 },
    { p: "/sellers", pr: 0.8 },
    { p: "/first-time-buyers", pr: 0.8 },
    { p: "/investment", pr: 0.7 },
    { p: "/communities", pr: 0.8 },
    { p: "/resources", pr: 0.8 },
    { p: "/meet-charlotte", pr: 0.7 },
    { p: "/relocation", pr: 0.6 },
    { p: "/team", pr: 0.5 },
    { p: "/preferred-partners", pr: 0.5 },
    { p: "/neighborhood-guides", pr: 0.4 },
    { p: "/privacy-policy", pr: 0.3 },
  ];

  const cities = cityPages.map((c) => ({ p: `/communities/${c.slug}`, pr: 0.7 }));
  const dpa = DPA_PROGRAMS.filter((d) => !d.comingSoon).map((d) => ({
    p: `/dpa/${d.slug}`,
    pr: 0.8,
  }));
  const res = publishedResources.map((r) => ({
    p: `/resources/${r.slug}`,
    pr: 0.7,
  }));

  return [...staticPaths, ...cities, ...dpa, ...res].map(({ p, pr }) => ({
    url: `${SITE}${p}`,
    lastModified: LAST,
    changeFrequency: "weekly" as const,
    priority: pr,
  }));
}
