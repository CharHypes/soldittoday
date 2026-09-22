/**
 * Agent Hub (dashboard) shell. Turns OFF the site-wide film-grain overlay for
 * the internal tool only ... the grain darkens/mutes the Mulberry Noir surfaces,
 * and the Agent Hub is meant to match the clean mockup. The marketing site keeps
 * its grain (this style only applies while a dashboard route is mounted).
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="agent-hub">
      <style dangerouslySetInnerHTML={{ __html: ".grain-overlay{display:none!important}" }} />
      {children}
    </div>
  );
}
