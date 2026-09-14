"use client"

import * as React from "react"
import { Image as ImageIcon, Loader2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState, inputClasses } from "./ui"
import { listMedia, uploadMedia } from "@/lib/admin/service"
import type { MediaItem } from "@/lib/admin/types"
import { cn } from "@/lib/utils"

/**
 * Media chooser shown from the article editor.
 *
 * Uses the same service functions as the media library page, so Phase 6 only
 * has to change `uploadMedia`/`listMedia` and both surfaces follow.
 */
export function MediaPickerDialog({
  open,
  onSelect,
  onCancel,
}: {
  open: boolean
  onSelect: (item: MediaItem) => void
  onCancel: () => void
}) {
  const [items, setItems] = React.useState<MediaItem[]>([])
  const [busy, setBusy] = React.useState(false)
  const [pathInput, setPathInput] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (!open) return
    listMedia().then(setItems)

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKey)
    }
  }, [open, onCancel])

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return
    setBusy(true)
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue
      await uploadMedia(file, file.name.replace(/\.[^.]+$/, ""))
    }
    setItems(await listMedia())
    setBusy(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cancel"
        tabIndex={-1}
        onClick={onCancel}
        className="absolute inset-0 cursor-default bg-background/85 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-picker-title"
        className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl ring-1 ring-hairline"
      >
        <div className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-4">
          <h2 id="media-picker-title" className="text-base font-semibold text-foreground">
            Choose an image
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Use a path already in /public */}
          <div className="mb-5 rounded-xl bg-surface-raised p-4 ring-1 ring-hairline">
            <label
              htmlFor="media-path"
              className="block text-sm font-medium text-foreground"
            >
              Use a file already in /public
            </label>
            <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
              <input
                id="media-path"
                value={pathInput}
                onChange={(event) => setPathInput(event.target.value)}
                placeholder="/insights/example.png"
                className={cn(inputClasses, "flex-1 font-[family-name:var(--font-mono)]")}
              />
              <Button
                size="cta"
                variant="outline"
                disabled={!pathInput.trim()}
                onClick={() =>
                  onSelect({
                    id: "path",
                    fileName: pathInput.trim(),
                    url: pathInput.trim(),
                    mimeType: "image/*",
                    size: 0,
                    alt: "",
                    uploadedAt: new Date().toISOString(),
                  })
                }
              >
                Use path
              </Button>
            </div>
          </div>

          {/* Upload */}
          <div className="mb-5">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(event) => handleFiles(event.target.files)}
            />
            <Button
              size="cta"
              variant="outline"
              className="w-full"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Upload aria-hidden />
              )}
              Upload image
            </Button>
          </div>

          {items.length === 0 ? (
            <EmptyState
              icon={ImageIcon}
              title="No uploads yet"
              description="Upload an image, or reference a file already in the public folder."
            />
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    className="group w-full overflow-hidden rounded-lg bg-background text-left ring-1 ring-hairline transition-colors hover:ring-primary/40"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.alt}
                      className="aspect-video w-full object-cover"
                    />
                    <span className="block truncate px-3 py-2 text-xs text-muted-foreground">
                      {item.fileName}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
