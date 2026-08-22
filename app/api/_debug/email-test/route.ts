import { NextResponse } from "next/server";

/**
 * TEMPORARY diagnostic: asks Resend to send a test email and returns Resend's
 * ACTUAL response (status + body) so we can see exactly why notifications may
 * not be arriving (domain not verified, key scope, sandbox restriction, etc.).
 * Gated by a query key. Remove after diagnosing.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("k") !== "sit-diag-2026") {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_NOTIFICATION_FROM ?? "no-reply@soldittoday.com";
  const to = url.searchParams.get("to") ?? "Charlotte@soldittoday.com";

  if (!apiKey) {
    return NextResponse.json({ hasKey: false, note: "RESEND_API_KEY is not set" });
  }

  let status = 0;
  let body = "";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `Sold It Today <${from}>`,
        to: [to],
        subject: "Sold It Today email diagnostic",
        html: "<p>Diagnostic test from Sold It Today. If you received this, notifications work.</p>",
      }),
    });
    status = res.status;
    body = (await res.text()).slice(0, 1000);
  } catch (e) {
    return NextResponse.json({ hasKey: true, from, to, threw: String(e) });
  }

  return NextResponse.json({ hasKey: true, from, to, resendStatus: status, resendBody: body });
}
