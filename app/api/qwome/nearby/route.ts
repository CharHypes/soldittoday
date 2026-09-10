/**
 * Legacy unversioned QWOME nearby endpoint. Kept as a thin alias of the
 * versioned route so the current Sold It Today client keeps working; new callers
 * should use /api/v1/qwome/nearby. Request handling lives in v1 (single source
 * of truth); only the route-segment config is declared here as literals so
 * Next.js can statically read it.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

export { POST } from "../../v1/qwome/nearby/route";
