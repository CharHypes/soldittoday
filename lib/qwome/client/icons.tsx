/**
 * QWOME™ category icons ... Sold It Today's client presentation.
 *
 * These outline/line icons are PRESENTATION, owned by this client, not by QWOME
 * core. The core (lib/qwome/preferences) knows category ids, capabilities, and
 * relationships; it says nothing about how they look. A different QWOME client
 * (QWOME.com, a widget, a partner) ships its own icon set without touching core.
 *
 * One consistent style: 24x24, no fill, currentColor stroke ... so a category's
 * glyph inherits the surrounding text color in either theme.
 */
import type { QwomeCategoryId } from "../preferences";

type IconKey =
  | "hospital" | "er" | "urgentcare" | "pharmacy" | "behavioral"
  | "pencil" | "book" | "cap"
  | "cart" | "storefront" | "box" | "leaf" | "basket" | "globe"
  | "coffee" | "bag" | "dumbbell" | "tree" | "bus" | "plane"
  | "briefcase" | "people" | "pin";

// Category -> icon. International/specialty markets share the "basket" glyph;
// their label carries the distinction (a consistent, uncluttered set).
const ICON_FOR: Record<QwomeCategoryId, IconKey> = {
  hospital: "hospital", er: "er", urgentcare: "urgentcare", pharmacy: "pharmacy", behavioral: "behavioral",
  school_elem: "pencil", school_mid: "book", school_high: "cap",
  grocery: "cart", grocery_any: "storefront", grocery_warehouse: "box", grocery_organic: "leaf",
  grocery_asian: "basket", grocery_chinese: "basket", grocery_korean: "basket", grocery_japanese: "basket",
  grocery_south_asian: "basket", grocery_mideast: "basket", grocery_halal: "basket", grocery_latin: "basket",
  grocery_african_caribbean: "basket", grocery_kosher: "basket",
  dining: "coffee", shopping: "bag", gym: "dumbbell", parks: "tree", transit: "bus", airport: "plane",
  workplace: "briefcase", family: "people", custom: "pin",
};

const PATHS: Record<IconKey, React.ReactNode> = {
  hospital: (<><path d="M5 21V6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5V21" /><path d="M3 21h18" /><path d="M12 8.5v4M10 10.5h4" /></>),
  er: (<><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M12 8.5v7M8.5 12h7" /></>),
  urgentcare: (<><path d="M12 3.5l6.5 2.7v4.3c0 3.9-2.8 6.9-6.5 8.3-3.7-1.4-6.5-4.4-6.5-8.3V6.2z" /><path d="M12 9v5M9.5 11.5h5" /></>),
  pharmacy: (<><path d="M9.5 4h5v2.6l1 2V19a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V8.6l1-2z" /><path d="M12 12v4M10 14h4" /></>),
  behavioral: (<><path d="M15.5 20.5v-1.7a2 2 0 0 0-1.2-1.8A6.5 6.5 0 1 0 6 13" /><path d="M6 13v3.5a1 1 0 0 0 1 1h1.5v3" /></>),
  pencil: (<><path d="M4 20l1-4 10-10 3 3-10 10z" /><path d="M13.5 6.5l3 3" /></>),
  book: (<><path d="M4 5.5C6 4.5 9 4.5 12 6c3-1.5 6-1.5 8 0v12c-2-1.2-5-1.2-8 0-3-1.2-6-1.2-8 0z" /><path d="M12 6v12" /></>),
  cap: (<><path d="M3 9l9-4 9 4-9 4z" /><path d="M7 11v4.4c0 1.1 2.2 2 5 2s5-.9 5-2V11" /></>),
  cart: (<><circle cx="9.5" cy="19.5" r="1.3" /><circle cx="17" cy="19.5" r="1.3" /><path d="M3 4h2l2.2 11.3a1.4 1.4 0 0 0 1.4 1.1h8.1a1.4 1.4 0 0 0 1.4-1.1L20.5 8H6" /></>),
  storefront: (<><path d="M4.5 9.8V20h15V9.8" /><path d="M3 9.5 4.5 5h15L21 9.5a2.4 2.4 0 0 1-4.5 0 2.4 2.4 0 0 1-4.5 0 2.4 2.4 0 0 1-4.5 0 2.4 2.4 0 0 1-4.5 0z" /><path d="M9.5 20v-4.5h5V20" /></>),
  box: (<><path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" /><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" /></>),
  leaf: (<><path d="M5 19c0-8 6-13 14-13 0 8-5 14-13 14-.6 0-1-.4-1-1z" /><path d="M6.5 17.5C9.5 14 12.5 12 16 10.5" /></>),
  basket: (<><path d="M5.5 9.5h13l-1.1 8.6a1.5 1.5 0 0 1-1.5 1.3H8.1a1.5 1.5 0 0 1-1.5-1.3z" /><path d="M4 9.5h16M9 6l3-2 3 2M9.7 12.8v3.4M14.3 12.8v3.4" /></>),
  globe: (<><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17" /></>),
  coffee: (<><path d="M5 8h11v4.5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" /><path d="M16 9h2.4a2 2 0 0 1 0 4H16" /><path d="M7 4v1.6M10 4v1.6M13 4v1.6" /></>),
  bag: (<><path d="M6 8h12l-1 12H7z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>),
  dumbbell: (<><path d="M6.5 9v6M4 10.2v3.6M17.5 9v6M20 10.2v3.6M6.5 12h11" /></>),
  tree: (<><path d="M12 3l5 7h-3l3 5H7l3-5H7z" /><path d="M12 15v6" /></>),
  bus: (<><rect x="4" y="4" width="16" height="12" rx="2" /><path d="M4 11h16" /><circle cx="8" cy="19" r="1.3" /><circle cx="16" cy="19" r="1.3" /><path d="M6.5 16v1M17.5 16v1" /></>),
  plane: (<><path d="M21 4 3 11l6 2.5z" /><path d="M9 13.5 21 4l-8 16-2.5-6z" /></>),
  briefcase: (<><rect x="3.5" y="8" width="17" height="11" rx="1.5" /><path d="M9 8V6.5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2V8M3.5 13h17" /></>),
  people: (<><circle cx="8.5" cy="8" r="2.5" /><circle cx="16" cy="9" r="2" /><path d="M4 19v-1a4.5 4.5 0 0 1 9 0v1M14.5 19v-.6a4 4 0 0 1 5.5-3.7" /></>),
  pin: (<><path d="M12 21s6-5.3 6-10a6 6 0 0 0-12 0c0 4.7 6 10 6 10z" /><circle cx="12" cy="11" r="2.2" /></>),
};

function Svg({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "h-5 w-5"}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** Outline icon for a QWOME category. */
export function QwomeIcon({ name, className }: { name: QwomeCategoryId; className?: string }) {
  return <Svg className={className}>{PATHS[ICON_FOR[name]]}</Svg>;
}

/** Icon for an expandable sub-section header (International & Specialty Markets). */
export function QwomeSubgroupIcon({ className }: { className?: string }) {
  return <Svg className={className}>{PATHS.globe}</Svg>;
}
