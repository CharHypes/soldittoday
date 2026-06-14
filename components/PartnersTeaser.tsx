"use client";

import { motion } from "framer-motion";
import { partnerCategories } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Compact homepage teaser for Preferred Partners. Links to the full
 * /preferred-partners page. Categories are real; partner companies are
 * placeholders until client-provided names are added.
 */
export default function PartnersTeaser() {
  return (
    <section className="relative overflow-hidden bg-plum py-20 md:py-24">
      <div className="aurora-bloom opacity-40" />

      <div className="container-lux relative z-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="eyebrow">Preferred Partners</span>
            <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tightest text-pearl sm:text-3xl md:text-4xl">
              A trusted network around every transaction
            </h2>
            <p className="mt-4 text-dusty">
              Lenders, title companies, inspectors, insurance agents, and
              tradespeople we trust — so the people supporting your move are as
              dependable as your agent.
            </p>
          </div>
          <a href="/preferred-partners" className="btn-outline group shrink-0">
            View Preferred Partners
            <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {partnerCategories.map((cat, i) => (
            <motion.a
              key={cat.id}
              href="/preferred-partners"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.07, ease }}
              className="aurora-ring group rounded-xl2 border border-dusty/12 bg-bruised/40 p-5"
            >
              <div className="text-sm font-semibold text-pearl">{cat.title}</div>
              <p className="mt-2 text-xs leading-relaxed text-dusty">
                {cat.blurb}
              </p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
