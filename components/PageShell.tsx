import type { ReactNode } from "react";
import Footer from "./Footer";
import ThemeToggle from "./ThemeToggle";
import { contact } from "@/lib/data";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description?: string;
  /** Optional hero CTA row, rendered under the description. */
  actions?: ReactNode;
  children: ReactNode;
};

/**
 * Shared shell for scaffolded sub-pages (Team, Service Areas, Neighborhood
 * Guides, Resources, Preferred Partners). Provides a lightweight header that
 * links back to the homepage sections, a branded hero band, and the footer.
 *
 * These pages exist for AI/SEO discoverability and future content. Most carry
 * placeholder content today — fill them in over time.
 */
export default function PageShell({
  eyebrow,
  title,
  description,
  actions,
  children,
}: PageShellProps) {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-dusty/10 bg-plum/80 backdrop-blur-xl">
        <nav className="container-lux flex h-[72px] items-center justify-between">
          <a href="/" className="flex items-center" aria-label="SOLD IT TODAY home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logos/sold-it-today/Sold-It-Today-high-contrast-fixed-transparent.svg"
              alt="SOLD IT TODAY"
              className="h-8 w-auto sm:h-[38px] md:h-[43px]"
            />
          </a>
          <div className="flex items-center gap-6">
            <a
              href="/#search"
              className="hidden text-sm font-medium text-dusty transition-colors hover:text-pearl sm:inline"
            >
              Search Homes
            </a>
            <a
              href="/"
              className="hidden text-sm font-medium text-dusty transition-colors hover:text-pearl sm:inline"
            >
              Home
            </a>
            <ThemeToggle />
            <a
              href="/#contact"
              className="btn-aurora whitespace-nowrap !px-4 !py-3 text-[13px] sm:!px-5 sm:text-sm"
            >
              <span className="sm:hidden">Schedule</span>
              <span className="hidden sm:inline">Schedule a Consultation</span>
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero band */}
        <section className="relative overflow-hidden bg-mulberry-radial pb-16 pt-24 md:pb-20 md:pt-32">
          <div className="aurora-bloom opacity-70" />
          <div className="grain-soft" />
          <div className="container-lux relative z-10 max-w-3xl">
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tightest text-pearl sm:text-5xl md:text-6xl">
              {title}
            </h1>
            {description && (
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-dusty">
                {description}
              </p>
            )}
            {actions && <div className="mt-8">{actions}</div>}
          </div>
        </section>

        {children}
      </main>

      <Footer />
    </>
  );
}

/**
 * Small reusable "content coming soon" block for scaffolded pages that don't
 * have full content yet. Keeps pages branded and SEO-meaningful in the interim.
 */
export function ComingSoon({
  note,
  bullets,
}: {
  note: string;
  bullets?: string[];
}) {
  return (
    <section className="relative bg-plum py-20 md:py-28">
      <div className="container-lux">
        <div className="aurora-ring max-w-3xl rounded-xl2 border border-dusty/15 bg-bruised/40 p-8 shadow-aurora md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-auroraMauve/25 bg-wine/30 px-3 py-1 text-[11px] uppercase tracking-widest text-pearl/90">
            In progress
          </div>
          <p className="mt-5 text-lg leading-relaxed text-dusty">{note}</p>
          {bullets && bullets.length > 0 && (
            <ul className="mt-6 space-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-pearl/85">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-auroraMauve" />
                  <span className="text-sm leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          )}
          <a href="/#contact" className="btn-aurora group mt-8">
            Schedule a Consultation
            <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
