import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendAgentEmail, esc } from "@/lib/notify";

/**
 * Buyer posts a message from their portal (no login). The insert goes through
 * the security-definer RPC add_buyer_reply, which validates the token, so this
 * works with the anon client and needs no service-role key. The agent is then
 * notified by email (best-effort).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  let body: { body?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const text = (body.body ?? "").trim();
  if (!text) return NextResponse.json({ error: "Message is empty" }, { status: 400 });
  if (text.length > 4000) return NextResponse.json({ error: "Message too long" }, { status: 400 });

  const { data: ok, error } = await supabase.rpc("add_buyer_reply", {
    p_token: params.token,
    p_body: text,
  });
  if (error || ok !== true) {
    return NextResponse.json({ error: "Could not send your message." }, { status: 400 });
  }

  // Notify the agent (best-effort; never blocks the reply).
  try {
    const { data: portal } = await supabase.rpc("get_buyer_portal", { p_token: params.token });
    const agentEmail: string | undefined = portal?.agent?.email;
    const clientName: string = portal?.client?.name ?? "Your buyer";
    const address: string = portal?.transaction?.address ?? "";
    if (agentEmail) {
      await sendAgentEmail({
        to: agentEmail,
        subject: `New portal message from ${clientName}`,
        html: `<p style="font-family:system-ui,sans-serif">${esc(clientName)} sent you a message on their portal${
          address ? ` for <strong>${esc(address)}</strong>` : ""
        }:</p>
        <blockquote style="font-family:system-ui,sans-serif;border-left:3px solid #8C3A63;margin:0;padding:8px 16px;color:#333">${esc(
          text
        )}</blockquote>
        <p style="font-family:system-ui,sans-serif;color:#666">Open your dashboard to reply.</p>`,
      });
    }
  } catch {
    /* best-effort notification */
  }

  return NextResponse.json({ ok: true });
}
