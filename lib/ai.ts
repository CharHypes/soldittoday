/**
 * Minimal Claude (Anthropic Messages API) client for server-side drafting.
 *
 * Called via fetch (no SDK dependency). Gated on ANTHROPIC_API_KEY: when the key
 * is not set, AI_ENABLED is false and draftWithClaude() returns null, so any
 * feature that uses it stays hidden/inert (non-breaking) until the key is added
 * to the environment. Server-only ... never import into a client component.
 */

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-sonnet-5";

/** True when a Claude API key is configured. */
export const AI_ENABLED = !!process.env.ANTHROPIC_API_KEY;

export type DraftOptions = {
  system: string;
  user: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
};

/**
 * Draft text with Claude. Returns the model's text, or null on any failure
 * (missing key, network, non-2xx, timeout) so callers degrade gracefully rather
 * than throwing into a server action.
 */
export async function draftWithClaude(opts: DraftOptions): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);
  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: opts.model ?? DEFAULT_MODEL,
        max_tokens: opts.maxTokens ?? 700,
        temperature: opts.temperature ?? 0.6,
        system: opts.system,
        messages: [{ role: "user", content: opts.user }],
      }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
    const text = Array.isArray(data.content)
      ? data.content.filter((b) => b.type === "text").map((b) => b.text ?? "").join("").trim()
      : "";
    return text || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
