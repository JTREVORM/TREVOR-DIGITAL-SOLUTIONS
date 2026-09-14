import { cn } from "@/lib/utils"
import { CategoryIcon } from "./category-icon"
import { formatArticleDate } from "@/lib/content/insights"
import type { ResolvedArticle } from "@/lib/content/insights-types"

/**
 * Byline, date and reading time. One component so every surface — cards,
 * featured slot, article header — states them identically.
 */
export function ArticleMeta({
  article,
  className,
  showAuthor = true,
}: {
  article: ResolvedArticle
  className?: string
  showAuthor?: boolean
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground",
        className
      )}
    >
      {showAuthor ? (
        <>
          <span className="text-foreground/80">{article.author.name}</span>
          <span aria-hidden className="text-muted-foreground/40">
            &middot;
          </span>
        </>
      ) : null}
      <time dateTime={article.publishedDate}>
        {formatArticleDate(article.publishedDate)}
      </time>
      <span aria-hidden className="text-muted-foreground/40">
        &middot;
      </span>
      <span>{article.readingTime} min read</span>
    </div>
  )
}

/**
 * Marks content that exists to demonstrate the layout. Sample articles are
 * labelled everywhere they appear so a reader never mistakes one for
 * published TDS reporting.
 */
export function SampleBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-muted px-2 py-0.5 font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.1em] text-muted-foreground uppercase ring-1 ring-hairline",
        className
      )}
    >
      Sample
    </span>
  )
}

export function CategoryChip({
  article,
  className,
}: {
  article: ResolvedArticle
  className?: string
}) {
  const { category } = article
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.1em] text-brand-lift uppercase ring-1 ring-primary/20",
        className
      )}
    >
      <CategoryIcon name={category.iconName} className="size-3" />
      {category.name}
    </span>
  )
}
