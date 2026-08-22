"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Message box on the buyer portal. Posts to the tokenized notes endpoint (no
 * login) and refreshes so the new message appears in the thread. The agent is
 * emailed server-side.
 */
export default function BuyerReply({ token }: { token: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function send() {
    const text = body.trim();
    if (!text || sending) return;
    setSending(true);
    setErr(null);
    try {
      const res = await fetch(`/api/buyer/${token}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j.error || "Could not send. Please try again.");
        return;
      }
      setBody("");
      router.refresh();
    } catch {
      setErr("Could not send. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-4">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Send Charlotte a message..."
        className="w-full rounded-xl border border-dusty/25 bg-plum/40 px-3.5 py-2.5 text-pearl outline-none transition-colors focus:border-auroraMauve/60"
      />
      <div className="mt-2 flex items-center justify-between">
        {err ? <p className="text-xs text-red-400">{err}</p> : <span />}
        <button
          type="button"
          onClick={send}
          disabled={sending || !body.trim()}
          className="btn-aurora !px-4 !py-2 text-sm disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send message"}
        </button>
      </div>
    </div>
  );
}
