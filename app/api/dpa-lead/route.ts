import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * DPA campaign lead intake.
 *
 * Mirrors /api/lead: saving the lead is the source of truth and is decoupled
 * from the email alert, so an unconfigured or failing mail provider can never
 * cost us a lead. DPA leads are stored in the same `leads` table as the rest of
 * the site, tagged `DPA: <City>` with the eligibility answers in the message so
 * they are easy to spot. Only the fields collected on the form are stored.
 *
 * Spam protection: honeypot field + basic in-memory rate limiting per IP.
 */

export const runtime = "nodejs";

const NOTIFY_TO = process.env.LEAD_NOTIFICATION_EMAIL ?? "charlotte@soldittoday.com";
const NOTIFY_FROM = process.env.LEAD_NOTIFICATION_FROM ?? "no-reply@soldittoday.com";

// --- Basic rate limiting (per server instance) ---
// Not a hard guarantee on serverless (each instance has its own memory), but it
// blunts obvious abuse without extra infrastructure, which is all the brief asks.
const RATE_LIMIT_MAX = 5; // requests
const RATE_LIMIT_WINDOW_MS = 60_000; // per minute per IP
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // opportunistic cleanup so the map doesn't grow unbounded
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > RATE_LIMIT_MAX;
}

type DpaPayload = {
  name?: string;
  email?: string;
  phone?: string;
  householdSize?: string;
  ownedHomePast3Years?: string; // "yes" | "no" | ""
  completedEducation?: string; // "yes" | "no" | ""
  city?: string;
  sourcePage?: string;
  company?: string; // honeypot
};

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function yesNo(value: string, noLabel = "No"): string {
  if (value === "yes") return "Yes";
  if (value === "no") return noLabel;
  return "Not answered";
}

async function sendNotification(lead: {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  householdSize: string;
  owned: string;
  education: string;
  sourcePage: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // Not configured (e.g. local dev); the lead is already saved.

  const rows: [string, string][] = [
    ["Name", lead.fullName],
    ["Email", lead.email],
    ["Phone", lead.phone || "Not provided"],
    ["City / program", lead.city],
    ["Household size", lead.householdSize || "Not provided"],
    ["Owned a home in past 3 years", lead.owned],
    ["Completed homebuyer education", lead.education],
    ["Page", lead.sourcePage],
  ];

  const html = `
    <h2 style="font-family:system-ui,sans-serif">New down payment assistance lead</h2>
    <table style="font-family:system-ui,sans-serif;border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:6px 14px 6px 0;color:#666">${label}</td><td style="padding:6px 0"><strong>${value}</strong></td></tr>`
        )
        .join("")}
    </table>
    <p style="font-family:system-ui,sans-serif;color:#666">Reply directly to this email to reach ${lead.fullName}.</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Sold It Today <${NOTIFY_FROM}>`,
      to: [NOTIFY_TO],
      reply_to: lead.email,
      subject: `New DPA lead (${lead.city}): ${lead.fullName}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error("DPA notification failed:", res.status, await res.text());
  }
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  let body: DpaPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Report success so they don't retry.
  if (clean(body.company)) {
    return NextResponse.json({ ok: true });
  }

  const email = clean(body.email);
  const fullName = clean(body.name);
  if (!email || !email.includes("@") || !fullName) {
    return NextResponse.json(
      { error: "Please add your name and a valid email." },
      { status: 400 }
    );
  }

  const city = clean(body.city) || "Unknown";
  const householdSize = clean(body.householdSize);
  const owned = yesNo(clean(body.ownedHomePast3Years));
  const education = yesNo(clean(body.completedEducation), "Not yet");
  const sourcePage = clean(body.sourcePage) || "/dpa";

  const [firstName, ...rest] = fullName.split(/\s+/);
  const lastName = rest.join(" ");

  // Eligibility answers captured into the existing message column (readable in
  // the same leads list). Nothing beyond the collected fields is stored.
  const message = [
    `Down payment assistance inquiry for ${city}`,
    `Household size: ${householdSize || "Not provided"}`,
    `Owned a home in the past 3 years: ${owned}`,
    `Completed homebuyer education: ${education}`,
  ].join("\n");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase.from("leads").insert({
    first_name: firstName,
    last_name: lastName,
    email,
    phone: clean(body.phone) || null,
    lead_type: `DPA: ${city}`,
    message,
    source_page: sourcePage,
    status: "new",
  });

  if (error) {
    console.error("DPA lead insert failed:", error.message);
    return NextResponse.json(
      { error: "We couldn't save your info. Please try again." },
      { status: 500 }
    );
  }

  try {
    await sendNotification({
      fullName,
      email,
      phone: clean(body.phone),
      city,
      householdSize,
      owned,
      education,
      sourcePage,
    });
  } catch (err) {
    console.error("DPA notification threw:", err);
  }

  return NextResponse.json({ ok: true });
}
