import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { LayoutDashboard, FolderKanban, Wrench, MessageSquare, Settings, LogOut, Star, Image as ImageIcon } from "lucide-react"
import { logout } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // This layout wraps /admin/login too, so redirecting here sent that page
    // into an infinite redirect loop (ERR_TOO_MANY_REDIRECTS) and made it
    // impossible to sign in. Authentication is enforced in src/proxy.ts,
    // which redirects every /admin/* request except /admin/login, so an
    // unauthenticated request only reaches this point on the login page
    // itself. Render it bare, without the dashboard chrome.
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex mt-[88px] top-0 pt-6">
        <nav className="flex flex-col gap-2 px-4 font-medium overflow-y-auto pb-6">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </Link>
          <Link
            href="/admin/projects"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
          >
            <FolderKanban className="h-4 w-4" />
            Projects
          </Link>
          <Link
            href="/admin/services"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
          >
            <Wrench className="h-4 w-4" />
            Services
          </Link>
          <Link
            href="/admin/gallery"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
          >
            <ImageIcon className="h-4 w-4" />
            Gallery
          </Link>
          <Link
            href="/admin/testimonials"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
          >
            <Star className="h-4 w-4" />
            Testimonials
          </Link>
          <Link
            href="/admin/messages"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
          >
            <MessageSquare className="h-4 w-4" />
            Messages
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
        <div className="mt-auto p-4 border-t bg-background">
          <div className="mb-4 text-sm text-muted-foreground break-all">
            {user.email}
          </div>
          <form action={logout}>
            <Button variant="outline" className="w-full gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 sm:pl-64 flex flex-col pt-6 px-4 md:px-8 mb-20">
        {children}
      </main>
    </div>
  )
}
