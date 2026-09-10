/**
 * Saved searches ... per-device (localStorage) until real accounts ship, then
 * account-backed. A saved search is just the /search query string plus a
 * human-readable label. Shared by the Save button and the Saved Searches page.
 */
import { catalogEntry, type QwomeCategoryId } from "@/lib/qwome/preferences";
import { qwomePresentation } from "@/lib/qwome/client/presentation";

export type SavedSearch = { query: string; label: string; savedAt: number };

const KEY = "sit-saved-searches";

export function readSearches(): SavedSearch[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function writeSearches(list: SavedSearch[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* private mode ... ignore */
  }
  try {
    window.dispatchEvent(new Event("sit-saved-searches-change"));
  } catch {
    /* SSR ... ignore */
  }
}

/** Normalize a query string (drop leading "?", stable) for dedupe/compare. */
export function normalizeQuery(qs: string): string {
  const p = new URLSearchParams(qs.startsWith("?") ? qs.slice(1) : qs);
  p.delete("v"); // strip our cache-buster if present
  return p.toString();
}

/** A short readable label from the search params. */
export function describeSearch(qs: string): string {
  const p = new URLSearchParams(qs.startsWith("?") ? qs.slice(1) : qs);
  const parts: string[] = [];
  const loc = p.get("location");
  parts.push(loc && loc.trim() ? loc.trim() : "All homes");
  const money = (n: string) => {
    const v = Number(n);
    if (!Number.isFinite(v)) return n;
    return v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${v}`;
  };
  const min = p.get("minPrice");
  const max = p.get("maxPrice");
  if (min && max) parts.push(`${money(min)}–${money(max)}`);
  else if (min) parts.push(`${money(min)}+`);
  else if (max) parts.push(`Up to ${money(max)}`);
  const beds = p.get("beds");
  if (beds && beds !== "any") parts.push(`${beds}+ bd`);
  const baths = p.get("baths");
  if (baths && baths !== "any") parts.push(`${baths}+ ba`);
  const pt = p.get("propertyType");
  if (pt) parts.push(pt);
  // QWOME proximity preferences: "near=hospital:10,grocery:3".
  const near = p.get("near");
  if (near) {
    const bits = near
      .split(",")
      .map((c) => {
        const [cat, mi] = c.split(":");
        const known = catalogEntry(cat as QwomeCategoryId);
        const label = known ? qwomePresentation(cat as QwomeCategoryId).short.toLowerCase() : undefined;
        return label && mi ? `≤${mi}mi ${label}` : "";
      })
      .filter(Boolean);
    parts.push(...bits);
  } else {
    // Back-compat with the old single-radius param.
    const rmi = p.get("radiusMi");
    const rof = p.get("radiusOf");
    if (rmi && rof) parts.push(`≤${rmi}mi ${rof}`);
  }
  const featureKeys = ["garage", "fireplace", "singleStory", "waterfront", "newConstruction"];
  const feats = featureKeys.filter((f) => p.get(f) === "1");
  if (feats.length) parts.push(feats.length === 1 ? feats[0] : `${feats.length} features`);
  return parts.join(" · ");
}

export function isSaved(qs: string): boolean {
  const q = normalizeQuery(qs);
  return readSearches().some((s) => s.query === q);
}

export function addSearch(qs: string) {
  const q = normalizeQuery(qs);
  if (!q) return;
  const list = readSearches().filter((s) => s.query !== q);
  list.unshift({ query: q, label: describeSearch(q), savedAt: Date.now() });
  writeSearches(list);
}

export function removeSearch(query: string) {
  writeSearches(readSearches().filter((s) => s.query !== query));
}
