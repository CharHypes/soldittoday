import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { partnerCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Preferred Partners | SOLD IT TODAY — Southeast Michigan Real Estate",
  description:
    "SOLD IT TODAY's preferred partners: trusted lenders, title companies, home inspectors, insurance agents, and contractors supporting buyers and sellers across Southeast Michigan and Metro Detroit.",
};

export default function PreferredPartnersPage() {
  return (
    <PageShell
      eyebrow="Preferred Partners"
      title="A trusted network around every transaction"
      description="The professionals we rely on to keep your move smooth — from financing and title to inspection, insurance, and repairs. Partner companies will be confirmed and listed here."
    >
      <section className="relative bg-plum py-20 md:py-28">
        <div className="container-lux space-y-12">
          {partnerCategories.map((cat) => (
            <div key={cat.id}>
              <div className="flex flex-col gap-2 border-b border-dusty/12 pb-5">
                <h2 className="text-2xl font-semibold tracking-tightest text-pearl">
                  {cat.title}
                </h2>
                <p className="max-w-2xl text-sm text-dusty">{cat.blurb}</p>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cat.partners.map((partner, i) => (
                  <div
                    key={`${cat.id}-${i}`}
                    className="aurora-ring rounded-xl2 border border-dusty/12 bg-bruised/40 p-5"
                  >
                    <div className="text-base font-semibold text-pearl">
                      {partner.name}
                    </div>
                    <div className="mt-1.5 text-xs text-dusty">
                      {partner.detail}
                    </div>
                    {partner.placeholder && (
                      <span className="mt-3 inline-flex rounded-full border border-dusty/25 bg-plum/50 px-2.5 py-1 text-[10px] uppercase tracking-widest text-dusty">
                        Placeholder
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <p className="text-xs leading-relaxed text-dusty/70">
            {/* NOTE: Use full public-facing company names (e.g. "First Centennial
                Title", not "FC Title"). Do not add companies unless provided by
                the client. */}
            Partner companies shown are placeholders. Real preferred partners
            will be listed with their full public-facing company names once
            confirmed.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
