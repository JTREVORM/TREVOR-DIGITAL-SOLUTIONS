"use client"

import {
  articles as publicArticles,
  authors as publicAuthors,
  insightCategories,
  readingTimeOf,
} from "@/lib/content/insights"
import type {
  AdminArticle,
  AdminAuthor,
  AdminCategory,
  AdminTag,
  ArticleInput,
  DashboardStats,
  MediaItem,
} from "./types"

/* ==========================================================================
   ADMIN SERVICE LAYER
   --------------------------------------------------------------------------
   This is the seam. Every admin screen calls the functions below and nothing
   else — no screen touches storage directly. In Phase 6, replace each body
   with a Supabase call and the UI is untouched:

     listArticles()   -> supabase.from('articles').select(...)
     saveArticle()    -> .upsert(...)
     deleteArticle()  -> .delete().eq('id', id)
     uploadMedia()    -> supabase.storage.from('media').upload(...)

   Every function is async and returns a promise today precisely so swapping
   in network calls changes no call site.

   WHERE THE DATA LIVES RIGHT NOW
   In the browser's localStorage, seeded from the public Insights content.
   It is development data: it never leaves the machine, it is per-browser,
   and clearing site data resets it. Rows carry `isDevSeed: true` so seeded
   records can be told apart from anything typed in during testing.
   ========================================================================== */

const STORAGE_KEY = "tds-admin-store-v1"

/** Phase 6: delete this flag along with the dev store. */
export const IS_DEV_STORE = true

type Store = {
  articles: AdminArticle[]
  categories: AdminCategory[]
  tags: AdminTag[]
  authors: AdminAuthor[]
  media: MediaItem[]
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function newId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  return `${prefix}_${random}`
}

/** Builds the initial store from the public Insights content. */
function seed(): Store {
  const categories: AdminCategory[] = insightCategories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    iconName: category.iconName,
    isDevSeed: true,
  }))

  const authors: AdminAuthor[] = publicAuthors.map((author) => ({
    id: author.id,
    name: author.name,
    role: author.role,
    company: author.company,
    bio: author.bio,
    avatar: author.avatar,
    profileUrl: author.profileUrl,
    isDevSeed: true,
  }))

  const articles: AdminArticle[] = publicArticles.map((article) => ({
    id: `art_${article.slug}`,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    featuredImage: article.featuredImage,
    featuredImageAlt: article.featuredImageAlt,
    categoryId: article.categoryId,
    tags: article.tags,
    authorId: article.authorId,
    publishedDate: article.publishedDate,
    updatedDate: article.updatedDate,
    readingTime: readingTimeOf(article.content),
    // Samples are unpublished drafts in the admin so nothing demo-shaped
    // looks like live editorial in the dashboard counts.
    status: "draft",
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    isDevSeed: true,
  }))

  const tagNames = Array.from(new Set(publicArticles.flatMap((a) => a.tags)))
  const tags: AdminTag[] = tagNames.map((name) => ({
    id: `tag_${slugify(name)}`,
    name,
    slug: slugify(name),
    isDevSeed: true,
  }))

  return { articles, categories, tags, authors, media: [] }
}

function read(): Store {
  if (typeof window === "undefined") return seed()

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const fresh = seed()
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
      return fresh
    }
    const parsed = JSON.parse(raw) as Partial<Store>
    const fresh = seed()
    // Merge so a store written by an older build still opens.
    return {
      articles: parsed.articles ?? fresh.articles,
      categories: parsed.categories ?? fresh.categories,
      tags: parsed.tags ?? fresh.tags,
      authors: parsed.authors ?? fresh.authors,
      media: parsed.media ?? [],
    }
  } catch {
    return seed()
  }
}

function write(store: Store): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    window.dispatchEvent(new Event("tds-admin-store-changed"))
  } catch {
    // Quota or private mode. The screen keeps working for this session.
  }
}

/** Resets development data back to the seed. */
export async function resetDevStore(): Promise<void> {
  write(seed())
}

/* ------------------------------- articles ------------------------------- */

export async function listArticles(): Promise<AdminArticle[]> {
  return read().articles.sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  )
}

export async function getArticle(id: string): Promise<AdminArticle | undefined> {
  return read().articles.find((article) => article.id === id)
}

export async function saveArticle(input: ArticleInput): Promise<AdminArticle> {
  const store = read()
  const readingTime = readingTimeOf(input.content)
  const today = new Date().toISOString().slice(0, 10)

  if (input.id) {
    const index = store.articles.findIndex((article) => article.id === input.id)
    if (index === -1) throw new Error(`Article ${input.id} not found`)

    const updated: AdminArticle = {
      ...store.articles[index],
      ...input,
      id: input.id,
      readingTime,
      updatedDate: today,
      isDevSeed: false,
    }
    store.articles[index] = updated
    write(store)
    return updated
  }

  const created: AdminArticle = {
    ...input,
    id: newId("art"),
    readingTime,
    isDevSeed: false,
  }
  store.articles.unshift(created)
  write(store)
  return created
}

