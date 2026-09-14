"use client"

import { useEffect, useState } from "react"
import { ArticleEditor } from "@/components/admin/article-editor"
import { LoadingState } from "@/components/admin/ui"
import { listAuthors, listCategories, listTags } from "@/lib/admin/service"
import type { AdminAuthor, AdminCategory, AdminTag } from "@/lib/admin/types"

export default function NewArticlePage() {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [authors, setAuthors] = useState<AdminAuthor[]>([])
  const [tags, setTags] = useState<AdminTag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([listCategories(), listAuthors(), listTags()]).then(
      ([nextCategories, nextAuthors, nextTags]) => {
        setCategories(nextCategories)
        setAuthors(nextAuthors)
        setTags(nextTags)
        setLoading(false)
      }
    )
  }, [])

  if (loading) return <LoadingState label="Preparing editor" />

  return <ArticleEditor categories={categories} authors={authors} tags={tags} />
}
