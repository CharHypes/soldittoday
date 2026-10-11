import type { SupabaseClient } from "@supabase/supabase-js";

export type PersonMatch = { id: string; source_client_id: string | null };

const digitsOf = (v: string | null | undefined) => (v ?? "").replace(/\D/g, "");

/**
 * Find an EXISTING contact that confidently matches the entered details, so we
 * reuse it instead of creating a duplicate. Conservative on purpose ... we only
 * auto-match on a strong, unambiguous signal (exact email, exact phone, or a
 * single exact full-name match) so we never silently merge two different people.
 * Returns null when there's no match, or when it's ambiguous (2+ candidates).
 * Scoped by the caller's RLS session to their active org.
 */
export async function findMatchingPerson(
  supabase: SupabaseClient,
  orgId: string,
  input: { name?: string | null; email?: string | null; phone?: string | null }
): Promise<PersonMatch | null> {
  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim();
  const digits = digitsOf(input.phone);

  // 1) exact email (strongest)
  if (email) {
    const { data } = await supabase
      .from("people")
      .select("id, source_client_id, email")
      .ilike("email", email)
      .limit(3);
    const hits = (data ?? []).filter((p: any) => (p.email ?? "").trim().toLowerCase() === email.toLowerCase());
    if (hits.length === 1) return { id: hits[0].id, source_client_id: hits[0].source_client_id ?? null };
    if (hits.length > 1) return null; // ambiguous
  }

  // 2) exact phone (compare on digits; last 10 to ignore country code)
  if (digits.length >= 10) {
    const tail = digits.slice(-10);
    const { data } = await supabase.from("people").select("id, source_client_id, phone");
    const hits = (data ?? []).filter((p: any) => {
      const d = digitsOf(p.phone);
      return d.length >= 10 && d.slice(-10) === tail;
    });
    if (hits.length === 1) return { id: hits[0].id, source_client_id: hits[0].source_client_id ?? null };
    if (hits.length > 1) return null;
  }

  // 3) single exact full-name match (only when unambiguous)
  if (name) {
    const { data } = await supabase.from("people").select("id, source_client_id, display_name").limit(50);
    const hits = (data ?? []).filter((p: any) => (p.display_name ?? "").trim().toLowerCase() === name.toLowerCase());
    if (hits.length === 1) return { id: hits[0].id, source_client_id: hits[0].source_client_id ?? null };
  }

  return null;
}
