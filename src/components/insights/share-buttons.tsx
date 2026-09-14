"use client"

import { useEffect, useState } from "react"
import { Check, Link2 } from "lucide-react"
import {
  FacebookIcon,
  LinkedInIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/site/social-icons"
import { site } from "@/lib/site"

/**
 * Article sharing.
 *
 * The canonical production URL is built from the article slug rather than
 * read from `window.location`, so a link shared from localhost or a preview
 * deployment still points at the public article. Copy Link uses the
 * clipboard API with a hidden-textarea fallback for browsers that refuse it
 * outside a secure context.
 */

type ShareButtonsProps = {
  slug: string
  title: string
}

export function ShareButtons({ slug, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const url = `${site.url}/insights/${slug}`

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  async function copyLink() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url)
      } else {
        const field = document.createElement("textarea")
        field.value = url
        field.setAttribute("readonly", "")
        field.style.position = "fixed"
        field.style.opacity = "0"
        document.body.appendChild(field)
        field.select()
        document.execCommand("copy")
        document.body.removeChild(field)
      }
      setCopied(true)
    } catch {
      // Leave the button unchanged; the URL is in the address bar anyway.
    }
  }

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const targets = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: WhatsAppIcon,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: LinkedInIcon,
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: FacebookIcon,
    },
    {
      name: "X",
      href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: XIcon,
    },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-[family-name:var(--font-mono)] text-[0.625rem] tracking-[0.14em] text-muted-foreground/70 uppercase">
        Share
      </span>

      {targets.map((target) => (
        <a
          key={target.name}
          href={target.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${target.name}`}
          title={`Share on ${target.name}`}
          className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground ring-1 ring-hairline transition-colors hover:bg-primary/10 hover:text-brand-lift"
        >
          <target.icon className="size-4" />
        </a>
      ))}

      <button
        type="button"
        onClick={copyLink}
        aria-label={copied ? "Link copied" : "Copy link"}
        title={copied ? "Link copied" : "Copy link"}
        className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-[0.8125rem] font-medium text-muted-foreground ring-1 ring-hairline transition-colors hover:bg-primary/10 hover:text-brand-lift"
      >
        {copied ? (
          <Check className="size-4 text-brand-lift" aria-hidden />
        ) : (
          <Link2 className="size-4" aria-hidden />
        )}
        <span aria-live="polite">{copied ? "Copied" : "Copy link"}</span>
      </button>
    </div>
  )
}
