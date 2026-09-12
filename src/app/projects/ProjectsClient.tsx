"use client"

import { useState } from "react"
import { ProjectCard } from "@/components/site/project-card"
import { projectCategories, projects } from "@/lib/content/projects"
import { cn } from "@/lib/utils"

/**
 * Category filter for the projects index. Only the filter needs to be
 * interactive, so this is the one client island on the page.
 */
export function ProjectsClient() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category === activeCategory)

  return (
    <div>
      {/* Filter. Scrolls horizontally on narrow screens instead of wrapping
          into a ragged block or forcing the page wider. */}
      <div
        role="group"
        aria-label="Filter projects by category"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projectCategories.map((category) => {
          const isActive = activeCategory === category
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={isActive}
              className={cn(
                "shrink-0 rounded-lg px-3.5 py-2 text-[0.8125rem] font-medium whitespace-nowrap ring-1 transition-colors",
                isActive
                  ? "bg-primary/12 text-foreground ring-primary/40"
                  : "text-muted-foreground ring-hairline hover:text-foreground hover:ring-primary/25"
              )}
            >
              {category}
            </button>
          )
        })}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
        {filtered.map((project, index) => (
          <ProjectCard key={project.slug} project={project} priority={index === 0} />
        ))}
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Showing {filtered.length} of {projects.length} projects.
      </p>
    </div>
  )
}
