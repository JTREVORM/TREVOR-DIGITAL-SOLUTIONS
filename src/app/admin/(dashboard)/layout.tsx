import Link from "next/link"
import { redirect } from "next/navigation"
import { ShieldAlert } from "lucide-react"
import { AdminShell } from "@/components/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { getAdminSession } from "@/lib/auth/session"
import { logout } from "@/app/actions/auth"

/**
 * Access control for the admin portal.
 *
 * Three outcomes:
 *
 *   No session            — redirect to the sign-in screen.
 *   Session, wrong role   — render a refusal, not the portal. A signed-in
 *                           visitor with the default `viewer` role has an
 *                           account but no editorial rights.
 *   Admin or editor       — render the portal.
 *
 * This is defence in depth, not the only defence. src/proxy.ts blocks
 * unauthenticated requests before they reach here, and RLS blocks the data
 * itself even if both were bypassed.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isSupabaseConfigured) {
    // No backend at all: nothing to authenticate against and no data to
    // expose. The portal renders as an interface preview that says so.
    return <AdminShell isPreview>{children}</AdminShell>
  }

  const session = await getAdminSession()

  if (!session) {
    redirect("/admin/login")
  }

  if (!session.canAccessAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 py-12">
        <div className="w-full max-w-md rounded-2xl bg-surface p-8 text-center ring-1 ring-hairline">
          <span className="mx-auto inline-flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive ring-1 ring-destructive/25">
            <ShieldAlert className="size-5" aria-hidden />
          </span>
          <h1 className="mt-5 text-xl font-semibold text-foreground">
            No editorial access
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            You are signed in as{" "}
            <span className="text-foreground">{session.email}</span>, but this
            account does not have the admin or editor role. An administrator
            has to grant it before you can manage content.
          </p>
          <div className="mt-7 flex flex-col gap-2.5">
            <Button size="cta" variant="outline" asChild>
              <Link href="/">Back to website</Link>
            </Button>
            <form action={logout}>
              <Button size="cta" variant="ghost" className="w-full" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  return (
    <AdminShell
      isPreview={false}
      userEmail={session.email ?? undefined}
      role={session.role}
    >
      {children}
    </AdminShell>
  )
}
