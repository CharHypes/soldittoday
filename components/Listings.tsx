import Link from "next/link";
import SectionHeading from "./ui/SectionHeading";
import {
  getFeaturedListings,
  IDX_DISCLAIMER,
  michRicCopyright,
  BROKERAGE_NAME,
  AGENT_MLS_ID,
  type Listing,
} from "@/lib/idx";

/**
 * Featured Listings ... REAL MichRIC IDX data now, scoped to Charlotte's
 * Downriver focus communities. Cards link to the full listing page and carry
 * the required brokerage attribution; the section shows the IDX disclaimer +
 * MichRIC copyright. If the feed is off or returns nothing, the section hides
 * itself (never placeholder/fake data co-mingled with the feed).
 */
const DOWNRIVER_CITIES = [
  "Allen Park",
  "Wyandotte",
  "Southgate",
  "Taylor",
  "Garden City",
  "Westland",
  "Livonia",
];

const statusLabel: Record<Listing["status"], string> = {
  active: "Active",
  pending: "Pending",
  sold: "Sold",
};

function money(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default async function Listings() {
  const listings = await getFeaturedListings(DOWNRIVER_CITIES, 6);
  if (listings.length === 0) return null;

  const year = new Date().getFullYear();

  return (
    <section id="listings" className="relative bg-plum py-24 md:py-32">
      <div className="container-lux">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Featured Listings"
            title="A look at recent homes"
            description="A selection of our current listings. Click any home for photos, details, and a map."
          />
          <Link href="/search" className="btn-outline group shrink-0">
            Search all homes
            <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <Link
              key={l.id}
              href={`/listing/${l.id}`}
              className="aurora-ring group block overflow-hidden rounded-xl2 border border-dusty/12 bg-bruised/40 transition-transform duration-300 hover:-translate-y-1.5"
            >
              {/* Photo */}
              <div className="relative aspect-[16/11] overflow-hidden bg-wine/30">
                {l.photoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={l.photoUrl}
                    alt={l.showAddress ? l.address : "Property photo"}
                    className="h-full w-full object-cover transition-transform duration-700 ease-lux group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-dusty/60">Photo coming soon</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-plum/60 via-transparent to-transparent opacity-70" />
                <span className="absolute left-4 top-4 rounded-full bg-pearl px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-plum">
                  {statusLabel[l.status]}
                </span>
                <div className="absolute bottom-4 left-4 text-lg font-semibold text-pearl drop-shadow">
                  {money(l.price)}
                </div>
              </div>

              {/* Details */}
              <div className="p-5">
                <h3 className="text-base font-semibold text-pearl">
                  {l.showAddress ? l.address : "Address available on request"}
                </h3>
                <p className="mt-1 text-sm text-dusty">
                  {l.city}, {l.state} {l.zip}
                </p>

                <div className="mt-4 flex items-center gap-4 border-t border-dusty/12 pt-4 text-xs text-dusty">
                  {l.beds != null && (
                    <span>
                      <span className="font-semibold text-pearl/90">{l.beds}</span> Beds
                    </span>
                  )}
                  {l.baths != null && (
                    <>
                      <span className="h-3 w-px bg-dusty/25" />
                      <span>
                        <span className="font-semibold text-pearl/90">{l.baths}</span> Baths
                      </span>
                    </>
                  )}
                  {l.sqft != null && (
                    <>
                      <span className="h-3 w-px bg-dusty/25" />
                      <span>
                        <span className="font-semibold text-pearl/90">{l.sqft.toLocaleString("en-US")}</span> Sq Ft
                      </span>
                    </>
                  )}
                </div>

                <p className="mt-3 text-[11px] text-dusty/70">
                  {l.listAgentMlsId === AGENT_MLS_ID
                    ? "Listed by Charlotte Hypes"
                    : /remerica/i.test(l.listingBrokerName)
                    ? `Presented by ${l.listingBrokerName}`
                    : `Listing courtesy of ${l.listingBrokerName}`}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* IDX compliance for the section */}
        <div className="mt-8 space-y-1 text-xs leading-relaxed text-dusty/70">
          <p>Listings displayed through Broker Reciprocity (IDX), brokered by {BROKERAGE_NAME}.</p>
          <p>{IDX_DISCLAIMER}</p>
          <p>{michRicCopyright(year)}</p>
        </div>
      </div>
    </section>
  );
}
