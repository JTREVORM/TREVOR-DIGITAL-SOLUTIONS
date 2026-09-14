import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArticleCard } from "./article-card"
import type { ResolvedArticle } from "@/lib/content/insights-types"

/**
 * Related reading at the foot of an article. Renders nothing when there is
 * nothing to relate to, rather than an empty heading.
 */
export function RelatedArticles({ articles }: { articles: ResolvedArticle[] }) {
  if (articles.length === 0) return null

  return (
    <section aria-labelledby="related-articles" className="shell">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Keep reading</p>
          <h2
            id="related-articles"
            className="mt-4 text-2xl font-semibold text-foreground"
          >
            Related articles
          </h2>
        </div>
        <Button size="cta" variant="outline" asChild>
          <Link href="/insights">
            All insights
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      </div>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <li key={article.slug} className="h-full">
            <ArticleCard article={article} compact />
          </li>
        ))}
      </ul>
    </section>
  )
}
