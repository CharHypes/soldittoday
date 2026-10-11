"use client";

import Link from "next/link";
import { useState } from "react";

export type DashDeal = {
  kind: "transaction" | "listing";
  id: string;
  href: string;
  photoUrl: string | null;
  address: string;
  cityLine: string;
  side: "Buyer side" | "Seller side";
  statusLabel: string;
  statusKind: "under" | "active" | "closed" | "other";
  priceText: string;
  metaText: string;
  clientName: string | null;
  clientInitials: string;
  agentName: string | null;
  agentInitials: string;
  progressPct: number | null;
  stageText: string | null;
  stageCount: string | null;
};

export type DashStats = {
  under: number;
  active: number;
  volumeText: string;
  nextCloseText: string;
  nextCloseAddr: string;
};

type Filter = "motion" | "under" | "active" | "all";
type View = "tiles" | "list";

const SHOW: Record<Filter, DashDeal["statusKind"][]> = {
  motion: ["under", "active"],
  under: ["under"],
  active: ["active"],
  all: ["under", "active", "closed", "other"],
};

// muted placeholder tints (deterministic per deal) for when there's no photo yet
const TINTS: [string, string][] = [
  ["#6c5767", "#2a1f28"], ["#5a6170", "#241f2a"], ["#6f5a5f", "#2a1f24"],
  ["#4d6368", "#1f262a"], ["#66605a", "#272320"], ["#4a4448", "#211d20"],
];
function tintFor(id: string): [string, string] {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return TINTS[h % TINTS.length];
}

const PILL: Record<string, string> = {
  under: "bg-gold/95 text-[#2a1518]",
  active: "bg-green/90 text-[#09231a]",
  closed: "bg-[#786e72] text-white",
  other: "bg-[#786e72] text-white",
};

