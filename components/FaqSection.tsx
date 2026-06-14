import SectionHeading from "./ui/SectionHeading";

export type FaqItem = { q: string; a: string };

/**
 * Reusable FAQ section. Native <details> accordions (no client JS, SEO-friendly)
 * plus FAQPage structured data built from the same items. Content is real — no
 * fabricated schema.
 */
export default function FaqSection({
  items,
  eyebrow = "FAQ",
  title = "Frequently asked questions",
  description,
}: {
  items: FaqItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <section className="relative overflow-hidden bg-plum py-20 md:py-28">
      <div className="aurora-bloom opacity-40" />
      <div className="container-lux relative z-10">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="center"
        />
        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {items.map((it) => (
            <details
              key={it.q}
              className="aurora-ring group rounded-xl2 border border-dusty/12 bg-bruised/40 px-6 open:border-auroraMauve/30"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-pearl marker:hidden [&::-webkit-details-marker]:hidden">
                <span className="font-medium">{it.q}</span>
                <span className="shrink-0 text-xl leading-none text-auroraMauve transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="pb-5 text-sm leading-relaxed text-dusty">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </section>
  );
}
