"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks } from "@/lib/data";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-lux",
        scrolled
          ? "border-b border-dusty/10 bg-plum/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <nav className="container-lux flex h-[72px] items-center justify-between">
        {/* Brand logo — SOLD IT TODAY is the primary brand */}
        <a href="#home" className="flex items-center" aria-label="SOLD IT TODAY home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logos/sold-it-today/Sold-It-Today-high-contrast-fixed-transparent.svg"
            alt="SOLD IT TODAY"
            className="h-[38px] w-auto md:h-[43px]"
          />
        </a>

        {/* Desktop links — full nav only at lg+ (7 items + CTA need the room);
            tablets and below use the hamburger menu. Tighter gap at lg so the
            CTA doesn't wrap; roomier spacing returns at xl. */}
        <ul className="hidden items-center gap-6 lg:flex xl:gap-9">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative text-sm font-medium tracking-wide text-dusty transition-colors duration-300 hover:text-pearl"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-pearl transition-all duration-400 ease-lux group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Primary CTA — aurora glow, strongest action site-wide.
            ~44px touch target (py-3) to match the site-wide standard. */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <ThemeToggle />
          <a href="#contact" className="btn-aurora whitespace-nowrap !px-5 !py-3">
            Schedule a Consultation
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
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-lg font-medium text-pearl/90 transition-colors hover:text-pearl"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-3">
                <a
                  href="#contact"
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
    </motion.header>
  );
}
