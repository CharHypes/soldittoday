import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import FaqSection from "@/components/FaqSection";
import CrossLinks from "@/components/CrossLinks";
import { getResource, publishedResources } from "@/lib/resources";

const SITE = "https://www.soldittoday.com";

export function generateStaticParams() {
  return publishedResources.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const r = getResource(params.slug);
  if (!r) return {};
  const url = `${SITE}/resources/${r.slug}`;
  return {
    title: r.metaTitle,
    description: r.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: r.metaTitle,
      description: r.metaDescription,
      url,
      type: "article",
    },
  };
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ResourceArticle({
  params,
}: {
  params: { slug: string };
}) {
  const r = getResource(params.slug);
  if (!r) notFound();

  const url = `${SITE}/resources/${r.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: r.title,
        description: r.metaDescription,
        datePublished: r.updated,
        dateModified: r.updated,
        mainEntityOfPage: url,
        author: {
          "@type": "Person",
          name: "Charlotte Hypes",
          url: `${SITE}/meet-charlotte`,
        },
        publisher: {
          "@type": "Organization",
          name: "Sold It Today",
          url: SITE,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Resources",
            item: `${SITE}/resources`,
          },
          { "@type": "ListItem", position: 2, name: r.title, item: url },
        ],
      },
    ],
  };

  return (
    <PageShell eyebrow={r.eyebrow} title={r.title} description={r.lede}>
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative bg-plum py-16 md:py-24">
        <div className="container-lux">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-dusty">
              Updated {formatDate(r.updated)} &middot; {r.readMinutes} min read
            </p>

            {r.keyPoints && r.keyPoints.length > 0 && (
              <div className="mt-8 rounded-xl2 border border-auroraMauve/20 bg-bruised/40 p-6 md:p-8">
                <div className="eyebrow text-auroraMauve">At a glance</div>
                <ul className="mt-4 space-y-3">
                  {r.keyPoints.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-pearl/90">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-auroraMauve shadow-aurora" />
                      <span className="text-sm leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <article className="mt-10">
              {r.sections.map((s, i) => (
                <div key={i} className={i > 0 ? "mt-10" : ""}>
                  {s.heading && (
                    <h2 className="text-2xl font-semibold tracking-tightest text-pearl">
                      {s.heading}
                    </h2>
                  )}
                  {s.body.map((p, j) => (
                    <p
                      key={j}
                      className="mt-4 text-[15px] leading-relaxed text-dusty md:text-base"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              ))}
            </article>

            {r.related.length > 0 && (
              <div className="mt-12 border-t border-dusty/15 pt-8">
                <div className="text-xs uppercase tracking-widest text-dusty">
                  Related
                </div>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {r.related.map((rel) => (
                    <a
                      key={rel.href}
                      href={rel.href}
                      className="rounded-full border border-dusty/25 bg-plum/40 px-4 py-2 text-sm text-pearl transition-colors duration-300 hover:border-auroraMauve/60"
                    >
                      {rel.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {r.faqs.length > 0 && (
        <FaqSection
          items={r.faqs}
          title={`${r.navLabel}: common questions`}
        />
      )}

      <CrossLinks />
    </PageShell>
  );
}
