"use client"

import { createClient } from "@/lib/supabase/client"
import { readingTimeOf } from "@/lib/content/insights-utils"
import { ARTICLE_SELECT } from "@/lib/supabase/types"
import type {
  ArticleRow,
  ArticleWithRelations,
  AuthorRow,
  CategoryRow,
  MediaRow,
  TagRow,
} from "@/lib/supabase/types"
import type {
  AdminArticle,
  AdminAuthor,
  AdminCategory,
  AdminTag,
  ArticleInput,
  DashboardStats,
  MediaItem,
} from "./types"
import type { CategoryIconName } from "@/lib/content/insights-types"

/* ==========================================================================
   ADMIN SERVICE — Supabase
   --------------------------------------------------------------------------
   Every admin screen calls these functions and nothing else. They run in the
   browser against the anon key, which is exactly how Supabase is designed to
   be used: Row Level Security is the authority on what the signed-in user may
   read or write, so a tampered client simply gets rejected by the database.

   Nothing here checks permissions itself. Client-side checks would be
   decoration; the policies in supabase/migrations/0002_rls_policies.sql are
   the real boundary.
   ========================================================================== */

const STORAGE_BUCKET = "tds-media"

/** Upload limits, matched to the bucket's own configuration. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
export const ALLOWED_UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
]

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function db() {
  return createClient()
}

/** Surfaces Postgres/RLS errors as something a person can act on. */
function fail(action: string, error: { message: string; code?: string } | null): never {
  const code = error?.code ? ` (${error.code})` : ""
  if (error?.code === "42501" || /row-level security/i.test(error?.message ?? "")) {
    throw new Error(
      `Not permitted: ${action}. Your account does not have the required role.`
    )
  }
  if (error?.code === "23505") {
    throw new Error(`Could not ${action}: that value is already taken.`)
  }
  throw new Error(`Could not ${action}${code}: ${error?.message ?? "unknown error"}`)
}

/* ------------------------------- mapping -------------------------------- */

function toAdminArticle(row: ArticleWithRelations | ArticleRow): AdminArticle {
  const withRelations = row as ArticleWithRelations
  const tags =
    withRelations.article_tags
      ?.map((link) => link.tags?.name)
      .filter((name): name is string => Boolean(name)) ?? []

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content ?? [],
    featuredImage: row.featured_image ?? undefined,
    featuredImageAlt: row.featured_image_alt ?? undefined,
    categoryId: row.category_id ?? "",
    tags,
    authorId: row.author_id ?? "",
    // Stored as timestamptz; the editor works in plain dates.
    publishedDate: (row.published_date ?? row.created_at).slice(0, 10),
    updatedDate: row.updated_at?.slice(0, 10),
    readingTime: row.reading_time,
    status: row.status,
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
  }
}

function toAdminCategory(row: CategoryRow): AdminCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    iconName: row.icon_name,
  }
}

function toAdminAuthor(row: AuthorRow): AdminAuthor {
  return {
    id: row.id,
    name: row.name,
    role: row.title,
    company: row.company,
    bio: row.bio,
    avatar: row.avatar_url ?? undefined,
    profileUrl: row.profile_url ?? undefined,
  }
}

function toMediaItem(row: MediaRow): MediaItem {
  return {
    id: row.id,
    fileName: row.file_name,
    url: row.file_url,
    mimeType: row.file_type,
    size: row.file_size,
    width: row.width ?? undefined,
    height: row.height ?? undefined,
    alt: row.alt_text,
    uploadedAt: row.created_at,
  }
}

/* ------------------------------- articles ------------------------------- */

