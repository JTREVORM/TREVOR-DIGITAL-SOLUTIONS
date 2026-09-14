/**
 * Supabase configuration, in one place.
 *
 * Supabase powers the admin portal and the contact-form inbox. The public
 * marketing site does not need it: every page renders from the content
 * modules in src/lib/content. So a missing configuration must degrade
 * gracefully rather than take the whole site down.
 *
 * These are NEXT_PUBLIC_ variables, so their values are inlined at build
 * time. Set them in `.env.local` for local development (see README.md) and in
 * your hosting provider's environment settings for deployments.
 */

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** True only when both variables are present and non-empty. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

/** Names of whichever variables are missing, for actionable error messages. */
export function missingSupabaseEnvVars(): string[] {
  const missing: string[] = []
  if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL")
  if (!supabaseAnonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  return missing
}

/**
 * Returns the credentials, or throws a message that says what to do instead of
 * the Supabase SDK's generic "URL and Key are required" error.
 */
export function requireSupabaseConfig(): { url: string; anonKey: string } {
  if (supabaseUrl && supabaseAnonKey) {
    return { url: supabaseUrl, anonKey: supabaseAnonKey }
  }

  throw new Error(
    `Supabase is not configured. Missing ${missingSupabaseEnvVars().join(" and ")}. ` +
      `Add them to .env.local and restart the dev server - see README.md. ` +
      `The public site runs without them; only the admin portal and the ` +
      `contact form require Supabase.`
  )
}
