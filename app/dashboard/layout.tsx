/**
 * Agent Hub (dashboard) shell. Turns OFF the site-wide film-grain overlay for
 * the internal tool only ... the grain darkens/mutes the Mulberry Noir surfaces,
 * and the Agent Hub is meant to match the clean mockup. The marketing site keeps
 * its grain (this style only applies while a dashboard route is mounted).
 */
import AgentHubShell from "@/components/dash/AgentHubShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AgentHubShell>
      <style dangerouslySetInnerHTML={{ __html: ".grain-overlay{display:none!important}html{scrollbar-gutter:stable}" }} />
      {children}
    </AgentHubShell>
  );
}
