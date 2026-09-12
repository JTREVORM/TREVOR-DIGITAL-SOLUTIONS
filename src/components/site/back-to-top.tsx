"use client"

import { ArrowUp } from "lucide-react"

/**
 * Small client island so the footer itself can stay a server component.
 */
export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex items-center gap-2 rounded-md text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      Back to top
      <ArrowUp className="size-3.5" aria-hidden />
    </button>
  )
}
