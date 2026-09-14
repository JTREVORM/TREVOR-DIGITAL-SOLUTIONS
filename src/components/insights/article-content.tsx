import { Fragment, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Info } from "lucide-react"
import type { ContentBlock } from "@/lib/content/insights-types"

/**
 * Renders an article's block array.
 *
 * Blocks are rendered as real React elements rather than injected HTML, so
 * nothing an editor types in Phase 5 can become markup. Inline formatting
 * supports a deliberately small markdown subset: **bold**, *italic*, `code`
 * and [links](/href).
 *
 * Measure is capped near 68 characters, which reads comfortably without the
 * cramped column a hard `max-w-prose` would give at desktop sizes.
 */

/** Splits inline markdown into React nodes. */
function inline(text: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g
  const parts = text.split(pattern).filter((part) => part !== "")

  return parts.map((part, index) => {
    const key = `${index}-${part.slice(0, 12)}`

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={key} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      )
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={key} className="italic">
          {part.slice(1, -1)}
        </em>
      )
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={key}
          className="rounded bg-muted px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[0.85em] text-brand-lift"
        >
          {part.slice(1, -1)}
        </code>
      )
    }

    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
    if (link) {
      const [, label, href] = link
      const isInternal = href.startsWith("/")
      const className =
        "font-medium text-brand-lift underline decoration-brand/40 underline-offset-4 transition-colors hover:decoration-brand"

      return isInternal ? (
        <Link key={key} href={href} className={className}>
          {label}
        </Link>
      ) : (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {label}
        </a>
      )
    }

    return <Fragment key={key}>{part}</Fragment>
  })
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading": {
      const id = slugifyHeading(block.text)
      // Articles own h1; body headings start at h2.
      return block.level === 2 ? (
        <h2
          id={id}
          className="mt-14 scroll-mt-28 text-[1.5rem] leading-snug font-semibold text-foreground sm:text-[1.75rem]"
        >
          {block.text}
        </h2>
      ) : (
        <h3
          id={id}
          className="mt-10 scroll-mt-28 text-xl leading-snug font-semibold text-foreground"
        >
          {block.text}
        </h3>
      )
    }

    case "paragraph":
      return (
        <p className="mt-6 text-[1.0625rem] leading-[1.75] text-muted-foreground">
          {inline(block.text)}
        </p>
      )

    case "list": {
      const items = block.items.map((item, index) => (
        <li key={index} className="pl-1.5 leading-[1.7] marker:text-brand-lift">
          {inline(item)}
        </li>
      ))
      return block.ordered ? (
        <ol className="mt-6 list-decimal space-y-3 pl-5 text-[1.0625rem] text-muted-foreground marker:font-[family-name:var(--font-mono)] marker:text-sm">
          {items}
        </ol>
      ) : (
        <ul className="mt-6 list-disc space-y-3 pl-5 text-[1.0625rem] text-muted-foreground">
          {items}
        </ul>
      )
    }

    case "quote":
      return (
        <figure className="mt-10">
          <blockquote className="border-l-2 border-brand pl-6 text-lg leading-relaxed text-foreground/90 italic sm:text-xl">
            {inline(block.text)}
          </blockquote>
          {block.attribution ? (
            <figcaption className="mt-3 pl-6 text-sm text-muted-foreground">
              &mdash; {block.attribution}
            </figcaption>
          ) : null}
        </figure>
      )

    case "code":
      return (
        <figure className="mt-8">
          <div className="overflow-hidden rounded-xl bg-surface-raised ring-1 ring-hairline">
            {block.language ? (
              <div className="border-b border-hairline px-4 py-2.5">
                <span className="font-[family-name:var(--font-mono)] text-[0.6875rem] tracking-[0.1em] text-muted-foreground/70 uppercase">
                  {block.language}
                </span>
              </div>
            ) : null}
            <pre className="overflow-x-auto p-4 sm:p-5">
              <code className="font-[family-name:var(--font-mono)] text-[0.8125rem] leading-[1.7] text-foreground/90">
                {block.code}
              </code>
            </pre>
          </div>
          {block.caption ? (
            <figcaption className="mt-3 text-sm text-muted-foreground">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      )

    case "image":
      return (
        <figure className="mt-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-background ring-1 ring-hairline">
            <Image
              src={block.src}
              alt={block.alt}
              fill
              sizes="(max-width: 768px) 100vw, 760px"
              className="object-cover object-center"
            />
          </div>
          {block.caption ? (
            <figcaption className="mt-3 text-sm text-muted-foreground">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      )

    case "table":
      return (
        <figure className="mt-10">
          {/* Tables get their own scroll container so a wide one never
              widens the page on a phone. */}
          <div className="overflow-x-auto rounded-xl ring-1 ring-hairline">
            <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
              <thead className="bg-surface-raised">
                <tr>
                  {block.head.map((cell) => (
                    <th
                      key={cell}
                      scope="col"
                      className="border-b border-hairline px-4 py-3 font-[family-name:var(--font-mono)] text-[0.6875rem] tracking-[0.1em] text-brand-lift uppercase"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-hairline last:border-0">
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-4 py-3 align-top leading-relaxed text-muted-foreground"
                      >
                        {inline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption ? (
            <figcaption className="mt-3 text-sm text-muted-foreground">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      )

    case "callout":
      return (
        <aside className="mt-10 rounded-xl bg-primary/[0.07] p-5 ring-1 ring-primary/20 sm:p-6">
          <div className="flex gap-4">
            <Info className="mt-0.5 size-5 shrink-0 text-brand-lift" aria-hidden />
            <div className="min-w-0">
              {block.title ? (
                <p className="text-[0.9375rem] font-semibold text-foreground">
                  {block.title}
                </p>
              ) : null}
              <p className="mt-1.5 leading-relaxed text-muted-foreground">
                {inline(block.text)}
              </p>
            </div>
          </div>
        </aside>
      )

    case "divider":
      return <hr className="mt-12 border-hairline" />

    case "embed":
      return (
        <figure className="mt-10 rounded-xl bg-surface-raised p-5 ring-1 ring-hairline">
          <p className="text-[0.9375rem] font-medium text-foreground">{block.title}</p>
          <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-block text-sm break-all text-brand-lift underline-offset-4 hover:underline"
          >
            {block.url}
          </a>
          {block.provider ? (
            <figcaption className="mt-2 font-[family-name:var(--font-mono)] text-[0.6875rem] tracking-[0.1em] text-muted-foreground/70 uppercase">
              {block.provider}
            </figcaption>
          ) : null}
        </figure>
      )

    default:
      return null
  }
}

export function ArticleContent({ content }: { content: ContentBlock[] }) {
  return (
    <div className="max-w-[68ch] [&>*:first-child]:mt-0">
      {content.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  )
}
