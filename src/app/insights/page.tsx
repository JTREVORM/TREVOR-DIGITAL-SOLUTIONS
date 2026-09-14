import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { Section, SectionHeading } from "@/components/site/section"
import { FeaturedArticle } from "@/components/insights/featured-article"
import { InsightsBrowser } from "@/components/insights/insights-browser"
import { CategoryIcon } from "@/components/insights/category-icon"
import { NewsletterCta } from "@/components/insights/newsletter-cta"
import {
  getActiveCategories,
  getFeaturedArticle,
  getVisibleArticles,
} from "@/lib/content/insights-queries"
import { searchIndexOf } from "@/lib/content/insights-utils"
import { site } from "@/lib/site"

/**
 * Rendered per request.
 *
 * Insights is CMS-backed: an article published in the admin portal has to
 * appear here immediately, and one unpublished has to disappear just as fast.
 * A statically cached page would keep serving whatever existed at build time —
 * which, on the first deploy, is nothing at all.
 */
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Technology, engineering and market insights from Trevor Digital Solutions — software engineering, business systems, financial markets, AI and digital operations.",
  keywords: [
    "software engineering blog Uganda",
    "technology insights Kampala",
    "Trevor Digital Solutions insights",
    "business systems articles",
    "MetaTrader development articles",
  ],
  openGraph: {
    title: "TDS Insights | Trevor Digital Solutions",
    description:
      "Technology, engineering and market insights from Trevor Digital Solutions.",
    url: "https://trevordigitalsolutions.com/insights",
    type: "website",
    images: [{ url: "/logo.png", width: 1536, height: 1024, alt: site.name }],
  },
  alternates: { canonical: "https://trevordigitalsolutions.com/insights" },
}

export default async function InsightsPage() {
  const [articles, featured, categories] = await Promise.all([
    getVisibleArticles(),
    getFeaturedArticle(),
    getActiveCategories(),
  ])

  // Search index is built on the server so no article body ships twice.
  const items = articles.map((article) => ({
    article,
    haystack: searchIndexOf(article),
  }))

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "TDS Insights",
    url: `${site.url}/insights`,
    description:
      "Technology, engineering and market insights from Trevor Digital Solutions.",
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: `${site.url}/logo.png`,
    },
    blogPost: articles.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      url: `${site.url}/insights/${article.slug}`,
      datePublished: article.publishedDate,
      author: { "@type": "Person", name: article.author.name },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="TDS Insights"
        title="Technology, engineering and market insights."
        lead="Notes from building business software in Uganda — what we have learned about architecture, data, automation and market systems, written for the people who have to live with the results."
        crumbs={[{ name: "Home", href: "/" }, { name: "Insights" }]}
      >
        <nav aria-label="Article categories">
          <p className="eyebrow mb-4">Categories</p>
          <ul className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/insights/category/${category.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-surface-raised px-3.5 py-2 text-[0.8125rem] font-medium text-muted-foreground ring-1 ring-hairline transition-colors hover:text-foreground hover:ring-primary/35"
                >
                  <CategoryIcon name={category.iconName} className="size-3.5 text-brand-lift" />
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {/* Featured */}
      {featured ? (
        <Section space="default">
          <FeaturedArticle article={featured} />
        </Section>
      ) : null}

      {/* Latest + search + filter */}
      <Section id="latest" tone="surface" space="loose" divide="both">
        <SectionHeading
          eyebrow="Latest"
          title="All articles."
          description="Search by keyword or filter by category."
        />
        <div className="mt-12">
          <InsightsBrowser items={items} categories={categories} />
        </div>
      </Section>

      {/* Browse by category */}
      <Section space="loose">
        <SectionHeading
          eyebrow="Browse"
          title="By category."
          description="Five areas we write about, each with its own page."
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.id} className="h-full">
              <Link
                href={`/insights/category/${category.slug}`}
                className="group flex h-full flex-col rounded-xl bg-surface p-6 ring-1 ring-hairline transition-colors duration-200 hover:bg-surface-raised hover:ring-primary/40"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/20">
                  <CategoryIcon name={category.iconName} className="size-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-foreground">
                  {category.name}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-brand-lift">
                  Browse
                  <ArrowUpRight
                    className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <NewsletterCta />

      {/* Route back into the business */}
      <Section space="default" divide="top">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-foreground">
              Have a problem one of these could solve?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We write about this work because we do it. Tell us what you need
              built and we will scope it properly.
            </p>
          </div>
          <Button size="cta-lg" asChild>
            <Link href="/contact">
              Start a Project
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </Section>
    </>
  )
}
