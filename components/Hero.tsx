"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { stats } from "@/lib/data";
import HeroSearch from "./search/HeroSearch";

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
      className="photo-hero relative flex min-h-[88vh] items-center overflow-hidden pt-28 pb-14"
    >
      {/* Golden-hour downtown photo behind the headline */}
      <Image
        src="/assets/hero/downtown-hero.jpg"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Plum wash: opaque on the left so the headline + search stay crisp,
          opening up to the photo's golden glow on the right. Fixed dark tones
          (not theme tokens) so the hero reads the same in light and dark. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(20,16,19,.94) 0%, rgba(24,18,22,.82) 34%, rgba(26,20,26,.42) 62%, rgba(26,20,26,.14) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,16,19,.5) 0%, transparent 20%, transparent 66%, rgba(20,16,19,.6) 100%)",
        }}
      />
      <div className="grain-soft" />

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

          {/* Primary action ... search homes, right here in the hero */}
          <motion.div variants={item} className="mt-10">
            <HeroSearch />
            <a
              href="#contact"
              className="mt-4 inline-flex items-center gap-1 text-sm text-dusty transition-colors hover:text-pearl"
            >
              or schedule a consultation
              <span className="transition-transform duration-500 ease-lux hover:translate-x-1">&rarr;</span>
            </a>
          </motion.div>

          {/* Tertiary buyer/seller paths */}
          <motion.div
            variants={item}
            className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-dusty"
          >
            <a
              href="/search"
              className="underline-offset-4 transition-colors hover:text-pearl hover:underline"
            >
              Buying a home &rarr;
            </a>
            <a
              href="/sellers"
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
