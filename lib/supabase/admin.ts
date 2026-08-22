import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the SERVICE-ROLE key.
 *
 * Used strictly for portal operations that must bypass RLS in a controlled,
 * token-verified way ... a buyer uploading or downloading a document without a
 * login ... and for agent-side storage writes. The key is server-only
 * (SUPABASE_SERVICE_ROLE_KEY, never NEXT_PUBLIC), so this file must NEVER be
 * imported into a client component.
 *
 * Returns null when the key is not configured, so callers degrade gracefully
 * (the document feature stays dark until the key is added in Vercel) instead of
 * crashing.
 */
export function createAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** True when document storage is configured (service-role key present). */
export const DOCS_ENABLED = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Private bucket that holds all portal documents. */
export const PORTAL_DOCS_BUCKET = "portal-docs";
