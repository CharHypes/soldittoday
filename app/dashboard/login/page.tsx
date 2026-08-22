"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-xl border border-dusty/25 bg-plum/60 px-4 py-3 text-pearl outline-none transition-colors focus:border-auroraMauve/60";

export default function DashboardLogin() {
  const supabase = createSupabaseBrowser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"email" | "code">("email");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendCode(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setMsg(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) setErr(error.message);
    else {
      setStage("code");
      setMsg(`We emailed a 6-digit code to ${email}.`);
    }
  }

  async function verify(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const token = code.trim();
    // Try the magic-link OTP type first, then the signup type (new users).
    let error = (await supabase.auth.verifyOtp({ email, token, type: "email" })).error;
    if (error) error = (await supabase.auth.verifyOtp({ email, token, type: "signup" })).error;
    setLoading(false);
    if (error) setErr(error.message);
    else router.replace("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-mulberry-radial px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-pearl">
            Sold It Today
          </div>
          <div className="mt-1 text-xs text-dusty">Agent Dashboard</div>
        </div>

        {stage === "email" ? (
          <form onSubmit={sendCode} className="space-y-4">
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
              {loading ? "Sending..." : "Email me a 6-digit code"}
            </button>
          </form>
        ) : (
          <form onSubmit={verify} className="space-y-4">
            <label className="block text-sm text-dusty">
              6-digit code
              <input
                inputMode="numeric"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className={`mt-1.5 tracking-[0.4em] ${inputClass}`}
                autoComplete="one-time-code"
              />
            </label>
            <button type="submit" disabled={loading} className="btn-aurora w-full justify-center disabled:opacity-60">
              {loading ? "Verifying..." : "Sign in"}
            </button>
            <button
              type="button"
              onClick={() => { setStage("email"); setCode(""); setErr(null); setMsg(null); }}
              className="w-full text-center text-xs text-dusty hover:text-pearl"
            >
              Use a different email
            </button>
          </form>
        )}

        {msg && <p className="mt-4 text-center text-sm text-pearl/80">{msg}</p>}
        {err && <p className="mt-4 text-center text-sm text-rose-300">{err}</p>}
      </div>
    </main>
  );
}
