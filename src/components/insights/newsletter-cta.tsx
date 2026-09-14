"use client"

import { useState, type FormEvent } from "react"
import { Check, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

/**
 * Newsletter sign-up — interface only.
 *
 * PHASE 5: there is no backend behind this yet, and the component says so
 * rather than pretending to subscribe anyone. Wire `onSubmit` to a server
 * action and remove the notice once a list exists. Collecting addresses into
 * a form that discards them would be worse than not offering it.
 */
export function NewsletterCta({
  className,
  tone = "band",
}: {
  className?: string
  /** `band` for a full-width section, `card` for a sidebar or article foot. */
  tone?: "band" | "card"
}) {
  const [email, setEmail] = useState("")
  const [acknowledged, setAcknowledged] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Intentionally does not transmit anything. See the note above.
    setAcknowledged(true)
  }

  const body = (
    <>
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-brand-lift ring-1 ring-primary/20">
          <Mail className="size-[1.125rem]" aria-hidden />
        </span>
        <p className="eyebrow">TDS Insights</p>
      </div>

      <h2
        className={cn(
          "mt-5 leading-snug font-semibold text-foreground",
          tone === "band" ? "text-[1.625rem] sm:text-3xl" : "text-xl"
        )}
      >
        New articles, when there are new articles.
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Occasional notes on software engineering, business systems and market
        technology. No schedule to pad out, and no marketing sequences.
      </p>

      {acknowledged ? (
        <div className="mt-6 flex items-start gap-3 rounded-lg bg-primary/10 p-4 ring-1 ring-primary/25">
          <Check className="mt-0.5 size-4 shrink-0 text-brand-lift" aria-hidden />
          <p className="text-sm leading-relaxed text-foreground">
            The mailing list is not live yet, so nothing was sent and your
            address was not stored. Email us at{" "}
            <a
              href="mailto:trevordigitalsolutions@gmail.com"
              className="font-medium text-brand-lift underline-offset-4 hover:underline"
            >
              trevordigitalsolutions@gmail.com
            </a>{" "}
            to be added when it opens.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6">
          <Label htmlFor="newsletter-email" className="sr-only">
            Email address
          </Label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id="newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 flex-1 px-3.5"
            />
            <Button type="submit" size="cta" className="shrink-0">
              Subscribe
            </Button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            The list is not open yet — this form does not store or send
            anything.
          </p>
        </form>
      )}
    </>
  )

  if (tone === "card") {
    return (
      <section className={cn("rounded-2xl bg-surface p-6 ring-1 ring-hairline", className)}>
        {body}
      </section>
    )
  }

  return (
    <section className={cn("border-t border-hairline bg-surface py-16 sm:py-20", className)}>
      <div className="shell">
        <div className="edge-light relative overflow-hidden rounded-2xl bg-surface-raised p-6 ring-1 ring-hairline sm:p-10">
          <div className="max-w-2xl">{body}</div>
        </div>
      </div>
    </section>
  )
}
