/**
 * "At a Glance" ... Sold It Today's original listing feature. Derives Home Match
 * tags and a short "Why this home stands out" list from REAL MLS StandardFields
 * only ... never invented claims. Masked ("********"), null, and empty values are
 * treated as no data, so we never overstate a home.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

type SF = Record<string, any>;
const MASK = "********";

function str(v: any): string | undefined {
  if (v == null || v === "" || v === MASK) return undefined;
  return typeof v === "string" ? v : String(v);
}
function nnum(v: any): number | undefined {
  if (v == null || v === "" || v === MASK) return undefined;
  const x = typeof v === "number" ? v : Number(String(v).replace(/[^0-9.]/g, ""));
  return Number.isFinite(x) ? x : undefined;
}
function trueKeys(v: any): string[] {
  if (!v || typeof v !== "object" || Array.isArray(v)) return [];
  return Object.entries(v)
    .filter(([, val]) => val === true)
    .map(([k]) => k);
}
function yn(v: any): boolean | undefined {
  if (v === true || v === "True" || v === "Yes") return true;
  if (v === false || v === "False" || v === "No") return false;
  return undefined; // masked / unknown
}
function fmtAcres(a: number): string {
  const rounded = Math.round(a * 100) / 100;
  return `${rounded % 1 === 0 ? rounded : rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")} acres`;
}

export function deriveHighlights(f: SF): { tags: string[]; whyItWorks: string[] } {
  const tags: string[] = [];
  const why: string[] = [];
  const addTag = (v?: string) => {
    if (v && !tags.includes(v)) tags.push(v);
  };
  // "Why this home works" ... curated, benefit-framed lines tied to real facts.
  const addWhy = (v?: string) => {
    if (v && !why.includes(v)) why.push(v);
  };

  const subType = (str(f.PropertySubType) || "").toLowerCase();
  const basement = trueKeys(f.Basement).map((k) => k.toLowerCase());
  const cooling = trueKeys(f.Cooling);
  const acres = nnum(f.LotSizeAcres);
  const garageSpaces = nnum(f.GarageSpaces);
  const attachedGarage = yn(f.AttachedGarageYN);
  const waterfront = yn(f.WaterFrontYN);
  const waterfrontFeat = trueKeys(f.WaterfrontFeatures);
  const fireplaceYN = yn(f.FireplaceYN);
  const fireplaces = nnum(f.FireplacesTotal);
  const pool = yn(f.PoolYN);
  const poolFeat = trueKeys(f.PoolFeatures);
  const newConstruction = yn(f.NewConstructionYN);
  const mainLevelBeds = nnum(f.MainLevelBedrooms);
  const stories = nnum(f.StoriesTotal) ?? nnum(f.Stories);
  const fencing = trueKeys(f.Fencing).length > 0 || (!!str(f.Fencing) && str(f.Fencing) !== "None");
  const patio = trueKeys(f.PatioAndPorchFeatures);
  const exterior = trueKeys(f.ExteriorFeatures);
  const interior = trueKeys(f.InteriorFeatures);

  const ranch = subType.includes("ranch") || stories === 1;
  const hasWalkout = basement.some((b) => b.includes("walk"));
  const hasFinished = basement.some((b) => b.includes("finish"));

  // ---- Tags (quick chips for "At a Glance") ----
  if (waterfront === true || waterfrontFeat.length) addTag("Waterfront");
  if (acres != null && acres >= 1) addTag(fmtAcres(acres));
  else if (acres != null && acres >= 0.5) addTag("Large lot");
  if (hasWalkout) addTag("Walkout lower level");
  if (hasFinished) addTag("Finished lower level");
  if (mainLevelBeds != null && mainLevelBeds > 0) addTag("First-floor bedroom");
  if (ranch) addTag("First-floor living");
  if (garageSpaces != null && garageSpaces >= 1) {
    addTag(attachedGarage ? `Attached ${garageSpaces}-car garage` : `${garageSpaces}-car garage`);
  } else if (attachedGarage === true) addTag("Attached garage");
  if (fireplaceYN === true || (fireplaces != null && fireplaces > 0)) {
    addTag(fireplaces && fireplaces > 1 ? `${fireplaces} fireplaces` : "Fireplace");
  }
  if (pool === true) addTag("Pool");
  if (newConstruction === true) addTag("New construction");
  if (cooling.some((c) => c.toLowerCase().includes("central"))) addTag("Central air");
  if (fencing) addTag("Fenced yard");
  if (!hasWalkout && !hasFinished && basement.length && !basement.every((b) => b.includes("slab"))) {
    addTag("Basement");
  }

  // ---- "Why this home works" (curated benefit lines) ----
  if (acres != null && acres >= 1) addWhy(`${fmtAcres(acres)} for room and privacy`);
  else if (acres != null && acres >= 0.5) addWhy("Over half an acre of yard");

  if (hasWalkout && hasFinished) addWhy("Finished walkout lower level adds flexible living space");
  else if (hasFinished) addWhy("Finished lower level adds flexible living space");
  else if (hasWalkout) addWhy("Walkout lower level opens to the backyard");

  if (ranch) addWhy("First-floor living ... everything on one level");
  else if (mainLevelBeds != null && mainLevelBeds > 0) addWhy("Main-floor bedroom for one-level convenience");

  if (waterfront === true || waterfrontFeat.length) {
    addWhy(waterfrontFeat.length ? `Waterfront setting (${waterfrontFeat.join(", ")})` : "Waterfront setting");
  }
  // Garage as a benefit line (the tag is bare; this explains the perk).
  if (garageSpaces != null && garageSpaces >= 2) {
    addWhy(`${attachedGarage ? "Attached " : ""}${garageSpaces}-car garage for parking and storage`);
  }
  if (pool === true) addWhy(poolFeat.length ? `Pool (${poolFeat.join(", ")})` : "Pool for summer");
  if (patio.length) addWhy(`Outdoor living space (${patio.slice(0, 2).join(", ")})`);
  if (newConstruction === true) addWhy("Brand-new construction, never lived in");

  // Notable named features straight from the MLS (e.g. outdoor speakers, wet bar)
  for (const feat of [...exterior, ...interior].slice(0, 2)) addWhy(feat);

  // Curated: cap at 5 strong benefit lines (the page may append a nearby line).
  return { tags: tags.slice(0, 8), whyItWorks: why.slice(0, 5) };
}
