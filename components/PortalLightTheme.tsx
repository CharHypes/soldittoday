/*
 * Client portals default to LIGHT for best readability (many clients find dark
 * mode hard to read). This runs before paint and only sets light when the
 * visitor has NOT explicitly chosen a theme ... an explicit toggle choice
 * (saved in localStorage by ThemeToggle) always wins, so a client who switches
 * to dark stays in dark. The main marketing site keeps its brand-dark default;
 * only the pages that render this component start light.
 *
 * Must stay a blocking inline script placed at the very top of the page tree so
 * it executes right after the layout's theme script and before body content
 * paints ... otherwise a dark frame would flash first.
 */
const script = `(function(){try{if(localStorage.getItem('sit-theme')===null){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`;

export default function PortalLightTheme() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
