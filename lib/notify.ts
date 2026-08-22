/**
 * Minimal transactional-email helper built on Resend, mirroring the pattern in
 * app/api/dpa-lead/route.ts. Email is best-effort: a missing key or a provider
 * error is logged, never thrown, so it can't break the action that triggered it.
 */

// soldittoday.com is verified in Resend, so send from the domain by default ...
// Resend's shared onboarding@resend.dev gets junked/dropped by Outlook.
const NOTIFY_FROM = process.env.LEAD_NOTIFICATION_FROM ?? "no-reply@soldittoday.com";

export async function sendAgentEmail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !opts.to) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Sold It Today <${NOTIFY_FROM}>`,
        to: [opts.to],
        reply_to: opts.replyTo,
        subject: opts.subject,
        html: opts.html,
      }),
    });
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error("[notify] send failed:", res.status, await res.text());
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[notify] send threw:", err);
  }
}

/** Escapes user-provided text for safe inclusion in a notification email. */
export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
