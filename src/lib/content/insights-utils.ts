import type { ContentBlock, ResolvedArticle } from "./insights-types"

/**
 * Pure helpers shared by the public site, the admin editor and the server
 * queries. No data source and no React, so both environments can import them
 * without dragging anything else along.
 */

/** Plain text of a block, used for reading time and search indexing. */
export function blockText(block: ContentBlock): string {
  switch (block.type) {
    case "heading":
    case "paragraph":
      return block.text
    case "list":
      return block.items.join(" ")
    case "quote":
      return `${block.text} ${block.attribution ?? ""}`
    case "code":
      return block.caption ?? ""
    case "image":
      return `${block.alt} ${block.caption ?? ""}`
    case "table":
      return [...block.head, ...block.rows.flat(), block.caption ?? ""].join(" ")
    case "callout":
      return `${block.title ?? ""} ${block.text}`
    case "embed":
      return block.title
    default:
      return ""
  }
}

const WORDS_PER_MINUTE = 200

export function readingTimeOf(content: ContentBlock[]): number {
  const words = (content ?? [])
    .map(blockText)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

/** Lowercased haystack used by client-side search. */
export function searchIndexOf(article: ResolvedArticle): string {
  return [
    article.title,
    article.excerpt,
    article.category.name,
    article.author.name,
    ...article.tags,
    ...article.content.map(blockText),
  ]
    .join(" ")
    .toLowerCase()
}

export function formatArticleDate(iso: string): string {
  const date = iso.length === 10 ? new Date(`${iso}T00:00:00Z`) : new Date(iso)
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}
