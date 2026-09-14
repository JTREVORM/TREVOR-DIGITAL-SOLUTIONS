import type { ContentBlock, CategoryIconName } from "@/lib/content/insights-types"

/**
 * Row shapes for the tables created in supabase/migrations.
 *
 * Hand-written rather than generated so the file stays readable and so
 * `content` keeps its real `ContentBlock[]` type instead of the bare `Json`
 * the generator would produce.
 */

export type UserRole = "admin" | "editor" | "viewer"
export type ArticleStatus = "draft" | "scheduled" | "published"
export type ProjectStatus = "draft" | "published"
export type MessageStatus = "new" | "read" | "replied" | "archived"

export type ProfileRow = {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export type CategoryRow = {
  id: string
  name: string
  slug: string
  description: string
  icon_name: CategoryIconName
  created_at: string
  updated_at: string
}

export type AuthorRow = {
  id: string
  profile_id: string | null
  name: string
  title: string
  company: string
  bio: string
  avatar_url: string | null
  profile_url: string | null
  created_at: string
  updated_at: string
}

export type TagRow = {
  id: string
  name: string
  slug: string
  created_at: string
}

export type ArticleRow = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: ContentBlock[]
  featured_image: string | null
  featured_image_alt: string | null
  category_id: string | null
  author_id: string | null
  reading_time: number
  status: ArticleStatus
  published_date: string | null
  seo_title: string | null
  seo_description: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

/** An article joined with its category, author and tags. */
export type ArticleWithRelations = ArticleRow & {
  categories: CategoryRow | null
  authors: AuthorRow | null
  article_tags: Array<{ tags: TagRow | null }>
}

export type MediaRow = {
  id: string
  file_name: string
  file_path: string
  file_url: string
  file_type: string
  file_size: number
  width: number | null
  height: number | null
  alt_text: string
  uploaded_by: string | null
  created_at: string
}

export type ContactMessageRow = {
  id: string
  reference_number: string | null
  name: string
  email: string
  phone: string | null
  company: string | null
  subject: string | null
  budget: string | null
  message: string
  status: MessageStatus
  created_at: string
}

export type ProjectRow = {
  id: string
  name: string
  slug: string
  description: string
  category: string
  industry: string
  technologies: string[]
  featured_image: string | null
  content: Record<string, unknown>
  status: ProjectStatus
  featured: boolean
  created_at: string
  updated_at: string
}

/** Columns selected when an article is fetched with its relations. */
export const ARTICLE_SELECT = `
  id, title, slug, excerpt, content, featured_image, featured_image_alt,
  category_id, author_id, reading_time, status, published_date,
  seo_title, seo_description, created_by, created_at, updated_at,
  categories ( id, name, slug, description, icon_name, created_at, updated_at ),
  authors ( id, profile_id, name, title, company, bio, avatar_url, profile_url, created_at, updated_at ),
  article_tags ( tags ( id, name, slug, created_at ) )
` as const
