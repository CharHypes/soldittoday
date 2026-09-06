import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import CrossLinks from "@/components/CrossLinks";
import { resources } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Resources | SOLD IT TODAY ... Southeast Michigan Real Estate",
  description:
    "Clear, honest real estate guides for Southeast Michigan buyers and sellers: down payment assistance, first-time buying, FHA loans, closing costs, and more.",
  alternates: { canonical: "https://www.soldittoday.com/resources" },
};

const CALCS = [
  { href: "/resources/mortgage-calculator", title: "Mortgage payment", blurb: "Your full monthly payment ... principal, interest, taxes, insurance, PMI.", icon: "🧮" },
  { href: "/resources/affordability-calculator", title: "How much can I afford?", blurb: "Your comfortable price range from income, debts, and down payment.", icon: "🏠" },
  { href: "/resources/rent-vs-buy-calculator", title: "Rent vs. buy", blurb: "The year buying pulls ahead of renting ... for how long you'll stay.", icon: "⚖️" },
];

export default function ResourcesPage() {
  return (
    <PageShell
      eyebrow="Resources"
      title="Real estate, explained clearly"
      description="Practical, honest guides to help Southeast Michigan buyers and sellers understand their options and make confident decisions."
    >
      <section className="relative bg-plum py-16 md:py-24">
        <div className="container-lux">
          <div className="grid gap-5 md:grid-cols-2">
            {resources.map((r) => {
              const inner = (
                <>
                  <div className="flex items-center gap-3">
                    <span className="eyebrow text-auroraMauve">{r.eyebrow}</span>
                    {!r.publish && (
                      <span className="rounded-full border border-dusty/25 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-dusty">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <h2 className="mt-3 text-xl font-semibold tracking-tightest text-pearl">
                    {r.navLabel}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-dusty">
                    {r.lede}
                  </p>
                  {r.publish && (
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-auroraMauve">
                      Read the guide
                      <span aria-hidden>&rarr;</span>
                    </span>
                  )}
                </>
              );

              return r.publish ? (
                <a
                  key={r.slug}
                  href={`/resources/${r.slug}`}
                  className="group aurora-ring rounded-xl2 border border-dusty/12 bg-bruised/40 p-7 transition-colors duration-300 hover:border-auroraMauve/40"
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={r.slug}
                  className="rounded-xl2 border border-dusty/12 bg-bruised/20 p-7 opacity-70"
                >
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools & Calculators */}
      <section className="relative bg-bruised py-16 md:py-24">
        <div className="container-lux">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow text-auroraMauve">Tools &amp; Calculators</span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tightest text-pearl">Run the numbers</h2>
            </div>
            <a href="/resources/calculators" className="btn-outline">All calculators &rarr;</a>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CALCS.map((c) => (
              <a
                key={c.href}
                href={c.href}
                className="group aurora-ring flex flex-col rounded-xl2 border border-dusty/12 bg-plum/50 p-6 transition-transform duration-300 hover:-translate-y-1.5"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full border border-auroraMauve/40 bg-plum/40 text-2xl">
                  {c.icon}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-pearl">{c.title}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-dusty">{c.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-auroraMauve">
                  Open
                  <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">&rarr;</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CrossLinks />
    </PageShell>
  );
}
