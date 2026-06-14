"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { brandValues, contact } from "@/lib/data";
import Reveal from "./ui/Reveal";

const ease = [0.22, 1, 0.36, 1] as const;

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-plum py-24 md:py-32">
      <div className="aurora-bloom opacity-60" />
      <div className="grain-soft" />

      <div className="container-lux relative z-10">
        {/* Brand intro */}
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl2 border border-dusty/15 shadow-aurora">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1100&q=80"
                  alt="The SOLD IT TODAY real estate team collaborating with clients"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-plum/70 via-transparent to-transparent" />
              </div>

              {/* Founder callout — Charlotte included, not the whole focus */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease }}
                className="aurora-ring absolute -bottom-6 -right-4 max-w-[15rem] rounded-xl2 border border-dusty/15 bg-bruised/90 px-6 py-5 shadow-aurora backdrop-blur sm:-right-8"
              >
                <div className="text-xs uppercase tracking-widest text-dusty">
                  Founded by
                </div>
                <div className="mt-1 text-lg font-semibold text-pearl">
                  {contact.founder}
                </div>
                <div className="text-sm text-dusty">{contact.founderTitle}</div>
              </motion.div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <span className="eyebrow">About SOLD IT TODAY</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.1] tracking-tightest text-pearl sm:text-4xl md:text-5xl">
                Meet the Team Behind SOLD IT TODAY
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-dusty md:text-lg">
                <p>
                  SOLD IT TODAY is a growing Southeast Michigan real estate team
                  built on a simple idea: clients make their best decisions when
                  they truly understand their options. We lead with education,
                  not pressure.
                </p>
                <p>
                  Founded by Charlotte Hypes and rooted in Downriver, our team
                  brings strong negotiation, creative problem-solving, and deep
                  local market knowledge to buyers and sellers across Metro
                  Detroit — guiding each client with clarity from first
                  conversation to closing table.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#contact" className="btn-aurora group">
                  Schedule a Consultation
                  <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                    &rarr;
                  </span>
                </a>
                <a href="/team" className="btn-outline">
                  Meet the Full Team
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        {/* What the team is built around */}
        <div className="mt-20">
          <Reveal>
            <h3 className="text-center text-sm font-medium uppercase tracking-widest text-dusty">
              What we&rsquo;re built around
            </h3>
          </Reveal>
          <div className="mt-8 grid gap-px overflow-hidden rounded-xl2 border border-dusty/12 bg-dusty/10 sm:grid-cols-2 lg:grid-cols-3">
            {brandValues.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.07, ease }}
                className="aurora-ring group bg-plum/60 p-7 backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold tracking-widest text-auroraMauve/70">
                    0{i + 1}
                  </span>
                  <span className="h-px flex-1 bg-dusty/15 transition-colors duration-500 group-hover:bg-auroraMauve/40" />
                </div>
                <h4 className="mt-5 text-lg font-semibold text-pearl">
                  {value.title}
                </h4>
                <p className="mt-2.5 text-sm leading-relaxed text-dusty">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
