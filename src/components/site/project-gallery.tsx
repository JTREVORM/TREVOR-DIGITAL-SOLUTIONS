"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import type { Screenshot } from "@/lib/content/projects"

/**
 * Screenshot gallery with a lightbox.
 *
 * Renders nothing when a project has no screenshots, so a case study awaiting
 * imagery shows no empty frame. Keyboard: arrows move, Escape closes; focus
 * returns to the thumbnail that opened the viewer.
 */

type ProjectGalleryProps = {
  screenshots: Screenshot[]
  projectName: string
}

export function ProjectGallery({ screenshots, projectName }: ProjectGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const isOpen = openIndex !== null

  const close = useCallback(() => setOpenIndex(null), [])

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return current
        return (current + delta + screenshots.length) % screenshots.length
      })
    },
    [screenshots.length]
  )

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
      if (event.key === "ArrowRight") step(1)
      if (event.key === "ArrowLeft") step(-1)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [isOpen, close, step])

  if (screenshots.length === 0) return null

  // Narrow once, so the viewer block gets both the image and its position.
  const active =
    openIndex === null ? null : { index: openIndex, shot: screenshots[openIndex] }

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2">
        {screenshots.map((shot, index) => (
          <li key={`${shot.src}-${index}`}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group block w-full overflow-hidden rounded-xl bg-background text-left ring-1 ring-hairline transition-colors hover:ring-primary/40"
              aria-label={`Open screenshot ${index + 1} of ${screenshots.length}: ${shot.alt}`}
            >
              <span className="relative block aspect-[16/10] overflow-hidden">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 480px"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </span>
              {shot.caption ? (
                <span className="block border-t border-hairline px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                  {shot.caption}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      {/* Lightbox */}
      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${projectName} screenshot viewer`}
          className="fixed inset-0 z-[60] flex flex-col bg-background/95 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-4">
            <p className="min-w-0 truncate text-sm text-muted-foreground">
              <span className="text-foreground">{projectName}</span>
              <span className="mx-2 text-muted-foreground/50">/</span>
              {active.index + 1} of {screenshots.length}
            </p>
            <button
              type="button"
              onClick={close}
              autoFocus
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-foreground ring-1 ring-hairline transition-colors hover:bg-muted"
              aria-label="Close viewer"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center p-4 sm:p-8">
            <div className="relative h-full w-full">
              <Image
                src={active.shot.src}
                alt={active.shot.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {screenshots.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="absolute left-3 inline-flex size-11 items-center justify-center rounded-full bg-surface/90 text-foreground ring-1 ring-hairline transition-colors hover:bg-surface sm:left-6"
                  aria-label="Previous screenshot"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="absolute right-3 inline-flex size-11 items-center justify-center rounded-full bg-surface/90 text-foreground ring-1 ring-hairline transition-colors hover:bg-surface sm:right-6"
                  aria-label="Next screenshot"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            ) : null}
          </div>

          {active.shot.caption ? (
            <p className="border-t border-hairline px-5 py-4 text-center text-sm text-muted-foreground">
              {active.shot.caption}
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
