import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Author } from "@/lib/content/insights-types"

/**
 * Author block for the foot of an article.
 *
 * Reads entirely from the author record, so adding contributors in Phase 5
 * needs no change here. Biography text comes from the author data and is
 * limited to what this project already documents.
 */

function initialsOf(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "TDS"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function AuthorCard({ author }: { author: Author }) {
  return (
    <section
      aria-labelledby="article-author"
      className="rounded-2xl bg-surface p-6 ring-1 ring-hairline sm:p-8"
    >
      <p className="eyebrow">Written by</p>

      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:gap-6">
        <div className="shrink-0">
          {author.avatar ? (
            <div className="relative size-20 overflow-hidden rounded-xl bg-surface-raised ring-1 ring-hairline">
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                sizes="80px"
                className="object-cover object-top"
              />
            </div>
          ) : (
            <div className="flex size-20 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <span className="font-[family-name:var(--font-display)] text-xl font-semibold text-brand-lift">
                {initialsOf(author.name)}
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h2 id="article-author" className="text-lg font-semibold text-foreground">
            {author.name}
          </h2>
          <p className="mt-1 text-sm text-brand-lift">
            {author.role}, {author.company}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {author.bio}
          </p>

          {author.profileUrl ? (
            <Link
              href={author.profileUrl}
              className="mt-5 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-brand-lift transition-colors hover:text-foreground"
            >
              Full profile
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}