export async function deleteArticle(id: string): Promise<void> {
  const store = read()
  store.articles = store.articles.filter((article) => article.id !== id)
  write(store)
}

/** True when the slug is already taken by a different article. */
export async function isSlugTaken(slug: string, exceptId?: string): Promise<boolean> {
  return read().articles.some(
    (article) => article.slug === slug && article.id !== exceptId
  )
}

/* ------------------------------ categories ------------------------------ */

export async function listCategories(): Promise<AdminCategory[]> {
  return read().categories
}

export async function saveCategory(
  input: Omit<AdminCategory, "id"> & { id?: string }
): Promise<AdminCategory> {
  const store = read()

  if (input.id) {
    const index = store.categories.findIndex((c) => c.id === input.id)
    if (index === -1) throw new Error(`Category ${input.id} not found`)
    const updated = { ...store.categories[index], ...input, id: input.id }
    store.categories[index] = updated
    write(store)
    return updated
  }

  const created: AdminCategory = { ...input, id: newId("cat") }
  store.categories.push(created)
  write(store)
  return created
}

export async function deleteCategory(id: string): Promise<void> {
  const store = read()
  store.categories = store.categories.filter((c) => c.id !== id)
  write(store)
}

export async function countArticlesInCategory(id: string): Promise<number> {
  return read().articles.filter((article) => article.categoryId === id).length
}

/* --------------------------------- tags --------------------------------- */

export async function listTags(): Promise<AdminTag[]> {
  return read().tags.sort((a, b) => a.name.localeCompare(b.name))
}

export async function saveTag(
  input: Omit<AdminTag, "id" | "slug"> & { id?: string; slug?: string }
): Promise<AdminTag> {
  const store = read()
  const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.name)

  if (input.id) {
    const index = store.tags.findIndex((t) => t.id === input.id)
    if (index === -1) throw new Error(`Tag ${input.id} not found`)
    const updated = { ...store.tags[index], ...input, slug, id: input.id }
    store.tags[index] = updated
    write(store)
    return updated
  }

  const created: AdminTag = { id: newId("tag"), name: input.name, slug }
  store.tags.push(created)
  write(store)
  return created
}

export async function deleteTag(id: string): Promise<void> {
  const store = read()
  store.tags = store.tags.filter((t) => t.id !== id)
  write(store)
}

export async function countArticlesWithTag(name: string): Promise<number> {
  return read().articles.filter((article) => article.tags.includes(name)).length
}

/* -------------------------------- authors ------------------------------- */

export async function listAuthors(): Promise<AdminAuthor[]> {
  return read().authors
}

export async function saveAuthor(
  input: Omit<AdminAuthor, "id"> & { id?: string }
): Promise<AdminAuthor> {
  const store = read()

  if (input.id) {
    const index = store.authors.findIndex((a) => a.id === input.id)
    if (index === -1) throw new Error(`Author ${input.id} not found`)
    const updated = { ...store.authors[index], ...input, id: input.id }
    store.authors[index] = updated
    write(store)
    return updated
  }

  const created: AdminAuthor = { ...input, id: newId("aut") }
  store.authors.push(created)
  write(store)
  return created
}

export async function deleteAuthor(id: string): Promise<void> {
  const store = read()
  store.authors = store.authors.filter((a) => a.id !== id)
  write(store)
}

export async function countArticlesByAuthor(id: string): Promise<number> {
  return read().articles.filter((article) => article.authorId === id).length
}

/* --------------------------------- media -------------------------------- */

/**
 * Phase 6: replace with supabase.storage.from('media').upload(). Today the
 * file is held as an object URL for this browser session only — it is not
 * uploaded anywhere and does not survive a reload, which the media screen
 * states plainly rather than implying files are stored.
 */
export async function uploadMedia(file: File, alt: string): Promise<MediaItem> {
  const store = read()

  const item: MediaItem = {
    id: newId("med"),
    fileName: file.name,
    url: URL.createObjectURL(file),
    mimeType: file.type,
    size: file.size,
    alt: alt || file.name,
    uploadedAt: new Date().toISOString(),
    isLocalOnly: true,
  }

  store.media.unshift(item)
  write(store)
  return item
}

export async function listMedia(): Promise<MediaItem[]> {
  return read().media
}

export async function deleteMedia(id: string): Promise<void> {
  const store = read()
  const item = store.media.find((m) => m.id === id)
  if (item?.isLocalOnly && item.url.startsWith("blob:")) {
    URL.revokeObjectURL(item.url)
  }
  store.media = store.media.filter((m) => m.id !== id)
  write(store)
}

/* ------------------------------- dashboard ------------------------------ */

export async function getStats(): Promise<DashboardStats> {
  const store = read()
  return {
    totalArticles: store.articles.length,
    published: store.articles.filter((a) => a.status === "published").length,
    drafts: store.articles.filter((a) => a.status === "draft").length,
    scheduled: store.articles.filter((a) => a.status === "scheduled").length,
    categories: store.categories.length,
    tags: store.tags.length,
    authors: store.authors.length,
    media: store.media.length,
  }
}

export { slugify }
