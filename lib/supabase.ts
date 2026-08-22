import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/*
 * Portal reads must always reflect current data. Next.js / Vercel will cache
 * the underlying fetch in the durable Data Cache (which survives redeploys)
 * unless it is explicitly no-store, so a client's name or closing-tracker
 * update could otherwise stay frozen on their portal. Force no-store on every
 * request from this anon client.
 */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    fetch: (input: RequestInfo | URL, init?: RequestInit) =>
      fetch(input, { ...init, cache: "no-store" }),
  },
})
