"use client";

import Link from "next/link";
import { useState } from "react";
import type { DashDeal } from "@/lib/deals";

export type { DashDeal } from "@/lib/deals";

export type DashStats = {
  under: number;
  active: number;
  volumeText: string;
  nextCloseText: string;
  nextCloseAddr: string;
};

export type FilterDef = { label: string; kinds: DashDeal["statusKind"][] };
type View = "tiles" | "list";

const DEFAULT_FILTERS: FilterDef[] = [
  { label: "In motion", kinds: ["under", "active"] },
  { label: "Under contract", kinds: ["under"] },
  { label: "Active listings", kinds: ["active"] },
  { label: "All", kinds: ["under", "active", "closed", "other"] },
];

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
  under: "bg-[#e3b19f] text-[#2a1518]",
  active: "bg-[#2f9e6e] text-white",
  closed: "bg-[#6b6469] text-white",
  other: "bg-[#6b6469] text-white",
};

export default function DashboardDeals({
  deals,
  stats = null,
  title = "Dashboard",
  subtitle = "Everything in motion ... the deals that need you right now.",
  action,
  secondaryAction,
  actionSlot,
  filters,
  hideFilters = false,
  showTicker = false,
}: {
  deals: DashDeal[];
  stats?: DashStats | null;
  title?: string;
  subtitle?: string;
  action?: { href: string; label: string };
  secondaryAction?: { href: string; label: string };
  actionSlot?: React.ReactNode;
  filters?: FilterDef[];
  hideFilters?: boolean;
  showTicker?: boolean;
}) {
  const fils = filters ?? DEFAULT_FILTERS;
  const [fi, setFi] = useState(0);
  const [view, setView] = useState<View>("tiles");
  const list = view === "list";
  const shown = deals.filter((d) => fils[fi].kinds.includes(d.statusKind));

  return (
    <>
      {showTicker && (
        <style>{`
          @keyframes ahtick { from { transform: translateX(0) } to { transform: translateX(-50%) } }
          .ahtrack { animation: ahtick 42s linear infinite; }
          .ahticker:hover .ahtrack { animation-play-state: paused; }
          @media (prefers-reduced-motion: reduce) { .ahtrack { animation: none } }
          @keyframes ahblink { 0%,100%{opacity:.3} 50%{opacity:.95} }
        `}</style>
      )}

      {/* header + controls */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium text-pearl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-dusty">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {!hideFilters && (
            <Seg>
              {fils.map((f, i) => (
                <button key={f.label} onClick={() => setFi(i)} className={segBtn(fi === i)}>{f.label}</button>
              ))}
            </Seg>
          )}
          <Seg>
            <button onClick={() => setView("tiles")} className={segBtn(!list)} aria-label="Tiles"><GridIcon /> Tiles</button>
            <button onClick={() => setView("list")} className={segBtn(list)} aria-label="List"><ListIcon /> List</button>
          </Seg>
          {secondaryAction && (
            <Link href={secondaryAction.href} className="rounded-xl border border-dusty/25 bg-bruised/40 px-3.5 py-1.5 text-sm text-dusty transition hover:border-mauve/50 hover:text-pearl">{secondaryAction.label}</Link>
          )}
          {action && <Link href={action.href} className="btn-mauve text-sm">{action.label}</Link>}
          {actionSlot}
        </div>
      </div>

      {showTicker && (
        <div className="ahticker mt-5 flex items-stretch overflow-hidden rounded-xl2 border border-dusty/15 bg-bruised shadow-sm">
          <div className="flex flex-none items-center gap-2 bg-mauve px-4 text-[11px] font-bold uppercase tracking-wider text-plum">
            <span className="h-1.5 w-1.5 rounded-full bg-plum" style={{ animation: "ahblink 1.6s ease-in-out infinite" }} /> Today
          </div>
          <div className="relative flex-1 overflow-hidden">
            <div className="ahtrack inline-flex whitespace-nowrap py-2.5">
              {[0, 1].map((dup) => (
                <span key={dup} className="inline-flex">
                  {TICKER.map((t, i) => (
                    <span key={i} className="px-7 text-[13px] text-pearl/80"><b className="font-semibold text-mauve">{t.k}</b> {t.v}</span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {stats && (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Tile k="Under contract" v={String(stats.under)} d={stats.under ? "in progress" : "nothing pending"} />
          <Tile k="Active listings" v={String(stats.active)} d={stats.active ? "on the market" : "none active"} />
          <Tile k="Volume in motion" v={stats.volumeText} d={`across ${stats.under + stats.active} deal${stats.under + stats.active === 1 ? "" : "s"}`} />
          <Tile k="Next closing" v={stats.nextCloseText} d={stats.nextCloseAddr} />
        </div>
      )}

      {shown.length === 0 ? (
        <div className="mt-6 rounded-xl2 border border-dusty/15 bg-bruised/40 p-10 text-center text-dusty">
          Nothing here right now.
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

function Photo({ d, h, overlays = true }: { d: DashDeal; h: string; overlays?: boolean }) {
  const [a, b] = tintFor(d.id);
  return (
    <div className={`relative ${h} overflow-hidden`} style={d.photoUrl ? undefined : { backgroundImage: `linear-gradient(135deg, ${a}, ${b})` }}>
      {d.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={d.photoUrl} alt={d.address} className="h-full w-full object-cover" />
      ) : (
        <div className="grid h-full w-full place-items-center text-white/50"><HouseIcon /></div>
      )}
      {overlays && (
        <>
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide backdrop-blur ${PILL[d.statusKind]}`}>{d.statusLabel}</span>
          {d.agentName && (
            <span title={`${d.agentName} is on this deal`} className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-plum/70 text-[10px] font-bold text-pearl ring-1 ring-white/25 backdrop-blur">{d.agentInitials}</span>
          )}
        </>
      )}
    </div>
  );
}

function StatusChip({ d }: { d: DashDeal }) {
  return <span className={`inline-block rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide ${PILL[d.statusKind]}`}>{d.statusLabel}</span>;
}

function ClientChip({ d, size }: { d: DashDeal; size: "tile" | "list" }) {
  const av = size === "tile" ? "h-[26px] w-[26px] text-[10.5px]" : "h-6 w-6 text-[9.5px]";
  const nameCls = size === "tile" ? "text-[13px] text-pearl/80" : "hidden truncate text-[12.5px] text-pearl/80 sm:inline";
  const avatar = <span className={`grid ${av} place-items-center rounded-full bg-mauve font-bold text-plum`}>{d.clientInitials}</span>;
  const name = <span className={nameCls}>{d.clientName ?? (d.clientPersonId ? "Contact" : size === "tile" ? "No client yet" : "No client")}</span>;
  if (d.clientPersonId) {
    return (
      <Link href={`/dashboard/contacts?id=${d.clientPersonId}`} className="relative z-10 flex items-center gap-2 hover:underline" title="Open contact card">
        {avatar}{name}
      </Link>
    );
  }
  return <span className="flex items-center gap-2">{avatar}{name}</span>;
}

function TileCard({ d }: { d: DashDeal }) {
  return (
    <article className="aurora-ring group relative block overflow-hidden rounded-[18px] border border-dusty/12 bg-bruised">
      <Link href={d.href} aria-label={`Open ${d.address}`} className="absolute inset-0" />
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
            <div className="h-[5px] overflow-hidden rounded-full bg-raise">
              <span className="block h-full bg-gradient-to-r from-wine to-gold" style={{ width: `${d.progressPct}%` }} />
            </div>
            <div className="mt-1.5 flex justify-between text-[11.5px] text-dusty">
              <span>{d.stageText}</span>
              {d.stageCount && <b className="font-semibold text-pearl/80">{d.stageCount}</b>}
            </div>
          </div>
        )}
        <div className="mt-3 flex items-center gap-2 border-t border-dusty/10 pt-3">
          <ClientChip d={d} size="tile" />
        </div>
      </div>
    </article>
  );
}

function ListRow({ d }: { d: DashDeal }) {
  return (
    <article className="aurora-ring relative flex items-stretch overflow-hidden rounded-xl2 border border-dusty/12 bg-bruised">
      <Link href={d.href} aria-label={`Open ${d.address}`} className="absolute inset-0" />
      <div className="w-[116px] flex-none"><Photo d={d} h="h-full min-h-[96px]" overlays={false} /></div>
      <div className="grid flex-1 items-center gap-4 p-[12px_18px] md:grid-cols-[minmax(0,1.9fr)_0.9fr_1.2fr_1.1fr]">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <StatusChip d={d} />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-mauve">{d.side}</span>
          </div>
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
              <div className="h-[5px] overflow-hidden rounded-full bg-raise">
                <span className="block h-full bg-gradient-to-r from-wine to-gold" style={{ width: `${d.progressPct}%` }} />
              </div>
              <div className="mt-1 flex justify-between text-[11px] text-dusty"><span className="truncate">{d.stageText}</span><b className="font-semibold text-pearl/80">{d.stageCount}</b></div>
            </>
          ) : (
            <span className="text-[12px] text-dusty">{d.metaText}</span>
          )}
        </div>
        <div className="flex items-center justify-end gap-2">
          <ClientChip d={d} size="list" />
          {d.agentName && (
            <span title={`${d.agentName} is on this deal`} className="ml-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-plum/70 text-[9px] font-bold text-pearl ring-1 ring-dusty/25">{d.agentInitials}</span>
          )}
        </div>
      </div>
    </article>
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
  `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] transition ${on ? "bg-raise font-semibold text-pearl shadow-sm" : "text-dusty hover:text-pearl"}`;

function GridIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-[15px] w-[15px]"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>; }
function ListIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-[15px] w-[15px]"><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" strokeLinecap="round"/></svg>; }
function HouseIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} className="h-11 w-11"><path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
