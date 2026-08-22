import { NextResponse } from "next/server";
import { createAdminClient, PORTAL_DOCS_BUCKET } from "@/lib/supabase/admin";

/**
 * Buyer downloads a document from their portal (no login). We verify the doc
 * belongs to the transaction that owns this token AND that it is theirs to see
 * (shared by the agent, or uploaded by the buyer), then hand back a short-lived
 * signed URL. Private bucket + signed URLs keep sensitive files from leaking.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { token: string; id: string } }
) {
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Not available" }, { status: 503 });

  const { data: doc } = await admin
    .from("documents")
    .select("storage_path, client_visible, uploaded_by, transactions!inner(portal_token)")
    .eq("id", params.id)
    .maybeSingle();

  const tokenOnDoc = (doc as { transactions?: { portal_token?: string } } | null)?.transactions?.portal_token;
  const visible = doc?.client_visible === true || doc?.uploaded_by === "buyer";
  if (!doc || !doc.storage_path || tokenOnDoc !== params.token || !visible) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: signed, error } = await admin.storage
    .from(PORTAL_DOCS_BUCKET)
    .createSignedUrl(doc.storage_path, 120);
  if (error || !signed?.signedUrl) {
    return NextResponse.json({ error: "Could not open file" }, { status: 500 });
  }
  return NextResponse.redirect(signed.signedUrl);
}
