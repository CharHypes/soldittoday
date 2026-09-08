/**
 * Builds the collapsible "Property details" sections for the listing page from
 * MLS StandardFields. Every value is cleaned ... masked ("********"), null, empty,
 * and empty objects/arrays are dropped, so we NEVER render blank rows or empty
 * sections. Structured objects (e.g. {"Central Air":true}) become "Central Air".
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

export type DetailRow = { label: string; value: string };
export type DetailSection = { title: string; rows: DetailRow[] };

type SF = Record<string, any>;
const MASK = "********";

function text(v: any): string | undefined {
  if (v == null || v === "" || v === MASK) return undefined;
  if (typeof v === "number") return v.toLocaleString("en-US");
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "string") {
    if (v === "True") return "Yes";
    if (v === "False") return "No";
    return v;
  }
  return undefined;
}
function list(v: any): string | undefined {
  if (!v || v === MASK) return undefined;
  if (Array.isArray(v)) {
    const a = v.filter((x) => x && x !== MASK).map(String);
    return a.length ? a.join(", ") : undefined;
  }
  if (typeof v === "object") {
    const keys = Object.entries(v)
      .filter(([, val]) => val === true)
      .map(([k]) => k);
    return keys.length ? keys.join(", ") : undefined;
  }
  return text(v);
}
function num(v: any): number | undefined {
  if (v == null || v === "" || v === MASK) return undefined;
  const n = typeof v === "number" ? v : Number(String(v).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}
function pos(v: any): string | undefined {
  const n = num(v);
  return n != null && n > 0 ? n.toLocaleString("en-US") : undefined;
}
function money(v: any): string | undefined {
  const n = num(v);
  return n != null && n > 0
    ? n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    : undefined;
}
function yes(v: any): string | undefined {
  return v === true || v === "True" || v === "Yes" ? "Yes" : undefined;
}

function section(title: string, rows: Array<[string, string | undefined]>): DetailSection | null {
  const filtered = rows.filter((r) => r[1] != null && r[1] !== "");
  return filtered.length
    ? { title, rows: filtered.map(([label, value]) => ({ label, value: value as string })) }
    : null;
}

export function buildDetailSections(f: SF): DetailSection[] {
  const fireplaces = num(f.FireplacesTotal);
  const beds = num(f.BedsTotal);
  const bathsFull = num(f.BathsFull);
  const bathsHalf = num(f.BathsHalf);
  const mainBeds = num(f.MainLevelBedrooms);

  const candidates: Array<DetailSection | null> = [
    section("Interior", [
      ["Features", list(f.InteriorFeatures)],
      ["Flooring", list(f.Flooring)],
      ["Fireplace", yes(f.FireplaceYN)],
      ["Fireplaces", fireplaces && fireplaces > 0 ? String(fireplaces) : undefined],
      ["Fireplace details", list(f.FireplaceFeatures)],
      ["Total rooms", pos(f.RoomsTotal)],
    ]),
    section("Kitchen & appliances", [
      ["Appliances", list(f.Appliances) ?? list(f.KitchenAppliances)],
    ]),
    section("Bedrooms & bathrooms", [
      ["Bedrooms", beds != null ? String(beds) : undefined],
      ["Full baths", bathsFull != null ? String(bathsFull) : undefined],
      ["Half baths", bathsHalf != null && bathsHalf > 0 ? String(bathsHalf) : undefined],
      ["Main-level bedrooms", mainBeds && mainBeds > 0 ? String(mainBeds) : undefined],
    ]),
    section("Basement / lower level", [
      ["Basement", list(f.Basement)],
      ["Finished area (below grade)", pos(f.BelowGradeFinishedArea) ? `${pos(f.BelowGradeFinishedArea)} sqft` : undefined],
    ]),
    section("Heating & cooling", [
      ["Heating", list(f.Heating)],
      ["Cooling", list(f.Cooling)],
    ]),
    section("Exterior", [
      ["Features", list(f.ExteriorFeatures)],
      ["Construction", list(f.ConstructionMaterials)],
      ["Architectural style", list(f.ArchitecturalStyle)],
      ["Roof", list(f.Roof)],
      ["Patio & porch", list(f.PatioAndPorchFeatures)],
      ["Fencing", list(f.Fencing)],
      ["Pool", yes(f.PoolYN)],
      ["Pool features", list(f.PoolFeatures)],
    ]),
    section("Garage & parking", [
      ["Garage", yes(f.GarageYN)],
      ["Garage spaces", pos(f.GarageSpaces)],
      ["Attached garage", yes(f.AttachedGarageYN)],
      ["Parking", list(f.ParkingFeatures)],
      ["Total parking", pos(f.ParkingTotal)],
    ]),
    section("Lot & property", [
      ["Lot size", pos(f.LotSizeAcres) ? `${pos(f.LotSizeAcres)} acres` : pos(f.LotSizeSquareFeet) ? `${pos(f.LotSizeSquareFeet)} sqft` : undefined],
      ["Lot dimensions", text(f.LotSizeDimensions)],
      ["Lot features", list(f.LotFeatures)],
      ["Year built", pos(f.YearBuilt)],
      ["Property type", text(f.PropertySubType)],
      ["Stories", pos(f.StoriesTotal) ?? pos(f.Stories)],
      ["View", list(f.View)],
      ["Waterfront", yes(f.WaterFrontYN)],
      ["Waterfront features", list(f.WaterfrontFeatures)],
      ["Zoning", text(f.Zoning)],
    ]),
    section("Utilities", [
      ["Utilities", list(f.Utilities)],
      ["Sewer", list(f.Sewer)],
      ["Water source", list(f.WaterSource)],
    ]),
    section("Financial & taxes", [
      ["Annual taxes", money(f.TaxAmount) ?? money(f.TaxAnnualAmount)],
      ["Assessed value", money(f.TaxAssessedValue)],
      ["Tax year", pos(f.TaxYear)],
      ["HOA", yes(f.AssociationYN)],
      ["HOA fee", money(f.AssociationFee)],
      ["HOA includes", list(f.AssociationFeeIncludes)],
    ]),
    section("Schools", [
      ["District", text(f.SchoolDistrict)],
      ["Elementary", text(f.ElementarySchool)],
      ["Middle / junior", text(f.MiddleOrJuniorSchool)],
      ["High school", text(f.HighSchool)],
    ]),
    section("Listing details", [
      ["MLS #", text(f.ListingId) ?? text(f.ListingKey)],
      ["Listed on", text(f.ListingContractDate)],
      ["County", text(f.CountyOrParish)],
    ]),
  ];

  return candidates.filter((s): s is DetailSection => s !== null);
}
