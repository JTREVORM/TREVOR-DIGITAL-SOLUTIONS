"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArticleEditor } from "@/components/admin/article-editor"
import { EmptyState, LoadingState } from "@/components/admin/ui"
import { getArticle, listAuthors, listCategories, listTags } from "@/lib/admin/service"
import type {
  AdminArticle,
  AdminAuthor,
  AdminCategory,
  AdminTag,
} from "@/lib/admin/types"

export default function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [article, setArticle] = useState<AdminArticle | null>(null)
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [authors, setAuthors] = useState<AdminAuthor[]>([])
  const [tags, setTags] = useState<AdminTag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getArticle(id), listCategories(), listAuthors(), listTags()]).then(
      ([found, nextCategories, nextAuthors, nextTags]) => {
        setArticle(found ?? null)
        setCategories(nextCategories)
        setAuthors(nextAuthors)
        setTags(nextTags)
        setLoading(false)
      }
    )
  }, [id])

  if (loading) return <LoadingState label="Loading article" />

  if (!article) {
    return (
      <EmptyState
        icon={FileText}
        title="Article not found"
        description="This article does not exist, or it was deleted."
        action={
          <Button size="cta" asChild>
            <Link href="/admin/articles">Back to articles</Link>
          </Button>
        }
      />
    )
  }

  return (
    <ArticleEditor
      article={article}
      categories={categories}
      authors={authors}
      tags={tags}
    />
  )
}
