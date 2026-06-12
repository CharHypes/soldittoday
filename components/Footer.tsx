import { contact, navLinks } from "@/lib/data";

export default function Footer() {
  const year = 2026;

  return (
    <footer className="border-t border-dusty/10 bg-plum">
      <div className="container-lux py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="text-lg font-bold uppercase tracking-[0.32em] text-pearl">
              Sold It Today
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-dusty">
              Real estate guidance with clarity, strategy, and results. Serving
              Southeast Michigan buyers and sellers with experience, honesty, and
              strong local market knowledge.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#contact" className="btn-primary">
                Buy With Us
              </a>
              <a href="#contact" className="btn-outline">
                Sell With Us
              </a>
            </div>
          </div>

          {/* Explore */}
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
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-xs uppercase tracking-widest text-dusty">
              Get In Touch
            </div>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="font-semibold text-pearl">{contact.agent}</li>
              <li className="text-dusty">{contact.title}</li>
              <li className="text-dusty">{contact.brokerage}</li>
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

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-dusty/10 pt-8 text-xs text-dusty sm:flex-row sm:items-center">
          <p>
            &copy; {year} SOLD IT TODAY &middot; Charlotte Hypes &middot;{" "}
            {contact.brokerage}
          </p>
          <p>{contact.region}</p>
        </div>
      </div>
    </footer>
  );
}
