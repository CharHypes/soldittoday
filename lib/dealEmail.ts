/** The subdomain that receives per-deal email. Set DEAL_EMAIL_DOMAIN to change it. */
export const DEAL_EMAIL_DOMAIN = process.env.DEAL_EMAIL_DOMAIN ?? "deals.soldittoday.com";

/** Build a deal's inbound email address from its token. */
export function dealEmailAddress(token: string | null | undefined): string | null {
  return token ? `${token}@${DEAL_EMAIL_DOMAIN}` : null;
}
