"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "./ui/Reveal";

export default function About() {
  return (
    <section id="about" className="relative bg-plum py-24 md:py-32">
      <div className="container-lux">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Portrait / brand image */}
          <Reveal>
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl2 border border-dusty/15 shadow-soft">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80"
                  alt="Charlotte Hypes, REALTOR® and Team Lead at SOLD IT TODAY"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-plum/70 via-transparent to-transparent" />
              </div>

              {/* Floating credential card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-6 -right-4 rounded-xl2 border border-dusty/15 bg-bruised/90 px-6 py-5 shadow-card backdrop-blur sm:-right-8"
              >
                <div className="text-3xl font-semibold text-pearl">350+</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-dusty">
                  Homes Sold
                </div>
              </motion.div>
            </div>
          </Reveal>

          {/* Copy */}
          <div>
            <Reveal>
              <span className="eyebrow">About SOLD IT TODAY</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.1] tracking-tightest text-pearl sm:text-4xl md:text-5xl">
                Meet Charlotte Hypes
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-3 text-sm uppercase tracking-widest text-dusty">
                REALTOR® &amp; Team Lead
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-7 space-y-5 text-base leading-relaxed text-dusty md:text-lg">
                <p>
                  With more than{" "}
                  <span className="text-pearl">19 years of experience</span> and{" "}
                  <span className="text-pearl">350+ homes sold</span>, Charlotte
                  has built SOLD IT TODAY on a simple belief: real estate should
                  feel clear, strategic, and genuinely in your corner.
                </p>
                <p>
                  Her roots run deep in Downriver, but her expertise spans Metro
                  Detroit and all of Southeast Michigan — from first-time buyers
                  finding their footing to investors and homeowners making their
                  next big move. Every client gets the same thing: honest
                  guidance, sharp negotiation, and a steady hand from first
                  showing to closing table.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-dusty/15 pt-8 sm:max-w-md">
                {[
                  ["Trust", "Honesty in every conversation"],
                  ["Guidance", "Clear steps, no guesswork"],
                  ["Negotiation", "Protecting your position"],
                  ["Local Depth", "Southeast Michigan expertise"],
                ].map(([title, sub]) => (
                  <div key={title}>
                    <div className="text-base font-semibold text-pearl">
                      {title}
                    </div>
                    <div className="mt-1 text-sm text-dusty">{sub}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <a href="#contact" className="btn-primary group mt-10">
                Work With Charlotte
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
