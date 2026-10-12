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
import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";
// Back-office design system (bo- prefixed). Scoped to the dashboard only ... never
// imported on the marketing site / client portal. See Shared-Projects/agent-hub-typography.
import "./backoffice.css";
import "./deal.css";

// The three back-office faces. Exposed as the tokens backoffice.css reads
// (--font-sans / --font-display / --font-mono), so the display exception
// (the property address in Fraunces) stays a single token.
const fraunces = Fraunces({ subsets: ["latin"], weight: ["500"], variable: "--font-display", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-sans", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

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
      <style dangerouslySetInnerHTML={{ __html:
        ".grain-overlay{display:none!important}html{scrollbar-gutter:stable}" +
        ".bo-overlay,.bo-btn{font-family:var(--bo-font)}" +
        // pending for backoffice.css: smaller person-role tag + a yes/no segmented toggle
        ".bo-person-role{font-size:9px;padding:2px 8px;letter-spacing:.06em}" +
        ".bo-seg{display:inline-flex;border:1px solid var(--bo-border);border-radius:var(--bo-r-pill);overflow:hidden;font-family:var(--bo-font)}" +
        ".bo-seg button{border:0;background:none;font:inherit;font-size:10.5px;font-weight:700;color:var(--bo-muted);padding:3px 12px;cursor:pointer}" +
        ".bo-seg button.on{background:var(--bo-accent-wash);color:var(--bo-accent)}"
      }} />
      <div className={`${fraunces.variable} ${manrope.variable} ${plexMono.variable}`}>{children}</div>
    </AgentHubShell>
  );
}
