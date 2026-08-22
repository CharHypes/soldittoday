import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { createAdminClient, PORTAL_DOCS_BUCKET } from "@/lib/supabase/admin";

/**
 * Agent downloads any document on one of their transactions (buyer uploads
 * included). The RLS-scoped select through the authenticated agent's client is
 * the authorization check ... it only returns the row if the agent owns it ...
 * then the service-role client signs a short-lived URL.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createSupabaseServer();
  const { data: doc } = await supabase
    .from("documents")
    .select("storage_path")
    .eq("id", params.id)
    .maybeSingle();
  if (!doc?.storage_path) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Not available" }, { status: 503 });

  const { data: signed, error } = await admin.storage
    .from(PORTAL_DOCS_BUCKET)
    .createSignedUrl(doc.storage_path, 120);
  if (error || !signed?.signedUrl) {
    return NextResponse.json({ error: "Could not open file" }, { status: 500 });
  }
  return NextResponse.redirect(signed.signedUrl);
}
