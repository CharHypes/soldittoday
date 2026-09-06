"use client";

import { motion } from "framer-motion";
import { testimonials, reviewsUrl } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Client reviews ... real, verified 5-star Zillow testimonials (see lib/data,
 * each corresponds to a live review at `reviewsUrl`). Chosen to show distinct
 * strengths: first-time buying, communication/patience, and selling. Never
 * invent or embellish a quote here.
 */
export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-bruised py-24 md:py-32">
      <div className="aurora-bloom opacity-60" />
      <div className="grain-soft" />

      <div className="container-lux relative z-10">
        <SectionHeading
          eyebrow="Client Reviews"
          title="In their words"
          description="Real, verified 5-star reviews from clients across Southeast Michigan. Read them all on Zillow."
          align="center"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: (i % 3) * 0.08, ease }}
              className="aurora-ring group flex flex-col rounded-xl2 border border-auroraMauve/18 bg-plum/50 p-7"
            >
              <div className="flex items-center gap-1 text-sm text-gold" aria-label="5 out of 5 stars">
                {"★★★★★"}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-pearl/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t border-dusty/12 pt-4">
                <div className="text-sm font-semibold text-pearl">{t.name}</div>
                <div className="mt-0.5 text-xs text-dusty">{t.role}</div>
              </figcaption>
            </motion.figure>
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
