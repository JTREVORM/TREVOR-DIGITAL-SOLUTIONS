"use client"

import { useDeferredValue, useMemo, useState } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArticleCard } from "./article-card"
import { CategoryIcon } from "./category-icon"
import { AllIcon } from "./all-icon"
import { cn } from "@/lib/utils"
import type { InsightCategory, ResolvedArticle } from "@/lib/content/insights-types"

/**
 * Search and category filtering for /insights.
 *
 * Receives pre-resolved articles and a pre-built search index from the
 * server, so no article content is parsed in the browser and swapping the
 * data source in Phase 5 changes nothing here.
 */

type Indexed = {
  article: ResolvedArticle
  /** Lowercased title, excerpt, tags and body text. */
  haystack: string
}

type InsightsBrowserProps = {
  items: Indexed[]
  categories: InsightCategory[]
}

export function InsightsBrowser({ items, categories }: InsightsBrowserProps) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string>("all")

  // Keeps typing responsive when the list grows.
  const deferredQuery = useDeferredValue(query)

  const counts = useMemo(() => {
    const map = new Map<string, number>([["all", items.length]])
    for (const c of categories) {
      map.set(c.id, items.filter((i) => i.article.categoryId === c.id).length)
    }
    return map
  }, [items, categories])

  const results = useMemo(() => {
    const terms = deferredQuery.trim().toLowerCase().split(/\s+/).filter(Boolean)

    return items
      .filter((item) => category === "all" || item.article.categoryId === category)
      .filter((item) => terms.every((term) => item.haystack.includes(term)))
      .map((item) => item.article)
  }, [items, deferredQuery, category])

  const isSearching = query.trim().length > 0
  const isFiltered = isSearching || category !== "all"

  function clearAll() {
    setQuery("")
    setCategory("all")
  }

  const filters = [
    { id: "all", label: "All", iconName: null },
    ...categories.map((c) => ({ id: c.id, label: c.name, iconName: c.iconName })),
  ]

  return (
    <div>
      {/* Search */}
      <div className="relative">
        <label htmlFor="insights-search" className="sr-only">
          Search articles
        </label>
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          id="insights-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search articles by title, topic or keyword"
          className="h-12 w-full rounded-xl border border-input bg-input/30 pr-11 pl-11 text-[0.9375rem] text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        {isSearching ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute top-1/2 right-2.5 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {/* Category filter */}
      <div
        role="group"
        aria-label="Filter articles by category"
        className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {filters.map((filter) => {
          const isActive = category === filter.id
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setCategory(filter.id)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2.5 text-[0.8125rem] font-medium whitespace-nowrap ring-1 transition-colors",
                isActive
                  ? "bg-primary/12 text-foreground ring-primary/40"
                  : "text-muted-foreground ring-hairline hover:text-foreground hover:ring-primary/25"
              )}
            >
              {filter.iconName ? (
                <CategoryIcon
                  name={filter.iconName}
                  className={cn(
                    "size-3.5",
                    isActive ? "text-brand-lift" : "text-muted-foreground/70"
                  )}
                />
              ) : (
                <AllIcon
                  className={cn(
                    "size-3.5",
                    isActive ? "text-brand-lift" : "text-muted-foreground/70"
                  )}
                />
              )}
              {filter.label}
              <span
                className={cn(
                  "font-[family-name:var(--font-mono)] text-[0.6875rem]",
                  isActive ? "text-brand-lift" : "text-muted-foreground/50"
                )}
              >
                {counts.get(filter.id) ?? 0}
              </span>
            </button>
          )
        })}
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {results.map((article, index) => (
            <li key={article.slug} className="h-full">
              <ArticleCard article={article} priority={index < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-xl bg-surface p-10 text-center ring-1 ring-hairline sm:p-14">
          <span className="mx-auto inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-brand-lift ring-1 ring-primary/20">
            <Search className="size-5" aria-hidden />
          </span>
          <h3 className="mt-5 text-lg font-semibold text-foreground">
            No articles match that search
          </h3>
          <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-muted-foreground">
            {isSearching ? (
              <>
                Nothing found for{" "}
                <span className="text-foreground">&ldquo;{query.trim()}&rdquo;</span>
                {category !== "all" ? " in this category" : ""}. Try a broader
                term, or clear the filters to see everything.
              </>
            ) : (
              "There are no articles in this category yet."
            )}
          </p>
          {isFiltered ? (
            <Button size="cta" variant="outline" className="mt-7" onClick={clearAll}>
              Clear filters
            </Button>
          ) : null}
        </div>
      )}

      <p aria-live="polite" className="mt-8 text-sm text-muted-foreground">
        Showing {results.length} of {items.length} articles
        {isFiltered ? " matching your filters" : ""}.
      </p>
    </div>
  )
}
