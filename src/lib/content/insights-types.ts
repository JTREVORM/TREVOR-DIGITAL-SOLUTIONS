/* ==========================================================================
   TDS INSIGHTS — data contract
   --------------------------------------------------------------------------
   These types mirror the shape the CMS will store in Phase 5, so moving from
   the local array in insights.ts to a Supabase table is a change of data
   source rather than a rewrite of the components.

   Planned table columns map one-to-one onto `Article` below:

     title, slug, excerpt, content (jsonb), featured_image, category_id,
     tags (text[]), author_id, published_date, updated_date, reading_time,
     status, seo_title, seo_description

   Article body is a typed block array rather than a raw HTML string. Blocks
   are safe to store as JSON, safe to render without dangerouslySetInnerHTML,
   and give an editor a predictable set of elements to work with.
   ========================================================================== */

export type ArticleStatus = "published" | "draft" | "sample"

export type Author = {
  id: string
  name: string
  role: string
  company: string
  /** Short biography. Only facts documented elsewhere in this project. */
  bio: string
  /** Path under /public. Optional; initials are shown when absent. */
  avatar?: string
  profileUrl?: string
}

/**
 * Icons are referenced by name, not by component.
 *
 * Two reasons. A CMS row can store a string but not a React component, so
 * this is the shape Phase 5 needs anyway. And a function cannot be passed
 * from a server component to a client one — storing the name lets the same
 * category object cross that boundary. Resolve it with <CategoryIcon />.
 */
export type CategoryIconName =
  | "newspaper"
  | "cpu"
  | "line-chart"
  | "brain"
  | "building"

export type InsightCategory = {
  id: string
  /** URL segment for /insights/category/<slug>. */
  slug: string
  name: string
  description: string
  iconName: CategoryIconName
}

/* ---------------------------- content blocks ---------------------------- */

export type HeadingBlock = {
  type: "heading"
  level: 2 | 3
  text: string
}

export type ParagraphBlock = {
  type: "paragraph"
  /** Inline markdown subset: **bold**, *italic*, `code`, [text](href). */
  text: string
}

export type ListBlock = {
  type: "list"
  ordered?: boolean
  items: string[]
}

export type QuoteBlock = {
  type: "quote"
  text: string
  attribution?: string
}

export type CodeBlock = {
  type: "code"
  language?: string
  code: string
  caption?: string
}

export type ImageBlock = {
  type: "image"
  src: string
  alt: string
  caption?: string
}

export type TableBlock = {
  type: "table"
  head: string[]
  rows: string[][]
  caption?: string
}

export type CalloutBlock = {
  type: "callout"
  title?: string
  text: string
}

export type DividerBlock = { type: "divider" }

/** An embed placeholder; Phase 5 can widen this to a provider union. */
export type EmbedBlock = {
  type: "embed"
  title: string
  url: string
  provider?: string
}

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | QuoteBlock
  | CodeBlock
  | ImageBlock
  | TableBlock
  | CalloutBlock
  | DividerBlock
  | EmbedBlock

/* ------------------------------- article -------------------------------- */

export type Article = {
  title: string
  slug: string
  excerpt: string
  content: ContentBlock[]
  /** Path under /public. A branded plate is shown when absent. */
  featuredImage?: string
  featuredImageAlt?: string
  categoryId: string
  tags: string[]
  authorId: string
  /** ISO date, e.g. "2026-08-14". */
  publishedDate: string
  updatedDate?: string
  status: ArticleStatus
  /** Pin to the featured slot on /insights. */
  featured?: boolean
  seoTitle?: string
  seoDescription?: string
}

/** Article plus everything the UI needs resolved. */
export type ResolvedArticle = Article & {
  category: InsightCategory
  author: Author
  readingTime: number
}
