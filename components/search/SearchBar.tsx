"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { propertyTypes, priceOptions, bedBathOptions } from "@/lib/data";
import SearchSelect from "./SearchSelect";

/** Feature toggles ... only fields MichRIC returns reliably (not masked). */
const FEATURES = [
  { key: "garage", label: "Garage" },
  { key: "ac", label: "Central A/C" },
  { key: "fireplace", label: "Fireplace" },
  { key: "singleStory", label: "Single story" },
  { key: "waterfront", label: "Waterfront" },
  { key: "newConstruction", label: "New construction" },
] as const;

type FeatureKey = (typeof FEATURES)[number]["key"];

type SearchBarProps = {
  initial?: {
    location?: string;
    propertyType?: string;
    minPrice?: string;
    maxPrice?: string;
    beds?: string;
    baths?: string;
    features?: Partial<Record<FeatureKey, boolean>>;
  };
};

/**
 * The filter bar on the /search results page. Pure UI ... it builds a query
 * string and navigates to /search, where the server calls the IDX feed. It does
 * not fetch or fabricate listings itself. Location accepts several cities/ZIPs
 * separated by commas (any match).
 */
export default function SearchBar({ initial = {} }: SearchBarProps) {
  const router = useRouter();
  const [location, setLocation] = useState(initial.location ?? "");
  const [propertyType, setPropertyType] = useState(initial.propertyType ?? "any");
  const [minPrice, setMinPrice] = useState(initial.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice ?? "");
  const [beds, setBeds] = useState(initial.beds ?? "any");
  const [baths, setBaths] = useState(initial.baths ?? "any");
  const [features, setFeatures] = useState<Partial<Record<FeatureKey, boolean>>>(
    initial.features ?? {}
  );

  const toggle = (key: FeatureKey) =>
    setFeatures((f) => ({ ...f, [key]: !f[key] }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (propertyType && propertyType !== "any") params.set("propertyType", propertyType);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (beds && beds !== "any") params.set("beds", beds);
    if (baths && baths !== "any") params.set("baths", baths);
    for (const { key } of FEATURES) if (features[key]) params.set(key, "1");
    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="aurora-ring rounded-xl2 border border-auroraMauve/25 bg-plum/70 p-5 shadow-aurora backdrop-blur-xl sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dusty">
            &#9906;
          </span>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City or ZIP ... add several with commas (e.g. Taylor, Wyandotte)"
            aria-label="Search by one or more cities or ZIP codes, separated by commas"
            className="w-full rounded-xl border border-dusty/20 bg-plum/50 py-4 pl-11 pr-4 text-sm text-pearl placeholder:text-dusty/60 outline-none transition-colors duration-300 hover:border-dusty/40 focus:border-auroraMauve/60 sm:text-base"
          />
        </div>
        <button type="submit" className="btn-aurora group shrink-0 sm:px-9">
          Search
          <span
            aria-hidden
            className="transition-transform duration-500 ease-lux group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-dusty/12 pt-5 sm:grid-cols-3 lg:grid-cols-5">
        <SearchSelect id="min-price" label="Min Price" value={minPrice} onChange={setMinPrice} options={priceOptions} />
        <SearchSelect
          id="max-price"
          label="Max Price"
          value={maxPrice}
          onChange={setMaxPrice}
          options={priceOptions.map((o) => (o.value === "" ? { value: "", label: "No Max" } : o))}
        />
        <SearchSelect id="beds" label="Beds" value={beds} onChange={setBeds} options={bedBathOptions} />
        <SearchSelect id="baths" label="Baths" value={baths} onChange={setBaths} options={bedBathOptions} />
        <SearchSelect id="property-type" label="Property Type" value={propertyType} onChange={setPropertyType} options={propertyTypes} />
      </div>

      {/* Feature toggles */}
      <div className="mt-5 border-t border-dusty/12 pt-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-dusty">Must have</p>
        <div className="flex flex-wrap gap-2">
          {FEATURES.map(({ key, label }) => {
            const on = !!features[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(key)}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  on
                    ? "border-transparent bg-gradient-to-br from-gold to-auroraMauve text-plum"
                    : "border-dusty/25 text-dusty hover:border-dusty/50 hover:text-pearl",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </form>
  );
}
