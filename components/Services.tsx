"use client";

import { motion } from "framer-motion";
import { services } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-bruised py-24 md:py-32"
    >
      <div className="pointer-events-none absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-wine/30 blur-[150px]" />

      <div className="container-lux relative z-10">
        <SectionHeading
          eyebrow="What We Do"
          title="Guidance built around every kind of move"
          description="Whether you're buying your first home or your fifth investment property, the strategy is tailored to your goals — and explained every step of the way."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.07, ease }}
              className="group relative flex flex-col overflow-hidden rounded-xl2 border border-dusty/12 bg-plum/50 p-7 transition-all duration-500 ease-lux hover:-translate-y-1.5 hover:border-dusty/35 hover:bg-plum/80"
            >
              {/* Index numeral */}
              <span className="text-sm font-medium tracking-widest text-dusty/60">
                0{i + 1}
              </span>

              <h3 className="mt-5 text-xl font-semibold text-pearl">
                {service.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-dusty">
                {service.description}
              </p>

              <ul className="mt-6 space-y-2.5 border-t border-dusty/12 pt-5">
                {service.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-3 text-sm text-pearl/80"
                  >
                    <span className="h-1 w-1 rounded-full bg-dusty" />
                    {point}
                  </li>
                ))}
              </ul>

              {/* Hover sheen */}
              <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-pearl/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.article>
          ))}

          {/* CTA tile */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: services.length * 0.07, ease }}
            className="flex flex-col justify-between rounded-xl2 border border-dusty/15 bg-wine-sheen p-7"
          >
            <div>
              <h3 className="text-xl font-semibold text-pearl">
                Not sure where to start?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-pearl/75">
                A short conversation is the best first step. We'll map out your
                options with zero pressure.
              </p>
            </div>
            <a
              href="#contact"
              className="btn-primary group mt-8 self-start"
            >
              Let's Talk
              <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
