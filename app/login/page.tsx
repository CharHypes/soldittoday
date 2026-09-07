import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

/**
 * Placeholder for the future client login / portal. Real auth + accounts ship
 * with the CRM build (saved searches, favorites, transaction tracking).
 * Noindexed until it's live.
 */
export const metadata: Metadata = {
  title: "Client Login | SOLD IT TODAY",
  description:
    "Client accounts are coming soon to SOLD IT TODAY ... save searches, favorite homes, and track your transaction in one place.",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <PageShell
      eyebrow="Client Login"
      title="Your client dashboard is coming soon"
      description="Soon you'll be able to create an account to save home searches, favorite listings, and follow your transaction from first showing to closing ... all in one place."
    >
      <section className="relative overflow-hidden bg-bruised py-20 md:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-wine/25 blur-[160px]" />
        <div className="container-lux relative z-10">
          <div className="mx-auto max-w-xl rounded-xl2 border border-auroraMauve/25 bg-plum/50 p-8 text-center md:p-12">
            <span className="inline-flex rounded-full border border-auroraMauve/40 bg-wine/20 px-3 py-1 text-[11px] uppercase tracking-widest text-auroraMauve">
              Under construction
            </span>
            <h2 className="mt-5 text-2xl font-semibold tracking-tightest text-pearl md:text-3xl">
              Accounts are on the way
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-dusty md:text-base">
              We&rsquo;re building a secure client portal so you can save searches, keep a
              favorites list, and stay in the loop on every step of your buy or sale.
              In the meantime, reach out and we&rsquo;ll take care of you personally.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="/#contact" className="btn-aurora group">
                Schedule a Consultation
                <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">&rarr;</span>
              </a>
              <a href="/search" className="btn-outline group">
                Search Homes
                <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
