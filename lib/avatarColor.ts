/**
 * Contact avatar colors. When the org's avatar_style is "colorful", each
 * contact gets a STABLE color from a muted 6-color palette (derived from their
 * id, so the same person always keeps the same color but the list looks varied).
 * When "solid", returns null and callers use the default mauve.
 */
export type AvatarStyle = "solid" | "colorful";

/**
 * The muted dark palette, good on the dark themes (Mulberry Noir + the dark
 * Butler themes). Butler Linen remaps these indices to a lighter, airier set in
 * app/globals.css (`.theme-butler-linen .av-chip.av-cN`), since the dark colors
 * read heavy on the light paper. The ACTUAL colors now live in CSS as
 * `.av-cN` classes so a theme can swap them; this array is kept only so
 * `avatarBg` still works for any non-themed caller.
 */
const PALETTE = ["#6c5767", "#5a6170", "#6f5a5f", "#4d6368", "#66605a", "#4a4448"];

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Stable palette index 0..N-1 for a colorful avatar, or null for the solid
 * default. The caller renders `av-c${index}`, whose color is defined per theme
 * in CSS, so Butler Linen can show a lighter set than Mulberry.
 */
export function avatarIndex(id: string, style: AvatarStyle | string | null | undefined): number | null {
  if (style !== "colorful") return null;
  return hashId(id) % PALETTE.length;
}

/** Background hex (dark palette), kept for any non-themed caller. */
export function avatarBg(id: string, style: AvatarStyle | string | null | undefined): string | null {
  const i = avatarIndex(id, style);
  return i === null ? null : PALETTE[i];
}
