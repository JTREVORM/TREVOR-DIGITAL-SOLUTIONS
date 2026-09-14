import { redirect } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"

/**
 * The authenticated admin chrome.
 *
 * Two states, and no third:
 *
 *   Supabase configured  — a real session is required. No user, no portal;
 *                          the request is redirected to the sign-in screen.
 *                          This is the production path and it is the only
 *                          path once Phase 6 is done.
 *
 *   Not configured       — there is no auth system to check against and no
 *                          server-side data to expose, so the portal renders
 *                          as an interface preview with a banner saying so
 *                          on every screen. This is not a security mode and
 *                          does not pretend to be one; it exists so the UI
 *                          can be built and reviewed before the backend.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isSupabaseConfigured) {
    return (
      <AdminShell isPreview>
        {children}
      </AdminShell>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return (
    <AdminShell isPreview={false} userEmail={user.email ?? undefined}>
      {children}
    </AdminShell>
  )
}
