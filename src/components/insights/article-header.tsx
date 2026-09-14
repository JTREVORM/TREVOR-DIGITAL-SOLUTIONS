import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ArticleMedia } from "./article-media"
import { CategoryIcon } from "./category-icon"
import { SampleBadge } from "./article-meta"
import { ShareButtons } from "./share-buttons"
import { formatArticleDate } from "@/lib/content/insights-utils"
import type { ResolvedArticle } from "@/lib/content/insights-types"

/**
 * The masthead of an article: breadcrumb, category, title, excerpt, byline,
 * dates, reading time, sharing and the featured image.
 */
export function ArticleHeader({ article }: { article: ResolvedArticle }) {
  const { category, author } = article

  return (
    <header className="relative overflow-hidden border-b border-hairline bg-surface pt-14 pb-0 sm:pt-16">
      <div className="brand-wash-soft pointer-events-none absolute inset-0" aria-hidden />

      <div className="shell relative">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
            <li>
              <Link href="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5 text-muted-foreground/60" />
            </li>
            <li>
              <Link href="/insights" className="transition-colors hover:text-foreground">
                Insights
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5 text-muted-foreground/60" />
            </li>
            <li>
              <Link
                href={`/insights/category/${category.slug}`}
                className="transition-colors hover:text-foreground"
              >
                {category.name}
              </Link>
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/insights/category/${category.slug}`}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.1em] text-brand-lift uppercase ring-1 ring-primary/20 transition-colors hover:bg-primary/15"
            >
              <CategoryIcon name={category.iconName} className="size-3" />
              {category.name}
            </Link>
            {article.status === "sample" ? <SampleBadge /> : null}
          </div>

          <h1 className="mt-6 text-[2rem] leading-[1.12] font-semibold text-foreground sm:text-[2.5rem] lg:text-[3rem]">
            {article.title}
          </h1>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {article.excerpt}
          </p>

          {/* Byline */}
          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <span className="font-medium text-foreground">{author.name}</span>
            <span aria-hidden className="text-muted-foreground/40">
              &middot;
            </span>
            <span className="text-muted-foreground">{author.role}</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
            <time dateTime={article.publishedDate}>
              Published {formatArticleDate(article.publishedDate)}
            </time>
            {article.updatedDate ? (
              <>
                <span aria-hidden className="text-muted-foreground/40">
                  &middot;
                </span>
                <time dateTime={article.updatedDate}>
                  Updated {formatArticleDate(article.updatedDate)}
                </time>
              </>
            ) : null}
            <span aria-hidden className="text-muted-foreground/40">
              &middot;
            </span>
            <span>{article.readingTime} min read</span>
          </div>

          <div className="mt-7 border-t border-hairline pt-6">
            <ShareButtons slug={article.slug} title={article.title} />
          </div>
        </div>

        {/* Featured image sits flush with the section foot. */}
        <div className="mt-12 overflow-hidden rounded-t-2xl ring-1 ring-hairline ring-b-0">
          <ArticleMedia
            article={article}
            ratio="16/9"
            sizes="(max-width: 1280px) 100vw, 1200px"
            priority
          />
        </div>
      </div>
    </header>
  )
}
