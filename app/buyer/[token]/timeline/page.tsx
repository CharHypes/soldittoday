import type { Metadata } from "next";
import { getBuyerTimeline } from "@/lib/portal";
import TimelineSheet, { type TimelineValues } from "@/components/dash/TimelineSheet";

export const metadata: Metadata = {
  title: "Your Closing Timeline | Sold It Today",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const usd0 = (n: unknown) => {
  if (n == null || n === "") return "";
  const v = Number(n);
  return Number.isFinite(v) ? "$" + v.toLocaleString("en-US", { maximumFractionDigits: 0 }) : "";
};
const md = (s: string | null) => (s ? new Date(`${s}T00:00:00`).toLocaleDateString("en-US") : "");
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function firstNames(name: string | null): string | null {
  if (!name) return null;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (name.includes("&")) return parts.slice(0, -1).join(" ");
  return parts[0] ?? null;
}

export default async function PublicTimelinePage({ params }: { params: { token: string } }) {
  const d = await getBuyerTimeline(params.token);
  if (!d) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#e6ddea", textAlign: "center", padding: 24, fontFamily: "system-ui" }}>
        <div>
          <p style={{ fontSize: 22, fontWeight: 600, color: "#3b2338" }}>This timeline is not available</p>
          <p style={{ marginTop: 8, color: "#6a5f66" }}>The link may have expired. Please contact your agent for an updated link.</p>
        </div>
      </main>
    );
  }

  const addrLine = [d.city, [d.state, d.zip].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const addressHtml = [esc(d.address || "") + (addrLine ? "," : ""), addrLine ? esc(addrLine) : ""].filter(Boolean).join("<br>");
  const fn = firstNames(d.client_name);

  const v: TimelineValues = {
    congrats: fn ? `Congratulations, ${fn}!` : "Congratulations!",
    intro: "You are officially under contract! Keep this timeline handy so we stay on track for a smooth, on-time closing. We are with you every step of the way.",
    purchasePrice: usd0(d.price),
    escrow: usd0(d.emd_amount),
    addressHtml,
    titleCompany: d.title_company || "",
    photoUrl: d.photo_url,
    rows: [
      { label: "Earnest money due", date: md(d.emd_received_date) },
      { label: "Send contract to lender", date: md(d.acceptance_date) },
      { label: "Schedule home inspection", date: md(d.inspection_deadline) },
      { label: "Repair request due to seller", date: md(d.inspection_deadline) },
      { label: "Obtain home insurance plan", date: md(d.insurance_date) },
      { label: "Complete home appraisal", date: md(d.appraisal_date) },
      { label: "Schedule the walk through", date: md(d.walkthrough_date) },
      { label: "Closing date per contract", date: md(d.target_close_date) },
    ],
  };

  return <TimelineSheet v={v} editable={false} />;
}
