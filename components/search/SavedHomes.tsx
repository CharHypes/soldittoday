"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ListingCard from "./ListingCard";
import type { Listing } from "@/lib/idx";

/**
 * Saved Homes ... reads the per-device favorites (localStorage) and fetches those
 * listings. Updates live when a home is un-saved (the card heart dispatches
 * "sit-favorites-change"). When real accounts ship, this swaps to account data.
 */
function readFavs(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem("sit-favorites") || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export default function SavedHomes() {
  const [ids, setIds] = useState<string[] | null>(null); // null = not read yet
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const read = () => setIds(readFavs());
    read();
    window.addEventListener("sit-favorites-change", read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener("sit-favorites-change", read);
      window.removeEventListener("storage", read);
    };
  }, []);

  const key = ids ? ids.join(",") : "";
  useEffect(() => {
    if (ids === null) return;
    if (ids.length === 0) {
      setListings([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch("/api/listings/by-ids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
      .then((r) => (r.ok ? r.json() : { listings: [] }))
      .then((d) => {
        if (!cancelled) {
          setListings(d.listings || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (ids === null || loading) {
    return <p className="text-dusty">Loading your saved homes...</p>;
  }

  if (listings.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-xl2 border border-dusty/15 bg-plum/40 p-10 text-center">
        <p className="text-lg font-semibold text-pearl">No saved homes yet</p>
        <p className="mx-auto mt-2 max-w-sm text-dusty">
          Tap the heart on any home and it&rsquo;ll show up here so you can compare your favorites.
        </p>
        <Link href="/search" className="btn-aurora mt-6 inline-flex">
          Browse homes
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-6 text-sm text-dusty">
        {listings.length} saved {listings.length === 1 ? "home" : "homes"}
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </div>
  );
}
