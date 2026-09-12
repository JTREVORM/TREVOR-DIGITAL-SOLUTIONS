import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { Project } from "@/lib/content/projects"

/**
 * One project card, shared by the homepage section and the projects index so
 * the two can never diverge.
 *
 * The placeholder artwork in /public is square, so the frame uses a 4:3 crop
 * centred on the interface rather than the 16:9 crop that was cutting the
 * mockups in half.
 */

type ProjectCardProps = {
  project: Project
  /** Eager-load the first card above the fold. */
  priority?: boolean
}

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <article className="group h-full">
      <Link
        href={`/projects/${project.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-xl bg-surface ring-1 ring-hairline transition-colors duration-200 hover:ring-primary/40"
      >
        <div className="relative aspect-[4/3] overflow-hidden border-b border-hairline bg-background">
          <Image
            src={project.image}
            alt={`${project.title} interface`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 620px"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent"
            aria-hidden
          />
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="rounded-md bg-primary/10 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.12em] text-brand-lift uppercase ring-1 ring-primary/20">
              {project.category}
            </span>
            <span className="text-xs text-muted-foreground">{project.industry}</span>
          </div>

          <h3 className="mt-4 text-xl leading-snug font-semibold text-foreground">
            {project.title}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            {project.summary}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <li
                key={tech}
                className="rounded-md px-2 py-1 font-[family-name:var(--font-mono)] text-[0.6875rem] text-muted-foreground ring-1 ring-hairline"
              >
                {tech}
              </li>
            ))}
            {project.technologies.length > 4 ? (
              <li className="px-1 py-1 font-[family-name:var(--font-mono)] text-[0.6875rem] text-muted-foreground/70">
                +{project.technologies.length - 4}
              </li>
            ) : null}
          </ul>

          <span className="mt-6 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-brand-lift">
            View project
            <ArrowUpRight
              className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </span>
        </div>
      </Link>
    </article>
  )
}
