import "server-only"

import { supabaseUrl } from "@/lib/supabase/config"

/**
 * The server's side of the line to the `send-newsletter-email` Edge Function.
 *
 * `server-only` at the top makes importing this from a client component a
 * build error. That matters more here than anywhere else in the codebase:
 * NEWSLETTER_INTERNAL_SECRET is what proves a send request came from this
 * server, and a single accidental import into a client bundle would publish
 * it. Nothing in this file may ever be reachable from the browser.
 *
 * The Resend API key is not here either — it never leaves Supabase's secret
 * store. This module knows only how to ask the Edge Function to send.
 */

const FUNCTION_NAME = "send-newsletter-email"

export type EdgeResult<T = Record<string, unknown>> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string }

function functionsUrl(): string | null {
  // An explicit override wins — useful when functions are served from a
  // custom domain, or from `supabase functions serve` during development.
  const override = process.env.SUPABASE_FUNCTIONS_URL?.replace(/\/+$/, "")
  if (override) return `${override}/${FUNCTION_NAME}`

  if (!supabaseUrl) return null
  return `${supabaseUrl.replace(/\/+$/, "")}/functions/v1/${FUNCTION_NAME}`
}

/** True when this deployment is able to send mail at all. */
export function isNewsletterSendingConfigured(): boolean {
  return Boolean(process.env.NEWSLETTER_INTERNAL_SECRET && functionsUrl())
}

/**
 * Calls the Edge Function.
 *
 * `accessToken` is the signed-in admin's own token, forwarded so the function
 * can check their role against `profiles` for itself rather than taking this
 * server's word for it. Omitted for the welcome email, which has no user
 * behind it and is gated on the address already being an active subscriber.
 */
export async function callNewsletterFunction<T = Record<string, unknown>>(
  payload: Record<string, unknown>,
  accessToken?: string
): Promise<EdgeResult<T>> {
  const url = functionsUrl()
  const secret = process.env.NEWSLETTER_INTERNAL_SECRET

  if (!url || !secret) {
    return {
      ok: false,
      status: 500,
      error:
        "Email sending is not configured on this deployment. " +
        "NEWSLETTER_INTERNAL_SECRET and the Supabase URL are both required.",
    }
  }

  let response: Response
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-newsletter-secret": secret,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(payload),
      // Sending a large issue takes a while; the platform's own limit applies
      // beyond this, but do not give up early on a request that is working.
      signal: AbortSignal.timeout(120_000),
    })
  } catch (error) {
    const reason =
      error instanceof Error && error.name === "TimeoutError"
        ? "The mail service did not respond in time."
        : "Could not reach the mail service."
    console.error(`${FUNCTION_NAME} request failed:`, error)
    return { ok: false, status: 503, error: reason }
  }

  let body: Record<string, unknown> = {}
  try {
    body = (await response.json()) as Record<string, unknown>
  } catch {
    // A non-JSON response means something upstream answered instead of the
    // function — a gateway error page, usually.
  }

  if (!response.ok) {
    // `error` is our own shape. `message` is what Supabase's gateway returns
    // when the function is not deployed or is failing to boot — worth
    // surfacing, because that is the likeliest problem on a fresh install.
    const message =
      typeof body.error === "string"
        ? body.error
        : typeof body.message === "string"
          ? body.message
          : `The mail service returned ${response.status}.`
    console.error(`${FUNCTION_NAME} responded ${response.status}:`, message)
    return { ok: false, status: response.status, error: message }
  }

  return { ok: true, data: body as T }
}
