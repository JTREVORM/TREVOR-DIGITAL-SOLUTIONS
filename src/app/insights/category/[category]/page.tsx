import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section } from "@/components/site/section"
import { ArticleCard } from "@/components/insights/article-card"
import { CategoryIcon } from "@/components/insights/category-icon"
import { NewsletterCta } from "@/components/insights/newsletter-cta"
import {
  getActiveCategories,
  getArticlesInCategory,
  getCategoryBySlug,
} from "@/lib/content/insights-queries"
import { site } from "@/lib/site"
import { BreadcrumbJsonLd } from "@/components/site/structured-data"

/**
 * Rendered per request.
 *
 * Insights is CMS-backed: an article published in the admin portal has to
 * appear here immediately, and one unpublished has to disappear just as fast.
 * A statically cached page would keep serving whatever existed at build time —
 * which, on the first deploy, is nothing at all.
 */
export const dynamic = "force-dynamic"

type Props = { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: "Category not found" }

  const url = `${site.url}/insights/category/${category.slug}`

  return {
    title: `${category.name} — Insights`,
    description: category.description,
    openGraph: {
      title: `${category.name} | TDS Insights`,
      description: category.description,
      url,
      type: "website",
      images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }],
    },
    alternates: { canonical: url },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const [articles, active] = await Promise.all([
    getArticlesInCategory(category.id),
    getActiveCategories(),
  ])
  const otherCategories = active.filter((c) => c.id !== category.id)

  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: category.name, path: `/insights/category/${category.slug}` },
        ]}
      />

      <PageHero
        eyebrow={`Insights / ${category.name}`}
        title={category.name}
        lead={category.description}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Insights", href: "/insights" },
          { name: category.name },
        ]}
        actions={
          <Button size="cta-lg" variant="outline" asChild>
            <Link href="/insights">
              All insights
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      <Section space="loose">
        {articles.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground">
              {articles.length} {articles.length === 1 ? "article" : "articles"} in{" "}
              {category.name}.
            </p>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {articles.map((article, index) => (
                <li key={article.slug} className="h-full">
                  <ArticleCard article={article} priority={index < 3} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="rounded-xl bg-surface p-10 text-center ring-1 ring-hairline sm:p-14">
            <span className="mx-auto inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-brand-lift ring-1 ring-primary/20">
              <CategoryIcon name={category.iconName} className="size-5" />
            </span>
            <h2 className="mt-5 text-lg font-semibold text-foreground">
              Nothing published here yet
            </h2>
            <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-muted-foreground">
              We have not published in {category.name} yet. The other
              categories have articles, and new pieces are added as we write
              them.
            </p>
            <Button size="cta" variant="outline" className="mt-7" asChild>
              <Link href="/insights">Browse all insights</Link>
            </Button>
          </div>
        )}

        {otherCategories.length > 0 ? (
          <nav aria-label="Other categories" className="mt-16 border-t border-hairline pt-10">
            <p className="eyebrow mb-4">Other categories</p>
            <ul className="flex flex-wrap gap-2">
              {otherCategories.map((other) => (
                <li key={other.id}>
                  <Link
                    href={`/insights/category/${other.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-surface px-3.5 py-2 text-[0.8125rem] font-medium text-muted-foreground ring-1 ring-hairline transition-colors hover:text-foreground hover:ring-primary/35"
                  >
                    <CategoryIcon name={other.iconName} className="size-3.5 text-brand-lift" />
                    {other.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </Section>

      <NewsletterCta />
    </>
  )
}
