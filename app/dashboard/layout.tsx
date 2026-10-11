/**
 * Agent Hub (dashboard) shell. Turns OFF the site-wide film-grain overlay for
 * the internal tool only ... the grain darkens/mutes the Mulberry Noir surfaces,
 * and the Agent Hub is meant to match the clean mockup. The marketing site keeps
 * its grain (this style only applies while a dashboard route is mounted).
 * Also loads the org's branding (logo) and makes it available to the header.
 */
import AgentHubShell from "@/components/dash/AgentHubShell";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getOrgContext } from "@/lib/context";
import type { Brand } from "@/components/dash/BrandContext";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let brand: Brand = { logoUrl: null, brandName: null, tagline: null };
  try {
    const supabase = createSupabaseServer();
    const { orgId } = await getOrgContext(supabase);
    if (orgId) {
      const { data: org } = await supabase
        .from("organizations")
        .select("logo_url, brand_name, tagline")
        .eq("id", orgId)
        .maybeSingle();
      if (org) brand = { logoUrl: org.logo_url ?? null, brandName: org.brand_name ?? null, tagline: org.tagline ?? null };
    }
  } catch {
    // not signed in (e.g. the login route) ... fall back to the default brand
  }

  return (
    <AgentHubShell brand={brand}>
      <style dangerouslySetInnerHTML={{ __html: ".grain-overlay{display:none!important}html{scrollbar-gutter:stable}" }} />
      {children}
    </AgentHubShell>
  );
}
