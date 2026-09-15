"use client"

import { createClient } from "@/lib/supabase/client"
import type {
  NewsletterRow,
  NewsletterSendWithSubject,
  SubscriberRow,
  SubscriberStats,
} from "./types"

/* ==========================================================================
   NEWSLETTER ADMIN SERVICE — Supabase
   --------------------------------------------------------------------------
   The same shape as src/lib/admin/service.ts, and for the same reason: these
   run in the browser against the anon key, and Row Level Security is the
   authority on what the signed-in user may read or write. Nothing here checks
   permissions itself — the policies in
   supabase/migrations/0005_newsletter.sql are the real boundary.

   Note what is NOT here. Sending anything, and adding a subscriber, both go
   through server actions, because the first needs the Resend key and the
   second needs rate limiting. This file only reads and curates.
   ========================================================================== */

function db() {
  return createClient()
}

/** Surfaces Postgres/RLS errors as something a person can act on. */
function fail(action: string, error: { message: string; code?: string } | null): never {
  const code = error?.code ? ` (${error.code})` : ""
  if (error?.code === "42501" || /row-level security/i.test(error?.message ?? "")) {
    throw new Error(
      `Not permitted: ${action}. Your account does not have the required role.`
    )
  }
  throw new Error(`Could not ${action}${code}: ${error?.message ?? "unknown error"}`)
}

/* ------------------------------ subscribers ----------------------------- */

export async function listSubscribers(): Promise<SubscriberRow[]> {
  const { data, error } = await db()
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false })

  if (error) fail("load subscribers", error)
  return (data ?? []) as SubscriberRow[]
}

/**
 * Counts, read as three head-only queries.
 *
 * `head: true` asks Postgres for the count and no rows, so the figures do not
 * depend on having every subscriber loaded in the browser.
 */
export async function getSubscriberStats(): Promise<SubscriberStats> {
  const client = db()

  const countWhere = async (status?: string) => {
    let query = client
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
    if (status) query = query.eq("status", status)
    const { count, error } = await query
    if (error) fail("count subscribers", error)
    return count ?? 0
  }

  const [total, active, unsubscribed] = await Promise.all([
    countWhere(),
    countWhere("active"),
    countWhere("unsubscribed"),
  ])

  return { total, active, unsubscribed }
}

export async function setSubscriberStatus(
  id: string,
  status: "active" | "unsubscribed"
): Promise<void> {
  const { error } = await db()
    .from("newsletter_subscribers")
    .update({
      status,
      // Keep the timestamps honest: reactivating restarts the subscription,
      // deactivating records when it stopped.
      subscribed_at: status === "active" ? new Date().toISOString() : undefined,
      unsubscribed_at: status === "unsubscribed" ? new Date().toISOString() : null,
    })
    .eq("id", id)

  if (error) fail("update the subscriber", error)
}

export async function deleteSubscriber(id: string): Promise<void> {
  const { error } = await db().from("newsletter_subscribers").delete().eq("id", id)
  if (error) fail("delete the subscriber", error)
}

/* ------------------------------ newsletters ----------------------------- */

export async function listNewsletters(): Promise<NewsletterRow[]> {
  const { data, error } = await db()
    .from("newsletters")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) fail("load newsletters", error)
  return (data ?? []) as NewsletterRow[]
}

export async function getNewsletter(id: string): Promise<NewsletterRow | null> {
  const { data, error } = await db()
    .from("newsletters")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) fail("load that newsletter", error)
  return (data as NewsletterRow | null) ?? null
}

export type NewsletterInput = {
  id?: string
  subject: string
  previewText: string
  contentHtml: string
  category: string | null
}

/**
 * Saves a draft.
 *
 * Saving never sends. The only thing that sends is the Edge Function, called
 * explicitly from the send actions — there is no code path from here to
 * Resend at all.
 */
export async function saveNewsletter(input: NewsletterInput): Promise<NewsletterRow> {
  const client = db()

  const payload = {
    subject: input.subject.trim(),
    preview_text: input.previewText.trim(),
    content_html: input.contentHtml,
    category: input.category,
  }

  if (input.id) {
    const { data, error } = await client
      .from("newsletters")
      .update(payload)
      .eq("id", input.id)
      .select("*")
      .single()
    if (error) fail("save the newsletter", error)
    return data as NewsletterRow
  }

  const {
    data: { user },
  } = await client.auth.getUser()

  const { data, error } = await client
    .from("newsletters")
    // A new issue is always a draft; the insert policy requires it.
    .insert({ ...payload, status: "draft", created_by: user?.id ?? null })
    .select("*")
    .single()

  if (error) fail("create the newsletter", error)
  return data as NewsletterRow
}

export async function deleteNewsletter(id: string): Promise<void> {
  const { error } = await db().from("newsletters").delete().eq("id", id)
  if (error) fail("delete the newsletter", error)
}

/* ----------------------------- send history ----------------------------- */

export async function listSendHistory(
  newsletterId?: string
): Promise<NewsletterSendWithSubject[]> {
  let query = db()
    .from("newsletter_sends")
    .select("*, newsletters(subject)")
    .order("created_at", { ascending: false })
    .limit(100)

  if (newsletterId) query = query.eq("newsletter_id", newsletterId)

  const { data, error } = await query
  if (error) fail("load the send history", error)
  return (data ?? []) as unknown as NewsletterSendWithSubject[]
}
