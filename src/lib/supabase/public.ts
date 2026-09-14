import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { requireSupabaseConfig } from "./config"

/**
 * An anonymous Supabase client for public website reads.
 *
 * Deliberately session-less. Two reasons, and both matter:
 *
 *   1. `generateStaticParams` runs at build time with no HTTP request, so a
 *      cookie-reading client throws there.
 *
 *   2. More importantly, the public site must render the same content for
 *      everyone. A cookie-based client would authenticate a signed-in editor,
 *      and the `articles_staff_read` policy would then surface unpublished
 *      drafts on the public pages that editor happens to be browsing. Reading
 *      as `anon` means the public site is held to the public RLS policy —
 *      published, and past its publication date — no matter who is looking.
 *
 * Never use this for anything that writes, or for the admin portal.
 */
export function createPublicClient() {
  const { url, anonKey } = requireSupabaseConfig()

  return createSupabaseClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
