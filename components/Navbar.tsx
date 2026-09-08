"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks } from "@/lib/data";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const onHome = pathname === "/";

  // Anchor links (#about, #contact, ...) scroll in place on the homepage, but
  // from a sub-page they must jump to the homepage first ("/#about"). Route
  // links (/relocation, /resources) pass through unchanged.
  const resolve = (href: string) =>
    href.startsWith("#") ? (onHome ? href : `/${href}`) : href;

  // Home: navigate to "/". If already on the homepage, jump to the top
  // instantly (no reload, no scroll glide) and drop any #hash from the URL.
  const goTop = (e: MouseEvent) => {
    setOpen(false);
    if (onHome) {
      e.preventDefault();
      window.scrollTo(0, 0);
      window.history.replaceState(null, "", "/");
    }
  };

  // Lock body scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="site-nav fixed inset-x-0 top-0 z-50 border-b border-dusty/10 bg-plum/85 backdrop-blur-xl">
      <nav className="container-lux flex h-[72px] items-center justify-between gap-3 xl:gap-8">
        {/* Brand logo ... SOLD IT TODAY is the primary brand (original rose-gold) */}
        <a href="/" onClick={goTop} className="flex shrink-0 items-center" aria-label="SOLD IT TODAY home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logos/sold-it-today/Sold-It-Today-high-contrast-fixed-transparent.svg"
            alt="SOLD IT TODAY"
            className="h-[46px] w-auto -translate-y-[3px] md:h-[54px]"
          />
        </a>

        {/* Desktop links ... full nav only at lg+ (7 items + CTA need the room);
            tablets and below use the hamburger menu. Tighter gap at lg so the
            CTA doesn't wrap; roomier spacing returns at xl. */}
        <ul className="hidden items-center gap-5 lg:flex xl:gap-8">
          {navLinks.map((link) => (
            <li key={link.href} className="group relative">
              <a
                href={resolve(link.href)}
                onClick={link.href === "/" ? goTop : undefined}
                className="relative flex items-center gap-1 whitespace-nowrap text-sm font-medium tracking-wide text-dusty transition-colors duration-300 hover:text-pearl"
              >
                {link.label}
                {link.children && (
                  <svg
                    viewBox="0 0 12 12"
                    className="h-2.5 w-2.5 opacity-70 transition-transform duration-300 group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M2.5 4.5L6 8l3.5-3.5" />
                  </svg>
                )}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-pearl transition-all duration-400 ease-lux group-hover:w-full" />
              </a>

              {link.children && (
                <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <ul className="min-w-[230px] rounded-xl2 border border-dusty/15 bg-plum/95 p-2 shadow-aurora backdrop-blur-xl">
                    {link.children.map((child) => (
                      <li key={child.href}>
                        <a
                          href={resolve(child.href)}
                          className="block rounded-lg px-3.5 py-2.5 text-sm text-dusty transition-colors duration-200 hover:bg-auroraMauve/10 hover:text-pearl"
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Primary CTA ... aurora glow, strongest action site-wide.
            ~44px touch target (py-3) to match the site-wide standard. */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <a
            href="/saved"
            aria-label="Saved homes"
            title="Saved homes"
            className="hidden h-9 w-9 place-items-center rounded-full text-dusty transition-colors duration-300 hover:text-pearl xl:grid"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </a>
          <a
            href="/login"
            className="whitespace-nowrap text-sm font-medium tracking-wide text-dusty transition-colors duration-300 hover:text-pearl"
          >
            Log In
          </a>
          <ThemeToggle />
          <a href={resolve("#contact")} className="btn-aurora whitespace-nowrap !px-4 !py-3 xl:!px-5">
            <span className="xl:hidden">Schedule</span>
            <span className="hidden xl:inline">Schedule a Consultation</span>
          </a>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 lg:hidden">
        <ThemeToggle />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={[
                "h-px w-6 bg-pearl transition-all duration-300",
                open ? "translate-y-[7px] rotate-45" : "",
              ].join(" ")}
            />
            <span
              className={[
                "h-px w-6 bg-pearl transition-all duration-300",
                open ? "opacity-0" : "",
              ].join(" ")}
            />
            <span
              className={[
                "h-px w-6 bg-pearl transition-all duration-300",
                open ? "-translate-y-[7px] -rotate-45" : "",
              ].join(" ")}
            />
          </div>
        </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-dusty/10 bg-plum/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="container-lux flex flex-col gap-1 py-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={resolve(link.href)}
                    onClick={link.href === "/" ? goTop : () => setOpen(false)}
                    className="block py-3 text-lg font-medium text-pearl/90 transition-colors hover:text-pearl"
                  >
                    {link.label}
                  </a>
                  {link.children && (
                    <ul className="mb-1 ml-2 flex flex-col border-l border-dusty/15 pl-4">
                      {link.children.map((child) => (
                        <li key={child.href}>
                          <a
                            href={resolve(child.href)}
                            onClick={() => setOpen(false)}
                            className="block py-2 text-base text-dusty transition-colors hover:text-pearl"
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li>
                <a
                  href="/saved"
                  onClick={() => setOpen(false)}
                  className="block py-3 text-lg font-medium text-pearl/90 transition-colors hover:text-pearl"
                >
                  Saved Homes
                </a>
              </li>
              <li>
                <a
                  href="/saved-searches"
                  onClick={() => setOpen(false)}
                  className="block py-3 text-lg font-medium text-pearl/90 transition-colors hover:text-pearl"
                >
                  Saved Searches
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block py-3 text-lg font-medium text-pearl/90 transition-colors hover:text-pearl"
                >
                  Log In
                </a>
              </li>
              <li className="pt-3">
                <a
                  href={resolve("#contact")}
                  onClick={() => setOpen(false)}
                  className="btn-aurora w-full"
                >
                  Schedule a Consultation
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
