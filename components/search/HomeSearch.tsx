"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  propertyTypes,
  priceOptions,
  bedBathOptions,
} from "@/lib/data";
import SearchSelect from "./SearchSelect";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * HomeSearch — premium, Zillow/Redfin-style search experience for the homepage.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  IDX INTEGRATION POINT                                                     │
 * │                                                                            │
 * │  This is a FRONTEND PLACEHOLDER. It is NOT connected to MLS/IDX and        │
 * │  intentionally renders no listing data.                                    │
 * │                                                                            │
 * │  When an IDX provider is selected (e.g. iHomefinder, IDX Broker, RealGeeks,│
 * │  Spark/FlexMLS, or a brokerage-provided feed):                            │
 * │    1. Replace `handleSubmit` below with a redirect/query to the IDX search │
 * │       results route, passing the `query` object built here.                │
 * │    2. Or POST `query` to an internal /api/search route that proxies IDX.   │
 * │    3. The `query` shape (location + filters) is already assembled — map it │
 * │       to the provider's expected params.                                   │
 * └──────────────────────────────────────────────────────────────────────────┘
 */
export default function HomeSearch() {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("any");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState("any");
  const [baths, setBaths] = useState("any");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Assembled, IDX-ready query. Hand this to the IDX provider when integrated.
    const query = {
      location: location.trim(), // City, Neighborhood, ZIP code, or Address
      propertyType,
      minPrice,
      maxPrice,
      beds,
      baths,
    };

    // Placeholder behavior until IDX is connected.
    // eslint-disable-next-line no-console
    console.info("[HomeSearch] IDX query ready (not yet connected):", query);
    setSubmitted(true);
  };

  return (
    <section
      id="search"
      className="relative -mt-2 overflow-hidden bg-bruised pb-20 pt-16 md:pb-28 md:pt-20"
    >
      {/* Aurora bloom backdrop (replaces template grid) */}
      <div className="aurora-bloom animate-aurora-drift" />
      {/* Central mauve glow behind the search card for richer brand presence */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[720px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-aurora/25 blur-[150px]" />
      <div className="grain-soft" />

      <div className="container-lux relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="eyebrow text-auroraMauve"
          >
            Search Homes
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.06, ease }}
            className="mt-4 text-balance text-3xl font-semibold tracking-tightest text-pearl sm:text-4xl"
          >
            Find your place in Southeast Michigan
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.12, ease }}
            className="mx-auto mt-4 max-w-xl text-dusty"
          >
            Search by city, neighborhood, ZIP code, or address — then refine by
            price, beds, baths, and property type.
          </motion.p>
        </div>

        {/* Search card with aurora glow */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="aurora-ring mx-auto mt-12 max-w-5xl rounded-xl2 border border-auroraMauve/25 bg-plum/70 p-5 shadow-aurora backdrop-blur-xl sm:p-7"
        >
          {/* Primary location input */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dusty">
                {/* search glyph */}
                &#9906;
              </span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Neighborhood, ZIP code, or Address"
                aria-label="Search by city, neighborhood, ZIP code, or address"
                className="w-full rounded-xl border border-dusty/20 bg-plum/50 py-4 pl-11 pr-4 text-sm text-pearl placeholder:text-dusty/60 outline-none transition-colors duration-300 hover:border-dusty/40 focus:border-auroraMauve/60 sm:text-base"
              />
            </div>
            <button type="submit" className="btn-aurora group shrink-0 sm:px-9">
              Search Homes
              <span
                aria-hidden
                className="transition-transform duration-500 ease-lux group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </button>
          </div>

          {/* Quick filters */}
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-dusty/12 pt-5 sm:grid-cols-3 lg:grid-cols-5">
            <SearchSelect
              id="min-price"
              label="Min Price"
              value={minPrice}
              onChange={setMinPrice}
              options={priceOptions}
            />
            <SearchSelect
              id="max-price"
              label="Max Price"
              value={maxPrice}
              onChange={setMaxPrice}
              options={priceOptions.map((o) =>
                o.value === "" ? { value: "", label: "No Max" } : o
              )}
            />
            <SearchSelect
              id="beds"
              label="Beds"
              value={beds}
              onChange={setBeds}
              options={bedBathOptions}
            />
            <SearchSelect
              id="baths"
              label="Baths"
              value={baths}
              onChange={setBaths}
              options={bedBathOptions}
            />
            <SearchSelect
              id="property-type"
              label="Property Type"
              value={propertyType}
              onChange={setPropertyType}
              options={propertyTypes}
            />
          </div>

          {/* Placeholder confirmation — replaced by IDX results once connected */}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              className="mt-5 flex flex-col items-start gap-1 rounded-xl border border-auroraMauve/25 bg-wine/30 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-pearl/90">
                Live home search is coming soon. Want listings now?{" "}
                <a
                  href="#contact"
                  className="font-semibold underline-offset-4 hover:underline"
                >
                  Schedule a Consultation
                </a>{" "}
                and we&rsquo;ll send matches directly.
              </span>
            </motion.div>
          )}
        </motion.form>

        <p className="mx-auto mt-4 max-w-5xl px-1 text-center text-xs text-dusty/70">
          Live MLS listings are coming soon to SOLD IT TODAY.
        </p>
      </div>
    </section>
  );
}
