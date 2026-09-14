import Image from "next/image"
import { cn } from "@/lib/utils"
import { CategoryIcon } from "./category-icon"
import type { ResolvedArticle } from "@/lib/content/insights-types"

/**
 * The visual for an article card or header.
 *
 * When a real featured image exists it is used. When one does not, this draws
 * a branded editorial plate from the article's category — deliberately
 * typographic and abstract, never a stock photograph or a generated image
 * dressed up as reportage. Setting `featuredImage` replaces it.
 */

type ArticleMediaProps = {
  article: ResolvedArticle
  ratio?: "16/9" | "16/10" | "4/3"
  sizes: string
  priority?: boolean
  className?: string
}

export function ArticleMedia({
  article,
  ratio = "16/9",
  sizes,
  priority = false,
  className,
}: ArticleMediaProps) {
  const { category } = article

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-background",
        ratio === "16/9" && "aspect-video",
        ratio === "16/10" && "aspect-[16/10]",
        ratio === "4/3" && "aspect-[4/3]",
        className
      )}
    >
      {article.featuredImage ? (
        <>
          <Image
            src={article.featuredImage}
            alt={article.featuredImageAlt ?? article.title}
            fill
            sizes={sizes}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"
            aria-hidden
          />
        </>
      ) : (
        <div className="absolute inset-0" aria-hidden>
          <div className="brand-grid absolute inset-0 opacity-50" />
          <div className="absolute inset-0 bg-[radial-gradient(28rem_16rem_at_30%_0%,oklch(0.6676_0.1797_248.36/13%),transparent_70%)]" />
          <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/25 backdrop-blur-sm">
              <CategoryIcon name={category.iconName} className="size-[1.125rem]" />
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.16em] text-muted-foreground/70 uppercase">
              {category.name}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
