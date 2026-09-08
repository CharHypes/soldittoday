"use client";

import { useEffect, useState } from "react";
import { addSearch, removeSearch, isSaved, normalizeQuery } from "@/lib/savedSearches";

/**
 * "Save this search" ... captures the current /search query (location + filters +
 * radius) to localStorage so the buyer can revisit it. Per-device until accounts
 * ship. Hides itself when there's nothing worth saving (no query at all).
 */
export default function SaveSearchButton() {
  const [query, setQuery] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const q = normalizeQuery(window.location.search);
    setQuery(q);
    setSaved(isSaved(window.location.search));
  }, []);

  if (query === null || query === "") return null; // nothing to save

  const toggle = () => {
    if (saved) {
      removeSearch(query);
      setSaved(false);
    } else {
      addSearch(query);
      setSaved(true);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={saved}
        className="inline-flex items-center gap-2 rounded-full border border-dusty/30 bg-plum/50 px-4 py-2 text-sm font-medium text-pearl transition-colors duration-300 hover:border-auroraMauve/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auroraMauve/50"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-auroraMauve" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 3h12a1 1 0 0 1 1 1v16l-7-4-7 4V4a1 1 0 0 1 1-1z" />
        </svg>
        {saved ? "Search saved" : "Save this search"}
      </button>
      {saved && (
        <a href="/saved-searches" className="text-xs font-medium text-auroraMauve transition-colors hover:text-pearl">
          View saved &rarr;
        </a>
      )}
    </div>
  );
}