export async function listArticles(): Promise<AdminArticle[]> {
  const { data, error } = await db()
    .from("articles")
    .select(ARTICLE_SELECT)
    .order("published_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })

  if (error) fail("load articles", error)
  return ((data ?? []) as unknown as ArticleWithRelations[]).map(toAdminArticle)
}

export async function getArticle(id: string): Promise<AdminArticle | undefined> {
  const { data, error } = await db()
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("id", id)
    .maybeSingle()

  if (error) fail("load that article", error)
  return data ? toAdminArticle(data as unknown as ArticleWithRelations) : undefined
}

export async function isSlugTaken(slug: string, exceptId?: string): Promise<boolean> {
  let query = db().from("articles").select("id").eq("slug", slug).limit(1)
  if (exceptId) query = query.neq("id", exceptId)

  const { data, error } = await query
  if (error) fail("check the slug", error)
  return (data ?? []).length > 0
}

/** Resolves tag names to ids, creating any that do not exist yet. */
async function resolveTagIds(names: string[]): Promise<string[]> {
  const cleaned = Array.from(new Set(names.map((n) => n.trim()).filter(Boolean)))
  if (cleaned.length === 0) return []

  const client = db()
  const slugs = cleaned.map(slugify)

  const { data: existing, error } = await client
    .from("tags")
    .select("id, name, slug")
    .in("slug", slugs)
  if (error) fail("read tags", error)

  const bySlug = new Map<string, string>(
    (existing ?? []).map((t) => [t.slug as string, t.id as string])
  )
  const missing = cleaned.filter((name) => !bySlug.has(slugify(name)))

  if (missing.length > 0) {
    const { data: created, error: insertError } = await client
      .from("tags")
      .insert(missing.map((name) => ({ name, slug: slugify(name) })))
      .select("id, slug")
    if (insertError) fail("create tags", insertError)
    for (const tag of created ?? []) bySlug.set(tag.slug, tag.id)
  }

  return cleaned
    .map((name) => bySlug.get(slugify(name)))
    .filter((id): id is string => Boolean(id))
}

export async function saveArticle(input: ArticleInput): Promise<AdminArticle> {
  const client = db()
  const readingTime = readingTimeOf(input.content)

  const {
    data: { user },
  } = await client.auth.getUser()

  // A draft may have no date; anything published or scheduled must have one,
  // and the database enforces that too.
  const publishedDate =
    input.status === "draft" && !input.publishedDate
      ? null
      : new Date(`${input.publishedDate}T00:00:00Z`).toISOString()

  const payload = {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content: input.content,
    featured_image: input.featuredImage ?? null,
    featured_image_alt: input.featuredImageAlt ?? null,
    category_id: input.categoryId || null,
    author_id: input.authorId || null,
    reading_time: readingTime,
    status: input.status,
    published_date: publishedDate,
    seo_title: input.seoTitle ?? null,
    seo_description: input.seoDescription ?? null,
  }

  let articleId = input.id

  if (articleId) {
    const { error } = await client.from("articles").update(payload).eq("id", articleId)
    if (error) fail("save the article", error)
  } else {
    const { data, error } = await client
      .from("articles")
      .insert({ ...payload, created_by: user?.id ?? null })
      .select("id")
      .single()
    if (error) fail("create the article", error)
    articleId = data.id
  }

  // Replace the tag links wholesale — simpler and more predictable than
  // diffing, and the join table is tiny.
  const tagIds = await resolveTagIds(input.tags)
  const { error: clearError } = await client
    .from("article_tags")
    .delete()
    .eq("article_id", articleId)
  if (clearError) fail("update article tags", clearError)

  if (tagIds.length > 0) {
    const { error: linkError } = await client
      .from("article_tags")
      .insert(tagIds.map((tagId) => ({ article_id: articleId, tag_id: tagId })))
    if (linkError) fail("link article tags", linkError)
  }

  const saved = await getArticle(articleId!)
  if (!saved) throw new Error("The article was saved but could not be read back.")
  return saved
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await db().from("articles").delete().eq("id", id)
  if (error) fail("delete the article", error)
}

/* ------------------------------ categories ------------------------------ */

export async function listCategories(): Promise<AdminCategory[]> {
  const { data, error } = await db().from("categories").select("*").order("name")
  if (error) fail("load categories", error)
  return (data ?? []).map(toAdminCategory)
}

export async function saveCategory(
  input: Omit<AdminCategory, "id"> & { id?: string }
): Promise<AdminCategory> {
  const payload = {
    name: input.name,
    slug: input.slug || slugify(input.name),
    description: input.description,
    icon_name: input.iconName as CategoryIconName,
  }

  const client = db()
  const query = input.id
    ? client.from("categories").update(payload).eq("id", input.id).select("*").single()
    : client.from("categories").insert(payload).select("*").single()

  const { data, error } = await query
  if (error) fail("save the category", error)
  return toAdminCategory(data)
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await db().from("categories").delete().eq("id", id)
  if (error) fail("delete the category", error)
}

export async function countArticlesInCategory(id: string): Promise<number> {
  const { count, error } = await db()
    .from("articles")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id)
  if (error) fail("count articles", error)
  return count ?? 0
}

/* --------------------------------- tags --------------------------------- */

export async function listTags(): Promise<AdminTag[]> {
  const { data, error } = await db().from("tags").select("*").order("name")
  if (error) fail("load tags", error)
  return (data ?? []).map((row: TagRow) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
  }))
}

export async function saveTag(
  input: Omit<AdminTag, "id" | "slug"> & { id?: string; slug?: string }
): Promise<AdminTag> {
  const payload = {
    name: input.name,
    slug: input.slug?.trim() ? slugify(input.slug) : slugify(input.name),
  }

  const client = db()
  const query = input.id
    ? client.from("tags").update(payload).eq("id", input.id).select("*").single()
    : client.from("tags").insert(payload).select("*").single()

  const { data, error } = await query
  if (error) fail("save the tag", error)
  return { id: data.id, name: data.name, slug: data.slug }
}

