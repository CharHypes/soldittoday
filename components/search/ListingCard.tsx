import Link from "next/link";
import type { Listing } from "@/lib/idx";
import { IDX_DISCLAIMER } from "@/lib/idx";
import { formatMiles, type AmenityDistances, type AmenityKey } from "@/lib/amenities";
import { formatInt } from "@/lib/format";
import { catalogEntry } from "@/lib/qwome/preferences";
import { qwomePresentation } from "@/lib/qwome/client/presentation";
import { QwomeIcon } from "@/lib/qwome/client/icons";
import FavoriteButton from "./FavoriteButton";

/**
 * QWOME™ proximity chips ... one small pill per category the viewer chose in
 * their QWOME preferences, each with the category's icon + this home's real
 * distance (e.g. "Hospital 3.4 mi"). No preferences => no chips, so cards stay
 * clean and we never dump distance data that isn't relevant to this viewer.
 */
function QwomeChips({
  amenities,
  categories,
}: {
  amenities?: AmenityDistances;
  categories: AmenityKey[];
}) {
  if (!amenities || categories.length === 0) return null;
  const chips = categories.filter((k) => catalogEntry(k) && amenities[k]);
  if (chips.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-dusty/12 pt-3">
      <span className="rounded-full bg-wine/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-auroraMauve">
        QWOME&trade;
      </span>
      {chips.map((k) => (
        <span
          key={k}
          className="inline-flex items-center gap-1 rounded-full border border-dusty/20 bg-plum/50 px-2 py-0.5 text-[11px] text-dusty"
        >
          <QwomeIcon name={k} className="h-3.5 w-3.5 text-auroraMauve" />
          <span className="font-medium text-pearl/90">{qwomePresentation(k).short}</span>
          <span>{formatMiles(amenities[k]!.miles)}</span>
        </span>
      ))}
    </div>
  );
}

/**
 * A single IDX listing card. Built to satisfy the MichRIC IDX display rules:
 *  - The listing broker's (Subscriber's) name is shown for another broker's
 *    listing (Rule l); the phone/email lives on the detail page.
 *  - The "Information Deemed Reliable But Not Guaranteed" disclaimer is present.
 *  - Address is hidden when the seller has withheld it (showAddress === false).
 *
 * Clean scan order: photo (status + save overlays) -> price -> address ->
 * beds/baths/sqft -> optional QWOME proximity line -> attribution.
 */
function formatPrice(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

const statusLabel: Record<Listing["status"], string> = {
  active: "Active",
  pending: "Pending",
  sold: "Sold",
};

export default function ListingCard({
  listing,
  amenities,
  qwomeCategories = [],
}: {
  listing: Listing;
  amenities?: AmenityDistances;
  /** Viewer's active QWOME preference categories ... drives the compact line. */
  qwomeCategories?: AmenityKey[];
}) {
  const addressLine = listing.showAddress
    ? listing.address
    : "Address available on request";
  const cityLine = `${listing.city}, ${listing.state} ${listing.zip}`.trim();

  return (
    <div className="group relative overflow-hidden rounded-xl2 border border-dusty/15 bg-plum/60 shadow-aurora transition-colors duration-300 hover:border-auroraMauve/40">
      {/* Save heart ... sibling of the link (not nested in the anchor) so it's
          valid HTML and its click won't navigate the card. */}
      <div className="absolute right-3 top-3 z-10">
        <FavoriteButton listingId={listing.id} variant="overlay" showHint={false} />
      </div>
      <Link href={`/listing/${listing.id}`} className="block">
      <div className="relative aspect-[4/3] overflow-hidden bg-wine/30">
        {listing.photoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={listing.photoUrl}
            alt={listing.showAddress ? listing.address : "Property photo"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-dusty/60">
            Photo coming soon
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-plum/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-pearl backdrop-blur">
          {statusLabel[listing.status]}
        </span>
      </div>

      <div className="p-4">
        <p className="text-lg font-semibold text-pearl">
          {formatPrice(listing.price)}
        </p>
        <p className="mt-1 text-sm text-pearl/90">{addressLine}</p>
        <p className="text-sm text-dusty">{cityLine}</p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-dusty">
          {listing.beds != null && <span>{listing.beds} bd</span>}
          {listing.baths != null && <span>{listing.baths} ba</span>}
          {listing.sqft != null && <span>{formatInt(listing.sqft)} sqft</span>}
        </div>

        <QwomeChips amenities={amenities} categories={qwomeCategories} />

        {/* Required attribution for the listing broker (Subscriber). */}
        <div className="mt-4 border-t border-dusty/12 pt-3 text-xs text-dusty">
          <p className="font-medium text-dusty">
            Listing courtesy of {listing.listingBrokerName}
          </p>
          <p className="mt-1 text-dusty/70">{IDX_DISCLAIMER}</p>
        </div>
      </div>
      </Link>
    </div>
  );
}
