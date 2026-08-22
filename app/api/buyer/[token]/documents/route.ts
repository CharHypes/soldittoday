import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient, PORTAL_DOCS_BUCKET } from "@/lib/supabase/admin";
import { sendAgentEmail, esc } from "@/lib/notify";

/**
 * Buyer uploads a document from their portal (no login). The token is verified
 * against a transaction, then the file is stored privately and recorded as an
 * uploaded_by='buyer' document. Requires the service-role key (returns 503
 * until it is configured). The agent is notified by email.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB

const safeName = (name: string): string =>
  (name || "document").replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "document";

export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Uploads are not enabled yet." }, { status: 503 });

  const { data: tx } = await admin
    .from("transactions")
    .select("id, agent_id, address, client_id")
    .eq("portal_token", params.token)
    .maybeSingle();
  if (!tx) return NextResponse.json({ error: "Portal not found" }, { status: 404 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0)
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (file.size > MAX_BYTES)
    return NextResponse.json({ error: "File too large (20MB max)" }, { status: 400 });

  const display = safeName(file.name);
  const path = `${tx.id}/${randomUUID()}-${display}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await admin.storage
    .from(PORTAL_DOCS_BUCKET)
    .upload(path, buf, { contentType: file.type || "application/octet-stream", upsert: false });
  if (upErr) return NextResponse.json({ error: "Upload failed" }, { status: 500 });

  const { error: insErr } = await admin.from("documents").insert({
    transaction_id: tx.id,
    agent_id: tx.agent_id,
    name: display,
    storage_path: path,
    content_type: file.type || null,
    size_bytes: file.size,
    uploaded_by: "buyer",
    client_visible: true,
  });
  if (insErr) return NextResponse.json({ error: "Could not save the document" }, { status: 500 });

  // Notify the agent (best-effort).
  try {
    const { data: agent } = await admin.from("agents").select("email").eq("id", tx.agent_id).maybeSingle();
    const { data: client } = tx.client_id
      ? await admin.from("clients").select("name").eq("id", tx.client_id).maybeSingle()
      : { data: null };
    if (agent?.email) {
      await sendAgentEmail({
        to: agent.email,
        subject: `New document from ${client?.name ?? "your buyer"}`,
        html: `<p style="font-family:system-ui,sans-serif">${esc(
          client?.name ?? "Your buyer"
        )} uploaded <strong>${esc(display)}</strong>${tx.address ? ` for ${esc(tx.address)}` : ""}.</p>
        <p style="font-family:system-ui,sans-serif;color:#666">Open your dashboard to view it.</p>`,
      });
    }
  } catch {
    /* best-effort */
  }

  return NextResponse.json({ ok: true });
}
