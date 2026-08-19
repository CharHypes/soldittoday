"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";

/**
 * Landing page for the login link in the auth email. The Supabase browser client
 * auto-detects the session from the URL (hash tokens or a PKCE `code`); we then
 * send the agent to the dashboard. Client-side so it works with the default
 * (uneditable) email template, which redirects with tokens in the URL hash.
 */
export default function AuthCallback() {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowser();

    async function finish() {
      // Session may already be set by detectSessionInUrl.
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/dashboard");
        return true;
      }
      // Fall back to exchanging a PKCE code if one is present.
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          router.replace("/dashboard");
          return true;
        }
      }
      return false;
    }

    let cancelled = false;
    (async () => {
      if (await finish()) return;
      // Give detectSessionInUrl a moment, then check once more.
      setTimeout(async () => {
        if (cancelled) return;
        if (!(await finish())) {
          setErr("We could not finish signing you in. Please request a new login link.");
        }
      }, 900);
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="grid min-h-screen place-items-center bg-mulberry-radial px-6 text-center">
      <div>
        {err ? (
          <>
            <p className="text-pearl">{err}</p>
            <a href="/dashboard/login" className="btn-aurora mt-6 inline-flex">Back to login</a>
          </>
        ) : (
          <p className="text-dusty">Signing you in...</p>
        )}
      </div>
    </main>
  );
}
