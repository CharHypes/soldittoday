"use client";

import { motion } from "framer-motion";
import { marketAreas } from "@/lib/data";
import Reveal from "./ui/Reveal";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Market() {
  return (
    <section className="relative overflow-hidden bg-mulberry-soft py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-wine/30 blur-[160px]" />

      <div className="container-lux relative z-10">
        <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <span className="eyebrow">The Region</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.1] tracking-tightest text-pearl sm:text-4xl md:text-5xl">
                Rooted in Downriver. Trusted across Southeast Michigan.
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-dusty md:text-lg">
                <p>
                  SOLD IT TODAY started with deep local roots in Downriver — but
                  Charlotte's market knowledge reaches throughout Metro Detroit
                  and the wider Southeast Michigan region.
                </p>
                <p>
                  From riverfront communities to established city
                  neighborhoods, that range means real insight into pricing,
                  timing, and what makes each area worth calling home.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <a href="#contact" className="btn-outline group mt-9">
                Ask About Your Area
                <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                  &rarr;
                </span>
              </a>
            </Reveal>
          </div>

          {/* Area grid */}
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl2 border border-dusty/12 bg-dusty/10">
            {marketAreas.map((area, i) => (
              <motion.div
                key={area.name}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease }}
                className="group bg-plum/60 p-6 backdrop-blur transition-colors duration-500 hover:bg-bruised/70"
              >
                <div className="text-lg font-semibold text-pearl">
                  {area.name}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-dusty">
                  {area.note}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
