"use client";

import { useState, type FormEvent } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-xl border border-dusty/25 bg-plum/60 px-4 py-3 text-pearl outline-none transition-colors focus:border-auroraMauve/60";

export default function DashboardLogin() {
  const supabase = createSupabaseBrowser();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function send(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) setErr(error.message);
    else setSent(true);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-mulberry-radial px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-pearl">Sold It Today</div>
          <div className="mt-1 text-xs text-dusty">Agent Dashboard</div>
        </div>

        {sent ? (
          <div className="rounded-xl2 border border-auroraMauve/25 bg-plum/50 p-6 text-center">
            <p className="text-pearl">Check your email.</p>
            <p className="mt-2 text-sm text-dusty">
              We sent a login link to <b className="text-pearl">{email}</b>. Open it and click the link (it may say
              &ldquo;Confirm email address&rdquo;) to sign in.
            </p>
            <button
              type="button"
              onClick={() => { setSent(false); setErr(null); }}
              className="mt-5 text-xs text-dusty hover:text-pearl"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={send} className="space-y-4">
            <label className="block text-sm text-dusty">
              Your email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@soldittoday.com"
                className={`mt-1.5 ${inputClass}`}
                autoComplete="email"
              />
            </label>
            <button type="submit" disabled={loading} className="btn-aurora w-full justify-center disabled:opacity-60">
              {loading ? "Sending..." : "Email me a login link"}
            </button>
          </form>
        )}

        {err && <p className="mt-4 text-center text-sm text-rose-300">{err}</p>}
      </div>
    </main>
  );
}
