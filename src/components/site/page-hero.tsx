import type { ReactNode } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * The masthead every page except the homepage uses: eyebrow, title, lead
 * paragraph, optional breadcrumb and optional actions. One component means
 * inner pages cannot drift apart from each other.
 */

type Crumb = {
  name: string
  href?: string
}

type PageHeroProps = {
  eyebrow?: string
  title: string
  lead?: ReactNode
  crumbs?: Crumb[]
  actions?: ReactNode
  /** Extra content below the lead, e.g. a stat row or tech chips. */
  children?: ReactNode
  align?: "start" | "center"
  className?: string
}

export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs,
  actions,
  children,
  align = "start",
  className,
}: PageHeroProps) {
  const centered = align === "center"

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-hairline bg-surface pt-14 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24",
        className
      )}
    >
      <div className="brand-wash-soft pointer-events-none absolute inset-0" aria-hidden />
      <div className="shell relative">
        {crumbs?.length ? (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
              {crumbs.map((crumb, i) => (
                <li key={crumb.name} className="flex items-center gap-1.5">
                  {i > 0 ? (
                    <ChevronRight className="size-3.5 text-muted-foreground/60" aria-hidden />
                  ) : null}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="rounded transition-colors hover:text-foreground"
                    >
                      {crumb.name}
                    </Link>
                  ) : (
                    <span className="text-foreground">{crumb.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className={cn("max-w-3xl", centered && "mx-auto text-center")}>
          {eyebrow ? <p className="eyebrow mb-5">{eyebrow}</p> : null}
          <h1 className="text-[2rem] leading-[1.1] font-semibold text-foreground sm:text-[2.75rem] lg:text-[3.25rem]">
            {title}
          </h1>
          {lead ? (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {lead}
            </p>
          ) : null}
          {actions ? (
            <div
              className={cn(
                "mt-9 flex flex-col gap-3 sm:flex-row sm:items-center",
                centered && "sm:justify-center"
              )}
            >
              {actions}
            </div>
          ) : null}
        </div>

        {children ? <div className="mt-12">{children}</div> : null}
      </div>
    </section>
  )
}
