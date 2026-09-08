import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import FaqSection from "@/components/FaqSection";
import CrossLinks from "@/components/CrossLinks";
import { getPost, posts } from "@/lib/blog";

const SITE = "https://www.soldittoday.com";

// Include drafts so they route (for review); drafts are noindexed below and are
// not linked from the public index or the sitemap.
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const p = getPost(params.slug);
  if (!p) return {};
  const url = `${SITE}/blog/${p.slug}`;
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    alternates: { canonical: url },
    // Drafts must never be indexed while under review.
    robots: p.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      title: p.metaTitle,
      description: p.metaDescription,
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

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const p = getPost(params.slug);
  if (!p) notFound();

  const url = `${SITE}/blog/${p.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: p.title,
        description: p.metaDescription,
        datePublished: p.date,
        dateModified: p.date,
        articleSection: p.category,
        mainEntityOfPage: url,
        author: { "@type": "Organization", name: "Sold It Today", url: SITE },
        publisher: { "@type": "Organization", name: "Sold It Today", url: SITE },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Articles & Insights", item: `${SITE}/blog` },
          { "@type": "ListItem", position: 2, name: p.title, item: url },
        ],
      },
    ],
  };

  return (
    <PageShell eyebrow={p.category} title={p.title} description={p.excerpt}>
      {/* Structured data only matters once published; harmless on drafts. */}
      {!p.draft && (
        // eslint-disable-next-line react/no-danger
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <section className="relative bg-plum py-16 md:py-24">
        <div className="container-lux">
          <div className="mx-auto max-w-3xl">
            {p.draft && (
              <div className="mb-8 rounded-xl2 border border-gold/40 bg-gold/10 px-5 py-4 text-sm text-pearl">
                <span className="font-semibold text-gold">Draft preview.</span>{" "}
                This article is not yet published ... it is hidden from the blog
                index, not indexed by search engines, and only reachable by this
                link. Review and approve it before it goes live.
              </div>
            )}

            <p className="text-xs uppercase tracking-widest text-dusty">
              {p.category} &middot; {formatDate(p.date)} &middot; {p.readMinutes} min read
            </p>

            {p.keyPoints && p.keyPoints.length > 0 && (
              <div className="mt-8 rounded-xl2 border border-auroraMauve/20 bg-bruised/40 p-6 md:p-8">
                <div className="eyebrow text-auroraMauve">At a glance</div>
                <ul className="mt-4 space-y-3">
                  {p.keyPoints.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-pearl/90">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-auroraMauve shadow-aurora" />
                      <span className="text-sm leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <article className="mt-10">
              {p.sections.map((s, i) => (
                <div key={i} className={i > 0 ? "mt-10" : ""}>
                  {s.heading && (
                    <h2 className="text-2xl font-semibold tracking-tightest text-pearl">
                      {s.heading}
                    </h2>
                  )}
                  {s.body.map((para, j) => (
                    <p
                      key={j}
                      className="mt-4 text-[15px] leading-relaxed text-dusty md:text-base"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              ))}
            </article>

            {p.related && p.related.length > 0 && (
              <div className="mt-12 border-t border-dusty/15 pt-8">
                <div className="text-xs uppercase tracking-widest text-dusty">Related</div>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {p.related.map((rel) => (
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

      {p.faqs && p.faqs.length > 0 && (
        <FaqSection items={p.faqs} title={`${p.category}: common questions`} />
      )}

      <CrossLinks />
    </PageShell>
  );
}
