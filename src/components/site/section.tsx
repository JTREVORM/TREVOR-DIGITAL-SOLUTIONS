import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Layout primitives that give every page the same rhythm: one gutter, one
 * vertical scale, one heading structure. Sections alternate between the base
 * background and a slightly raised surface, separated by hairlines rather
 * than heavy borders.
 */

type SectionProps = {
  children: ReactNode
  id?: string
  /** `surface` lifts the band slightly off the page background. */
  tone?: "base" | "surface"
  /** Vertical rhythm. `tight` for short bands, `loose` for major sections. */
  space?: "tight" | "default" | "loose"
  /** Hairline rules above and below the band. */
  divide?: "none" | "top" | "bottom" | "both"
  className?: string
  containerClassName?: string
}

const spaceClasses = {
  tight: "py-14 sm:py-16",
  default: "py-16 sm:py-20 lg:py-24",
  loose: "py-20 sm:py-24 lg:py-32",
} as const

export function Section({
  children,
  id,
  tone = "base",
  space = "default",
  divide = "none",
  className,
  containerClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full",
        tone === "surface" && "bg-surface",
        spaceClasses[space],
        (divide === "top" || divide === "both") && "hairline-t",
        (divide === "bottom" || divide === "both") && "hairline-b",
        className
      )}
    >
      <div className={cn("shell relative", containerClassName)}>{children}</div>
    </section>
  )
}

type SectionHeadingProps = {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: "start" | "center"
  /** Optional action rendered opposite the heading on wide screens. */
  action?: ReactNode
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  action,
  className,
}: SectionHeadingProps) {
  const centered = align === "center"

  return (
    <div
      className={cn(
        "flex flex-col gap-8",
        action && !centered && "lg:flex-row lg:items-end lg:justify-between",
        className
      )}
    >
      <div
        className={cn(
          "flex max-w-2xl flex-col",
          centered && "mx-auto items-center text-center"
        )}
      >
        {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
        <h2 className="text-[1.75rem] leading-[1.15] font-semibold text-foreground sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
        {description ? (
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
