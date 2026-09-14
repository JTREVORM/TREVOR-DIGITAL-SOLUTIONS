import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArticleHeader } from "@/components/insights/article-header"
import { ArticleContent } from "@/components/insights/article-content"
import { AuthorCard } from "@/components/insights/author-card"
import { RelatedArticles } from "@/components/insights/related-articles"
import { ShareButtons } from "@/components/insights/share-buttons"
import { NewsletterCta } from "@/components/insights/newsletter-cta"
import {
  articles as allArticles,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/content/insights"
import { site } from "@/lib/site"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return allArticles
    .filter((article) => article.status !== "draft")
    .map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return { title: "Article not found" }

  const title = article.seoTitle ?? article.title
  const description = article.seoDescription ?? article.excerpt
  const url = `${site.url}/insights/${article.slug}`
  const image = article.featuredImage ?? "/logo.png"

  return {
    title,
    description,
    authors: [{ name: article.author.name, url: `${site.url}/founder` }],
    keywords: article.tags,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: article.publishedDate,
      modifiedTime: article.updatedDate ?? article.publishedDate,
      authors: [article.author.name],
      tags: article.tags,
      siteName: site.name,
      images: [{ url: image, alt: article.featuredImageAlt ?? article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: { canonical: url },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const related = getRelatedArticles(article)
  const url = `${site.url}/insights/${article.slug}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.seoDescription ?? article.excerpt,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: article.publishedDate,
    dateModified: article.updatedDate ?? article.publishedDate,
    keywords: article.tags.join(", "),
    articleSection: article.category.name,
    wordCount: article.readingTime * 200,
    image: `${site.url}${article.featuredImage ?? "/logo.png"}`,
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.role,
      url: `${site.url}/founder`,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: { "@type": "ImageObject", url: `${site.url}/logo.png` },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ArticleHeader article={article} />

      <article className="py-14 sm:py-16 lg:py-20">
        <div className="shell">
          {article.status === "sample" ? (
            <aside className="mb-10 max-w-[68ch] rounded-xl bg-muted/60 p-5 ring-1 ring-hairline">
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">
                  This is a sample article.
                </span>{" "}
                It demonstrates the Insights layout and typography while the
                publication is being set up. It is not published TDS reporting,
                and it contains no client information.
              </p>
            </aside>
          ) : null}

          <ArticleContent content={article.content} />

          {/* Tags */}
          {article.tags.length > 0 ? (
            <div className="mt-14 max-w-[68ch] border-t border-hairline pt-8">
              <p className="eyebrow mb-4">Topics</p>
              <ul className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <li
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[0.75rem] text-muted-foreground ring-1 ring-hairline"
                  >
                    <Tag className="size-3 text-brand-lift" aria-hidden />
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Share again at the foot, where people finish reading */}
          <div className="mt-10 max-w-[68ch] border-t border-hairline pt-8">
            <ShareButtons slug={article.slug} title={article.title} />
          </div>

          {/* Author */}
          <div className="mt-14 max-w-[68ch]">
            <AuthorCard author={article.author} />
          </div>

          <div className="mt-10 max-w-[68ch]">
            <Button size="cta" variant="outline" asChild>
              <Link href="/insights">
                <ArrowLeft aria-hidden />
                All insights
              </Link>
            </Button>
          </div>
        </div>
      </article>

      <div className="border-t border-hairline bg-surface py-14 sm:py-16">
        <RelatedArticles articles={related} />
      </div>

      <NewsletterCta />
    </>
  )
}
