"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { testimonials } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: number) =>
      setIndex((prev) => (prev + dir + testimonials.length) % testimonials.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), 6000);
    return () => clearInterval(id);
  }, [paused, go]);

  const active = testimonials[index];

  return (
    <section
      className="relative overflow-hidden bg-bruised py-24 md:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-lux">
        <SectionHeading
          eyebrow="Client Stories"
          title="What it's like to work with SOLD IT TODAY"
          align="center"
        />

        <div className="relative mx-auto mt-16 max-w-3xl">
          {/* Quote mark */}
          <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 select-none font-serif text-[140px] leading-none text-wine/40">
            &ldquo;
          </div>

          <div className="relative min-h-[220px] text-center">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={active.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease }}
              >
                <p className="text-balance text-xl font-light leading-relaxed text-pearl md:text-2xl">
                  {active.quote}
                </p>
                <footer className="mt-8">
                  <div className="text-base font-semibold text-pearl">
                    {active.name}
                  </div>
                  <div className="mt-1 text-sm uppercase tracking-widest text-dusty">
                    {active.role}
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-dusty/25 text-pearl transition-all duration-400 ease-lux hover:border-pearl/60 hover:-translate-x-0.5"
            >
              &larr;
            </button>

            <div className="flex items-center gap-2.5">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={[
                    "h-1.5 rounded-full transition-all duration-400 ease-lux",
                    i === index
                      ? "w-7 bg-pearl"
                      : "w-1.5 bg-dusty/40 hover:bg-dusty",
                  ].join(" ")}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-dusty/25 text-pearl transition-all duration-400 ease-lux hover:border-pearl/60 hover:translate-x-0.5"
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
