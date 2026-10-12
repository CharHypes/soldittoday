import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import TimelineSheet, { type TimelineValues } from "@/components/dash/TimelineSheet";

export const metadata: Metadata = {
  title: "Under Contract Timeline | Sold It Today",
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

export default async function TimelinePage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServer();
  const { data: tx } = await supabase.from("transactions").select("*").eq("id", params.id).maybeSingle();
  if (!tx) redirect("/dashboard/buyers");

  // Title company ... from the deal's title contact.
  let titleCompany = "";
  const { data: links } = await supabase
    .from("transaction_people").select("role, name_on_deal, person_id").eq("transaction_id", params.id);
  const titleLink = (links ?? []).find((l) => /title/i.test(l.role || ""));
  if (titleLink?.person_id) {
    const { data: tp } = await supabase.from("people").select("company, display_name").eq("id", titleLink.person_id).maybeSingle();
    titleCompany = tp?.company || tp?.display_name || titleLink.name_on_deal || "";
  } else if (titleLink) {
    titleCompany = titleLink.name_on_deal || "";
  }

  const addrLine = [tx.city, [tx.state, tx.zip].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const addressHtml = [esc(tx.address || "") + (addrLine ? "," : ""), addrLine ? esc(addrLine) : ""].filter(Boolean).join("<br>");

  const v: TimelineValues = {
    congrats: "Congratulations!",
    intro: "You are officially under contract! Keep this timeline handy so we stay on track for a smooth, on-time closing. We are with you every step of the way.",
    purchasePrice: usd0(tx.price),
    escrow: usd0(tx.emd_amount),
    addressHtml: addressHtml || "",
    titleCompany,
    rows: [
      { label: "Earnest money due", date: md(tx.emd_received_date) },
      { label: "Send contract to lender", date: md(tx.acceptance_date) },
      { label: "Schedule home inspection", date: md(tx.inspection_deadline) },
      { label: "Repair request due to seller", date: md(tx.inspection_deadline) },
      { label: "Obtain home insurance plan", date: md(tx.insurance_date) },
      { label: "Complete home appraisal", date: md(tx.appraisal_date) },
      { label: "Schedule the walk through", date: md(tx.walkthrough_date) },
      { label: "Closing date per contract", date: md(tx.target_close_date) },
    ],
  };

  return <TimelineSheet v={v} backHref={`/dashboard/buyers/${params.id}`} />;
}
