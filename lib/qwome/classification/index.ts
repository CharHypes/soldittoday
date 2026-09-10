/**
 * QWOME™ classification ... barrel + combined classifier.
 *
 * Import individual rule sets (`classifyHealthcare`, `classifySchool`,
 * `classifyGrocery`) or the combined `classifyPlace`, which returns every QWOME
 * category a place belongs to across all domains. A live provider that ingests
 * arbitrary places (health, schools, grocery) can call `classifyPlace` and bucket
 * each place by the categories it returns ... the same rules the bundled dataset
 * was built with.
 *
 * NOTE for build-time (Node) callers: import the individual rule files with an
 * explicit `.ts` extension (e.g. "../lib/qwome/classification/grocery.ts"); this
 * barrel uses extensionless value imports and is intended for the bundled app.
 */
import type { QwomeCategoryKey } from "../engine";
import type { ClassifiablePlace } from "./types";
import { classifyHealthcare } from "./healthcare";
import { classifySchool } from "./school";
import { classifyGrocery } from "./grocery";

export type { ClassifiablePlace, ClassifierFn } from "./types";
export { classifyHealthcare } from "./healthcare";
export { classifySchool } from "./school";
export { classifyGrocery } from "./grocery";

/** Every QWOME category a place belongs to, across healthcare/schools/grocery. */
export function classifyPlace(place: ClassifiablePlace): QwomeCategoryKey[] {
  return [
    ...classifyHealthcare(place),
    ...classifySchool(place),
    ...classifyGrocery(place),
  ];
}
