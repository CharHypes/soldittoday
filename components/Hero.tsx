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
      {/* Ambient glow accents */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[480px] w-[480px] rounded-full bg-wine/40 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-smoked/40 blur-[150px]" />

      {/* Faint grid lines for editorial structure */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #F5E8E4 1px, transparent 1px), linear-gradient(to bottom, #F5E8E4 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
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
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-dusty/20 bg-bruised/40 px-4 py-2 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-pearl" />
            <span className="text-xs font-medium uppercase tracking-widest text-dusty">
              Southeast Michigan &middot; Metro Detroit
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-balance text-[2.75rem] font-semibold leading-[1.02] tracking-tightest text-pearl sm:text-6xl lg:text-7xl"
          >
            Real estate guidance with{" "}
            <span className="italic font-light text-dusty">clarity</span>,
            strategy, and{" "}
            <span className="italic font-light text-dusty">results</span>.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-xl text-lg leading-relaxed text-dusty"
          >
            SOLD IT TODAY helps buyers and sellers across Southeast Michigan move
            forward with experience, honesty, and strong local market knowledge.
            Luxury feel, practical guidance, real results.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a href="#contact" className="btn-primary group">
              Buy With Us
              <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
            <a href="#contact" className="btn-outline group">
              Sell With Us
              <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
            <a
              href="#contact"
              className="btn text-pearl underline-offset-4 hover:underline"
            >
              Schedule a Consultation
            </a>
          </motion.div>

          {/* Stat strip */}
          <motion.div
            variants={item}
            className="mt-16 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-xl2 border border-dusty/10 bg-dusty/10 sm:grid-cols-4"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-plum/60 px-5 py-6 backdrop-blur transition-colors duration-500 hover:bg-bruised/60"
              >
                <div className="text-2xl font-semibold text-pearl sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs leading-snug text-dusty">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[10px] uppercase tracking-widest text-dusty">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="h-8 w-px bg-gradient-to-b from-dusty to-transparent"
        />
      </motion.div>
    </section>
  );
}
