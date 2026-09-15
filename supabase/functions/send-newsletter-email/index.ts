/**
 * send-newsletter-email — the only place that knows the Resend API key.
 *
 * Everything that sends mail for Trevor Digital Solutions goes through here.
 * The key lives in Supabase Edge Function secrets, is read from the Deno
 * environment at request time, and is never returned, logged or forwarded.
 * No browser code ever talks to Resend.
 *
 * Three actions, each with its own gate:
 *
 *   welcome    Sent after a visitor subscribes. Requires the shared internal
 *              secret AND an address that is genuinely active in
 *              newsletter_subscribers — so the endpoint cannot be used to mail
 *              a stranger, even by something holding the secret.
 *
 *   test       One copy of an issue to an address the admin typed. Requires
 *              the internal secret AND an access token belonging to an admin
 *              or editor.
 *
 *   broadcast  An issue to every active subscriber. Same gate as `test`, plus
 *              an atomic claim on the issue (begin_newsletter_send) so it can
 *              never go out twice. Subscriber addresses are read here with the
 *              service role and never leave this function.
 *
 * The two gates are independent on purpose. The internal secret proves the
 * request came from the TDS server rather than from someone who found the
 * function URL; the access token proves a real, role-checked person is behind
 * it. Losing either one alone is not enough to send anything.
 */

import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2"
import { htmlToText, newsletterEmail, welcomeEmail } from "./templates.ts"

/* ----------------------------- configuration ----------------------------- */

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const INTERNAL_SECRET = Deno.env.get("NEWSLETTER_INTERNAL_SECRET")

const FROM =
  Deno.env.get("NEWSLETTER_FROM") ??
  "Trevor Digital Solutions <insights@trevordigitalsolutions.com>"
const REPLY_TO = Deno.env.get("NEWSLETTER_REPLY_TO") ?? ""
const SITE_URL = (
  Deno.env.get("SITE_URL") ?? "https://trevordigitalsolutions.com"
).replace(/\/+$/, "")

// Injected by the platform. Present in every deployed Edge Function.
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

/** Resend accepts at most 100 messages per batch request. */
const BATCH_SIZE = 100
/** Resend's default account limit is 2 requests/second; stay well under it. */
const BATCH_PAUSE_MS = 600

const CORS_HEADERS = {
  // Only the TDS server calls this, and a server is not subject to CORS. The
  // header exists so a stray browser request fails visibly rather than
  // mysteriously; it grants nothing on its own, since every action still
  // needs the internal secret.
  "Access-Control-Allow-Origin": SITE_URL,
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-newsletter-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

/* -------------------------------- helpers -------------------------------- */

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  })
}

const EMAIL_RE = /^[^@\s]+@[^@\s.]+\.[^@\s]+$/

function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : ""
}

function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value) && value.length >= 6 && value.length <= 320
}

