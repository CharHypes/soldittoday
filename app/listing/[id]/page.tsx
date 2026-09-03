import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComplianceFooter from "@/components/search/ComplianceFooter";
import { getListing, formatUpdated, IDX_DISCLAIMER } from "@/lib/idx";
import { contact } from "@/lib/data";

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

  const attribution =
    `Listing courtesy of ${listing.listingBrokerName}` +
    (listing.listingBrokerPhone
      ? ` · ${listing.listingBrokerPhone}`
      : listing.listingBrokerEmail
      ? ` · ${listing.listingBrokerEmail}`
      : "");

  const details: [string, string][] = [];
  if (listing.beds != null) details.push(["Bedrooms", String(listing.beds)]);
  if (listing.baths != null) details.push(["Bathrooms", String(listing.baths)]);
  if (listing.sqft != null) details.push(["Square feet", listing.sqft.toLocaleString("en-US")]);
  if (listing.yearBuilt != null) details.push(["Year built", String(listing.yearBuilt)]);
  if (listing.lotSize) details.push(["Lot size", listing.lotSize]);
  if (listing.subType) details.push(["Property type", listing.subType]);
  if (listing.county) details.push(["County", listing.county]);
  if (listing.mlsNumber) details.push(["MLS #", listing.mlsNumber]);

  return (
    <>
      <Navbar />
      <main className="bg-plum pb-20 pt-24 md:pt-28">
        <div className="container-lux">
          <Link href="/search" className="text-sm text-dusty transition-colors hover:text-pearl">
            &larr; Back to search
          </Link>

          {/* Photo gallery */}
          {listing.photos.length > 0 ? (
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <div className="overflow-hidden rounded-xl2 border border-dusty/15 sm:col-span-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={listing.photos[0]} alt={addr} className="max-h-[540px] w-full object-cover" />
              </div>
              {listing.photos.slice(1, 13).map((p, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden rounded-xl border border-dusty/12">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p} alt={`${addr} ... photo ${i + 2}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 grid h-64 place-items-center rounded-xl2 border border-dusty/15 bg-wine/20 text-dusty/60">
              Photos coming soon
            </div>
          )}

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

              {listing.description && (
                <section className="mt-8">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-auroraMauve">About this home</h2>
                  <p className="mt-3 whitespace-pre-line leading-relaxed text-pearl/90">{listing.description}</p>
                </section>
              )}

              {details.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-auroraMauve">Details</h2>
                  <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                    {details.map(([k, v]) => (
                      <div key={k} className="border-b border-dusty/10 pb-2">
                        <dt className="text-xs text-dusty">{k}</dt>
                        <dd className="text-pearl/90">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              {/* Required attribution for a detailed display (name + phone/email). */}
              <div className="mt-8 border-t border-dusty/12 pt-4 text-xs text-dusty">
                <p className="font-medium">{attribution}</p>
                <p className="mt-1 text-dusty/70">{IDX_DISCLAIMER}</p>
              </div>
            </div>

            <aside className="h-fit rounded-xl2 border border-auroraMauve/20 bg-wine-sheen p-6 text-center shadow-aurora lg:sticky lg:top-24">
              <p className="font-medium text-pearl">Interested in this home?</p>
              <p className="mt-1 text-sm text-dusty">
                Charlotte can set up a private showing and pull the full story on this property.
              </p>
              <a href="/#contact" className="btn-aurora mt-4 inline-flex w-full justify-center">
                Ask Charlotte about this home
              </a>
              <a href={`tel:${phoneDigits}`} className="mt-3 block text-sm text-dusty transition-colors hover:text-pearl">
                or call {contact.phone}
              </a>
            </aside>
          </div>

          <ComplianceFooter lastUpdated={updated} />
        </div>
      </main>
      <Footer />
    </>
  );
}
