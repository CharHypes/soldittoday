import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for client components (login + auth callback).
 *
 * Uses the implicit flow so the email login link carries a self-contained token
 * in the URL. That means the link works even when opened in a different browser
 * than the one that requested it (no PKCE code-verifier tied to one browser).
 */
export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: "implicit",
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  );
}
