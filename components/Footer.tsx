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
                navy + red — illegible directly on the dark footer — so we use a
                generated pearl-white reversed version (remerica-united-realty-white.png)
                inside a subtle dark glass card. Reads as an integrated brokerage
                badge, not a bright white box. Swap in an official reversed asset
                if the brokerage provides one. */}
            <div className="flex items-center rounded-xl border border-pearl/12 bg-pearl/[0.05] px-4 py-2.5 backdrop-blur-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/logos/remerica/remerica-united-realty-white.png"
                alt="Remerica United Realty — brokerage"
                className="h-8 w-auto opacity-90"
              />
            </div>
          </div>
          {/* Footer CTA — a friendly, smaller invitation to the founder page
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
            {/* Body copy uses a softer tone (#D8C8CF) than headings/names/links
                for clearer hierarchy while staying well above AA contrast. */}
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#D8C8CF]">
              Real estate guidance with clarity, strategy, and results. Helping
              Southeast Michigan buyers and sellers feel confident, informed, and
              ready to take the next step.
            </p>
            <p className="mt-5 text-sm font-medium text-[#D8C8CF]">
              {contact.serviceStatement}
            </p>
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

        {/* Legal / disclaimer area — placeholder copy until reviewed */}
        <div className="space-y-4 border-t border-dusty/10 pt-8 text-xs leading-relaxed text-dusty/70">
          <p>
            {/* DISCLAIMER PLACEHOLDER — replace with brokerage-approved legal text,
                Equal Housing Opportunity, and license disclosures before launch. */}
            SOLD IT TODAY is a real estate team at {contact.brokerage},{" "}
            {contact.officeStreet}, {contact.officeCityStateZip}. Equal Housing
            Opportunity. All information is deemed reliable but not guaranteed.
            This site is for informational purposes and is not a solicitation if
            you are already represented by a real estate professional. [Legal
            &amp; license disclosures to be finalized.]
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
