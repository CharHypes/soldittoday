"use client";

import { motion } from "framer-motion";
import { reasons } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;

export default function WhyWorkWithUs() {
  return (
    <section className="relative overflow-hidden bg-ivory py-24 md:py-32">
      <div className="container-lux">
        <SectionHeading
          eyebrow="Why Work With Us"
          title="The difference is in how it feels to work together"
          description="Experience matters — but so does the way you're treated along the way. Here's what clients can count on from start to finish."
          align="center"
          light
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-xl2 border border-smoked/15 bg-smoked/10 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease }}
              className="group bg-ivory p-8 transition-colors duration-500 hover:bg-champagne"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold tracking-widest text-inkAccent/90">
                  0{i + 1}
                </span>
                <span className="h-px flex-1 bg-smoked/15 transition-colors duration-500 group-hover:bg-wine/30" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink">
                {reason.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
