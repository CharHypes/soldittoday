"use client";

import { motion } from "framer-motion";
import { reviewThemes, reviewsUrl } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Reviews — focused on the themes clients consistently mention rather than
 * fabricated direct quotes. Verified, real reviews live on Charlotte's Zillow
 * profile (linked via "Read More Reviews"). No invented testimonials here.
 */
export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-bruised py-24 md:py-32">
      <div className="aurora-bloom opacity-60" />
      <div className="grain-soft" />

      <div className="container-lux relative z-10">
        <SectionHeading
          eyebrow="Client Reviews"
          title="What clients consistently say"
          description="Across years of closings, the same themes come up again and again. Here's what working with SOLD IT TODAY tends to feel like."
          align="center"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviewThemes.map((theme, i) => (
            <motion.div
              key={theme.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: (i % 3) * 0.08, ease }}
              className="aurora-ring group rounded-xl2 border border-auroraMauve/18 bg-plum/50 p-7"
            >
              <div className="flex items-center gap-3">
                {/* Quotation glyph accent */}
                <span className="font-serif text-3xl leading-none text-auroraMauve">
                  &ldquo;
                </span>
                <span className="h-px flex-1 bg-auroraMauve/20 transition-colors duration-500 group-hover:bg-auroraMauve/40" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-pearl">
                {theme.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-dusty">
                {theme.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Link out to verified reviews */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="mt-12 flex flex-col items-center gap-3 text-center"
        >
          <a
            href={reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-aurora group"
          >
            Read More Reviews
            <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
          <span className="text-xs text-dusty/70">
            Verified client reviews on Zillow
          </span>
        </motion.div>
      </div>
    </section>
  );
}
