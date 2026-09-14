import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArticleMedia } from "./article-media"
import { ArticleMeta, CategoryChip, SampleBadge } from "./article-meta"
import type { ResolvedArticle } from "@/lib/content/insights-types"

/**
 * The lead article on /insights. Side-by-side on wide screens so the visual
 * has presence without pushing the headline below the fold.
 */
export function FeaturedArticle({ article }: { article: ResolvedArticle }) {
  return (
    <article className="group">
      <Link
        href={`/insights/${article.slug}`}
        className="grid overflow-hidden rounded-2xl bg-surface ring-1 ring-hairline transition-colors duration-200 hover:ring-primary/40 lg:grid-cols-[1.15fr_1fr] lg:items-stretch"
      >
        <div className="border-b border-hairline lg:border-r lg:border-b-0">
          <ArticleMedia
            article={article}
            ratio="16/9"
            sizes="(max-width: 1024px) 100vw, 700px"
            priority
            className="lg:h-full lg:aspect-auto"
          />
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.16em] text-brand-lift uppercase">
              Featured
            </span>
            <span aria-hidden className="text-muted-foreground/30">
              /
            </span>
            <CategoryChip article={article} />
            {article.status === "sample" ? <SampleBadge /> : null}
          </div>

          <h2 className="mt-5 text-[1.625rem] leading-[1.2] font-semibold text-foreground sm:text-[2rem] lg:text-[2.125rem]">
            {article.title}
          </h2>

          <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base">
            {article.excerpt}
          </p>

          <ArticleMeta article={article} className="mt-6" />

          <div className="mt-7">
            <Button size="cta" asChild>
              <span>
                Read article
                <ArrowRight aria-hidden />
              </span>
            </Button>
          </div>
        </div>
      </Link>
    </article>
  )
}
