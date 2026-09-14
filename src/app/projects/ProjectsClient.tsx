"use client"

import { useMemo, useState } from "react"
import { LayoutGrid } from "lucide-react"
import { ProjectCard } from "@/components/site/project-card"
import {
  activeProjectCategories,
  projects,
  type ProjectCategoryId,
} from "@/lib/content/projects"
import { cn } from "@/lib/utils"

type Filter = ProjectCategoryId | "all"

/**
 * Category filter for the projects index.
 *
 * The only interactive part of the page, so it is the one client island.
 * Counts come from the data, and a category with no projects never appears,
 * so the filter can never land on an empty result.
 */
export function ProjectsClient() {
  const [active, setActive] = useState<Filter>("all")

  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["all", projects.length]])
    for (const category of activeProjectCategories) {
      map.set(
        category.id,
        projects.filter((p) => p.categoryId === category.id).length
      )
    }
    return map
  }, [])

  const filtered = useMemo(
    () =>
      active === "all"
        ? projects
        : projects.filter((project) => project.categoryId === active),
    [active]
  )

  const filters: Array<{
    id: Filter
    label: string
    icon: typeof LayoutGrid
  }> = [
    { id: "all", label: "All", icon: LayoutGrid },
    ...activeProjectCategories.map((category) => ({
      id: category.id as Filter,
      label: category.filterLabel,
      icon: category.icon,
    })),
  ]

  return (
    <div>
      {/* Filter bar. Scrolls horizontally on narrow screens rather than
          wrapping into a ragged block or widening the page. */}
      <div
        role="group"
        aria-label="Filter projects by category"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {filters.map((filter) => {
          const isActive = active === filter.id
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActive(filter.id)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2.5 text-[0.8125rem] font-medium whitespace-nowrap ring-1 transition-colors",
                isActive
                  ? "bg-primary/12 text-foreground ring-primary/40"
                  : "text-muted-foreground ring-hairline hover:text-foreground hover:ring-primary/25"
              )}
            >
              <filter.icon
                className={cn("size-3.5", isActive ? "text-brand-lift" : "text-muted-foreground/70")}
                aria-hidden
              />
              {filter.label}
              <span
                className={cn(
                  "font-[family-name:var(--font-mono)] text-[0.6875rem]",
                  isActive ? "text-brand-lift" : "text-muted-foreground/50"
                )}
              >
                {counts.get(filter.id) ?? 0}
              </span>
            </button>
          )
        })}
      </div>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:gap-8">
        {filtered.map((project, index) => (
          <li key={project.slug} className="h-full">
            <ProjectCard project={project} priority={index < 2} />
          </li>
        ))}
      </ul>

      <p
        aria-live="polite"
        className="mt-10 text-sm text-muted-foreground"
      >
        Showing {filtered.length} of {projects.length} projects.
      </p>
    </div>
  )
}
