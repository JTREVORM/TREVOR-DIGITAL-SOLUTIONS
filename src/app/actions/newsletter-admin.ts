"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { getAdminSession } from "@/lib/auth/session"
import { callNewsletterFunction } from "@/lib/newsletter/edge"

/**
 * Admin newsletter actions: send a test, and send an issue to the list.
 *
 * Both are Server Functions, which means they are reachable by anyone who can
 * craft a request to this app — being unreachable from the admin UI protects
 * nothing. So each one re-establishes who is calling from the session cookie
 * before it does anything, exactly as if it were a public endpoint.
 *
 * That check is then made again, independently, inside the Edge Function,
 * which verifies the same user's access token against `profiles` with the
 * service role. Two separate places have to agree before an email goes out.
 */

export type SendResult =
  | { ok: true; message: string; recipientCount?: number; failed?: number }
  | { ok: false; message: string }

const REFUSED = "You do not have permission to send newsletters."

/**
 * Confirms an admin or editor is behind this call and returns their access
 * token for the Edge Function to re-verify.
 */
async function requireStaffToken(): Promise<
  { token: string } | { error: string }
> {
  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured on this deployment." }
  }

  // getAdminSession() calls getUser(), which revalidates the token with
  // Supabase rather than trusting the cookie's contents.
  const session = await getAdminSession()
  if (!session) return { error: "Your session has expired. Sign in again." }
  if (!session.canAccessAdmin) return { error: REFUSED }

  const supabase = await createClient()
  const {
    data: { session: authSession },
  } = await supabase.auth.getSession()

  if (!authSession?.access_token) {
    return { error: "Your session has expired. Sign in again." }
  }

  return { token: authSession.access_token }
}

const testSchema = z.object({
  to: z.string().trim().email("Enter a valid address to send the test to."),
  newsletterId: z.string().uuid().optional(),
  subject: z.string().trim().max(300).optional(),
  previewText: z.string().trim().max(300).optional(),
  contentHtml: z.string().max(400_000).optional(),
  category: z.string().trim().max(120).optional(),
})

export async function sendTestNewsletter(
  input: z.infer<typeof testSchema>
): Promise<SendResult> {
  const parsed = testSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form." }
  }

  const auth = await requireStaffToken()
  if ("error" in auth) return { ok: false, message: auth.error }

  const result = await callNewsletterFunction(
    { action: "test", ...parsed.data },
    auth.token
  )

  if (!result.ok) return { ok: false, message: result.error }

  return { ok: true, message: `Test sent to ${parsed.data.to}.` }
}

export async function sendNewsletterToSubscribers(
  newsletterId: string
): Promise<SendResult> {
  if (!z.string().uuid().safeParse(newsletterId).success) {
    return { ok: false, message: "Save the newsletter before sending it." }
  }

  const auth = await requireStaffToken()
  if ("error" in auth) return { ok: false, message: auth.error }

  const result = await callNewsletterFunction<{
    recipientCount?: number
    succeeded?: number
    failed?: number
  }>({ action: "broadcast", newsletterId }, auth.token)

  if (!result.ok) return { ok: false, message: result.error }

  const succeeded = result.data.succeeded ?? 0
  const failed = result.data.failed ?? 0

  return {
    ok: true,
    recipientCount: result.data.recipientCount,
    failed,
    message:
      failed > 0
        ? `Sent to ${succeeded} subscribers. ${failed} could not be delivered — see the send history.`
        : `Sent to ${succeeded} ${succeeded === 1 ? "subscriber" : "subscribers"}.`,
  }
}
