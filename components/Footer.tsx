import { contact, navLinks, futurePages } from "@/lib/data";

export default function Footer() {
  const year = 2026;

  return (
    <footer className="relative overflow-hidden border-t border-dusty/10 bg-plum">
      <div className="aurora-bloom opacity-40" />

      <div className="container-lux relative z-10 py-16">
        {/* Brand + broker logo lockups */}
        <div className="flex flex-col items-start justify-between gap-8 border-b border-dusty/10 pb-10 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-6">
            {/* SOLD IT TODAY logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logos/sold-it-today/Sold-It-Today-high-contrast-fixed-transparent.svg"
              alt="SOLD IT TODAY"
              className="h-12 w-auto"
            />
            {/* Brokerage compliance lockup. The official Remerica mark is dark
                navy + red ... illegible on the dark footer ... so a generated
                pearl-white reversed version is used there. Light mode needs the
                opposite: the white mark vanishes, so the original dark mark
                shows instead. Both are rendered and swapped by theme in CSS
                rather than in JS, so the correct one is present at first paint.
                Swap in an official reversed asset if the brokerage provides one. */}
            <div className="flex items-center rounded-xl border border-pearl/12 bg-pearl/[0.05] px-4 py-2.5 backdrop-blur-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/logos/remerica/remerica-united-realty-white.png"
                alt="Remerica United Realty ... brokerage"
                className="theme-dark-only h-8 w-auto opacity-90"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/logos/remerica/remerica-united-realty.png"
                alt="Remerica United Realty ... brokerage"
                className="theme-light-only h-8 w-auto"
              />
            </div>
          </div>
          {/* Footer CTA ... a friendly, smaller invitation to the founder page
              (distinct from the header's "Schedule a Consultation" primary CTA). */}
          <a
            href="/meet-charlotte"
            className="btn-aurora group !px-6 !py-3 !text-[13px]"
          >
            Meet Charlotte
            <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </div>

        <div className="grid gap-12 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="text-lg font-bold uppercase tracking-[0.32em] text-pearl">
              {contact.brand}
            </div>
            {/* Body copy uses a softer tone than headings/names/links for
                clearer hierarchy while staying well above AA contrast. */}
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-bodySoft">
              Real estate guidance with clarity, strategy, and results. Helping
              Southeast Michigan buyers and sellers feel confident, informed, and
              ready to take the next step.
            </p>
            <p className="mt-5 text-sm font-medium text-bodySoft">
              {contact.serviceStatement}
            </p>

            {/* Official social links ... subtle, theme-aware (icons inherit the
                pearl text token, which flips for light mode). Open in a new tab. */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.instagram.com/sold.it.today"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sold It Today on Instagram"
                className="grid h-9 w-9 place-items-center rounded-full border border-dusty/25 text-pearl/70 transition-colors duration-300 hover:border-auroraMauve/50 hover:text-pearl"
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden focusable="false">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/soldittoday"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sold It Today on Facebook"
                className="grid h-9 w-9 place-items-center rounded-full border border-dusty/25 text-pearl/70 transition-colors duration-300 hover:border-auroraMauve/50 hover:text-pearl"
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden focusable="false">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Explore + future pages */}
          <div>
            <div className="text-xs uppercase tracking-widest text-dusty">
              Explore
            </div>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-pearl/80 transition-colors duration-300 hover:text-pearl"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              {futurePages.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-pearl/80 transition-colors duration-300 hover:text-pearl"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-xs uppercase tracking-widest text-dusty">
              Get In Touch
            </div>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="font-semibold text-pearl">{contact.founder}</li>
              <li className="text-dusty">{contact.founderTitle}</li>
              <li className="text-dusty">
                <address className="not-italic leading-relaxed">
                  {contact.brokerage}
                  <br />
                  {contact.officeStreet}
                  <br />
                  {contact.officeCityStateZip}
                </address>
              </li>
              <li>
                <a
                  href={`tel:${contact.phone.replace(/[^0-9]/g, "")}`}
                  className="text-pearl/80 transition-colors hover:text-pearl"
                >
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-pearl/80 transition-colors hover:text-pearl"
                >
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal / disclaimer area */}
        <div className="space-y-4 border-t border-dusty/10 pt-8 text-xs leading-relaxed text-dusty/70">
          <p>
            SOLD IT TODAY is a real estate team at {contact.brokerage},{" "}
            {contact.officeStreet}, {contact.officeCityStateZip}. Equal Housing
            Opportunity. All information is deemed reliable but not guaranteed.
            This site is for informational purposes and is not a solicitation if
            you are already represented by a real estate professional.
          </p>
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p>
              &copy; {year} {contact.brand} &middot; {contact.brokerage}
            </p>
            <p>{contact.region}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
