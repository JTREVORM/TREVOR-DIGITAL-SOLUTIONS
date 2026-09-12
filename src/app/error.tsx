"use client"

import Link from "next/link"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { contact } from "@/lib/site"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section className="relative flex flex-1 items-center overflow-hidden py-24 sm:py-32">
      <div className="brand-wash-soft pointer-events-none absolute inset-0" aria-hidden />
      <div className="shell relative">
        <div className="max-w-xl">
          <p className="eyebrow">Unexpected error</p>
          <h1 className="mt-6 text-[2rem] leading-[1.1] font-semibold text-foreground sm:text-[2.75rem]">
            Something went wrong on our side.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            This is our fault, not yours. Try again, and if it keeps happening
            let us know &mdash; we would rather hear about it than not.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button size="cta-lg" onClick={reset}>
              <RefreshCw aria-hidden />
              Try again
            </Button>
            <Button size="cta-lg" variant="outline" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </div>

          <div className="mt-12 border-t border-hairline pt-8">
            <p className="text-sm text-muted-foreground">
              Still stuck? Email{" "}
              <a
                href={contact.emailHref}
                className="text-brand-lift underline-offset-4 hover:underline"
              >
                {contact.email}
              </a>{" "}
              or call{" "}
              <a
                href={contact.phoneHref}
                className="text-brand-lift underline-offset-4 hover:underline"
              >
                {contact.phone}
              </a>
              .
            </p>
            {error.digest ? (
              <p className="mt-4 font-[family-name:var(--font-mono)] text-xs text-muted-foreground/60">
                Reference: {error.digest}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
