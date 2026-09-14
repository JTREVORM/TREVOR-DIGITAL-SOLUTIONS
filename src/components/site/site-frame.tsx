"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"

/**
 * Decides whether a route gets the public site chrome.
 *
 * The root layout wraps every route, including /admin. Without this the
 * marketing navbar and footer render on top of the admin portal — two
 * navigations stacked, two logos overlapping.
 *
 * `navbar` and `footer` are passed in as rendered elements, so they stay
 * server components; this wrapper only chooses whether to place them.
 */
export function SiteFrame({
  navbar,
  footer,
  children,
}: {
  navbar: ReactNode
  footer: ReactNode
  children: ReactNode
}) {
  const pathname = usePathname()
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/")

  if (isAdmin) {
    // The admin portal supplies its own sidebar, top bar and layout.
    return <>{children}</>
  }

  return (
    <>
      {navbar}
      <main id="main" className="flex flex-1 flex-col pt-16 sm:pt-[4.5rem]">
        {children}
      </main>
      {footer}
    </>
  )
}
