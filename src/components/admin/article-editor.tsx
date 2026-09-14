"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  CalendarClock,
  Check,
  ExternalLink,
  Eye,
  Loader2,
  Save,
  Send,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ConfirmDialog,
  Field,
  PageHeader,
  Panel,
  StatusBadge,
  inputClasses,
  textareaClasses,
} from "./ui"
import { BlockEditor } from "./block-editor"
import { MediaPickerDialog } from "./media-picker"
import { ArticleContent } from "@/components/insights/article-content"
import { isSlugTaken, saveArticle, slugify } from "@/lib/admin/service"
import { readingTimeOf } from "@/lib/content/insights-utils"
import type {
  AdminArticle,
  AdminAuthor,
  AdminCategory,
  AdminTag,
  ArticleStatus,
} from "@/lib/admin/types"
import type { ContentBlock } from "@/lib/content/insights-types"
import { cn } from "@/lib/utils"

/**
 * The article editor, shared by /admin/articles/new and .../edit.
 *
 * Slug is derived from the title until an author edits it by hand, after
 * which it is left alone — renaming a published article should not silently
 * change its URL. Reading time is computed from the content and shown read
 * only, because a hand-typed estimate goes stale the moment anyone edits.
 */

type Props = {
  article?: AdminArticle
  categories: AdminCategory[]
  authors: AdminAuthor[]
  tags: AdminTag[]
}

const today = () => new Date().toISOString().slice(0, 10)

