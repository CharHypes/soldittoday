"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

/**
 * Prominent home-search bar for the hero ... the first thing a buyer can DO on
 * the site. Location-only entry (Zillow-style); full filters live on /search.
 */
export default function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = location.trim();
    router.push(q ? `/search?location=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <form
      onSubmit={submit}
      className="aurora-ring flex w-full max-w-xl items-center gap-2 rounded-xl2 border border-auroraMauve/30 bg-plum/70 p-2 shadow-aurora backdrop-blur-xl"
    >
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dusty">
          &#9906;
        </span>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, ZIP, or address ... search homes"
          aria-label="Search homes by city, ZIP, or address"
          className="w-full rounded-xl bg-transparent py-3.5 pl-11 pr-3 text-sm text-pearl placeholder:text-dusty/60 outline-none sm:text-base"
        />
      </div>
      <button type="submit" className="btn-aurora group shrink-0 sm:px-7">
        Search
        <span aria-hidden className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
          &rarr;
        </span>
      </button>
    </form>
  );
}
