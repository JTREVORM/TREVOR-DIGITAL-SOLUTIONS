import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * The site's single entrance animation: a short, small fade-and-rise.
 *
 * Deliberately CSS-only and *not* scroll-triggered. The obvious
 * implementation — an IntersectionObserver or framer-motion `whileInView`
 * with `initial: { opacity: 0 }` — leaves every below-the-fold block at zero
 * opacity until it is observed. That means content is invisible if JavaScript
 * is slow, blocked or broken, and can be captured as blank by crawlers and
 * screenshot tools. Not a trade worth making for an effect nobody sees on a
 * section they have not scrolled to yet.
 *
 * So: the element is a plain server-rendered element, visible in the HTML,
 * with one cheap CSS animation on mount. `prefers-reduced-motion` is handled
 * globally in globals.css, and if the animation never runs the content is
 * simply there.
 */

type RevealProps = {
  children: ReactNode
  /** Stagger index. Capped so long lists never feel slow. */
  index?: number
  className?: string
  as?: "div" | "li" | "article"
}

export function Reveal({ children, index = 0, className, as: Component = "div" }: RevealProps) {
  return (
    <Component
      className={cn("reveal", className)}
      style={index ? { animationDelay: `${Math.min(index, 5) * 60}ms` } : undefined}
    >
      {children}
    </Component>
  )
}
