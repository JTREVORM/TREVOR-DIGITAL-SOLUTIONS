"use client"

import { useEffect, useState } from "react"
import { ExternalLink, Pencil, Plus, Trash2, Users, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ConfirmDialog,
  EmptyState,
  Field,
  LoadingState,
  PageHeader,
  Panel,
  inputClasses,
  textareaClasses,
} from "@/components/admin/ui"
import {
  deleteAuthor,
  listArticles,
  listAuthors,
  saveAuthor,
} from "@/lib/admin/service"
import type { AdminAuthor } from "@/lib/admin/types"

type Draft = {
  id?: string
  name: string
  role: string
  company: string
  bio: string
  avatar: string
  profileUrl: string
}

const EMPTY: Draft = {
  name: "",
  role: "",
  company: "Trevor Digital Solutions",
  bio: "",
  avatar: "",
  profileUrl: "",
}

function initialsOf(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<AdminAuthor[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  const [draft, setDraft] = useState<Draft | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<AdminAuthor | null>(null)
  const [busy, setBusy] = useState(false)

  async function load() {
    const [nextAuthors, articles] = await Promise.all([listAuthors(), listArticles()])
    const nextCounts: Record<string, number> = {}
    for (const author of nextAuthors) {
      nextCounts[author.id] = articles.filter((a) => a.authorId === author.id).length
    }
    setAuthors(nextAuthors)
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

  async function submit() {
    if (!draft) return
    if (!draft.name.trim()) {
      setError("A name is required.")
      return
    }

    setBusy(true)
    await saveAuthor({
      id: draft.id,
      name: draft.name.trim(),
      role: draft.role.trim(),
      company: draft.company.trim(),
      bio: draft.bio.trim(),
      avatar: draft.avatar.trim() || undefined,
      profileUrl: draft.profileUrl.trim() || undefined,
    })
    await load()
    setBusy(false)
    setDraft(null)
    setError(null)
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setBusy(true)
    await deleteAuthor(pendingDelete.id)
    await load()
    setBusy(false)
    setPendingDelete(null)
  }

  return (
    <>
      <PageHeader
        title="Authors"
        description="People who can be credited on TDS Insights articles."
        crumbs={[{ name: "Admin", href: "/admin" }, { name: "Authors" }]}
        actions={
          <Button size="cta" onClick={() => setDraft({ ...EMPTY })}>
            <Plus aria-hidden />
            New author
          </Button>
        }
      />

      {draft ? (
        <Panel
          title={draft.id ? "Edit author" : "New author"}
          className="mb-6"
          actions={
            <button
              type="button"
              onClick={() => {
                setDraft(null)
                setError(null)
              }}
              aria-label="Close form"
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          }
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <Field label="Name" htmlFor="author-name" required error={error ?? undefined}>
              <input
                id="author-name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className={inputClasses}
              />
            </Field>

            <Field label="Role" htmlFor="author-role">
              <input
                id="author-role"
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                placeholder="Founder & CEO"
                className={inputClasses}
              />
            </Field>

            <Field label="Company" htmlFor="author-company">
              <input
                id="author-company"
                value={draft.company}
                onChange={(e) => setDraft({ ...draft, company: e.target.value })}
                className={inputClasses}
              />
            </Field>

            <Field
              label="Profile URL"
              htmlFor="author-profile"
              hint="Optional link shown under the biography."
            >
              <input
                id="author-profile"
                value={draft.profileUrl}
                onChange={(e) => setDraft({ ...draft, profileUrl: e.target.value })}
                placeholder="/founder"
                className={inputClasses}
              />
            </Field>

            <Field
              label="Avatar path"
              htmlFor="author-avatar"
              hint="A file in /public. Initials are shown if left blank."
            >
              <input
                id="author-avatar"
                value={draft.avatar}
                onChange={(e) => setDraft({ ...draft, avatar: e.target.value })}
                placeholder="/founder.png"
                className={inputClasses}
              />
            </Field>

            <Field
              label="Biography"
              htmlFor="author-bio"
              className="lg:col-span-2"
              hint="Shown at the foot of every article they write. Record only what can be verified."
            >
              <textarea
                id="author-bio"
                value={draft.bio}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                rows={4}
                className={textareaClasses}
              />
            </Field>
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-hairline pt-5 sm:flex-row sm:justify-end">
            <Button
              size="cta"
              variant="outline"
              onClick={() => {
                setDraft(null)
                setError(null)
              }}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button size="cta" onClick={submit} disabled={busy}>
              {draft.id ? "Save changes" : "Create author"}
            </Button>
          </div>
        </Panel>
      ) : null}

      {loading ? (
        <LoadingState label="Loading authors" />
      ) : authors.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No authors"
          description="Add an author before publishing articles."
          action={
            <Button size="cta" onClick={() => setDraft({ ...EMPTY })}>
              <Plus aria-hidden />
              New author
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {authors.map((author) => (
            <li key={author.id} className="rounded-xl bg-surface p-5 ring-1 ring-hairline">
              <div className="flex gap-4">
                {author.avatar ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="size-14 shrink-0 rounded-lg object-cover object-top ring-1 ring-hairline"
                  />
                ) : (
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-[family-name:var(--font-display)] text-sm font-semibold text-brand-lift ring-1 ring-primary/20">
                    {initialsOf(author.name)}
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-foreground">{author.name}</h2>
                  <p className="mt-0.5 text-sm text-brand-lift">
                    {author.role}
                    {author.company ? `, ${author.company}` : ""}
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-mono)] text-[0.6875rem] text-muted-foreground/70">
                    {counts[author.id] ?? 0} article(s)
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {author.bio || "No biography recorded."}
              </p>

              <div className="mt-5 flex items-center gap-1 border-t border-hairline pt-4">
                <button
                  type="button"
                  onClick={() =>
                    setDraft({
                      id: author.id,
                      name: author.name,
                      role: author.role,
                      company: author.company,
                      bio: author.bio,
                      avatar: author.avatar ?? "",
                      profileUrl: author.profileUrl ?? "",
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="size-3.5" aria-hidden />
                  Edit
                </button>
                {author.profileUrl ? (
                  <Link
                    href={author.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <ExternalLink className="size-3.5" aria-hidden />
                    Profile
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={() => setPendingDelete(author)}
                  className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" aria-hidden />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this author?"
        description={`“${pendingDelete?.name}” is credited on ${counts[pendingDelete?.id ?? ""] ?? 0} article(s), which will need reassigning.`}
        confirmLabel="Delete author"
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
