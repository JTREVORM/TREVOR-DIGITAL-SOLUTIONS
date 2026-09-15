"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

/**
 * Sub-navigation for the newsletter section.
 *
 * Subscribers and issues are two halves of one job, so they share a header
 * rather than sitting in the sidebar as unrelated entries.
 */
const TABS = [
  { name: "Subscribers", href: "/admin/newsletter" },
  { name: "Newsletters", href: "/admin/newsletter/issues", prefix: true },
] as const

export function NewsletterTabs() {
  const pathname = usePathname()

  return (
    <div className="mb-7 border-b border-hairline">
      <nav aria-label="Newsletter sections" className="-mb-px flex gap-1">
        {TABS.map((tab) => {
          const active =
            "prefix" in tab && tab.prefix
              ? pathname === tab.href || pathname.startsWith(`${tab.href}/`)
              : pathname === tab.href

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:border-hairline hover:text-foreground"
              )}
            >
              {tab.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
