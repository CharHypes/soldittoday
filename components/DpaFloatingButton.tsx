"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/*
 * Floating "Down Payment Assistance" call-to-action.
 *
 * Sits in the bottom-right corner site-wide and links to the /dpa hub, so a
 * buyer on any page can discover the programs. Uses the brand's dark plum +
 * rose gold so it reads on both the light and dark themes. Hidden on the /dpa
 * pages themselves (redundant there), and dismissible (remembered per browser).
 */

const DISMISS_KEY = "sit-dpa-cta-dismissed";

export default function DpaFloatingButton() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Hide on the DPA pages themselves and on private app surfaces
    // (client seller portals, the agent dashboard, and auth screens).
    if (
      pathname?.startsWith("/dpa") ||
      pathname?.startsWith("/seller") ||
      pathname?.startsWith("/buyer") ||
      pathname?.startsWith("/dashboard") ||
      pathname?.startsWith("/auth")
    ) {
      setShow(false);
      return;
    }
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      dismissed = false;
    }
    setShow(!dismissed);
  }, [pathname]);

  if (!show) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        right: "16px",
        bottom: "16px",
        zIndex: 60,
        fontFamily: "var(--font-poppins), system-ui, sans-serif",
      }}
    >
      <a
        href="/dpa"
        aria-label="Down payment assistance programs. See if you qualify."
        className="sit-dpa-fab"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          maxWidth: "320px",
          padding: "13px 17px",
          borderRadius: "14px",
          textDecoration: "none",
          background: "linear-gradient(155deg, #5A2E48, #2A1B28)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/logos/sold-it-today/Sold-It-Today-key-only-crisp-transparent.png"
          alt=""
          aria-hidden="true"
          style={{ flex: "none", height: "38px", width: "auto", display: "block" }}
        />
        <span style={{ lineHeight: 1.3 }}>
          <span style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#F3EAEC", whiteSpace: "nowrap" }}>
            Down Payment Assistance
          </span>
          <span style={{ display: "block", fontSize: "11px", color: "#E0B8AB", marginTop: "2px", whiteSpace: "nowrap" }}>
            First-time buyer? See if you qualify &rarr;
          </span>
        </span>
      </a>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        style={{
          position: "absolute",
          top: "-8px",
          right: "-8px",
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          background: "#2A1B28",
          border: "1px solid #8C3A63",
          color: "#E0B8AB",
          fontSize: "13px",
          lineHeight: 1,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        &times;
      </button>
    </div>
  );
}
