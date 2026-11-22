import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhotoGallery from "@/components/search/PhotoGallery";
import FavoriteButton from "@/components/search/FavoriteButton";
import ShareButton from "@/components/search/ShareButton";
import ListingPaymentCalculator from "@/components/search/ListingPaymentCalculator";
import { getPublicListing } from "@/lib/publicListing";
import { contact } from "@/lib/data";

export const dynamic = "force-dynamic";

const SITE = "https://www.soldittoday.com";

function money(n: number | null): string {
  if (n == null) return "Price on request";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

// Per-listing link preview (Open Graph): the HOUSE PHOTO + address under the
// Sold It Today brand, never a personal name. These are OUR own published
// listings, so (unlike duplicated IDX feed listings) they are safe to index.
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const listing = await getPublicListing(params.slug);
  if (!listing) {
    return { title: "Home for Sale | Sold It Today", robots: { index: false, follow: true } };
  }
  const cityLine = [listing.city, [listing.state, listing.zip].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
  const addrHasCity = !!listing.city && listing.address.toLowerCase().includes(listing.city.toLowerCase());
  const headline = addrHasCity ? listing.address : [listing.address, cityLine].filter(Boolean).join(", ");
  const title = `${headline} | Sold It Today`;
  const description =
    [
      listing.price != null ? money(listing.price) : null,
      listing.beds != null ? `${listing.beds} bd` : null,
      listing.baths != null ? `${listing.baths} ba` : null,
      listing.sqft != null ? `${listing.sqft.toLocaleString("en-US")} sqft` : null,
    ]
      .filter(Boolean)
      .join("  ·  ") || "View this home for sale with Sold It Today.";
  const photo = listing.photos?.[0] ?? listing.photoUrl ?? null;
  const url = `${SITE}/l/${listing.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: headline,
      description,
      url,
      siteName: "Sold It Today",
      type: "website",
      ...(photo ? { images: [{ url: photo, alt: listing.address || "Home for sale" }] } : {}),
    },
    twitter: {
      card: photo ? "summary_large_image" : "summary",
      title: headline,
      description,
      ...(photo ? { images: [photo] } : {}),
    },
  };
}

export default async function PublicListingPage({ params }: { params: { slug: string } }) {
  const listing = await getPublicListing(params.slug);
  if (!listing) notFound();

  const cityLine = [listing.city, [listing.state, listing.zip].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
  const phoneDigits = contact.phone.replace(/[^0-9]/g, "");
  const galleryPhotos = listing.photos.length ? listing.photos : listing.photoUrl ? [listing.photoUrl] : [];

  return (
    <>
      <Navbar />
      <main className="bg-plum pb-20 pt-24 md:pt-28">
        <div className="container-lux">
          <Link href="/search" className="text-sm text-dusty transition-colors hover:text-pearl">
            &larr; Back to search
          </Link>

          <div className="mt-5">
            <PhotoGallery photos={galleryPhotos} alt={listing.address} />
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-wine/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-pearl">
                  {listing.status}
                </span>
                {listing.isFsbo && (
                  <span className="rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold">
                    For Sale by Owner
                  </span>
                )}
              </div>

              <p className="mt-3 text-3xl font-semibold text-pearl md:text-4xl">{money(listing.price)}</p>
              <p className="mt-1 text-lg text-pearl/90">{listing.address}</p>
              {cityLine && <p className="text-dusty">{cityLine}</p>}

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-pearl/90">
                {listing.beds != null && <span><strong>{listing.beds}</strong> beds</span>}
                {listing.baths != null && <span><strong>{listing.baths}</strong> baths</span>}
                {listing.sqft != null && <span><strong>{listing.sqft.toLocaleString("en-US")}</strong> sqft</span>}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a href="/#contact" className="btn-aurora group order-first w-full justify-center sm:w-auto">
                  Request a Showing
                  <span className="transition-transform duration-500 ease-lux group-hover:translate-x-1">&rarr;</span>
                </a>
                <FavoriteButton listingId={listing.id} />
                <ShareButton title={`${listing.address} ... ${money(listing.price)}`} />
              </div>

              {listing.description && (
                <section className="mt-8">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-auroraMauve">About this home</h2>
                  <p className="mt-3 whitespace-pre-line leading-relaxed text-pearl/90">{listing.description}</p>
                </section>
              )}

              {listing.price != null && listing.price >= 25000 && (
                <ListingPaymentCalculator price={listing.price} />
              )}

              {listing.address && (
                <section className="mt-8">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-auroraMauve">Location</h2>
                  <div className="mt-3 overflow-hidden rounded-xl2 border border-dusty/15">
                    <iframe
                      title={`Map of ${listing.address}`}
                      src={`https://www.google.com/maps?q=${encodeURIComponent(
                        [listing.address, cityLine].filter(Boolean).join(", ")
                      )}&z=15&output=embed`}
                      className="h-72 w-full md:h-80"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </section>
              )}

              <div className="mt-8 border-t border-dusty/12 pt-4 text-xs text-dusty">
                <p className="font-medium">
                  {listing.isFsbo ? "Marketed by " : "Listed by "}
                  {listing.agent.brand || listing.agent.name || "Sold It Today"}
                </p>
                <p className="mt-1 text-dusty/70">
                  Listing information is provided by Sold It Today and believed reliable but not guaranteed.
                </p>
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
              <a
                href={`tel:${phoneDigits}`}
                className="mt-3 block text-sm font-medium text-dusty transition-colors hover:text-pearl"
              >
                or call {contact.phone}
              </a>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
