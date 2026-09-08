/**
 * Single source of truth for number/year/money formatting across the whole site.
 *
 * WHY THIS EXISTS: years and other "identifier" numbers (year built, tax year,
 * MLS #, ZIP) must NEVER be comma-grouped ... "1993", never "1,993"; "2025",
 * never "2,025". Counts and areas (sqft, lot size) SHOULD be grouped. Keeping
 * both rules in one place means no component can accidentally run a year through
 * `toLocaleString` again. Route every number render through these helpers.
 */

const MASK = "********";

/** Parse a feed value to a finite number, treating masked/empty as no-data. */
export function toNumber(v: unknown): number | undefined {
  if (v == null || v === "" || v === MASK) return undefined;
  const n = typeof v === "number" ? v : Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

/**
 * A year (or any bare identifier number): plain digits, NO thousands separator.
 * Returns undefined for anything that isn't a plausible 4-digit-ish year so we
 * never render "0" or garbage. Use for Year Built, Tax Year, and similar.
 */
export function formatYear(v: unknown): string | undefined {
  const n = toNumber(v);
  if (n == null) return undefined;
  const y = Math.round(n);
  return y > 1000 && y < 3000 ? String(y) : undefined;
}

/** A counted/measured integer WITH thousands separators (sqft, lot sqft, views). */
export function formatInt(v: unknown): string | undefined {
  const n = toNumber(v);
  return n != null ? Math.round(n).toLocaleString("en-US") : undefined;
}

/** Whole-dollar currency, no cents. Undefined when there's no positive value. */
export function money(v: unknown): string | undefined {
  const n = toNumber(v);
  return n != null && n > 0
    ? n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    : undefined;
}

/** Whole-dollar currency that always renders (0 becomes "$0"). For live inputs. */
export function moneyAlways(n: number): string {
  return (Number.isFinite(n) ? n : 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
