import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createAdminClient, PORTAL_DOCS_BUCKET } from "@/lib/supabase/admin";
import { DEAL_EMAIL_DOMAIN } from "@/lib/dealEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Inbound email webhook. An email service (Resend inbound) POSTs here when mail
 * arrives at <token>@deals.soldittoday.com. We match the token to a deal and
 * file every attachment onto that deal's Documents (private bucket), plus a note
 * recording the sender. Gated by a shared secret (?key= / x-inbound-key).
 */

const safeName = (n: string) => (n || "attachment").replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "attachment";

function collectRecipients(d: any): string[] {
  const out: string[] = [];
  const push = (v: any) => {
    if (!v) return;
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(push);
    else if (typeof v === "object" && v.address) out.push(String(v.address));
    else if (typeof v === "object" && v.email) out.push(String(v.email));
  };
  push(d.to); push(d.cc); push(d.recipient); push(d.recipients);
  if (d.envelope) push(d.envelope.to);
  return out;
}

function tokenFromRecipients(recips: string[]): string | null {
  const suffix = `@${DEAL_EMAIL_DOMAIN}`.toLowerCase();
  for (const r of recips) {
    const addr = String(r).trim().toLowerCase();
    // handle "Name <token@domain>"
    const m = addr.match(/<([^>]+)>/);
    const email = (m ? m[1] : addr).trim();
    if (email.endsWith(suffix)) return email.slice(0, -suffix.length);
  }
  return null;
}

async function attachmentBytes(att: any): Promise<Uint8Array | null> {
  try {
    if (att.content && typeof att.content === "string") {
      return new Uint8Array(Buffer.from(att.content, "base64"));
    }
    const url = att.url || att.download_url || att.downloadUrl;
    if (url) {
      const res = await fetch(url);
      if (!res.ok) return null;
      return new Uint8Array(await res.arrayBuffer());
    }
  } catch {
    /* ignore */
  }
  return null;
}

export async function POST(req: Request) {
  const secret = process.env.INBOUND_EMAIL_SECRET;
  const key = new URL(req.url).searchParams.get("key") ?? req.headers.get("x-inbound-key");
  if (!secret || key !== secret) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "storage not configured" }, { status: 503 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }
  const d = body?.data ?? body;

  const token = tokenFromRecipients(collectRecipients(d));
  if (!token) return NextResponse.json({ ok: true, ignored: "no deal address" });

  // find the deal (transaction first, then listing)
  let kind: "transaction" | "listing" | null = null;
  let deal: any = null;
  const { data: tx } = await admin.from("transactions").select("id, organization_id, agent_id").eq("email_token", token).maybeSingle();
  if (tx) { kind = "transaction"; deal = tx; }
  else {
    const { data: ls } = await admin.from("listings").select("id, organization_id, agent_id").eq("email_token", token).maybeSingle();
    if (ls) { kind = "listing"; deal = ls; }
  }
  if (!deal) return NextResponse.json({ ok: true, ignored: "unknown deal token" });

  const linkCol = kind === "transaction" ? "transaction_id" : "listing_id";
  const from = String(d.from?.address ?? d.from?.email ?? d.from ?? "someone");
  const subject = String(d.subject ?? "").slice(0, 200);

  // file attachments
  const attachments: any[] = Array.isArray(d.attachments) ? d.attachments : [];
  let filed = 0;
  for (const att of attachments) {
    const bytes = await attachmentBytes(att);
    if (!bytes || bytes.length === 0) continue;
    const name = safeName(att.filename || att.name || "attachment");
    const path = `inbound/${token}/${randomUUID()}-${name}`;
    const contentType = att.contentType || att.content_type || "application/octet-stream";
    const up = await admin.storage.from(PORTAL_DOCS_BUCKET).upload(path, bytes, { contentType, upsert: false });
    if (up.error) continue;
    const { error } = await admin.from("documents").insert({
      organization_id: deal.organization_id,
      [linkCol]: deal.id,
      agent_id: deal.agent_id,
      name,
      storage_path: path,
      content_type: contentType,
      size_bytes: bytes.length,
      uploaded_by: "email",
      client_visible: false,
    });
    if (error) {
      await admin.storage.from(PORTAL_DOCS_BUCKET).remove([path]);
      continue;
    }
    filed++;
  }

  // record the email itself as an internal note
  await admin.from("notes").insert({
    organization_id: deal.organization_id,
    [linkCol]: deal.id,
    body: `Email from ${from}${subject ? `: ${subject}` : ""}${filed ? ` (${filed} attachment${filed === 1 ? "" : "s"} filed)` : ""}`,
    client_visible: false,
  });

  return NextResponse.json({ ok: true, kind, deal: deal.id, filed });
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "inbound-email" });
}
