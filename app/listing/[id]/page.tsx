import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComplianceFooter from "@/components/search/ComplianceFooter";
import PhotoGallery from "@/components/search/PhotoGallery";
import FavoriteButton from "@/components/search/FavoriteButton";
import ShareButton from "@/components/search/ShareButton";
import { getListing, getSimilarListings, formatUpdated, IDX_DISCLAIMER } from "@/lib/idx";
import ListingCard from "@/components/search/ListingCard";
import ListingPaymentCalculator from "@/components/search/ListingPaymentCalculator";
import { amenitiesForPoints, type AmenityKey } from "@/lib/amenities";
import { contact } from "@/lib/data";

/* Fixed icons: hospital = "H" in a box (highway sign), school = schoolhouse
   (K-12), grocery = cart. Matches the search cards. */
const NEARBY_ICON: Record<AmenityKey, JSX.Element> = {
  hospital: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M9 8v8M15 8v8M9 12h6" />
    </>
  ),
  school: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V10l7-3.5L19 10v11" />
      <path d="M10 21v-4h4v4" />
      <path d="M12 6.5V3l3 1-3 1" />
    </>
  ),
  grocery: (
    <>
      <circle cx="9" cy="20" r="1.3" />
      <circle cx="18" cy="20" r="1.3" />
      <path d="M2 3h2l2.2 12.2a1.5 1.5 0 0 0 1.5 1.3H18a1.5 1.5 0 0 0 1.5-1.2L21 7H5.2" />
    </>
  ),
};
const NEARBY_LABEL: Record<AmenityKey, string> = {
  hospital: "Nearest hospital",
  school: "Nearest school",
  grocery: "Nearest grocery",
};

export const metadata: Metadata = {
  title: "Home for Sale | SOLD IT TODAY",
  // Individual IDX listings change often and duplicate across broker sites;
  // keep them out of the index (still followable) to avoid thin/duplicate SEO.
  robots: { index: false, follow: true },
};
export const dynamic = "force-dynamic";

