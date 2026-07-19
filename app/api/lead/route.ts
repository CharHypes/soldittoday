import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Lead intake. Saving the lead and notifying Charlotte are deliberately
 * decoupled: the insert is the source of truth, and a failing/unconfigured
 * mail provider must never cost us the lead. Email errors are logged and
 * swallowed after the row is committed.
 */

export const runtime = "nodejs";

const NOTIFY_TO = process.env.LEAD_NOTIFICATION_EMAIL ?? "charlotte@soldittoday.com";
const NOTIFY_FROM = process.env.LEAD_NOTIFICATION_FROM ?? "onboarding@resend.dev";

type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  intent?: string;
  message?: string;
  sourcePage?: string;
  company?: string; // honeypot
};

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function sendNotification(lead: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  leadType: string;
  message: string;
  sourcePage: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // Not configured yet — lead is already saved.

  const fullName = [lead.firstName, lead.lastName].filter(Boolean).join(" ");
  const rows: [string, string][] = [
    ["Name", fullName],
    ["Email", lead.email],
    ["Phone", lead.phone || "Not provided"],
    ["Interested in", lead.leadType],
    ["Page", lead.sourcePage],
    ["Message", lead.message || "No message"],
  ];

  const html = `
    <h2 style="font-family:system-ui,sans-serif">New lead from soldittoday.com</h2>
    <table style="font-family:system-ui,sans-serif;border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:6px 14px 6px 0;color:#666">${label}</td><td style="padding:6px 0"><strong>${value}</strong></td></tr>`
        )
        .join("")}
    </table>
    <p style="font-family:system-ui,sans-serif;color:#666">Reply directly to this email to reach ${fullName}.</p>
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
      subject: `New ${lead.leadType} lead: ${fullName}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error("Lead notification failed:", res.status, await res.text());
  }
}

export async function POST(request: Request) {
  let body: LeadPayload;
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
      { error: "Name and a valid email are required." },
      { status: 400 }
    );
  }

  const [firstName, ...rest] = fullName.split(/\s+/);
  const lead = {
    firstName,
    lastName: rest.join(" "),
    email,
    phone: clean(body.phone),
    leadType: clean(body.intent) || "Just Exploring",
    message: clean(body.message),
    sourcePage: clean(body.sourcePage) || "/",
  };

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase.from("leads").insert({
    first_name: lead.firstName,
    last_name: lead.lastName,
    email: lead.email,
    phone: lead.phone || null,
    lead_type: lead.leadType,
    message: lead.message || null,
    source_page: lead.sourcePage,
    status: "new",
  });

  if (error) {
    console.error("Lead insert failed:", error.message);
    return NextResponse.json(
      { error: "We couldn't save your message. Please try again." },
      { status: 500 }
    );
  }

  try {
    await sendNotification(lead);
  } catch (err) {
    console.error("Lead notification threw:", err);
  }

  return NextResponse.json({ ok: true });
}
