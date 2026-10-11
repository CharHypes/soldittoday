/**
 * Contact avatar colors. When the org's avatar_style is "colorful", each
 * contact gets a STABLE color from a muted 6-color palette (derived from their
 * id, so the same person always keeps the same color but the list looks varied).
 * When "solid", returns null and callers use the default mauve.
 */
export type AvatarStyle = "solid" | "colorful";

const PALETTE = ["#6c5767", "#5a6170", "#6f5a5f", "#4d6368", "#66605a", "#4a4448"];

/** Returns the background hex for a colorful avatar, or null for the solid default. */
export function avatarBg(id: string, style: AvatarStyle | string | null | undefined): string | null {
  if (style !== "colorful") return null;
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}
