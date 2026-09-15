/**
 * Row shapes for the tables in supabase/migrations/0005_newsletter.sql.
 *
 * Hand-written to match the rest of src/lib/supabase/types.ts.
 */

export type SubscriberStatus = "active" | "unsubscribed"
export type NewsletterStatus = "draft" | "sending" | "sent" | "failed"
export type SendKind = "test" | "broadcast"
export type SendStatus = "success" | "partial" | "failed"

export type SubscriberRow = {
  id: string
  email: string
  status: SubscriberStatus
  source: string
  subscribed_at: string
  unsubscribed_at: string | null
  created_at: string
  updated_at: string
}

export type NewsletterRow = {
  id: string
  subject: string
  preview_text: string
  content_html: string
  category: string | null
  status: NewsletterStatus
  sent_at: string | null
  recipient_count: number
  last_error: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export type NewsletterSendRow = {
  id: string
  newsletter_id: string | null
  kind: SendKind
  status: SendStatus
  recipient_count: number
  succeeded: number
  failed: number
  test_recipient: string | null
  error: string | null
  sent_by: string | null
  created_at: string
}

/** A send row joined to the subject of the issue it belongs to. */
export type NewsletterSendWithSubject = NewsletterSendRow & {
  newsletters: { subject: string } | null
}

export type SubscriberStats = {
  total: number
  active: number
  unsubscribed: number
}

/**
 * The categories an issue can be filed under.
 *
 * These mirror the Insights categories in the CMS. They are a fixed list
 * rather than a join to `categories` because a newsletter issue is not an
 * article: it may cover several topics, or none of them.
 */
export const NEWSLETTER_CATEGORIES = [
  "Technology & News",
  "Software Engineering",
  "Financial Markets",
  "Artificial Intelligence",
  "Business & Digital",
] as const
