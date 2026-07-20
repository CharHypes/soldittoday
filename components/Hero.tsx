"use client";

import { motion } from "framer-motion";
import { stats } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-mulberry-radial pt-28 pb-20"
    >
      {/* Abstract aurora light bloom (replaces the old template grid) */}
      <div className="pointer-events-none absolute -left-40 top-16 h-[520px] w-[520px] animate-aurora-pulse rounded-full bg-aurora/45 blur-[150px]" />
      <div className="pointer-events-none absolute right-[-10rem] top-1/3 h-[460px] w-[460px] animate-aurora-drift rounded-full bg-auroraMauve/28 blur-[160px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[420px] w-[420px] rounded-full bg-wine/60 blur-[150px]" />
      <div className="grain-soft" />

      {/* Oversized SOLD IT TODAY key — architectural brand signature.
          Anchored to the right and bled off the bottom edge of the hero so it
          reads as integrated background artwork, not a placed logo. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        aria-hidden
        alt=""
        src="/assets/logos/sold-it-today/Sold-It-Today-key-only-crisp-transparent.png"
        className="key-watermark bottom-[-7rem] right-0 hidden h-[54rem] w-auto md:block lg:right-10"
      />

      <div className="container-lux relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          <motion.div
            variants={item}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-auroraMauve/25 bg-wine/30 px-4 py-2 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-auroraMauve shadow-aurora" />
            <span className="text-xs font-medium uppercase tracking-widest text-dusty">
              Southeast Michigan &middot; Metro Detroit
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-balance text-[2.75rem] font-semibold leading-[1.02] tracking-tightest text-pearl sm:text-6xl lg:text-7xl"
          >
            Real estate guidance with{" "}
            <span className="italic font-light text-auroraMauve">clarity</span>,
            strategy, and{" "}
            <span className="italic font-light text-auroraMauve">results</span>.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-xl text-lg leading-relaxed text-dusty"
          >
            SOLD IT TODAY is a Southeast Michigan real estate team helping buyers
            and sellers feel confident, informed, and ready for the next step.
            Luxury feel, practical guidance, real results.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            {/* Primary CTA — strongest action across the whole site */}
            <a href="#contact" className="btn-aurora group">
              Schedule a Consultation
              <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
            {/* Secondary CTA — jumps to the Home Search section */}
            <a href="#search" className="btn-outline group">
              Search Homes
              <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
          </motion.div>

          {/* Tertiary buyer/seller paths */}
          <motion.div
            variants={item}
            className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-dusty"
          >
            <a
              href="#contact"
              className="underline-offset-4 transition-colors hover:text-pearl hover:underline"
            >
              Buying a home &rarr;
            </a>
            <a
              href="#contact"
              className="underline-offset-4 transition-colors hover:text-pearl hover:underline"
            >
              Selling a home &rarr;
            </a>
            <a
              href="/relocation"
              className="underline-offset-4 transition-colors hover:text-pearl hover:underline"
            >
              Relocating to Michigan &rarr;
            </a>
          </motion.div>

          {/* Stat strip */}
          <motion.div
            variants={item}
            className="mt-12 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-xl2 border border-auroraMauve/15 bg-auroraMauve/15 sm:grid-cols-4"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-plum/60 px-3.5 py-4 backdrop-blur transition-colors duration-500 hover:bg-wine/50"
              >
                <div className="text-xl font-semibold leading-tight text-pearl sm:text-2xl">
                  {s.value}
                </div>
                <div className="mt-1 text-[11px] leading-snug text-dusty">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
