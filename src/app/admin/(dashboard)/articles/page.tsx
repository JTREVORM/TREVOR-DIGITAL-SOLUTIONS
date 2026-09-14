"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowUpDown,
  ExternalLink,
  FileText,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ConfirmDialog,
  EmptyState,
  LoadingState,
  PageHeader,
  StatusBadge,
  Toolbar,
  inputClasses,
} from "@/components/admin/ui"
import { deleteArticle, listArticles, listCategories } from "@/lib/admin/service"
import type { AdminArticle, AdminCategory, ArticleStatus } from "@/lib/admin/types"
import { cn } from "@/lib/utils"

type StatusFilter = ArticleStatus | "all"
type SortOrder = "newest" | "oldest"

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<AdminArticle[]>([])
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)

  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [categoryId, setCategoryId] = useState<string>("all")
  const [sort, setSort] = useState<SortOrder>("newest")

  const [pendingDelete, setPendingDelete] = useState<AdminArticle | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    const [nextArticles, nextCategories] = await Promise.all([
      listArticles(),
      listCategories(),
    ])
    setArticles(nextArticles)
    setCategories(nextCategories)
    setLoading(false)
  }

  useEffect(() => {
    let active = true

    // State is set inside an async closure, after an await, so the effect
    // body itself never calls setState synchronously.
    const refresh = () => {
      void (async () => {
        const [nextArticles, nextCategories] = await Promise.all([
          listArticles(),
          listCategories(),
        ])
        if (!active) return
        setArticles(nextArticles)
        setCategories(nextCategories)
        setLoading(false)
      })()
    }

    refresh()
    window.addEventListener("tds-admin-store-changed", refresh)
    return () => {
      active = false
      window.removeEventListener("tds-admin-store-changed", refresh)
    }
  }, [])

  const categoryName = (id: string) =>
    categories.find((category) => category.id === id)?.name ?? "Uncategorised"

  const filtered = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)

    const result = articles
      .filter((article) => status === "all" || article.status === status)
      .filter((article) => categoryId === "all" || article.categoryId === categoryId)
      .filter((article) => {
        if (terms.length === 0) return true
        const haystack = [
          article.title,
          article.excerpt,
          article.slug,
          ...article.tags,
        ]
          .join(" ")
          .toLowerCase()
        return terms.every((term) => haystack.includes(term))
      })

    return result.sort((a, b) => {
      const diff =
        new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime()
      return sort === "newest" ? -diff : diff
    })
  }, [articles, query, status, categoryId, sort])

  const isFiltered = query.trim() !== "" || status !== "all" || categoryId !== "all"

  function clearFilters() {
    setQuery("")
    setStatus("all")
    setCategoryId("all")
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    await deleteArticle(pendingDelete.id)
    await load()
    setDeleting(false)
    setPendingDelete(null)
  }

  return (
    <>
      <PageHeader
        title="Articles"
        description="Create, edit and publish TDS Insights content."
        crumbs={[{ name: "Admin", href: "/admin" }, { name: "Articles" }]}
        actions={
          <Button size="cta" asChild>
            <Link href="/admin/articles/new">
              <Plus aria-hidden />
              New article
            </Link>
          </Button>
        }
      />

      {loading ? (
        <LoadingState label="Loading articles" />
      ) : (
        <>
          <Toolbar>
            {/* Search */}
            <div className="relative lg:max-w-sm lg:flex-1">
              <label htmlFor="article-search" className="sr-only">
                Search articles
              </label>
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                id="article-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, slug or tag"
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

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="filter-status" className="sr-only">
                Filter by status
              </label>
              <select
                id="filter-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as StatusFilter)}
                className={cn(inputClasses, "w-auto min-w-[8.5rem]")}
              >
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>

              <label htmlFor="filter-category" className="sr-only">
                Filter by category
              </label>
              <select
                id="filter-category"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className={cn(inputClasses, "w-auto min-w-[9.5rem]")}
              >
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setSort((s) => (s === "newest" ? "oldest" : "newest"))}
                className={cn(inputClasses, "inline-flex w-auto items-center gap-2")}
                aria-label={`Sort by date, currently ${sort} first`}
              >
                <ArrowUpDown className="size-3.5 text-muted-foreground" aria-hidden />
                {sort === "newest" ? "Newest" : "Oldest"}
              </button>

              {isFiltered ? (
                <Button size="cta" variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              ) : null}
            </div>
          </Toolbar>

          {filtered.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={isFiltered ? "No articles match those filters" : "No articles yet"}
              description={
                isFiltered
                  ? "Try a broader search, or clear the filters to see everything."
                  : "Create your first article to get TDS Insights started."
              }
              action={
                isFiltered ? (
                  <Button size="cta" variant="outline" onClick={clearFilters}>
                    Clear filters
                  </Button>
                ) : (
                  <Button size="cta" asChild>
                    <Link href="/admin/articles/new">
                      <Plus aria-hidden />
                      New article
                    </Link>
                  </Button>
                )
              }
            />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-hidden rounded-xl bg-surface ring-1 ring-hairline lg:block">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-surface-raised">
                    <tr>
                      {["Title", "Category", "Status", "Date", "Read", ""].map((head, i) => (
                        <th
                          key={head || i}
                          scope="col"
                          className="border-b border-hairline px-5 py-3 font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.1em] text-muted-foreground/70 uppercase"
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((article) => (
                      <tr
                        key={article.id}
                        className="border-b border-hairline last:border-0 hover:bg-surface-raised/60"
                      >
                        <td className="max-w-0 px-5 py-4 align-middle">
                          <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className="block truncate font-medium text-foreground transition-colors hover:text-brand-lift"
                          >
                            {article.title}
                          </Link>
                          <span className="mt-1 block truncate font-[family-name:var(--font-mono)] text-xs text-muted-foreground">
                            /{article.slug}
                          </span>
                        </td>
                        <td className="px-5 py-4 align-middle whitespace-nowrap text-muted-foreground">
                          {categoryName(article.categoryId)}
                        </td>
                        <td className="px-5 py-4 align-middle">
                          <StatusBadge status={article.status} />
                        </td>
                        <td className="px-5 py-4 align-middle whitespace-nowrap text-muted-foreground">
                          {article.publishedDate}
                        </td>
                        <td className="px-5 py-4 align-middle whitespace-nowrap text-muted-foreground">
                          {article.readingTime} min
                        </td>
                        <td className="px-5 py-4 align-middle">
                          <div className="flex items-center justify-end gap-1">
                            <RowActions
                              article={article}
                              onDelete={() => setPendingDelete(article)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards — a horizontally scrolling table is unusable on
                  a phone, so the same data is laid out as cards instead. */}
              <ul className="space-y-3 lg:hidden">
                {filtered.map((article) => (
                  <li
                    key={article.id}
                    className="rounded-xl bg-surface p-4 ring-1 ring-hairline"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="min-w-0 flex-1"
                      >
                        <p className="text-sm font-medium text-foreground">
                          {article.title}
                        </p>
                        <p className="mt-1 truncate font-[family-name:var(--font-mono)] text-xs text-muted-foreground">
                          /{article.slug}
                        </p>
                      </Link>
                      <StatusBadge status={article.status} />
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-hairline pt-3 text-xs">
                      <div>
                        <dt className="text-muted-foreground/60">Category</dt>
                        <dd className="mt-0.5 text-muted-foreground">
                          {categoryName(article.categoryId)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground/60">Date</dt>
                        <dd className="mt-0.5 text-muted-foreground">
                          {article.publishedDate} &middot; {article.readingTime} min
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-4 flex items-center gap-1 border-t border-hairline pt-3">
                      <RowActions
                        article={article}
                        onDelete={() => setPendingDelete(article)}
                        withLabels
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          <p aria-live="polite" className="mt-6 text-sm text-muted-foreground">
            Showing {filtered.length} of {articles.length} articles
            {isFiltered ? " matching your filters" : ""}.
          </p>
        </>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this article?"
        description={`“${pendingDelete?.title ?? ""}” will be removed. This cannot be undone.`}
        confirmLabel="Delete article"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}

function RowActions({
  article,
  onDelete,
  withLabels = false,
}: {
  article: AdminArticle
  onDelete: () => void
  withLabels?: boolean
}) {
  const base =
    "inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors"

  return (
    <>
      <Link
        href={`/admin/articles/${article.id}/edit`}
        className={cn(base, "text-muted-foreground hover:bg-muted hover:text-foreground")}
        aria-label={`Edit ${article.title}`}
      >
        <Pencil className="size-3.5" aria-hidden />
        {withLabels ? "Edit" : null}
      </Link>

      <Link
        href={`/insights/${article.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(base, "text-muted-foreground hover:bg-muted hover:text-foreground")}
        aria-label={`Preview ${article.title}`}
      >
        <ExternalLink className="size-3.5" aria-hidden />
        {withLabels ? "Preview" : null}
      </Link>

      <button
        type="button"
        onClick={onDelete}
        className={cn(base, "text-muted-foreground hover:bg-destructive/10 hover:text-destructive")}
        aria-label={`Delete ${article.title}`}
      >
        <Trash2 className="size-3.5" aria-hidden />
        {withLabels ? "Delete" : null}
      </button>
    </>
  )
}