function unsubscribeUrl(token: string, email: string): string {
  return `${SITE_URL}/unsubscribe?token=${encodeURIComponent(
    token
  )}&email=${encodeURIComponent(email)}`
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Constant-time comparison.
 *
 * A plain `===` on secrets leaks their prefix through timing. The cost of
 * doing it properly here is a few microseconds.
 */
function secretsMatch(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function adminClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/**
 * Resolves the caller to an admin or editor, or returns null.
 *
 * The role is read from `profiles` with the service role — never from the
 * token's own claims, which a client could influence.
 */
async function requireStaff(
  req: Request,
  db: SupabaseClient
): Promise<{ id: string; email: string | null } | null> {
  const header = req.headers.get("Authorization") ?? ""
  const token = header.replace(/^Bearer\s+/i, "").trim()
  if (!token) return null

  const { data, error } = await db.auth.getUser(token)
  if (error || !data.user) return null

  const { data: profile } = await db
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle()

  if (profile?.role !== "admin" && profile?.role !== "editor") return null

  return { id: data.user.id, email: data.user.email ?? null }
}

/* --------------------------------- Resend -------------------------------- */

type Message = {
  from: string
  to: string[]
  subject: string
  html: string
  text: string
  reply_to?: string
  headers?: Record<string, string>
}

function buildMessage(options: {
  to: string
  subject: string
  html: string
  text: string
  unsubscribe: string
}): Message {
  const message: Message = {
    from: FROM,
    to: [options.to],
    subject: options.subject,
    html: options.html,
    text: options.text,
    headers: {
      // Puts an unsubscribe control in the client's own chrome. Mailbox
      // providers weigh this heavily, and a reader who can leave easily is
      // far less likely to press the spam button instead.
      "List-Unsubscribe": `<${options.unsubscribe}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  }
  if (REPLY_TO) message.reply_to = REPLY_TO
  return message
}

async function resendFetch(path: string, payload: unknown): Promise<Response> {
  return await fetch(`https://api.resend.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
}

/** Sends one message. Returns an error string rather than throwing. */
async function sendOne(message: Message): Promise<string | null> {
  try {
    const response = await resendFetch("/emails", message)
    if (response.ok) return null

    const body = await response.text()
    // Never echo the raw body straight back to a caller: it can contain the
    // request we sent. Resend's `message` field is the useful part.
    let detail = body.slice(0, 300)
    try {
      const parsed = JSON.parse(body)
      detail = parsed?.message ?? parsed?.error?.message ?? detail
    } catch {
      // Non-JSON error body; the truncated text is the best we have.
    }
    return `Resend rejected the message (${response.status}): ${detail}`
  } catch (error) {
    return `Could not reach Resend: ${(error as Error).message}`
  }
}

/**
 * Sends a batch, falling back to per-message sends if the batch endpoint
 * refuses the payload.
 *
 * The fallback exists because the batch endpoint has historically been
 * stricter about optional fields than the single-send endpoint. Losing an
 * entire issue to one unsupported header would be a poor trade.
 */
async function sendBatch(
  messages: Message[]
): Promise<{ succeeded: number; failed: number; error: string | null }> {
  try {
    const response = await resendFetch("/emails/batch", messages)

    if (response.ok) {
      return { succeeded: messages.length, failed: 0, error: null }
    }

    const body = await response.text()

    // 4xx means the payload was wrong, not that the service is down: retry
    // one at a time so a single bad address cannot take the batch with it.
    if (response.status >= 400 && response.status < 500) {
      let succeeded = 0
      let failed = 0
      let firstError: string | null = null

      for (const message of messages) {
        const error = await sendOne(message)
        if (error) {
          failed++
          firstError ??= error
        } else {
          succeeded++
        }
      }
      return { succeeded, failed, error: firstError }
    }

    return {
      succeeded: 0,
      failed: messages.length,
      error: `Resend batch failed (${response.status}): ${body.slice(0, 300)}`,
    }
  } catch (error) {
    return {
      succeeded: 0,
      failed: messages.length,
      error: `Could not reach Resend: ${(error as Error).message}`,
    }
  }
}

/* --------------------------------- actions -------------------------------- */

type Subscriber = { email: string; unsubscribe_token: string }

async function handleWelcome(
  payload: Record<string, unknown>,
  db: SupabaseClient
): Promise<Response> {
  const email = normalizeEmail(payload.email)
  if (!isValidEmail(email)) {
    return json({ error: "A valid email address is required." }, 400)
  }

  // The gate that matters: this action can only ever mail an address that is
  // already an active subscriber, so it cannot be turned into a relay.
  const { data: subscriber, error } = await db
    .from("newsletter_subscribers")
    .select("email, unsubscribe_token, status")
    .eq("email", email)
    .maybeSingle()

  if (error) {
    return json({ error: "Could not read the subscriber record." }, 500)
  }
  if (!subscriber || subscriber.status !== "active") {
    return json({ error: "That address is not an active subscriber." }, 404)
  }

  const unsubscribe = unsubscribeUrl(subscriber.unsubscribe_token, subscriber.email)
  const { subject, html, text } = welcomeEmail({
    recipient: subscriber.email,
    unsubscribeUrl: unsubscribe,
    siteUrl: SITE_URL,
  })

  const sendError = await sendOne(
    buildMessage({ to: subscriber.email, subject, html, text, unsubscribe })
  )

  if (sendError) {
    console.error("welcome email failed:", sendError)
    return json({ error: sendError }, 502)
  }

  return json({ sent: true })
}

/** An issue's content, either loaded from the row or supplied for a preview. */
type Draft = {
  id: string | null
  subject: string
  preview_text: string
  content_html: string
  category: string | null
}

async function resolveDraft(
  payload: Record<string, unknown>,
  db: SupabaseClient
): Promise<Draft | string> {
  const newsletterId =
    typeof payload.newsletterId === "string" ? payload.newsletterId : null

  if (newsletterId) {
    const { data, error } = await db
      .from("newsletters")
      .select("id, subject, preview_text, content_html, category")
      .eq("id", newsletterId)
      .maybeSingle()

    if (error) return "Could not load that newsletter."
    if (!data) return "That newsletter no longer exists."
    return data as Draft
  }

  // Unsaved content typed into the editor, for testing before the first save.
  const subject = typeof payload.subject === "string" ? payload.subject.trim() : ""
  const contentHtml =
    typeof payload.contentHtml === "string" ? payload.contentHtml : ""

  if (!subject) return "A subject is required."
  if (!htmlToText(contentHtml)) return "The newsletter has no content."

  return {
    id: null,
    subject,
    preview_text:
      typeof payload.previewText === "string" ? payload.previewText : "",
    content_html: contentHtml,
    category: typeof payload.category === "string" ? payload.category : null,
  }
}

async function handleTest(
  payload: Record<string, unknown>,
  db: SupabaseClient,
  staff: { id: string; email: string | null }
): Promise<Response> {
  const to = normalizeEmail(payload.to)
  if (!isValidEmail(to)) {
    return json({ error: "Enter a valid address to send the test to." }, 400)
  }

  const draft = await resolveDraft(payload, db)
  if (typeof draft === "string") return json({ error: draft }, 400)

  // A test goes to one typed address, which has no subscriber row and so no
  // token. The link still resolves — the unsubscribe page handles an address
  // that is not on the list.
  const unsubscribe = `${SITE_URL}/unsubscribe?email=${encodeURIComponent(to)}`
  const { html, text } = newsletterEmail({
    subject: draft.subject,
    previewText: draft.preview_text,
    contentHtml: draft.content_html,
    category: draft.category,
    recipient: to,
    unsubscribeUrl: unsubscribe,
    siteUrl: SITE_URL,
  })

  const sendError = await sendOne(
    buildMessage({
      to,
      subject: `[TEST] ${draft.subject}`,
      html,
      text,
      unsubscribe,
    })
  )

  // Logged either way. A test that failed is worth seeing in the history.
  await db.from("newsletter_sends").insert({
    newsletter_id: draft.id,
    kind: "test",
    status: sendError ? "failed" : "success",
    recipient_count: 1,
    succeeded: sendError ? 0 : 1,
    failed: sendError ? 1 : 0,
    test_recipient: to,
    error: sendError,
    sent_by: staff.id,
  })

  if (sendError) {
    console.error("test send failed:", sendError)
    return json({ error: sendError }, 502)
  }

  return json({ sent: true, to })
}

async function handleBroadcast(
  payload: Record<string, unknown>,
  db: SupabaseClient,
  staff: { id: string; email: string | null }
): Promise<Response> {
  const newsletterId =
    typeof payload.newsletterId === "string" ? payload.newsletterId : null

  if (!newsletterId) {
    return json({ error: "Save the newsletter before sending it." }, 400)
  }

  // Atomic claim. Two clicks, two admins or a retried request all arrive here;
  // exactly one of them gets `claimed`.
  const { data: claim, error: claimError } = await db.rpc("begin_newsletter_send", {
    p_newsletter_id: newsletterId,
  })

  if (claimError) {
    return json({ error: "Could not start the send." }, 500)
  }

  const claimStatus = (claim as { status?: string } | null)?.status
  if (claimStatus === "not_found") {
    return json({ error: "That newsletter no longer exists." }, 404)
  }
  if (claimStatus === "already_sending") {
    return json({ error: "That newsletter is already being sent." }, 409)
  }
  if (claimStatus === "already_sent") {
    return json({ error: "That newsletter has already been sent." }, 409)
  }
  if (claimStatus !== "claimed") {
    return json({ error: "Could not start the send." }, 500)
  }

  const draft = (claim as { newsletter: Draft }).newsletter

  /** Puts the issue back so it can be corrected and sent again. */
  async function release(reason: string, status: "draft" | "failed") {
    await db
      .from("newsletters")
      .update({ status, last_error: reason })
      .eq("id", newsletterId)
  }

  if (!draft.subject?.trim() || !htmlToText(draft.content_html ?? "")) {
    await release("The newsletter needs a subject and some content.", "draft")
    return json(
      { error: "The newsletter needs a subject and some content." },
      400
    )
  }

  // Read with the service role and kept here. Addresses are never returned to
  // the caller, so no subscriber list reaches the browser for a send.
  const { data: subscribers, error: readError } = await db
    .from("newsletter_subscribers")
    .select("email, unsubscribe_token")
    .eq("status", "active")
    .order("subscribed_at", { ascending: true })

  if (readError) {
    await release("Could not read the subscriber list.", "draft")
    return json({ error: "Could not read the subscriber list." }, 500)
  }

  const recipients = (subscribers ?? []) as Subscriber[]

  if (recipients.length === 0) {
    await release("There are no active subscribers to send to.", "draft")
    return json({ error: "There are no active subscribers to send to." }, 400)
  }

  let succeeded = 0
  let failed = 0
  let firstError: string | null = null

  for (let index = 0; index < recipients.length; index += BATCH_SIZE) {
    const slice = recipients.slice(index, index + BATCH_SIZE)

    const messages = slice.map((subscriber) => {
      const unsubscribe = unsubscribeUrl(
        subscriber.unsubscribe_token,
        subscriber.email
      )
      const { html, text } = newsletterEmail({
        subject: draft.subject,
        previewText: draft.preview_text ?? "",
        contentHtml: draft.content_html,
        category: draft.category,
        recipient: subscriber.email,
        unsubscribeUrl: unsubscribe,
        siteUrl: SITE_URL,
      })
      return buildMessage({
        to: subscriber.email,
        subject: draft.subject,
        html,
        text,
        unsubscribe,
      })
    })

    const result = await sendBatch(messages)
    succeeded += result.succeeded
    failed += result.failed
    firstError ??= result.error

    if (index + BATCH_SIZE < recipients.length) await sleep(BATCH_PAUSE_MS)
  }

  const status = failed === 0 ? "success" : succeeded === 0 ? "failed" : "partial"

  // The issue is marked sent whenever anything went out. Marking a partly
  // delivered issue as a draft would invite someone to send it again and
  // double-mail everyone who already received it.
  await db
    .from("newsletters")
    .update({
      status: succeeded > 0 ? "sent" : "failed",
      sent_at: succeeded > 0 ? new Date().toISOString() : null,
      recipient_count: succeeded,
      last_error: firstError,
    })
    .eq("id", newsletterId)

  await db.from("newsletter_sends").insert({
    newsletter_id: newsletterId,
    kind: "broadcast",
    status,
    recipient_count: recipients.length,
    succeeded,
    failed,
    error: firstError,
    sent_by: staff.id,
  })

  if (succeeded === 0) {
    return json(
      { error: firstError ?? "The newsletter could not be sent.", failed },
      502
    )
  }

  return json({
    sent: true,
    recipientCount: recipients.length,
    succeeded,
    failed,
    error: firstError,
  })
}

/* --------------------------------- router --------------------------------- */

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS })
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, 405)
  }

  // Refuse to run half-configured rather than failing per-message later.
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set on this function.")
    return json({ error: "Email sending is not configured." }, 500)
  }
  if (!INTERNAL_SECRET) {
    console.error("NEWSLETTER_INTERNAL_SECRET is not set on this function.")
    return json({ error: "Email sending is not configured." }, 500)
  }

  // Gate one: this request came from the TDS server, not from someone who
  // found the URL. Checked before anything is parsed or looked up.
  const presented = req.headers.get("x-newsletter-secret") ?? ""
  if (!secretsMatch(presented, INTERNAL_SECRET)) {
    return json({ error: "Not authorised." }, 401)
  }

  let payload: Record<string, unknown>
  try {
    payload = (await req.json()) as Record<string, unknown>
  } catch {
    return json({ error: "Expected a JSON body." }, 400)
  }

  const action = typeof payload.action === "string" ? payload.action : ""
  const db = adminClient()

  try {
    if (action === "welcome") {
      return await handleWelcome(payload, db)
    }

    if (action === "test" || action === "broadcast") {
      // Gate two: a real person with an editorial role is behind this.
      const staff = await requireStaff(req, db)
      if (!staff) {
        return json({ error: "Not authorised." }, 403)
      }

      return action === "test"
        ? await handleTest(payload, db, staff)
        : await handleBroadcast(payload, db, staff)
    }

    return json({ error: "Unknown action." }, 400)
  } catch (error) {
    // Anything unexpected: log it where only the project owner can read it,
    // and tell the caller nothing about the internals.
    console.error("send-newsletter-email failed:", error)
    return json({ error: "Something went wrong while sending." }, 500)
  }
})
