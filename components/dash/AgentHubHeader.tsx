"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "@/app/dashboard/actions";

/** The Agent Hub top bar: logo, tabs, settings, theme toggle, New Transaction. */
export default function AgentHubHeader() {
  const pathname = usePathname() || "";
  const is = (p: string, exact = false) => (exact ? pathname === p : pathname.startsWith(p));

  return (
    <header className="sticky top-0 z-30 border-b border-dusty/12 bg-[rgb(26,21,24)]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-5 px-6">
        {/* brand */}
        <Link href="/dashboard/contacts" className="flex shrink-0 items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logos/optimized/sold-it-today-400w.png" alt="Sold It Today" className="h-6 w-auto" />
          <span className="hidden border-l border-dusty/20 pl-3 font-serif text-sm text-dusty sm:inline">Agent Hub</span>
        </Link>

        {/* tabs */}
        <nav className="ml-2 hidden items-center gap-1 md:flex">
          <Tab href="/dashboard/contacts" active={is("/dashboard/contacts")}>Contacts</Tab>
          <Tab href="/dashboard/buyers/new" active={is("/dashboard/buyers/new")}>New Transaction</Tab>
          <Tab href="/dashboard" active={is("/dashboard", true) || is("/dashboard/listings")}>Listings</Tab>
          <span className="cursor-default rounded-lg px-3 py-2 text-sm text-dusty/40" title="Coming soon">Leads</span>
        </nav>

        <div className="flex-1" />

        {/* actions */}
        <ThemeToggle />
        <Link
          href="/dashboard/settings"
          aria-label="Settings"
          className="grid h-9 w-9 place-items-center rounded-lg border border-dusty/20 text-dusty transition-colors hover:border-auroraMauve/50 hover:text-pearl"
        >
          <GearIcon />
        </Link>
        <Link href="/dashboard/buyers/new" className="btn-mauve text-sm">
          <PlusIcon /> New Transaction
        </Link>
        <form action={signOut}>
          <button type="submit" className="ml-1 hidden text-xs text-dusty transition-colors hover:text-pearl sm:block">
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}

function Tab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-sm transition-colors ${
        active ? "bg-bruised/70 font-medium text-pearl" : "text-dusty hover:text-pearl"
      }`}
    >
      {children}
    </Link>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("agenthub-theme");
    } catch {}
    const isDark = saved ? saved === "dark" : true;
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    try {
      localStorage.setItem("agenthub-theme", next ? "dark" : "light");
    } catch {}
  };
  return (
    <button
      onClick={toggle}
      aria-label="Toggle light and dark"
      className="grid h-9 w-9 place-items-center rounded-lg border border-dusty/20 text-dusty transition-colors hover:border-auroraMauve/50 hover:text-pearl"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-[18px] w-[18px]">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-[18px] w-[18px]">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-[18px] w-[18px]">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
