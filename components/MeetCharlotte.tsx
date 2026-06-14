"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { charlotteStats, contact } from "@/lib/data";
import Reveal from "./ui/Reveal";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Meet Charlotte — a personal founder spotlight. Intentionally smaller and
 * editorial: SOLD IT TODAY stays the primary brand, with Charlotte positioned
 * as the founder/guide. Refined portrait card (not oversized) + a first-person
 * note + supporting stats.
 */
export default function MeetCharlotte() {
  return (
    <section
      id="meet-charlotte"
      className="relative overflow-hidden bg-plum py-24 md:py-32"
    >
      <div className="aurora-bloom opacity-60" />
      <div className="grain-soft" />

      <div className="container-lux relative z-10">
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-[auto_1fr] md:gap-16">
          {/* Refined portrait card — deliberately compact */}
          <Reveal>
            <div className="relative mx-auto w-[230px] sm:w-[260px]">
              <div className="aurora-ring relative aspect-[4/5] overflow-hidden rounded-xl2 border border-auroraMauve/20 shadow-aurora">
                <Image
                  src="/assets/team/charlotte-hypes.png"
                  alt="Charlotte Hypes, Founder & Team Lead at SOLD IT TODAY"
                  fill
                  sizes="260px"
                  style={{ objectPosition: "center 18%" }}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-plum/60 via-transparent to-transparent" />
              </div>

              {/* Signature-style founder tag */}
              <motion.div
                initial={{ opacity: 0, y: 16, x: "-50%" }}
                whileInView={{ opacity: 1, y: 0, x: "-50%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2, ease }}
                className="absolute -bottom-4 left-1/2 w-max rounded-full border border-auroraMauve/25 bg-bruised/90 px-4 py-1.5 text-[11px] uppercase tracking-widest text-pearl shadow-aurora backdrop-blur"
              >
                Founder &amp; Team Lead
              </motion.div>
            </div>
          </Reveal>

          {/* Story */}
          <div>
            <Reveal>
              <span className="eyebrow text-auroraMauve">Your Guide</span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.1] tracking-tightest text-pearl sm:text-4xl md:text-5xl">
                Meet Charlotte Hypes
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-2 text-sm uppercase tracking-widest text-dusty">
                Founder &amp; Team Lead, SOLD IT TODAY
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-dusty md:text-lg">
                Real estate doesn&rsquo;t have to feel confusing. My job is to
                help you understand your options, avoid costly mistakes, and move
                forward with confidence. Whether you&rsquo;re buying your first
                home, selling your current home, or planning your next move,
                you&rsquo;ll have a trusted advisor in your corner every step of
                the way.
              </p>
            </Reveal>

            {/* Supporting stats */}
            <Reveal delay={0.22}>
              <div className="mt-9 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-xl2 border border-auroraMauve/15 bg-auroraMauve/15 sm:grid-cols-4">
                {charlotteStats.map((s) => (
                  <div
                    key={s.label}
                    className="bg-plum/60 px-4 py-5 text-center backdrop-blur transition-colors duration-500 hover:bg-wine/50 sm:text-left"
                  >
                    <div className="text-base font-semibold leading-tight text-pearl">
                      {s.value}
                    </div>
                    <div className="mt-1 text-[11px] leading-snug text-dusty">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.28}>
              <a href="#contact" className="btn-aurora group mt-9">
                Schedule a Consultation
                <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                  &rarr;
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
