import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProjectMedia } from "@/components/site/project-media"
import { categoryOf, isCaseStudyReady, type Project } from "@/lib/content/projects"

/**
 * One project card, shared by the homepage featured section and the projects
 * index so the two can never diverge.
 *
 * The visual leads; text is kept to the name, one line, and the metadata a
 * buyer scans by (category, industry, stack). `feature` renders the larger
 * treatment used for the first card on the homepage.
 */

type ProjectCardProps = {
  project: Project
  /** Larger layout for a hero position. */
  feature?: boolean
  /** Eager-load above-the-fold artwork. */
  priority?: boolean
  className?: string
}

export function ProjectCard({
  project,
  feature = false,
  priority = false,
  className,
}: ProjectCardProps) {
  const category = categoryOf(project)
  const ready = isCaseStudyReady(project)
  const technologies = project.technologies ?? []

  return (
    <article className={cn("group h-full", className)}>
      <Link
        href={`/projects/${project.slug}`}
        className={cn(
          "flex h-full overflow-hidden rounded-xl bg-surface ring-1 ring-hairline transition-colors duration-200 hover:ring-primary/40",
          // The feature card runs side by side on wide screens. Stacked, its
          // media would be a full-width band tall enough to read as an empty
          // gap before any screenshots exist.
          feature ? "flex-col lg:grid lg:grid-cols-2 lg:items-stretch" : "flex-col"
        )}
      >
        <div
          className={cn(
            "border-hairline",
            feature ? "border-b lg:border-r lg:border-b-0" : "border-b"
          )}
        >
          <ProjectMedia
            project={project}
            ratio={feature ? "16/10" : "16/10"}
            sizes={
              feature
                ? "(max-width: 1024px) 100vw, 640px"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
            }
            priority={priority}
            className={feature ? "lg:h-full lg:aspect-auto" : undefined}
          />
        </div>

        <div
          className={cn(
            "flex flex-1 flex-col p-6",
            feature && "sm:p-8 lg:justify-center lg:p-10"
          )}
        >
          {/* Category + industry */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.1em] text-brand-lift uppercase ring-1 ring-primary/20">
              <category.icon className="size-3" aria-hidden />
              {category.name}
            </span>
            <span className="text-xs text-muted-foreground">{project.industry}</span>
          </div>

          <h3
            className={cn(
              "mt-4 leading-snug font-semibold text-foreground",
              feature ? "text-xl sm:text-2xl" : "text-lg"
            )}
          >
            {project.name}
          </h3>

          <p
            className={cn(
              "mt-3 flex-1 leading-relaxed text-muted-foreground",
              feature ? "text-[0.9375rem]" : "text-sm"
            )}
          >
            {project.summary}
          </p>

          {technologies.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-2">
              {technologies.slice(0, 4).map((tech) => (
                <li
                  key={tech}
                  className="rounded-md px-2 py-1 font-[family-name:var(--font-mono)] text-[0.6875rem] text-muted-foreground ring-1 ring-hairline"
                >
                  {tech}
                </li>
              ))}
              {technologies.length > 4 ? (
                <li className="px-1 py-1 font-[family-name:var(--font-mono)] text-[0.6875rem] text-muted-foreground/70">
                  +{technologies.length - 4}
                </li>
              ) : null}
            </ul>
          ) : null}

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-hairline pt-5">
            <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-brand-lift">
              {ready ? "View case study" : "View project"}
              <ArrowUpRight
                className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </span>
            {!ready ? (
              <span className="font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.1em] text-muted-foreground/60 uppercase">
                In preparation
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  )
}
