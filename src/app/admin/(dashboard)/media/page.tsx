"use client"

import { useEffect, useRef, useState } from "react"
import { Image as ImageIcon, Info, Loader2, Trash2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ConfirmDialog,
  EmptyState,
  LoadingState,
  PageHeader,
} from "@/components/admin/ui"
import { deleteMedia, listMedia, uploadMedia } from "@/lib/admin/service"
import type { MediaItem } from "@/lib/admin/types"

function formatSize(bytes: number): string {
  if (bytes === 0) return "—"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selected, setSelected] = useState<MediaItem | null>(null)
  const [pendingDelete, setPendingDelete] = useState<MediaItem | null>(null)
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function load() {
    setItems(await listMedia())
    setLoading(false)
  }

  useEffect(() => {
    let active = true
    // setState happens inside an async closure, after an await, so the
    // effect body never sets state synchronously.
    void (async () => {
      await load()
      if (!active) return
    })()
    return () => {
      active = false
    }
  }, [])

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return
    setUploading(true)
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue
      await uploadMedia(file, file.name.replace(/\.[^.]+$/, ""))
    }
    await load()
    setUploading(false)
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setBusy(true)
    await deleteMedia(pendingDelete.id)
    if (selected?.id === pendingDelete.id) setSelected(null)
    await load()
    setBusy(false)
    setPendingDelete(null)
  }

  return (
    <>
      <PageHeader
        title="Media"
        description="Images available to articles."
        crumbs={[{ name: "Admin", href: "/admin" }, { name: "Media" }]}
        actions={
          <Button size="cta" onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Upload aria-hidden />
            )}
            Upload
          </Button>
        }
      />

      {/* Storage is not connected yet — say so rather than implying files are
          being kept somewhere. */}
      <div className="mb-6 flex gap-3 rounded-xl bg-primary/[0.07] p-4 ring-1 ring-primary/20">
        <Info className="mt-0.5 size-4 shrink-0 text-brand-lift" aria-hidden />
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">
            Cloud storage is not connected yet.
          </span>{" "}
          Uploads here are held in this browser tab only and disappear on
          reload. For images that need to persist today, place the file in the
          project&apos;s <code className="font-[family-name:var(--font-mono)] text-brand-lift">/public</code>{" "}
          folder and reference it by path. Supabase Storage is wired up in
          Phase 6.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(event) => handleFiles(event.target.files)}
      />

      {/* Drop zone */}
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          handleFiles(event.dataTransfer.files)
        }}
        className={`mb-6 rounded-xl border border-dashed p-8 text-center transition-colors ${
          dragging ? "border-primary/50 bg-primary/[0.06]" : "border-hairline"
        }`}
      >
        <span className="mx-auto inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-brand-lift ring-1 ring-primary/20">
          <Upload className="size-[1.125rem]" aria-hidden />
        </span>
        <p className="mt-4 text-sm text-foreground">Drag images here to upload</p>
        <p className="mt-1 text-xs text-muted-foreground">or</p>
        <Button
          size="cta"
          variant="outline"
          className="mt-3"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          Browse files
        </Button>
      </div>

      {loading ? (
        <LoadingState label="Loading media" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No media uploaded"
          description="Upload an image above, or reference a file already in the public folder from the article editor."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelected(item)}
                  aria-pressed={selected?.id === item.id}
                  className={`group block w-full overflow-hidden rounded-xl bg-surface text-left ring-1 transition-colors ${
                    selected?.id === item.id
                      ? "ring-primary/50"
                      : "ring-hairline hover:ring-primary/30"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="aspect-video w-full bg-background object-cover"
                  />
                  <span className="block truncate px-3 py-2.5 text-xs text-muted-foreground">
                    {item.fileName}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* Metadata */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            {selected ? (
              <div className="rounded-xl bg-surface ring-1 ring-hairline">
                <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-4">
                  <h2 className="text-[0.9375rem] font-semibold text-foreground">
                    Image details
                  </h2>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    aria-label="Close details"
                    className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="p-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selected.url}
                    alt={selected.alt}
                    className="aspect-video w-full rounded-lg bg-background object-contain ring-1 ring-hairline"
                  />

                  <dl className="mt-5 space-y-3 text-sm">
                    <div>
                      <dt className="text-[0.6875rem] tracking-[0.1em] text-muted-foreground/60 uppercase">
                        File name
                      </dt>
                      <dd className="mt-1 break-all text-foreground">
                        {selected.fileName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.6875rem] tracking-[0.1em] text-muted-foreground/60 uppercase">
                        Type
                      </dt>
                      <dd className="mt-1 text-muted-foreground">{selected.mimeType}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.6875rem] tracking-[0.1em] text-muted-foreground/60 uppercase">
                        Size
                      </dt>
                      <dd className="mt-1 text-muted-foreground">
                        {formatSize(selected.size)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.6875rem] tracking-[0.1em] text-muted-foreground/60 uppercase">
                        Uploaded
                      </dt>
                      <dd className="mt-1 text-muted-foreground">
                        {new Date(selected.uploadedAt).toLocaleString()}
                      </dd>
                    </div>
                    {selected.isLocalOnly ? (
                      <div>
                        <dt className="text-[0.6875rem] tracking-[0.1em] text-muted-foreground/60 uppercase">
                          Storage
                        </dt>
                        <dd className="mt-1 text-amber-300">
                          This browser session only
                        </dd>
                      </div>
                    ) : null}
                  </dl>

                  <Button
                    size="cta"
                    variant="destructive"
                    className="mt-6 w-full"
                    onClick={() => setPendingDelete(selected)}
                  >
                    <Trash2 aria-hidden />
                    Delete image
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-surface px-5 py-10 text-center ring-1 ring-hairline">
                <p className="text-sm text-muted-foreground">
                  Select an image to see its details.
                </p>
              </div>
            )}
          </aside>
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this image?"
        description={`“${pendingDelete?.fileName}” will be removed from the library. Articles referencing it will show a broken image.`}
        confirmLabel="Delete image"
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