export async function deleteTag(id: string): Promise<void> {
  // article_tags cascades on delete, so links disappear with the tag and no
  // article is left pointing at a row that no longer exists.
  const { error } = await db().from("tags").delete().eq("id", id)
  if (error) fail("delete the tag", error)
}

/* -------------------------------- authors ------------------------------- */

export async function listAuthors(): Promise<AdminAuthor[]> {
  const { data, error } = await db().from("authors").select("*").order("name")
  if (error) fail("load authors", error)
  return (data ?? []).map(toAdminAuthor)
}

export async function saveAuthor(
  input: Omit<AdminAuthor, "id"> & { id?: string }
): Promise<AdminAuthor> {
  const payload = {
    name: input.name,
    title: input.role,
    company: input.company,
    bio: input.bio,
    avatar_url: input.avatar ?? null,
    profile_url: input.profileUrl ?? null,
  }

  const client = db()
  const query = input.id
    ? client.from("authors").update(payload).eq("id", input.id).select("*").single()
    : client.from("authors").insert(payload).select("*").single()

  const { data, error } = await query
  if (error) fail("save the author", error)
  return toAdminAuthor(data)
}

export async function deleteAuthor(id: string): Promise<void> {
  const { error } = await db().from("authors").delete().eq("id", id)
  if (error) fail("delete the author", error)
}

export async function countArticlesByAuthor(id: string): Promise<number> {
  const { count, error } = await db()
    .from("articles")
    .select("id", { count: "exact", head: true })
    .eq("author_id", id)
  if (error) fail("count articles", error)
  return count ?? 0
}

/* --------------------------------- media -------------------------------- */

export async function listMedia(): Promise<MediaItem[]> {
  const { data, error } = await db()
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) fail("load media", error)
  return (data ?? []).map(toMediaItem)
}

export async function uploadMedia(file: File, alt: string): Promise<MediaItem> {
  // Validated here for a fast, clear message; the bucket enforces the same
  // limits again server-side, which is what actually stops a crafted request.
  if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) {
    throw new Error(
      `${file.type || "That file type"} is not allowed. Use JPEG, PNG, WebP, AVIF, GIF or SVG.`
    )
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `${file.name} is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 10 MB.`
    )
  }

  const client = db()
  const {
    data: { user },
  } = await client.auth.getUser()
  if (!user) throw new Error("You must be signed in to upload.")

  const extension = file.name.includes(".") ? file.name.split(".").pop() : "bin"
  const safeBase = slugify(file.name.replace(/\.[^.]+$/, "")) || "image"
  const path = `${new Date().getFullYear()}/${Date.now()}-${safeBase}.${extension}`

  const { error: uploadError } = await client.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type })
  if (uploadError) fail("upload the file", uploadError)

  const {
    data: { publicUrl },
  } = client.storage.from(STORAGE_BUCKET).getPublicUrl(path)

  const { data, error } = await client
    .from("media")
    .insert({
      file_name: file.name,
      file_path: path,
      file_url: publicUrl,
      file_type: file.type,
      file_size: file.size,
      alt_text: alt || file.name,
      uploaded_by: user.id,
    })
    .select("*")
    .single()

  if (error) {
    // Do not leave an orphan object behind if the metadata row is rejected.
    await client.storage.from(STORAGE_BUCKET).remove([path])
    fail("record the upload", error)
  }

  return toMediaItem(data)
}

export async function deleteMedia(id: string): Promise<void> {
  const client = db()

  const { data: row, error: readError } = await client
    .from("media")
    .select("file_path")
    .eq("id", id)
    .maybeSingle()
  if (readError) fail("read the file record", readError)

  if (row?.file_path) {
    const { error: removeError } = await client.storage
      .from(STORAGE_BUCKET)
      .remove([row.file_path])
    if (removeError) fail("remove the stored file", removeError)
  }

  const { error } = await client.from("media").delete().eq("id", id)
  if (error) fail("delete the file record", error)
}

/* ------------------------------- dashboard ------------------------------ */

async function countOf(table: string): Promise<number> {
  const { count, error } = await db()
    .from(table)
    .select("id", { count: "exact", head: true })
  if (error) return 0
  return count ?? 0
}

export async function getStats(): Promise<DashboardStats> {
  const client = db()

  const [total, published, drafts, scheduled, categories, tags, authors, media] =
    await Promise.all([
      countOf("articles"),
      client
        .from("articles")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .then(({ count }) => count ?? 0),
      client
        .from("articles")
        .select("id", { count: "exact", head: true })
        .eq("status", "draft")
        .then(({ count }) => count ?? 0),
      client
        .from("articles")
        .select("id", { count: "exact", head: true })
        .eq("status", "scheduled")
        .then(({ count }) => count ?? 0),
      countOf("categories"),
      countOf("tags"),
      countOf("authors"),
      countOf("media"),
    ])

  return {
    totalArticles: total,
    published,
    drafts,
    scheduled,
    categories,
    tags,
    authors,
    media,
  }
}
