import "server-only"

import { createPublicClient } from "@/lib/supabase/public"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { readingTimeOf } from "./insights-utils"
import { ARTICLE_SELECT } from "@/lib/supabase/types"
import type { ArticleWithRelations, CategoryRow } from "@/lib/supabase/types"
import type {
  Author,
  InsightCategory,
  ResolvedArticle,
} from "./insights-types"

/* ==========================================================================
   PUBLIC INSIGHTS QUERIES
   --------------------------------------------------------------------------
   Server-only. Every read goes through the anon key with RLS applied, so the
   embargo on drafts and scheduled posts is enforced by the database rather
   than by a filter in application code that could be forgotten.

   Reads go through an anonymous client on purpose — see
   lib/supabase/public.ts. A signed-in editor browsing the public site must
   see exactly what a stranger sees, not their own drafts.

   The policy is:
     status = 'published' AND published_date <= now()

   which means a scheduled article becomes visible on its own, at its own
   time, with no cron job and no deploy.

   The extra .eq()/.lte() filters below are belt and braces: they make the
   intent explicit at the call site and let Postgres use the partial index.
   ========================================================================== */

function mapCategory(row: CategoryRow): InsightCategory {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    iconName: row.icon_name,
  }
}

/** Fallback shown if an article somehow has no category or author attached. */
const UNFILED: InsightCategory = {
  id: "unfiled",
  slug: "unfiled",
  name: "Insights",
  description: "",
  iconName: "newspaper",
}

const UNATTRIBUTED: Author = {
  id: "unattributed",
  name: "Trevor Digital Solutions",
  role: "",
  company: "Trevor Digital Solutions",
  bio: "",
}

function mapArticle(row: ArticleWithRelations): ResolvedArticle {
  const tags =
    row.article_tags
      ?.map((link) => link.tags?.name)
      .filter((name): name is string => Boolean(name)) ?? []

  const category = row.categories ? mapCategory(row.categories) : UNFILED

  const author: Author = row.authors
    ? {
        id: row.authors.id,
        name: row.authors.name,
        role: row.authors.title,
        company: row.authors.company,
        bio: row.authors.bio,
        avatar: row.authors.avatar_url ?? undefined,
        profileUrl: row.authors.profile_url ?? undefined,
      }
    : UNATTRIBUTED

  return {
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content ?? [],
    featuredImage: row.featured_image ?? undefined,
    featuredImageAlt: row.featured_image_alt ?? undefined,
    categoryId: row.category_id ?? UNFILED.id,
    tags,
    authorId: row.author_id ?? UNATTRIBUTED.id,
    publishedDate: (row.published_date ?? row.created_at).slice(0, 10),
    updatedDate:
      row.updated_at && row.updated_at.slice(0, 10) !== (row.published_date ?? "").slice(0, 10)
        ? row.updated_at.slice(0, 10)
        : undefined,
    status: "published",
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    category,
    author,
    readingTime: row.reading_time || readingTimeOf(row.content ?? []),
  }
}

/** Published articles whose publication moment has passed, newest first. */
export async function getVisibleArticles(): Promise<ResolvedArticle[]> {
  if (!isSupabaseConfigured) return []

  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .lte("published_date", new Date().toISOString())
    .order("published_date", { ascending: false })

  if (error) {
    console.error("Insights: failed to load articles –", error.message)
    return []
  }

  return ((data ?? []) as unknown as ArticleWithRelations[]).map(mapArticle)
}

export async function getArticleBySlug(
  slug: string
): Promise<ResolvedArticle | undefined> {
  if (!isSupabaseConfigured) return undefined

  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_date", new Date().toISOString())
    .maybeSingle()

  if (error || !data) return undefined
  return mapArticle(data as unknown as ArticleWithRelations)
}

export async function getAllCategories(): Promise<InsightCategory[]> {
  if (!isSupabaseConfigured) return []

  const supabase = createPublicClient()
  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Insights: failed to load categories –", error.message)
    return []
  }
  return (data ?? []).map(mapCategory)
}

export async function getCategoryBySlug(
  slug: string
): Promise<InsightCategory | undefined> {
  if (!isSupabaseConfigured) return undefined

  const supabase = createPublicClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<CategoryRow>()

  return data ? mapCategory(data) : undefined
}

export async function getArticlesInCategory(
  categoryId: string
): Promise<ResolvedArticle[]> {
  const all = await getVisibleArticles()
  return all.filter((article) => article.categoryId === categoryId)
}

/** Categories that currently have at least one live article. */
export async function getActiveCategories(): Promise<InsightCategory[]> {
  const [categories, articles] = await Promise.all([
    getAllCategories(),
    getVisibleArticles(),
  ])
  return categories.filter((category) =>
    articles.some((article) => article.categoryId === category.id)
  )
}

/** The most recent article, used as the featured slot. */
export async function getFeaturedArticle(): Promise<ResolvedArticle | undefined> {
  const articles = await getVisibleArticles()
  return articles[0]
}

/** Same category first, then most recent. Never the article itself. */
export async function getRelatedArticles(
  article: ResolvedArticle,
  limit = 3
): Promise<ResolvedArticle[]> {
  const others = (await getVisibleArticles()).filter(
    (item) => item.slug !== article.slug
  )
  const sameCategory = others.filter((item) => item.categoryId === article.categoryId)
  const rest = others.filter((item) => item.categoryId !== article.categoryId)
  return [...sameCategory, ...rest].slice(0, limit)
}
