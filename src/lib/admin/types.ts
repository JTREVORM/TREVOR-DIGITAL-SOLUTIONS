import type { ContentBlock, CategoryIconName } from "@/lib/content/insights-types"

/* ==========================================================================
   ADMIN DATA MODEL
   --------------------------------------------------------------------------
   Mirrors the Phase 4 public article shape, plus the fields an editor needs.
   Column names in the comments are the ones Phase 6 should create in
   Supabase, so the mapping is one-to-one and nothing has to be renamed.
   ========================================================================== */

export type ArticleStatus = "draft" | "scheduled" | "published"

export type AdminArticle = {
  /** Primary key. Supabase: uuid. */
  id: string
  title: string
  slug: string
  excerpt: string
  content: ContentBlock[]
  /** featured_image */
  featuredImage?: string
  featuredImageAlt?: string
  /** category_id */
  categoryId: string
  tags: string[]
  /** author_id */
  authorId: string
  /** published_date — ISO date. For `scheduled`, the date it goes live. */
  publishedDate: string
  /** updated_date */
  updatedDate?: string
  /** reading_time — minutes. Derived from content, stored for query speed. */
  readingTime: number
  status: ArticleStatus
  /** seo_title */
  seoTitle?: string
  /** seo_description */
  seoDescription?: string
  /** Marks rows seeded for local development. Never true in production. */
  isDevSeed?: boolean
}

export type AdminCategory = {
  id: string
  name: string
  slug: string
  description: string
  iconName: CategoryIconName
  isDevSeed?: boolean
}

export type AdminTag = {
  id: string
  name: string
  slug: string
  isDevSeed?: boolean
}

export type AdminAuthor = {
  id: string
  name: string
  role: string
  company: string
  bio: string
  avatar?: string
  profileUrl?: string
  isDevSeed?: boolean
}

export type MediaItem = {
  id: string
  fileName: string
  /** Object URL in development; a Supabase Storage public URL in Phase 6. */
  url: string
  mimeType: string
  /** Bytes. */
  size: number
  width?: number
  height?: number
  alt: string
  uploadedAt: string
  /** True while the file lives only in this browser session. */
  isLocalOnly?: boolean
}

/** Draft payload used by the editor before an id exists. */
export type ArticleInput = Omit<AdminArticle, "id" | "readingTime"> & {
  id?: string
}

export type DashboardStats = {
  totalArticles: number
  published: number
  drafts: number
  scheduled: number
  categories: number
  tags: number
  authors: number
  media: number
}
