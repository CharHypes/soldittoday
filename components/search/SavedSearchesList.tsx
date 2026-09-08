"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readSearches, removeSearch, type SavedSearch } from "@/lib/savedSearches";

/**
 * Saved Searches list ... per-device (localStorage). Each row re-runs the search
 * and can be removed. Updates live when searches are added/removed elsewhere.
 */
export default function SavedSearchesList() {
  const [items, setItems] = useState<SavedSearch[] | null>(null);

  useEffect(() => {
    const read = () => setItems(readSearches());
    read();
    window.addEventListener("sit-saved-searches-change", read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener("sit-saved-searches-change", read);
      window.removeEventListener("storage", read);
    };
  }, []);

  if (items === null) return <p className="text-dusty">Loading your saved searches...</p>;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-xl2 border border-dusty/15 bg-plum/40 p-10 text-center">
        <p className="text-lg font-semibold text-pearl">No saved searches yet</p>
        <p className="mx-auto mt-2 max-w-sm text-dusty">
          Run a search, then tap &ldquo;Save this search&rdquo; to keep it here and pick up right where you left off.
        </p>
        <Link href="/search" className="btn-aurora mt-6 inline-flex">
          Start searching
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((s) => (
        <div
          key={s.query}
          className="flex items-center justify-between gap-4 rounded-xl2 border border-dusty/15 bg-plum/50 p-4 transition-colors duration-300 hover:border-auroraMauve/40"
        >
          <Link href={`/search?${s.query}`} className="group min-w-0 flex-1">
            <p className="truncate font-medium text-pearl group-hover:text-pearl">{s.label}</p>
            <p className="mt-0.5 text-xs text-dusty">
              Saved {new Date(s.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <Link href={`/search?${s.query}`} className="btn-outline !px-4 !py-2 text-sm">
              View
            </Link>
            <button
              type="button"
              onClick={() => removeSearch(s.query)}
              aria-label="Remove saved search"
              className="grid h-9 w-9 place-items-center rounded-full border border-dusty/25 text-dusty transition-colors hover:border-auroraMauve/50 hover:text-pearl"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
