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

export function deriveHighlights(f: SF): { tags: string[]; standouts: string[] } {
  const tags: string[] = [];
  const standouts: string[] = [];
  const addTag = (v?: string) => {
    if (v && !tags.includes(v)) tags.push(v);
  };
  const addOut = (v?: string) => {
    if (v && !standouts.includes(v)) standouts.push(v);
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
  const newConstruction = yn(f.NewConstructionYN);
  const mainLevelBeds = nnum(f.MainLevelBedrooms);
  const yearBuilt = nnum(f.YearBuilt);
  const stories = nnum(f.StoriesTotal) ?? nnum(f.Stories);

  if (waterfront === true || waterfrontFeat.length) {
    addTag("Waterfront");
    addOut(waterfrontFeat.length ? `Waterfront (${waterfrontFeat.join(", ")})` : "Waterfront property");
  }

  if (acres != null && acres >= 1) {
    addTag(fmtAcres(acres));
    addOut(`Sits on ${fmtAcres(acres)}`);
  } else if (acres != null && acres >= 0.5) {
    addTag("Large lot");
  }

  const hasWalkout = basement.some((b) => b.includes("walk"));
  const hasFinished = basement.some((b) => b.includes("finish"));
  if (hasWalkout) addTag("Walkout lower level");
  if (hasFinished) addTag("Finished lower level");
  if (hasWalkout && hasFinished) addOut("Finished walkout lower level");
  else if (hasFinished) addOut("Finished lower level adds living space");
  else if (hasWalkout) addOut("Walkout lower level");

  const ranch = subType.includes("ranch") || stories === 1;
  if (mainLevelBeds != null && mainLevelBeds > 0) addTag("First-floor bedroom");
  if (ranch) {
    addTag("First-floor living");
    addOut("Single-level living");
  }

  if (garageSpaces != null && garageSpaces >= 1) {
    const label = `${garageSpaces}-car garage`;
    addTag(attachedGarage ? `Attached ${label}` : label);
    addOut(attachedGarage ? `Attached ${label}` : label);
  } else if (attachedGarage === true) {
    addTag("Attached garage");
  }

  if (fireplaceYN === true || (fireplaces != null && fireplaces > 0)) {
    addTag(fireplaces && fireplaces > 1 ? `${fireplaces} fireplaces` : "Fireplace");
  }
  if (pool === true) {
    addTag("Pool");
    addOut("Has a pool");
  }
  if (newConstruction === true) addTag("New construction");
  if (cooling.some((c) => c.toLowerCase().includes("central"))) addTag("Central air");
  if (!hasWalkout && !hasFinished && basement.length && !basement.every((b) => b.includes("slab"))) {
    addTag("Basement");
  }
  if (yearBuilt != null) addOut(`Built in ${yearBuilt}`);

  return { tags: tags.slice(0, 8), standouts: standouts.slice(0, 5) };
}