export default function DashboardDeals({ deals, stats }: { deals: DashDeal[]; stats: DashStats }) {
  const [filter, setFilter] = useState<Filter>("motion");
  const [view, setView] = useState<View>("tiles");

  const allow = SHOW[filter];
  const shown = deals.filter((d) => allow.includes(d.statusKind));
  const list = view === "list";

  return (
    <>
      <style>{`
        @keyframes ahtick { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .ahtrack { animation: ahtick 42s linear infinite; }
        .ahticker:hover .ahtrack { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .ahtrack { animation: none } }
        @keyframes ahblink { 0%,100%{opacity:.3} 50%{opacity:.95} }
      `}</style>

      {/* header + controls */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium text-pearl">Dashboard</h1>
          <p className="mt-1 text-sm text-dusty">Everything in motion ... the deals that need you right now.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Seg>
            {(["motion", "under", "active", "all"] as Filter[]).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={segBtn(filter === f)}>
                {f === "motion" ? "In motion" : f === "under" ? "Under contract" : f === "active" ? "Active listings" : "All"}
              </button>
            ))}
          </Seg>
          <Seg>
            <button onClick={() => setView("tiles")} className={segBtn(!list)} aria-label="Tiles">
              <GridIcon /> Tiles
            </button>
            <button onClick={() => setView("list")} className={segBtn(list)} aria-label="List">
              <ListIcon /> List
            </button>
          </Seg>
        </div>
      </div>

      {/* ticker (below filters) */}
      <div className="ahticker mt-5 flex items-stretch overflow-hidden rounded-xl2 border border-dusty/15 bg-bruised shadow-sm">
        <div className="flex flex-none items-center gap-2 bg-mauve px-4 text-[11px] font-bold uppercase tracking-wider text-plum">
          <span className="h-1.5 w-1.5 rounded-full bg-plum" style={{ animation: "ahblink 1.6s ease-in-out infinite" }} /> Today
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="ahtrack inline-flex whitespace-nowrap py-2.5">
            {[0, 1].map((dup) => (
              <span key={dup} className="inline-flex">
                {TICKER.map((t, i) => (
                  <span key={i} className="px-7 text-[13px] text-pearl/80">
                    <b className="font-semibold text-mauve">{t.k}</b> {t.v}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* stat tiles */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Tile k="Under contract" v={String(stats.under)} d={stats.under ? "in progress" : "nothing pending"} />
        <Tile k="Active listings" v={String(stats.active)} d={stats.active ? "on the market" : "none active"} />
        <Tile k="Volume in motion" v={stats.volumeText} d={`across ${stats.under + stats.active} deal${stats.under + stats.active === 1 ? "" : "s"}`} />
        <Tile k="Next closing" v={stats.nextCloseText} d={stats.nextCloseAddr} />
      </div>

      {/* deals */}
      {shown.length === 0 ? (
        <div className="mt-6 rounded-xl2 border border-dusty/15 bg-bruised/40 p-10 text-center text-dusty">
          Nothing here right now. Start a transaction or add a listing to see it on your dashboard.
        </div>
      ) : (
        <div className={list ? "mt-6 flex flex-col gap-2.5 pb-16" : "mt-6 grid gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3"}>
          {shown.map((d) => (list ? <ListRow key={`${d.kind}-${d.id}`} d={d} /> : <TileCard key={`${d.kind}-${d.id}`} d={d} />))}
        </div>
      )}
    </>
  );
}

const TICKER: { k: string; v: string }[] = [
  { k: "Reminder", v: "your ticker content will go here (closings, leads, birthdays, market notes)" },
  { k: "Tip", v: "hover to pause ... this scrolls your live updates" },
];

/* ---------- pieces ---------- */

function Photo({ d, h }: { d: DashDeal; h: string }) {
  const [a, b] = tintFor(d.id);
  return (
    <div className={`relative ${h} overflow-hidden`} style={d.photoUrl ? undefined : { backgroundImage: `linear-gradient(135deg, ${a}, ${b})` }}>
      {d.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={d.photoUrl} alt={d.address} className="h-full w-full object-cover" />
      ) : (
        <div className="grid h-full w-full place-items-center text-white/50">
          <HouseIcon />
        </div>
      )}
      <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide backdrop-blur ${PILL[d.statusKind]}`}>
        {d.statusLabel}
      </span>
      {d.agentName && (
        <span
          title={`${d.agentName} is on this deal`}
          className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-plum/70 text-[10px] font-bold text-pearl ring-1 ring-white/25 backdrop-blur"
        >
          {d.agentInitials}
        </span>
      )}
    </div>
  );
}

function TileCard({ d }: { d: DashDeal }) {
  return (
    <Link href={d.href} className="group block overflow-hidden rounded-[18px] border border-dusty/12 bg-bruised shadow-sm transition hover:-translate-y-0.5 hover:border-mauve/45">
      <Photo d={d} h="h-[170px]" />
      <div className="p-[16px_18px_18px]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-mauve">{d.side}</div>
        <h3 className="mt-1 font-serif text-xl font-medium text-pearl">{d.address}</h3>
        <div className="text-[13px] text-dusty">{d.cityLine}</div>
        <div className="mt-3 flex items-center gap-2 text-[13.5px]">
          <span className="font-bold text-pearl">{d.priceText}</span>
          {d.metaText && <><span className="text-dusty">·</span><span className="text-dusty">{d.metaText}</span></>}
        </div>
        {d.progressPct != null && (
          <div className="mt-3">
            <div className="h-[5px] overflow-hidden rounded-full bg-bruised">
              <span className="block h-full bg-gradient-to-r from-wine to-gold" style={{ width: `${d.progressPct}%` }} />
            </div>
            <div className="mt-1.5 flex justify-between text-[11.5px] text-dusty">
              <span>{d.stageText}</span>
              {d.stageCount && <b className="font-semibold text-pearl/80">{d.stageCount}</b>}
            </div>
          </div>
        )}
        <div className="mt-3 flex items-center gap-2 border-t border-dusty/10 pt-3">
          <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-mauve text-[10.5px] font-bold text-plum">{d.clientInitials}</span>
          <span className="text-[13px] text-pearl/80">{d.clientName ?? "No client yet"}</span>
        </div>
      </div>
    </Link>
  );
}

function ListRow({ d }: { d: DashDeal }) {
  return (
    <Link href={d.href} className="flex items-stretch overflow-hidden rounded-xl2 border border-dusty/12 bg-bruised shadow-sm transition hover:border-mauve/45">
      <div className="w-[120px] flex-none">
        <Photo d={d} h="h-full min-h-[86px]" />
      </div>
      <div className="grid flex-1 items-center gap-4 p-[12px_18px] md:grid-cols-[minmax(0,1.9fr)_1fr_1.3fr_1.1fr]">
        <div className="min-w-0">
          <h3 className="truncate font-serif text-[17px] font-medium text-pearl">{d.address}</h3>
          <div className="truncate text-[12.5px] text-dusty">{d.cityLine}</div>
        </div>
        <div className="hidden flex-col md:flex">
          <span className="font-bold text-pearl">{d.priceText}</span>
          <span className="text-[12px] text-dusty">{d.metaText}</span>
        </div>
        <div className="hidden min-w-0 md:block">
          {d.progressPct != null ? (
            <>
              <div className="h-[5px] overflow-hidden rounded-full bg-bruised">
                <span className="block h-full bg-gradient-to-r from-wine to-gold" style={{ width: `${d.progressPct}%` }} />
              </div>
              <div className="mt-1 flex justify-between text-[11px] text-dusty"><span className="truncate">{d.stageText}</span><b className="font-semibold text-pearl/80">{d.stageCount}</b></div>
            </>
          ) : (
            <span className="text-[12px] text-dusty">{d.metaText}</span>
          )}
        </div>
        <div className="flex items-center justify-end gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-mauve text-[9.5px] font-bold text-plum">{d.clientInitials}</span>
          <span className="hidden truncate text-[12.5px] text-pearl/80 sm:inline">{d.clientName ?? "No client"}</span>
        </div>
      </div>
    </Link>
  );
}

function Tile({ k, v, d }: { k: string; v: string; d: string }) {
  return (
    <div className="rounded-2xl border border-dusty/12 bg-bruised p-[18px_20px] shadow-sm">
      <div className="text-[11px] uppercase tracking-[0.11em] text-dusty">{k}</div>
      <div className="mt-2 font-serif text-[30px] font-medium tabular-nums text-pearl">{v}</div>
      <div className="mt-1 truncate text-[12px] text-mauve">{d}</div>
    </div>
  );
}

function Seg({ children }: { children: React.ReactNode }) {
  return <div className="inline-flex rounded-xl border border-dusty/15 bg-bruised/40 p-1">{children}</div>;
}
const segBtn = (on: boolean) =>
  `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] transition ${on ? "bg-bruised font-semibold text-pearl shadow-sm" : "text-dusty hover:text-pearl"}`;

function GridIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-[15px] w-[15px]"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>; }
function ListIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-[15px] w-[15px]"><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" strokeLinecap="round"/></svg>; }
function HouseIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} className="h-11 w-11"><path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
