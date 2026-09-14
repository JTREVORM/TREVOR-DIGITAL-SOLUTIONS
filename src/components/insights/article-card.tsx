import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { ArticleMedia } from "./article-media"
import { ArticleMeta, CategoryChip, SampleBadge } from "./article-meta"
import type { ResolvedArticle } from "@/lib/content/insights-types"

/**
 * The article card. Used by the latest grid, category pages and related
 * articles, so all three stay identical.
 */

type ArticleCardProps = {
  article: ResolvedArticle
  /** Drop the excerpt where space is tight, e.g. related articles. */
  compact?: boolean
  priority?: boolean
  className?: string
}

export function ArticleCard({
  article,
  compact = false,
  priority = false,
  className,
}: ArticleCardProps) {
  return (
    <article className={cn("group h-full", className)}>
      <Link
        href={`/insights/${article.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-xl bg-surface ring-1 ring-hairline transition-colors duration-200 hover:ring-primary/40"
      >
        <div className="border-b border-hairline">
          <ArticleMedia
            article={article}
            ratio="16/9"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            priority={priority}
          />
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryChip article={article} />
            {article.status === "sample" ? <SampleBadge /> : null}
          </div>

          <h3
            className={cn(
              "mt-4 leading-snug font-semibold text-foreground",
              compact ? "text-base" : "text-lg"
            )}
          >
            {article.title}
          </h3>

          {!compact ? (
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              {article.excerpt}
            </p>
          ) : (
            <div className="flex-1" />
          )}

          <div className="mt-5 border-t border-hairline pt-4">
            <ArticleMeta article={article} />
            <span className="mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-brand-lift">
              Read article
              <ArrowUpRight
                className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
