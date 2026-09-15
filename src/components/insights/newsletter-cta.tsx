"use client"

import { useState, useTransition, type FormEvent } from "react"
import { AlertCircle, Check, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { subscribeToNewsletter, type SubscribeResult } from "@/app/actions/newsletter"
import { cn } from "@/lib/utils"

/**
 * Newsletter sign-up.
 *
 * The address goes to a server action, which hands it to a SECURITY DEFINER
 * database function that normalises, validates and rate-limits it. Nothing
 * about Resend or the subscriber list is reachable from this component —
 * it knows an email address and a result, and nothing else.
 */
export function NewsletterCta({
  className,
  tone = "band",
  /** Recorded on the subscriber row, so it is clear where someone signed up. */
  source = "insights",
}: {
  className?: string
  /** `band` for a full-width section, `card` for a sidebar or article foot. */
  tone?: "band" | "card"
  source?: string
}) {
  const [email, setEmail] = useState("")
  const [result, setResult] = useState<SubscribeResult | null>(null)
  const [pending, startTransition] = useTransition()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // A second submission while the first is in flight would create a second
    // sign-up attempt against the rate limit for no benefit.
    if (pending) return

    const value = email.trim()
    if (!value) return

    startTransition(async () => {
      const next = await subscribeToNewsletter(value, source)
      setResult(next)
      // Only clear the field on success. After an error the address is still
      // there to correct, rather than having to be retyped.
      if (next.state === "subscribed" || next.state === "already_subscribed") {
        setEmail("")
      }
    })
  }

  const settled =
    result?.state === "subscribed" || result?.state === "already_subscribed"

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

      {settled ? (
        <div className="mt-6 flex items-start gap-3 rounded-lg bg-primary/10 p-4 ring-1 ring-primary/25">
          <Check className="mt-0.5 size-4 shrink-0 text-brand-lift" aria-hidden />
          <div className="text-sm leading-relaxed text-foreground">
            <p>{result.message}</p>
            {result.state === "subscribed" && result.welcomeSent === false ? (
              <p className="mt-2 text-muted-foreground">
                You can unsubscribe from any issue we send.
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-6">
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
              disabled={pending}
              aria-invalid={result ? true : undefined}
              aria-describedby={result ? "newsletter-status" : undefined}
              onChange={(event) => {
                setEmail(event.target.value)
                // Clear a stale error the moment the address is edited.
                if (result) setResult(null)
              }}
              className="h-11 flex-1 px-3.5"
            />
            <Button type="submit" size="cta" className="shrink-0" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Subscribing
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </div>

          {result ? (
            <p
              id="newsletter-status"
              role="alert"
              className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-destructive"
            >
              <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              {result.message}
            </p>
          ) : (
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              One email per article, at most. Unsubscribe in one click, any time.
            </p>
          )}

          {/* Announces the in-flight state to screen readers without moving
              anything on screen. */}
          <span aria-live="polite" className="sr-only">
            {pending ? "Subscribing" : ""}
          </span>
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
