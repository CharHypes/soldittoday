"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks } from "@/lib/data";

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
        {/* Wordmark */}
        <a
          href="#home"
          className="group flex flex-col leading-none"
          aria-label="SOLD IT TODAY home"
        >
          <span className="text-sm font-bold uppercase tracking-[0.32em] text-pearl">
            Sold It Today
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.28em] text-dusty">
            Charlotte Hypes
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-9 md:flex">
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

        <a
          href="#contact"
          className="hidden rounded-full border border-dusty/30 px-5 py-2.5 text-sm font-medium text-pearl transition-all duration-500 ease-lux hover:border-pearl/70 hover:-translate-y-0.5 md:inline-flex"
        >
          Schedule a Consultation
        </a>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center md:hidden"
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
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-dusty/10 bg-plum/95 backdrop-blur-xl md:hidden"
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
                  className="btn-primary w-full"
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