export function ArticleEditor({ article, categories, authors, tags }: Props) {
  const router = useRouter()
  const [title, setTitle] = React.useState(article?.title ?? "")
  const [manualSlug, setManualSlug] = React.useState(article?.slug ?? "")
  const [slugTouched, setSlugTouched] = React.useState(Boolean(article?.slug))
  const [excerpt, setExcerpt] = React.useState(article?.excerpt ?? "")
  const [content, setContent] = React.useState<ContentBlock[]>(article?.content ?? [])
  const [featuredImage, setFeaturedImage] = React.useState(article?.featuredImage ?? "")
  const [featuredImageAlt, setFeaturedImageAlt] = React.useState(
    article?.featuredImageAlt ?? ""
  )
  const [categoryId, setCategoryId] = React.useState(
    article?.categoryId ?? categories[0]?.id ?? ""
  )
  const [selectedTags, setSelectedTags] = React.useState<string[]>(article?.tags ?? [])
  const [authorId, setAuthorId] = React.useState(
    article?.authorId ?? authors[0]?.id ?? ""
  )
  const [publishedDate, setPublishedDate] = React.useState(
    article?.publishedDate ?? today()
  )
  const [status, setStatus] = React.useState<ArticleStatus>(article?.status ?? "draft")
  const [seoTitle, setSeoTitle] = React.useState(article?.seoTitle ?? "")
  const [seoDescription, setSeoDescription] = React.useState(
    article?.seoDescription ?? ""
  )

  /** Set once a new article is first saved, so later saves update it. */
  const [articleId, setArticleId] = React.useState(article?.id)
  const [dirty, setDirty] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [savedAt, setSavedAt] = React.useState<string | null>(null)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = React.useState(false)
  const [mediaOpen, setMediaOpen] = React.useState(false)
  const [leaveTo, setLeaveTo] = React.useState<string | null>(null)
  const mediaResolver = React.useRef<((v: { url: string; alt: string } | null) => void) | null>(null)

  const readingTime = React.useMemo(() => readingTimeOf(content), [content])

  /**
   * The slug follows the title until an author edits it, after which their
   * value wins. Derived during render rather than synced in an effect — an
   * effect would render once with a stale slug before correcting itself.
   */
  const slug = slugTouched ? manualSlug : slugify(title)

  /** Warn before losing unsaved work on a full page unload. */
  React.useEffect(() => {
    if (!dirty) return
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [dirty])

  function touch<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value)
      setDirty(true)
      setSavedAt(null)
    }
  }

  async function validate(): Promise<boolean> {
    const next: Record<string, string> = {}

    if (!title.trim()) next.title = "A title is required."
    if (!slug.trim()) next.slug = "A slug is required."
    // Except this article's own id, or a second save would report its own
    // slug as a clash with itself.
    else if (await isSlugTaken(slug.trim(), articleId))
      next.slug = "Another article already uses this slug."
    if (!excerpt.trim()) next.excerpt = "An excerpt is required — it is used on cards and in search results."
    if (!categoryId) next.categoryId = "Choose a category."
    if (!authorId) next.authorId = "Choose an author."
    if (content.length === 0) next.content = "Add at least one content block."

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function persist(nextStatus: ArticleStatus) {
    if (!(await validate())) return

    setSaving(true)
    try {
      const saved = await saveArticle({
        id: articleId,
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        content,
        featuredImage: featuredImage.trim() || undefined,
        featuredImageAlt: featuredImageAlt.trim() || undefined,
        categoryId,
        tags: selectedTags,
        authorId,
        publishedDate,
        status: nextStatus,
        seoTitle: seoTitle.trim() || undefined,
        seoDescription: seoDescription.trim() || undefined,
      })

      setStatus(nextStatus)
      setDirty(false)
      setSavedAt(new Date().toLocaleTimeString())

      if (!articleId) {
        setArticleId(saved.id)
        // Update the address bar without remounting: router.replace() would
        // navigate to the edit route, unmounting this component and taking
        // the "Saved" confirmation with it before anyone could read it.
        // A refresh still lands on the real edit page.
        window.history.replaceState(null, "", `/admin/articles/${saved.id}/edit`)
      }
    } finally {
      setSaving(false)
    }
  }

  function attemptLeave(href: string) {
    if (dirty) setLeaveTo(href)
    else router.push(href)
  }

  async function pickImage(): Promise<{ url: string; alt: string } | null> {
    setMediaOpen(true)
    return new Promise((resolve) => {
      mediaResolver.current = resolve
    })
  }

  function resolveMedia(value: { url: string; alt: string } | null) {
    setMediaOpen(false)
    mediaResolver.current?.(value)
    mediaResolver.current = null
  }

  return (
    <>
      <PageHeader
        title={articleId ? "Edit article" : "New article"}
        crumbs={[
          { name: "Admin", href: "/admin" },
          { name: "Articles", href: "/admin/articles" },
          { name: articleId ? title || "Untitled" : "New" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={status} />
            {dirty ? (
              <span className="font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.1em] text-amber-300 uppercase">
                Unsaved
              </span>
            ) : savedAt ? (
              <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.1em] text-emerald-300 uppercase">
                <Check className="size-3" aria-hidden />
                Saved {savedAt}
              </span>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        {/* Main column */}
        <div className="min-w-0 space-y-6">
          <Panel title="Article">
            <div className="space-y-5">
              <Field label="Title" htmlFor="title" required error={errors.title}>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => touch(setTitle)(e.target.value)}
                  placeholder="A clear, specific headline"
                  className={inputClasses}
                />
              </Field>

              <Field
                label="Slug"
                htmlFor="slug"
                required
                error={errors.slug}
                hint={`Public URL: /insights/${slug || "…"}`}
              >
                <input
                  id="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    touch(setManualSlug)(slugify(e.target.value))
                  }}
                  placeholder="article-url-slug"
                  className={cn(inputClasses, "font-[family-name:var(--font-mono)]")}
                />
              </Field>

              <Field
                label="Excerpt"
                htmlFor="excerpt"
                required
                error={errors.excerpt}
                hint="One or two sentences. Shown on cards, category pages and in search results."
              >
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => touch(setExcerpt)(e.target.value)}
                  rows={3}
                  className={textareaClasses}
                />
              </Field>
            </div>
          </Panel>

          <Panel
            title="Content"
            description={`${content.length} block${content.length === 1 ? "" : "s"} · ${readingTime} min read`}
            actions={
              <Button
                size="xs"
                variant="outline"
                onClick={() => setShowPreview((open) => !open)}
              >
                <Eye aria-hidden />
                {showPreview ? "Hide preview" : "Preview"}
              </Button>
            }
          >
            {errors.content ? (
              <p className="mb-4 text-xs text-destructive" role="alert">
                {errors.content}
              </p>
            ) : null}

            {showPreview ? (
              <div className="rounded-xl bg-background p-5 ring-1 ring-hairline sm:p-7">
                <p className="eyebrow mb-5">Preview</p>
                <h1 className="text-2xl leading-tight font-semibold text-foreground sm:text-3xl">
                  {title || "Untitled article"}
                </h1>
                {excerpt ? (
                  <p className="mt-4 leading-relaxed text-muted-foreground">{excerpt}</p>
                ) : null}
                <div className="mt-8">
                  <ArticleContent content={content} />
                </div>
              </div>
            ) : (
              <BlockEditor
                value={content}
                onChange={(blocks) => touch(setContent)(blocks)}
                onPickImage={pickImage}
              />
            )}
          </Panel>

          <Panel
            title="Search engine listing"
            description="Leave blank to fall back to the title and excerpt."
          >
            <div className="space-y-5">
              <Field
                label="SEO title"
                htmlFor="seo-title"
                hint={`${seoTitle.length}/60 characters`}
              >
                <input
                  id="seo-title"
                  value={seoTitle}
                  onChange={(e) => touch(setSeoTitle)(e.target.value)}
                  placeholder={title || "Defaults to the article title"}
                  className={inputClasses}
                />
              </Field>
              <Field
                label="SEO description"
                htmlFor="seo-description"
                hint={`${seoDescription.length}/160 characters`}
              >
                <textarea
                  id="seo-description"
                  value={seoDescription}
                  onChange={(e) => touch(setSeoDescription)(e.target.value)}
                  rows={3}
                  placeholder={excerpt || "Defaults to the excerpt"}
                  className={textareaClasses}
                />
              </Field>
            </div>
          </Panel>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Panel title="Publish">
            <div className="space-y-4">
              <Field label="Status" htmlFor="status">
                <select
                  id="status"
                  value={status}
                  onChange={(e) => touch(setStatus)(e.target.value as ArticleStatus)}
                  className={inputClasses}
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </Field>

              <Field
                label={status === "scheduled" ? "Publish on" : "Published date"}
                htmlFor="published-date"
              >
                <input
                  id="published-date"
                  type="date"
                  value={publishedDate}
                  onChange={(e) => touch(setPublishedDate)(e.target.value)}
                  className={inputClasses}
                />
              </Field>

              <div className="rounded-lg bg-surface-raised px-3.5 py-3 ring-1 ring-hairline">
                <p className="font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.1em] text-muted-foreground/70 uppercase">
                  Reading time
                </p>
                <p className="mt-1 text-sm text-foreground">
                  {readingTime} min &middot; calculated from content
                </p>
              </div>

              <div className="flex flex-col gap-2 border-t border-hairline pt-4">
                <Button
                  size="cta"
                  variant="outline"
                  onClick={() => persist("draft")}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Save aria-hidden />}
                  Save draft
                </Button>
                <Button
                  size="cta"
                  variant="outline"
                  onClick={() => persist("scheduled")}
                  disabled={saving}
                >
                  <CalendarClock aria-hidden />
                  Schedule
                </Button>
                <Button size="cta" onClick={() => persist("published")} disabled={saving}>
                  <Send aria-hidden />
                  Publish
                </Button>
                {articleId ? (
                  <Button size="cta" variant="ghost" asChild>
                    <Link
                      href={`/insights/${slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink aria-hidden />
                      View on site
                    </Link>
                  </Button>
                ) : null}
                <Button
                  size="cta"
                  variant="ghost"
                  onClick={() => attemptLeave("/admin/articles")}
                  disabled={saving}
                >
                  <X aria-hidden />
                  Cancel
                </Button>
              </div>
            </div>
          </Panel>

          <Panel title="Organisation">
            <div className="space-y-4">
              <Field label="Category" htmlFor="category" required error={errors.categoryId}>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => touch(setCategoryId)(e.target.value)}
                  className={inputClasses}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Author" htmlFor="author" required error={errors.authorId}>
                <select
                  id="author"
                  value={authorId}
                  onChange={(e) => touch(setAuthorId)(e.target.value)}
                  className={inputClasses}
                >
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Tags" htmlFor="tags" hint="Click to add or remove.">
                <div className="flex flex-wrap gap-2" id="tags">
                  {tags.map((tag) => {
                    const active = selectedTags.includes(tag.name)
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() =>
                          touch(setSelectedTags)(
                            active
                              ? selectedTags.filter((t) => t !== tag.name)
                              : [...selectedTags, tag.name]
                          )
                        }
                        className={cn(
                          "rounded-md px-2.5 py-1.5 text-xs font-medium ring-1 transition-colors",
                          active
                            ? "bg-primary/12 text-brand-lift ring-primary/35"
                            : "text-muted-foreground ring-hairline hover:text-foreground"
                        )}
                      >
                        {tag.name}
                      </button>
                    )
                  })}
                </div>
              </Field>
            </div>
          </Panel>

          <Panel title="Featured image">
            <div className="space-y-4">
              {featuredImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={featuredImage}
                  alt={featuredImageAlt || "Featured image preview"}
                  className="aspect-video w-full rounded-lg object-cover ring-1 ring-hairline"
                />
              ) : (
                <p className="rounded-lg bg-surface-raised px-3.5 py-6 text-center text-xs text-muted-foreground ring-1 ring-hairline">
                  No image set. The article shows a branded category plate.
                </p>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={featuredImage}
                  onChange={(e) => touch(setFeaturedImage)(e.target.value)}
                  placeholder="/insights/cover.png"
                  className={cn(inputClasses, "flex-1")}
                  aria-label="Featured image path"
                />
                <Button
                  size="cta"
                  variant="outline"
                  onClick={async () => {
                    const picked = await pickImage()
                    if (picked) {
                      touch(setFeaturedImage)(picked.url)
                      setFeaturedImageAlt(picked.alt)
                    }
                  }}
                >
                  Choose
                </Button>
              </div>

              <Field label="Image alt text" htmlFor="featured-alt">
                <input
                  id="featured-alt"
                  value={featuredImageAlt}
                  onChange={(e) => touch(setFeaturedImageAlt)(e.target.value)}
                  placeholder="Describe the image"
                  className={inputClasses}
                />
              </Field>
            </div>
          </Panel>
        </aside>
      </div>

      <MediaPickerDialog
        open={mediaOpen}
        onSelect={(item) => resolveMedia({ url: item.url, alt: item.alt })}
        onCancel={() => resolveMedia(null)}
      />

      <ConfirmDialog
        open={leaveTo !== null}
        destructive={false}
        title="Discard unsaved changes?"
        description="This article has changes that have not been saved. Leaving now will lose them."
        confirmLabel="Discard and leave"
        onConfirm={() => {
          const href = leaveTo
          setLeaveTo(null)
          setDirty(false)
          if (href) router.push(href)
        }}
        onCancel={() => setLeaveTo(null)}
      />
    </>
  )
}
