import Image from "next/image"
import { cn } from "@/lib/utils"
import { categoryOf, type Project } from "@/lib/content/projects"

/**
 * The visual for a project card or case-study hero.
 *
 * When a real screenshot exists it is shown. When one does not, this renders
 * a branded plate built from the project's own initials and category icon —
 * deliberately abstract, so nobody can mistake it for a picture of the
 * delivered system. Dropping a real image into the project's `image` field
 * replaces it with no other change.
 */

type ProjectMediaProps = {
  project: Project
  /** Aspect ratio of the frame. Cards and hero use different shapes. */
  ratio?: "16/10" | "4/3" | "16/9"
  sizes: string
  priority?: boolean
  className?: string
}

/** Up to two initials from the organisation's name. */
function initialsOf(name: string): string {
  const words = name
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => !/^(and|the|of|for)$/i.test(w))

  if (words.length === 0) return "TDS"
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

export function ProjectMedia({
  project,
  ratio = "16/10",
  sizes,
  priority = false,
  className,
}: ProjectMediaProps) {
  const category = categoryOf(project)

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-background",
        ratio === "16/10" && "aspect-[16/10]",
        ratio === "4/3" && "aspect-[4/3]",
        ratio === "16/9" && "aspect-video",
        className
      )}
    >
      {project.image ? (
        <>
          <Image
            src={project.image}
            alt={`${project.name} interface`}
            fill
            sizes={sizes}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"
            aria-hidden
          />
        </>
      ) : (
        /* Branded placeholder. Abstract on purpose — never a fake UI. */
        <div className="absolute inset-0" aria-hidden>
          <div className="brand-grid absolute inset-0 opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(24rem_14rem_at_50%_0%,oklch(0.6676_0.1797_248.36/14%),transparent_70%)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-brand-lift ring-1 ring-primary/25 backdrop-blur-sm">
              <category.icon className="size-[1.375rem]" />
            </span>
            <span className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground/25 sm:text-4xl">
              {initialsOf(project.name)}
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4">
            <span className="rounded-md bg-background/70 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.1em] text-muted-foreground/80 uppercase backdrop-blur-sm">
              Screenshots in preparation
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