function money(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default async function ListingPage({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id);

  if (!listing) {
    return (
      <>
        <Navbar />
        <main className="grid min-h-[70vh] place-items-center bg-plum px-6 pt-28 text-center">
          <div>
            <h1 className="text-2xl font-semibold text-pearl">This listing isn&rsquo;t available</h1>
            <p className="mt-3 text-dusty">It may no longer be active. Browse current homes or reach out and we&rsquo;ll help.</p>
            <Link href="/search" className="btn-aurora mt-6 inline-flex">Back to search</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const addr = listing.showAddress ? listing.address : "Address available on request";
  const cityLine = `${listing.city}, ${listing.state} ${listing.zip}`.trim();
  const updated = formatUpdated(new Date().toISOString());
  const phoneDigits = contact.phone.replace(/[^0-9]/g, "");

  // MichRIC requires the listing broker's name + a contact on a detailed
  // display. Prefer their email over the phone (less "call the competitor"),
  // falling back to phone when the feed gives no email.
  const brokerContact = listing.listingBrokerEmail || listing.listingBrokerPhone || "";
  const attribution =
    `Listing courtesy of ${listing.listingBrokerName}` + (brokerContact ? ` · ${brokerContact}` : "");

  // Nearby amenities ... computed server-side from the bundled MI dataset (local,
  // instant). Includes the actual place name for the detail page.
  const nearby =
    listing.lat != null && listing.lng != null
      ? (await amenitiesForPoints([{ id: listing.id, lat: listing.lat, lng: listing.lng }]))[listing.id] ?? {}
      : {};
  const nearbyKeys = (["hospital", "school", "grocery"] as AmenityKey[]).filter((k) => nearby[k]);

  // "Why this home works" ... curated benefit lines + a nearby "close to" line.
  const closeParts = [
    nearby.hospital ? `a hospital (${nearby.hospital.miles} mi)` : null,
    nearby.school ? `schools (${nearby.school.miles} mi)` : null,
    nearby.grocery ? `groceries (${nearby.grocery.miles} mi)` : null,
  ].filter((x): x is string => x !== null);
  const whyList = [
    ...listing.whyItWorks,
    ...(closeParts.length ? [`Close to ${closeParts.join(", ")}`] : []),
  ];

  // "Similar homes" ... nearby comparable active listings (excludes this one).
  const similar = await getSimilarListings(
    { id: listing.id, city: listing.city, price: listing.price },
    6
  );

  return (
    <>
      <Navbar />
      <main className="bg-plum pb-20 pt-24 md:pt-28">
        <div className="container-lux">
          <Link href="/search" className="text-sm text-dusty transition-colors hover:text-pearl">
            &larr; Back to search
          </Link>

          {/* Photo gallery ... mosaic + full-screen lightbox */}
          <div className="mt-5">
            <PhotoGallery photos={listing.photos} alt={addr} />
          </div>

          {/* Summary + CTA */}
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-wine/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-pearl">
                  {listing.status}
                </span>
                {updated && <span className="text-xs text-dusty">Updated {updated}</span>}
              </div>
              <p className="mt-3 text-3xl font-semibold text-pearl md:text-4xl">{money(listing.price)}</p>
              <p className="mt-1 text-lg text-pearl/90">{addr}</p>
              <p className="text-dusty">{cityLine}</p>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-pearl/90">
                {listing.beds != null && <span><strong>{listing.beds}</strong> beds</span>}
                {listing.baths != null && <span><strong>{listing.baths}</strong> baths</span>}
                {listing.sqft != null && <span><strong>{listing.sqft.toLocaleString("en-US")}</strong> sqft</span>}
              </div>

              {/* Action row ... Save / Share / Request a Showing (strongest CTA). */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a href="/#contact" className="btn-aurora group order-first w-full justify-center sm:w-auto">
                  Request a Showing
                  <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">&rarr;</span>
                </a>
                <FavoriteButton listingId={listing.id} />
                <ShareButton title={`${addr} ... ${money(listing.price)}`} />
              </div>

              {listing.homeTags.length > 0 && (
                <section className="mt-8 rounded-xl2 border border-auroraMauve/20 bg-plum/40 p-5 md:p-6">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-auroraMauve">At a glance</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {listing.homeTags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded-full border border-auroraMauve/30 bg-wine/25 px-3 py-1.5 text-xs font-medium text-pearl"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {whyList.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-auroraMauve">Why this home works</h2>
                  <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {whyList.map((w) => (
                      <li key={w} className="flex items-start gap-2.5 text-sm leading-relaxed text-pearl/90">
                        <svg
                          viewBox="0 0 24 24"
                          className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M5 12l4 4 10-11" />
                        </svg>
                        {w}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {listing.description && (
                <section className="mt-8">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-auroraMauve">About this home</h2>
                  <p className="mt-3 whitespace-pre-line leading-relaxed text-pearl/90">{listing.description}</p>
                </section>
              )}

              {listing.sections.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-auroraMauve">Property details</h2>
                  <div className="mt-3 overflow-hidden rounded-xl2 border border-dusty/15">
                    {listing.sections.map((sec, i) => (
                      <details
                        key={sec.title}
                        open={i === 0}
                        className="group border-t border-dusty/12 bg-plum/40 first:border-t-0"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 marker:content-none [&::-webkit-details-marker]:hidden">
                          <span className="text-sm font-semibold text-pearl">{sec.title}</span>
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4 text-dusty transition-transform duration-300 group-open:rotate-180"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </summary>
                        <dl className="grid gap-x-8 px-5 pb-5 sm:grid-cols-2">
                          {sec.rows.map((r) => (
                            <div
                              key={r.label}
                              className="flex justify-between gap-4 border-b border-dusty/10 py-2"
                            >
                              <dt className="text-sm text-dusty">{r.label}</dt>
                              <dd className="text-right text-sm text-pearl/90">{r.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* Payment estimator ... skip on rentals/low-price (not a purchase). */}
              {listing.price >= 25000 && <ListingPaymentCalculator price={listing.price} />}

              {nearbyKeys.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-auroraMauve">What&rsquo;s nearby</h2>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {nearbyKeys.map((k) => (
                      <div key={k} className="rounded-xl2 border border-dusty/15 bg-plum/50 p-4">
                        <div className="flex items-center gap-2">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.7}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5 text-gold"
                            aria-hidden
                          >
                            {NEARBY_ICON[k]}
                          </svg>
                          <span className="text-xs uppercase tracking-wider text-dusty">{NEARBY_LABEL[k]}</span>
                        </div>
                        <div className="mt-2 text-xl font-semibold text-pearl">{nearby[k]!.miles} mi</div>
                        {nearby[k]!.name && (
                          <div className="mt-0.5 text-sm text-dusty">{nearby[k]!.name}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-dusty/70">Straight-line distance to the nearest, from public map data.</p>
                </section>
              )}

              {listing.showAddress && (
                <section className="mt-8">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-auroraMauve">Location</h2>
                  <div className="mt-3 overflow-hidden rounded-xl2 border border-dusty/15">
                    <iframe
                      title={`Map of ${addr}`}
                      src={`https://www.google.com/maps?q=${encodeURIComponent(`${listing.address}, ${cityLine}`)}&z=15&output=embed`}
                      className="h-72 w-full md:h-80"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </section>
              )}

              {/* Required attribution for a detailed display (name + phone/email). */}
              <div className="mt-8 border-t border-dusty/12 pt-4 text-xs text-dusty">
                <p className="font-medium">{attribution}</p>
                <p className="mt-1 text-dusty/70">{IDX_DISCLAIMER}</p>
              </div>
            </div>

            <aside className="h-fit rounded-xl2 border border-dusty/15 bg-bruised/60 p-5 text-center shadow-aurora lg:sticky lg:top-24">
              <p className="font-semibold text-pearl">Interested in this home?</p>
              <p className="mt-1 text-sm text-dusty">
                The Sold It Today team can set up a private showing and get you the full details.
              </p>
              <a href="/#contact" className="btn-aurora mt-4 inline-flex w-full justify-center">
                Request a showing
              </a>
              <a href={`tel:${phoneDigits}`} className="mt-3 block text-sm font-medium text-dusty transition-colors hover:text-pearl">
                or call {contact.phone}
              </a>
            </aside>
          </div>

          {similar.length > 0 && (
            <section className="mt-14 border-t border-dusty/12 pt-10">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-auroraMauve">
                Similar homes you may like
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
              <div className="mt-8">
                <Link href="/search" className="btn-outline group">
                  See more homes
                  <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">&rarr;</span>
                </Link>
              </div>
            </section>
          )}

          <ComplianceFooter lastUpdated={updated} />
        </div>
      </main>
      <Footer />
    </>
  );
}
