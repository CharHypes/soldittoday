"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { listings, type ListingStatus } from "@/lib/data";
import SectionHeading from "./ui/SectionHeading";

const ease = [0.22, 1, 0.36, 1] as const;

const statusStyles: Record<ListingStatus, string> = {
  "Just Listed": "bg-pearl text-plum",
  "Under Contract": "bg-wine text-pearl border border-pearl/20",
  Sold: "bg-plum/70 text-dusty border border-dusty/30",
};

export default function Listings() {
  return (
    <section id="listings" className="relative bg-plum py-24 md:py-32">
      <div className="container-lux">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Featured Listings"
            title="A look at recent homes"
            description="A small selection from across Southeast Michigan. New opportunities come on the market often — reach out for current availability."
          />
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="btn-outline group shrink-0"
          >
            Inquire About Listings
            <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
              &rarr;
            </span>
          </motion.a>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing, i) => (
            <motion.article
              key={listing.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease }}
              className="group overflow-hidden rounded-xl2 border border-dusty/12 bg-bruised/40 transition-all duration-500 ease-lux hover:-translate-y-1.5 hover:border-dusty/30 hover:shadow-card"
            >
              {/* Photo */}
              <div className="relative aspect-[16/11] overflow-hidden">
                <Image
                  src={listing.image}
                  alt={`${listing.title} in ${listing.location}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-lux group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-plum/60 via-transparent to-transparent opacity-70" />

                {/* Status pill */}
                <span
                  className={[
                    "absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider",
                    statusStyles[listing.status],
                  ].join(" ")}
                >
                  {listing.status}
                </span>

                {/* Price */}
                <div className="absolute bottom-4 left-4 text-lg font-semibold text-pearl drop-shadow">
                  {listing.price}
                </div>
              </div>

              {/* Details */}
              <div className="p-5">
                <h3 className="text-base font-semibold text-pearl">
                  {listing.title}
                </h3>
                <p className="mt-1 text-sm text-dusty">{listing.location}</p>

                <div className="mt-4 flex items-center gap-4 border-t border-dusty/12 pt-4 text-xs text-dusty">
                  <span>
                    <span className="font-semibold text-pearl/90">
                      {listing.beds}
                    </span>{" "}
                    Beds
                  </span>
                  <span className="h-3 w-px bg-dusty/25" />
                  <span>
                    <span className="font-semibold text-pearl/90">
                      {listing.baths}
                    </span>{" "}
                    Baths
                  </span>
                  <span className="h-3 w-px bg-dusty/25" />
                  <span>
                    <span className="font-semibold text-pearl/90">
                      {listing.sqft}
                    </span>{" "}
                    Sq Ft
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
