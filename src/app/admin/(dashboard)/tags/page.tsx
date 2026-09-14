"use client"

import { useEffect, useMemo, useState } from "react"
import { Check, Pencil, Plus, Search, Tag as TagIcon, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ConfirmDialog,
  EmptyState,
  LoadingState,
  PageHeader,
  Toolbar,
  inputClasses,
} from "@/components/admin/ui"
import { deleteTag, listArticles, listTags, saveTag } from "@/lib/admin/service"
import type { AdminTag } from "@/lib/admin/types"
import { cn } from "@/lib/utils"

export default function AdminTagsPage() {
  const [tags, setTags] = useState<AdminTag[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  const [newName, setNewName] = useState("")
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null)
  const [pendingDelete, setPendingDelete] = useState<AdminTag | null>(null)
  const [busy, setBusy] = useState(false)

  async function load() {
    const [nextTags, articles] = await Promise.all([listTags(), listArticles()])
    const nextCounts: Record<string, number> = {}
    for (const tag of nextTags) {
      nextCounts[tag.id] = articles.filter((a) => a.tags.includes(tag.name)).length
    }
    setTags(nextTags)
    setCounts(nextCounts)
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

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return tags
    return tags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(term) || tag.slug.toLowerCase().includes(term)
    )
  }, [tags, query])

  async function create() {
    if (!newName.trim()) return
    setBusy(true)
    await saveTag({ name: newName.trim() })
    await load()
    setNewName("")
    setBusy(false)
  }

  async function saveEdit() {
    if (!editing?.name.trim()) return
    setBusy(true)
    await saveTag({ id: editing.id, name: editing.name.trim() })
    await load()
    setEditing(null)
    setBusy(false)
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setBusy(true)
    await deleteTag(pendingDelete.id)
    await load()
    setBusy(false)
    setPendingDelete(null)
  }

  return (
    <>
      <PageHeader
        title="Tags"
        description="Topic labels applied to articles. Used for related content and filtering."
        crumbs={[{ name: "Admin", href: "/admin" }, { name: "Tags" }]}
      />

      {/* Create + search */}
      <Toolbar>
        <div className="relative lg:max-w-sm lg:flex-1">
          <label htmlFor="tag-search" className="sr-only">
            Search tags
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            id="tag-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tags"
            className={cn(inputClasses, "pr-10 pl-10")}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-1.5 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        <div className="flex gap-2">
          <label htmlFor="tag-new" className="sr-only">
            New tag name
          </label>
          <input
            id="tag-new"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                create()
              }
            }}
            placeholder="New tag name"
            className={cn(inputClasses, "min-w-0 flex-1 lg:w-56")}
          />
          <Button size="cta" onClick={create} disabled={busy || !newName.trim()}>
            <Plus aria-hidden />
            Add
          </Button>
        </div>
      </Toolbar>

      {loading ? (
        <LoadingState label="Loading tags" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={TagIcon}
          title={query ? "No tags match that search" : "No tags yet"}
          description={
            query
              ? "Try a different term, or clear the search."
              : "Add a tag above to start labelling articles."
          }
          action={
            query ? (
              <Button size="cta" variant="outline" onClick={() => setQuery("")}>
                Clear search
              </Button>
            ) : undefined
          }
        />
      ) : (
        <ul className="flex flex-wrap gap-2.5">
          {filtered.map((tag) => {
            const isEditing = editing?.id === tag.id
            return (
              <li key={tag.id}>
                {isEditing ? (
                  <div className="flex items-center gap-1.5 rounded-lg bg-surface p-1.5 ring-1 ring-primary/35">
                    <input
                      value={editing.name}
                      onChange={(event) =>
                        setEditing({ ...editing, name: event.target.value })
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") saveEdit()
                        if (event.key === "Escape") setEditing(null)
                      }}
                      autoFocus
                      aria-label={`Rename ${tag.name}`}
                      className="h-8 w-40 rounded-md bg-input/40 px-2.5 text-sm text-foreground outline-none"
                    />
                    <button
                      type="button"
                      onClick={saveEdit}
                      aria-label="Save tag"
                      className="inline-flex size-8 items-center justify-center rounded-md text-brand-lift transition-colors hover:bg-muted"
                    >
                      <Check className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      aria-label="Cancel"
                      className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 rounded-lg bg-surface py-1.5 pr-1.5 pl-3 ring-1 ring-hairline">
                    <TagIcon className="size-3.5 shrink-0 text-brand-lift" aria-hidden />
                    <span className="ml-1.5 text-sm text-foreground">{tag.name}</span>
                    <span className="ml-2 font-[family-name:var(--font-mono)] text-[0.6875rem] text-muted-foreground/60">
                      {counts[tag.id] ?? 0}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditing({ id: tag.id, name: tag.name })}
                      aria-label={`Edit ${tag.name}`}
                      className="ml-1.5 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(tag)}
                      aria-label={`Delete ${tag.name}`}
                      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {!loading && filtered.length > 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          {filtered.length} of {tags.length} tags.
        </p>
      ) : null}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this tag?"
        description={`“${pendingDelete?.name}” is used by ${counts[pendingDelete?.id ?? ""] ?? 0} article(s). Deleting it does not remove it from those articles.`}
        confirmLabel="Delete tag"
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
