import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import CrossLinks from "@/components/CrossLinks";
import { libraryItems } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Articles & Insights | SOLD IT TODAY ... Michigan Real Estate",
  description:
    "Market updates, buyer and seller education, relocation help, and neighborhood spotlights, plus our evergreen guides ... clear, honest real estate insight from the Sold It Today team.",
  alternates: { canonical: "https://www.soldittoday.com/blog" },
};

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const items = libraryItems();

  return (
    <PageShell
      eyebrow="Articles & Insights"
      title="Real estate, explained clearly"
      description="Market updates, buyer and seller education, relocation help, and neighborhood spotlights ... alongside our in-depth guides. Honest, practical insight for Michigan buyers and sellers."
    >
      <section className="relative bg-plum py-16 md:py-24">
        <div className="container-lux">
          {items.length === 0 ? (
            <p className="mx-auto max-w-2xl text-center text-dusty">
              New articles are on the way. In the meantime, explore our{" "}
              <a href="/resources" className="font-medium text-auroraMauve hover:underline">
                resources and calculators
              </a>
              .
            </p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group aurora-ring flex flex-col rounded-xl2 border border-dusty/12 bg-bruised/40 p-7 transition-colors duration-300 hover:border-auroraMauve/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="eyebrow text-auroraMauve">{item.label}</span>
                    <span className="text-[11px] uppercase tracking-widest text-dusty/70">
                      {item.readMinutes} min read
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold tracking-tightest text-pearl">
                    {item.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-dusty">
                    {item.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs text-dusty/70">{formatDate(item.date)}</span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-auroraMauve">
                      {item.type === "guide" ? "Read the guide" : "Read the article"}
                      <span aria-hidden className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                        &rarr;
                      </span>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <CrossLinks />
    </PageShell>
  );
}
