import "server-only"

import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import type { ProfileRow, UserRole } from "@/lib/supabase/types"

/**
 * Server-side session and role lookup.
 *
 * `server-only` at the top makes importing this from a client component a
 * build error, so the role can never be resolved in the browser where a user
 * could tamper with the answer.
 *
 * The role is always read from the `profiles` table, never from user metadata
 * or anything else the client can influence. The database enforces the same
 * rule again through RLS, so a forged client cannot escalate even if this
 * check were bypassed.
 */

export type AdminSession = {
  userId: string
  email: string | null
  profile: ProfileRow | null
  role: UserRole
  /** Admin or editor — may reach the portal. */
  canAccessAdmin: boolean
  isAdmin: boolean
}

export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isSupabaseConfigured) return null

  const supabase = await createClient()

  // getUser() revalidates the token with Supabase. getSession() would trust
  // whatever is in the cookie, which is not good enough for an access check.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>()

  const role: UserRole = profile?.role ?? "viewer"

  return {
    userId: user.id,
    email: user.email ?? null,
    profile: profile ?? null,
    role,
    canAccessAdmin: role === "admin" || role === "editor",
    isAdmin: role === "admin",
  }
}
