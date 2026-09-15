"use client"

import { useState, useTransition, type FormEvent } from "react"
import Link from "next/link"
import { AlertCircle, Check, Loader2, MailX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  unsubscribeFromNewsletter,
  type UnsubscribeResult,
} from "@/app/actions/newsletter"
import { contact } from "@/lib/site"

/**
 * The unsubscribe confirmation.
 *
 * Unsubscribing takes a deliberate click even when the link carries a valid
 * token. Following the link is not proof of intent: corporate mail scanners
 * and link-preview bots fetch every URL in a message, and a one-click GET
 * would quietly unsubscribe people who never touched it. One button press is
 * a small cost for not losing subscribers to a security appliance.
 */
export function UnsubscribeForm({
  token,
  initialEmail,
}: {
  token: string | null
  initialEmail: string
}) {
  const [email, setEmail] = useState(initialEmail)
  const [result, setResult] = useState<UnsubscribeResult | null>(null)
  const [pending, startTransition] = useTransition()

  // With a token the address is already known, so there is nothing to type.
  const knowsWho = Boolean(token) || Boolean(initialEmail)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return

    startTransition(async () => {
      setResult(await unsubscribeFromNewsletter({ token, email: email.trim() }))
    })
  }

  const done =
    result?.state === "unsubscribed" || result?.state === "already_unsubscribed"

  if (done) {
    return (
      <div className="rounded-2xl bg-surface p-7 ring-1 ring-hairline sm:p-8">
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-brand-lift ring-1 ring-primary/20">
          <Check className="size-5" aria-hidden />
        </span>
        <h2 className="mt-5 text-xl font-semibold text-foreground">
          {result.state === "unsubscribed" ? "You are unsubscribed" : "Already done"}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {result.message}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          We keep your address on record as unsubscribed rather than deleting it,
          so you are not accidentally added again. Changed your mind? Subscribing
          again on the{" "}
          <Link
            href="/insights"
            className="font-medium text-brand-lift underline-offset-4 hover:underline"
          >
            Insights page
          </Link>{" "}
          turns it straight back on.
        </p>
        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
          <Button size="cta" variant="outline" asChild>
            <Link href="/">Back to the website</Link>
          </Button>
          <Button size="cta" variant="ghost" asChild>
            <Link href="/insights">Browse Insights</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-surface p-7 ring-1 ring-hairline sm:p-8">
      <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-brand-lift ring-1 ring-primary/20">
        <MailX className="size-5" aria-hidden />
      </span>

      <h2 className="mt-5 text-xl font-semibold text-foreground">
        Unsubscribe from TDS Insights
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {knowsWho
          ? "Confirm below and you will stop receiving the newsletter. No further emails, and no follow-up asking you to reconsider."
          : "Enter the address you subscribed with and we will remove it from the list."}
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6">
        <Label htmlFor="unsubscribe-email" className="mb-2 block text-sm font-medium">
          Email address
        </Label>
        <Input
          id="unsubscribe-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required={!token}
          placeholder="you@company.com"
          value={email}
          disabled={pending}
          onChange={(event) => {
            setEmail(event.target.value)
            if (result) setResult(null)
          }}
          className="h-11 px-3.5"
        />

        {result && !done ? (
          <p
            role="alert"
            className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-destructive"
          >
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            {result.message}
          </p>
        ) : null}

        <Button
          type="submit"
          size="cta"
          variant="destructive"
          className="mt-6 w-full sm:w-auto"
          disabled={pending}
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Unsubscribing
            </>
          ) : (
            "Confirm unsubscribe"
          )}
        </Button>
      </form>

      <p className="mt-6 border-t border-hairline pt-5 text-xs leading-relaxed text-muted-foreground">
        Trouble with this page? Email{" "}
        <a
          href={contact.emailHref}
          className="text-brand-lift underline-offset-4 hover:underline"
        >
          {contact.email}
        </a>{" "}
        and we will remove you by hand.
      </p>
    </div>
  )
}
