"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  ExternalLink,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Menu,
  MessageSquare,
  Settings,
  Star,
  Tag,
  Users,
  Wrench,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogoMark } from "@/components/site/logo"
import { logout } from "@/app/actions/auth"

/**
 * Admin chrome: fixed sidebar on desktop, slide-over drawer on mobile, and a
 * top bar carrying the page context, notifications and the profile menu.
 */

type NavItem = {
  name: string
  href: string
  icon: LucideIcon
  /** Match child routes too, e.g. /admin/articles/new. */
  prefix?: boolean
}

type NavGroup = {
  label: string
  items: NavItem[]
}

const NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Insights",
    items: [
      { name: "Articles", href: "/admin/articles", icon: FileText, prefix: true },
      { name: "Categories", href: "/admin/categories", icon: FolderKanban },
      { name: "Tags", href: "/admin/tags", icon: Tag },
      { name: "Authors", href: "/admin/authors", icon: Users },
      { name: "Media", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    label: "Website",
    items: [
      { name: "Projects", href: "/admin/projects", icon: FolderKanban },
      { name: "Services", href: "/admin/services", icon: Wrench },
      { name: "Testimonials", href: "/admin/testimonials", icon: Star },
      { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
      { name: "Messages", href: "/admin/messages", icon: MessageSquare },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
]

function isActive(pathname: string, item: NavItem): boolean {
  if (item.prefix) return pathname === item.href || pathname.startsWith(`${item.href}/`)
  return pathname === item.href
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-5">
      {NAV.map((group) => (
        <div key={group.label} className="mb-6 last:mb-0">
          <p className="px-3 pb-2 font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.14em] text-muted-foreground/60 uppercase">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/12 text-foreground ring-1 ring-primary/25"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-4 shrink-0",
                        active ? "text-brand-lift" : "text-muted-foreground/70"
                      )}
                      aria-hidden
                    />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function SidebarFooter() {
  return (
    <div className="border-t border-hairline p-3">
      <Link
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ExternalLink className="size-4 shrink-0 text-muted-foreground/70" aria-hidden />
        View website
      </Link>
    </div>
  )
}

export function AdminShell({
  children,
  userEmail,
  isPreview,
  role,
}: {
  children: React.ReactNode
  userEmail?: string
  isPreview: boolean
  role?: string
}) {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const pathname = usePathname()

  // Close the drawer on navigation, adjusted during render so the new route
  // paints with it already closed.
  const [renderedPath, setRenderedPath] = React.useState(pathname)
  if (pathname !== renderedPath) {
    setRenderedPath(pathname)
    if (drawerOpen) setDrawerOpen(false)
    if (menuOpen) setMenuOpen(false)
  }

  React.useEffect(() => {
    if (!drawerOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKey)
    }
  }, [drawerOpen])

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-hairline bg-surface lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-hairline px-5">
          <LogoMark className="h-8" />
          <div className="min-w-0 leading-none">
            <p className="truncate font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
              TDS Admin
            </p>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.12em] text-muted-foreground uppercase">
              Content
            </p>
          </div>
        </div>
        <SidebarNav />
        <SidebarFooter />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            tabIndex={-1}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-background/80 lg:hidden"
          />
          <aside
            id="admin-drawer"
            className="fixed inset-y-0 left-0 z-50 flex w-[17rem] max-w-[85vw] flex-col border-r border-hairline bg-surface lg:hidden"
          >
            <div className="flex h-16 items-center justify-between gap-3 border-b border-hairline px-4">
              <div className="flex min-w-0 items-center gap-3">
                <LogoMark className="h-8" />
                <p className="truncate font-[family-name:var(--font-display)] text-sm font-semibold text-foreground">
                  TDS Admin
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>
            <SidebarNav onNavigate={() => setDrawerOpen(false)} />
            <SidebarFooter />
          </aside>
        </>
      ) : null}

      {/* Main column */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-hairline bg-background/85 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open navigation"
                aria-expanded={drawerOpen}
                aria-controls="admin-drawer"
                className="-ml-2 inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted lg:hidden"
              >
                <Menu className="size-5" />
              </button>
              <span className="truncate text-sm font-medium text-foreground lg:hidden">
                TDS Admin
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Notifications"
                className="relative inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Bell className="size-[1.125rem]" />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-2.5 rounded-lg p-1.5 pr-2.5 transition-colors hover:bg-muted"
                >
                  <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary/10 font-[family-name:var(--font-display)] text-xs font-semibold text-brand-lift ring-1 ring-primary/20">
                    {(userEmail ?? "TDS").slice(0, 2).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[12rem] truncate text-sm text-muted-foreground sm:block">
                    {userEmail ?? "Preview mode"}
                  </span>
                </button>

                {menuOpen ? (
                  <>
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-hidden
                      onClick={() => setMenuOpen(false)}
                      className="fixed inset-0 z-40 cursor-default"
                    />
                    <div
                      role="menu"
                      className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl bg-surface-raised p-1.5 shadow-xl ring-1 ring-hairline"
                    >
                      <div className="border-b border-hairline px-3 py-2.5">
                        <p className="truncate text-sm font-medium text-foreground">
                          {userEmail ?? "Not signed in"}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground capitalize">
                          {isPreview ? "Preview mode" : (role ?? "Signed in")}
                        </p>
                      </div>
                      <Link
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        role="menuitem"
                        className="mt-1.5 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <ExternalLink className="size-4" aria-hidden />
                        View website
                      </Link>
                      {isPreview ? (
                        <Link
                          href="/admin/login"
                          role="menuitem"
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <LogOut className="size-4" aria-hidden />
                          Go to sign in
                        </Link>
                      ) : (
                        <form action={logout}>
                          <button
                            type="submit"
                            role="menuitem"
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <LogOut className="size-4" aria-hidden />
                            Sign out
                          </button>
                        </form>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        {isPreview ? <PreviewBanner /> : null}

        <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
      </div>
    </div>
  )
}

/**
 * States plainly that this is an unauthenticated interface shell. It is not a
 * security measure — it exists so nobody mistakes the portal for a working,
 * protected CMS before Phase 6 connects Supabase Auth.
 */
function PreviewBanner() {
  return (
    <div className="border-b border-primary/25 bg-primary/[0.08]">
      <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">Interface preview.</span>{" "}
          Supabase is not configured, so there is no sign-in and nothing is
          saved to a server. Changes live in this browser only.
        </p>
        <Button size="xs" variant="outline" asChild className="shrink-0 self-start sm:self-auto">
          <Link href="/admin/login">Sign-in screen</Link>
        </Button>
      </div>
    </div>
  )
}
