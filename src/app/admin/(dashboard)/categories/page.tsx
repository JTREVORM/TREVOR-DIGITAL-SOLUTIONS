"use client"

import { useEffect, useState } from "react"
import { FolderKanban, Pencil, Plus, Trash2, X } from "lucide-react"
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
import { CategoryIcon } from "@/components/insights/category-icon"
import {
  deleteCategory,
  listArticles,
  listCategories,
  saveCategory,
  slugify,
} from "@/lib/admin/service"
import type { AdminCategory } from "@/lib/admin/types"
import type { CategoryIconName } from "@/lib/content/insights-types"
import { cn } from "@/lib/utils"

const ICON_OPTIONS: Array<{ value: CategoryIconName; label: string }> = [
  { value: "newspaper", label: "Newspaper" },
  { value: "cpu", label: "Chip" },
  { value: "line-chart", label: "Chart" },
  { value: "brain", label: "AI" },
  { value: "building", label: "Business" },
]

type Draft = {
  id?: string
  name: string
  slug: string
  description: string
  iconName: CategoryIconName
}

const EMPTY: Draft = {
  name: "",
  slug: "",
  description: "",
  iconName: "newspaper",
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  const [draft, setDraft] = useState<Draft | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<AdminCategory | null>(null)
  const [busy, setBusy] = useState(false)

  async function load() {
    const [nextCategories, articles] = await Promise.all([
      listCategories(),
      listArticles(),
    ])
    const nextCounts: Record<string, number> = {}
    for (const category of nextCategories) {
      nextCounts[category.id] = articles.filter(
        (article) => article.categoryId === category.id
      ).length
    }
    setCategories(nextCategories)
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
    await saveCategory({
      id: draft.id,
      name: draft.name.trim(),
      slug: draft.slug.trim() || slugify(draft.name),
      description: draft.description.trim(),
      iconName: draft.iconName,
    })
    await load()
    setBusy(false)
    setDraft(null)
    setError(null)
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setBusy(true)
    await deleteCategory(pendingDelete.id)
    await load()
    setBusy(false)
    setPendingDelete(null)
  }

  return (
    <>
      <PageHeader
        title="Categories"
        description="Sections articles are filed under on TDS Insights."
        crumbs={[{ name: "Admin", href: "/admin" }, { name: "Categories" }]}
        actions={
          <Button size="cta" onClick={() => setDraft({ ...EMPTY })}>
            <Plus aria-hidden />
            New category
          </Button>
        }
      />

      {draft ? (
        <Panel
          title={draft.id ? "Edit category" : "New category"}
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
            <Field label="Name" htmlFor="category-name" required error={error ?? undefined}>
              <input
                id="category-name"
                value={draft.name}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    name: e.target.value,
                    slug: draft.id ? draft.slug : slugify(e.target.value),
                  })
                }
                placeholder="Software Engineering"
                className={inputClasses}
              />
            </Field>

            <Field label="Slug" htmlFor="category-slug" hint="Used in /insights/category/…">
              <input
                id="category-slug"
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })}
                placeholder="software-engineering"
                className={cn(inputClasses, "font-[family-name:var(--font-mono)]")}
              />
            </Field>

            <Field label="Icon" htmlFor="category-icon" className="lg:col-span-1">
              <select
                id="category-icon"
                value={draft.iconName}
                onChange={(e) =>
                  setDraft({ ...draft, iconName: e.target.value as CategoryIconName })
                }
                className={inputClasses}
              >
                {ICON_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Description"
              htmlFor="category-description"
              className="lg:col-span-2"
              hint="Shown on the category page beneath the title."
            >
              <textarea
                id="category-description"
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                rows={2}
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
              {draft.id ? "Save changes" : "Create category"}
            </Button>
          </div>
        </Panel>
      ) : null}

      {loading ? (
        <LoadingState label="Loading categories" />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No categories"
          description="Create a category before publishing articles."
          action={
            <Button size="cta" onClick={() => setDraft({ ...EMPTY })}>
              <Plus aria-hidden />
              New category
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex flex-col rounded-xl bg-surface p-5 ring-1 ring-hairline"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/20">
                  <CategoryIcon name={category.iconName} className="size-[1.125rem]" />
                </span>
                <span className="rounded-md bg-muted px-2 py-1 font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.1em] text-muted-foreground uppercase">
                  {counts[category.id] ?? 0}{" "}
                  {(counts[category.id] ?? 0) === 1 ? "article" : "articles"}
                </span>
              </div>

              <h2 className="mt-4 text-base font-semibold text-foreground">
                {category.name}
              </h2>
              <p className="mt-1 font-[family-name:var(--font-mono)] text-xs text-muted-foreground">
                /{category.slug}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {category.description || "No description."}
              </p>

              <div className="mt-5 flex items-center gap-1 border-t border-hairline pt-4">
                <button
                  type="button"
                  onClick={() =>
                    setDraft({
                      id: category.id,
                      name: category.name,
                      slug: category.slug,
                      description: category.description,
                      iconName: category.iconName,
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="size-3.5" aria-hidden />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(category)}
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
        title="Delete this category?"
        description={
          (counts[pendingDelete?.id ?? ""] ?? 0) > 0
            ? `“${pendingDelete?.name}” still has ${counts[pendingDelete?.id ?? ""]} article(s). They will keep the category id and need reassigning.`
            : `“${pendingDelete?.name}” will be removed. This cannot be undone.`
        }
        confirmLabel="Delete category"
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
