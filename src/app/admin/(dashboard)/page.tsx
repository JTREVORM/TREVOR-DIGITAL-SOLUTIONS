"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  CalendarClock,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  PenSquare,
  Plus,
  Tag,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  EmptyState,
  LoadingState,
  PageHeader,
  Panel,
  StatCard,
  StatusBadge,
} from "@/components/admin/ui"
import { getStats, listArticles, listCategories } from "@/lib/admin/service"
import type { AdminArticle, AdminCategory, DashboardStats } from "@/lib/admin/types"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recent, setRecent] = useState<AdminArticle[]>([])
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const [nextStats, articles, nextCategories] = await Promise.all([
        getStats(),
        listArticles(),
        listCategories(),
      ])
      if (cancelled) return
      setStats(nextStats)
      setRecent(articles.slice(0, 5))
      setCategories(nextCategories)
      setLoading(false)
    }

    load()
    window.addEventListener("tds-admin-store-changed", load)
    return () => {
      cancelled = true
      window.removeEventListener("tds-admin-store-changed", load)
    }
  }, [])

  const categoryName = (id: string) =>
    categories.find((category) => category.id === id)?.name ?? "Uncategorised"

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Content overview for TDS Insights."
        crumbs={[{ name: "Admin" }]}
        actions={
          <Button size="cta" asChild>
            <Link href="/admin/articles/new">
              <Plus aria-hidden />
              Create article
            </Link>
          </Button>
        }
      />

      {loading || !stats ? (
        <LoadingState label="Loading dashboard" />
      ) : (
        <div className="space-y-8">
          {/* Article stats */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total articles"
              value={stats.totalArticles}
              icon={FileText}
              href="/admin/articles"
            />
            <StatCard
              label="Published"
              value={stats.published}
              icon={PenSquare}
              hint="Live on the website"
              href="/admin/articles?status=published"
            />
            <StatCard
              label="Drafts"
              value={stats.drafts}
              icon={FileText}
              hint="Not visible publicly"
              href="/admin/articles?status=draft"
            />
            <StatCard
              label="Scheduled"
              value={stats.scheduled}
              icon={CalendarClock}
              hint="Queued to publish"
              href="/admin/articles?status=scheduled"
            />
          </div>

          {/* Library stats */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Categories"
              value={stats.categories}
              icon={FolderKanban}
              href="/admin/categories"
            />
            <StatCard label="Tags" value={stats.tags} icon={Tag} href="/admin/tags" />
            <StatCard
              label="Authors"
              value={stats.authors}
              icon={Users}
              href="/admin/authors"
            />
            <StatCard
              label="Media"
              value={stats.media}
              icon={ImageIcon}
              href="/admin/media"
            />
          </div>

          {/* Recent articles */}
          <Panel
            title="Recent articles"
            description="The five most recent by publication date."
            actions={
              <Button size="xs" variant="outline" asChild>
                <Link href="/admin/articles">View all</Link>
              </Button>
            }
          >
            {recent.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No articles yet"
                description="Create your first article to see it here."
                action={
                  <Button size="cta" asChild>
                    <Link href="/admin/articles/new">
                      <Plus aria-hidden />
                      Create article
                    </Link>
                  </Button>
                }
              />
            ) : (
              <ul className="divide-y divide-hairline">
                {recent.map((article) => (
                  <li key={article.id} className="py-3.5 first:pt-0 last:pb-0">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="group flex flex-col gap-2 rounded-lg sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-brand-lift">
                          {article.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {categoryName(article.categoryId)} &middot;{" "}
                          {article.publishedDate} &middot; {article.readingTime} min
                        </p>
                      </div>
                      <StatusBadge status={article.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      )}
    </>
  )
}
