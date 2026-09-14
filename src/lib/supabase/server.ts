import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireSupabaseConfig } from './config'

export async function createClient() {
  // `cookies()` must be awaited BEFORE any other work that can throw. Reading
  // cookies is what opts the calling route into dynamic rendering; throwing
  // ahead of it makes Next try to prerender admin pages at build time, and the
  // build then fails on machines without Supabase credentials.
  const cookieStore = await cookies()

  // Fails with a message that names the missing variables and what to do,
  // rather than the SDK's generic "URL and Key are required" error.
  const { url, anonKey } = requireSupabaseConfig()

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
