import { DOCUMENT_HTML, EXPIRED_HTML } from "./documents";

// Seller-only market and pricing review for 1457 Indian Trail.
// Expires at the end of Sep 23, 2026 (Eastern). To extend, change this one date.
const EXPIRES_AT = new Date("2026-09-24T04:00:00Z");

export const dynamic = "force-dynamic";

const BASE_HEADERS = {
  "Content-Type": "text/html; charset=utf-8",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Cache-Control": "no-store, max-age=0",
};

export async function GET() {
  const expired = Date.now() > EXPIRES_AT.getTime();
  return new Response(expired ? EXPIRED_HTML : DOCUMENT_HTML, {
    status: expired ? 410 : 200,
    headers: BASE_HEADERS,
  });
}
