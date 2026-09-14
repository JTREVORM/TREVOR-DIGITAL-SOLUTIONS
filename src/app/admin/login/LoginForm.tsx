"use client"

import { useState, type FormEvent } from "react"
import { AlertTriangle, Eye, EyeOff, Loader2, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Field, inputClasses } from "@/components/admin/ui"
import { login } from "@/app/actions/auth"

/**
 * Sign-in form.
 *
 * Credentials are submitted to the existing `login` server action, which
 * calls Supabase `signInWithPassword`. There is no password in this file, no
 * client-side credential check, and no local "session" — if Supabase is not
 * configured the attempt fails honestly and says why.
 *
 * `remember me` is presentational until Phase 6: Supabase session lifetime
 * is a server concern, so the checkbox is wired to nothing rather than being
 * given a fake implementation in the browser.
 */
export function LoginForm({
  message,
  isConfigured,
}: {
  message?: string
  isConfigured: boolean
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(message ?? null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!isConfigured) {
      setError(
        "Authentication is not connected yet. Supabase credentials are missing, so there is no account to sign in to."
      )
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData(event.currentTarget)
      await login(formData)
      // A successful login redirects from the server action, so reaching
      // this point means the attempt came back without navigating.
      setIsSubmitting(false)
    } catch (cause) {
      // Next throws a redirect signal on success; rethrow so it is handled.
      if (
        typeof cause === "object" &&
        cause !== null &&
        "digest" in cause &&
        String((cause as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT")
      ) {
        throw cause
      }
      setIsSubmitting(false)
      setError("Could not sign in. Check the email and password and try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!isConfigured ? (
        <div
          role="status"
          className="flex gap-3 rounded-lg bg-primary/[0.08] p-4 ring-1 ring-primary/25"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-brand-lift" aria-hidden />
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">
              Authentication is not connected yet.
            </span>{" "}
            Supabase Auth is wired up in Phase 6. This screen is the real form
            and will work as soon as credentials exist.
          </p>
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="flex gap-3 rounded-lg bg-destructive/[0.08] p-4 ring-1 ring-destructive/25"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
          <p className="text-sm leading-relaxed text-foreground">{error}</p>
        </div>
      ) : null}

      <Field label="Email address" htmlFor="email" required>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="you@trevordigitalsolutions.com"
          className={inputClasses}
          disabled={isSubmitting}
        />
      </Field>

      <Field label="Password" htmlFor="password" required>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            className={`${inputClasses} pr-12`}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute top-1/2 right-1.5 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden />
            ) : (
              <Eye className="size-4" aria-hidden />
            )}
          </button>
        </div>
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="remember"
            className="size-4 rounded border-input bg-input/30 accent-[oklch(0.6676_0.1797_248.36)]"
            disabled={isSubmitting}
          />
          Remember me
        </label>

        <a
          href="mailto:trevordigitalsolutions@gmail.com?subject=Admin%20password%20reset"
          className="text-sm font-medium text-brand-lift underline-offset-4 hover:underline"
        >
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        size="cta-lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Signing in…
          </>
        ) : (
          <>
            <LogIn aria-hidden />
            Sign in
          </>
        )}
      </Button>
    </form>
  )
}
