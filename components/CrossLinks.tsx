import { contact } from "@/lib/data";

/**
 * Standard closing section used across content pages: a consultation + contact
 * CTA plus an internal-linking cluster to the core SOLD IT TODAY pages. The
 * current page renders as an active (non-link) chip; the rest are live links.
 */
const PAGES: { label: string; href: string }[] = [
  { label: "Meet Charlotte", href: "/meet-charlotte" },
  { label: "Buyers", href: "/buyers" },
  { label: "Sellers", href: "/sellers" },
  { label: "First-Time Buyers", href: "/first-time-buyers" },
  { label: "Communities", href: "/communities" },
  { label: "Relocation", href: "/relocation" },
];

export default function CrossLinks({ current }: { current?: string }) {
  const tel = `tel:${contact.phone.replace(/[^0-9]/g, "")}`;
  return (
    <section className="relative overflow-hidden bg-bruised py-20 md:py-24">
      <div className="aurora-bloom opacity-40" />
      <div className="container-lux relative z-10 text-center">
        <span className="eyebrow text-auroraMauve">Ready When You Are</span>
        <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tightest text-pearl sm:text-3xl">
          Let&rsquo;s map out your next move
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-dusty">
          Have a question or want a clear plan? Start with a no-pressure
          conversation — you&rsquo;ll get straight answers and a confident next
          step.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a href="/#contact" className="btn-aurora group">
            Schedule a Consultation
            <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
          <a href={tel} className="btn-outline">
            Call or Text {contact.phone}
          </a>
        </div>

        {/* Internal linking cluster */}
        <div className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-2.5">
          {PAGES.map((p) =>
            p.href === current ? (
              <span
                key={p.href}
                aria-current="page"
                className="inline-flex items-center gap-2 rounded-full border border-auroraMauve/50 bg-wine/40 px-4 py-2 text-sm font-medium text-pearl"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-auroraMauve shadow-aurora" />
                {p.label}
              </span>
            ) : (
              <a
                key={p.href}
                href={p.href}
                className="rounded-full border border-dusty/25 bg-plum/40 px-4 py-2 text-sm text-pearl transition-colors duration-300 hover:border-auroraMauve/60"
              >
                {p.label}
              </a>
            )
          )}
        </div>
      </div>
    </section>
  );
}
