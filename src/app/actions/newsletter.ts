"use server"

import { createHash } from "node:crypto"
import { headers } from "next/headers"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured, missingSupabaseEnvVars } from "@/lib/supabase/config"
import { callNewsletterFunction } from "@/lib/newsletter/edge"
import { contact } from "@/lib/site"

/**
 * Public newsletter actions: subscribe, and unsubscribe.
 *
 * Both run on the server and both go through a SECURITY DEFINER database
 * function rather than writing to `newsletter_subscribers` directly. That is
 * the whole security model in one sentence: `anon` has EXECUTE on two
 * functions and no privilege at all on the table, so there is no policy that
 * could be loosened by accident into letting the public read the list.
 *
 * Validation happens here for a fast, specific message, and again in the
 * database — which also owns the CHECK constraints — so a request that skips
 * this action entirely still cannot write a malformed address.
 */

const emailSchema = z
  .string()
  .trim()
  .min(1, "Please enter your email address.")
  .max(320, "That email address is too long.")
  .email("Please enter a valid email address.")

export type SubscribeState =
  | "subscribed"
  | "already_subscribed"
  | "invalid"
  | "rate_limited"
  | "unavailable"
  | "error"

export type SubscribeResult = {
  state: SubscribeState
  message: string
  /** True when a welcome email was accepted by Resend. */
  welcomeSent?: boolean
}

/**
 * A stable, non-reversible key for the caller, used only for rate limiting.
 *
 * The address itself is never stored: it is salted with the project's own
 * secret and hashed, so the abuse table holds nothing that identifies a
 * visitor if it were ever read.
 */
async function clientKey(): Promise<string | null> {
  const headerList = await headers()
  const forwarded = headerList.get("x-forwarded-for")
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    headerList.get("cf-connecting-ip")

  if (!ip) return null

  const salt = process.env.NEWSLETTER_INTERNAL_SECRET ?? "tds-newsletter"
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 40)
}

export async function subscribeToNewsletter(
  rawEmail: string,
  source = "website"
): Promise<SubscribeResult> {
  const parsed = emailSchema.safeParse(rawEmail)
  if (!parsed.success) {
    return {
      state: "invalid",
      message: parsed.error.issues[0]?.message ?? "Please enter a valid email address.",
    }
  }

  if (!isSupabaseConfigured) {
    console.error(
      "Newsletter signup attempted but Supabase is not configured. Missing:",
      missingSupabaseEnvVars().join(", ")
    )
    return {
      state: "unavailable",
      message: `Sign-up is temporarily unavailable. Email ${contact.email} and we will add you.`,
    }
  }

  const email = parsed.data.toLowerCase()

  let result: { status?: string } | null
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc("subscribe_to_newsletter", {
      p_email: email,
      p_source: source,
      p_client_key: await clientKey(),
    })

    if (error) {
      console.error("Newsletter subscribe failed:", error.message, error.code)
      return {
        state: "error",
        message: `We could not save your address just now. Please try again, or email ${contact.email}.`,
      }
    }

    result = data as { status?: string } | null
  } catch (error) {
    console.error("Newsletter subscribe error:", error)
    return {
      state: "error",
      message: "Something went wrong on our side. Please try again in a moment.",
    }
  }

  switch (result?.status) {
    case "invalid_email":
      return { state: "invalid", message: "Please enter a valid email address." }

    case "rate_limited":
      return {
        state: "rate_limited",
        message:
          "That is a few too many sign-ups from this connection. Please try again later.",
      }

    case "already_subscribed":
      // Deliberately no welcome email: they already had one.
      return {
        state: "already_subscribed",
        message: "You are already on the list — nothing more to do.",
      }

    case "subscribed":
    case "reactivated": {
      // The subscription is saved at this point. A welcome email that fails
      // is worth reporting, but it must not read as though the sign-up
      // itself failed, because it did not.
      const welcome = await callNewsletterFunction({ action: "welcome", email })

      if (!welcome.ok) {
        console.error("Welcome email failed for a new subscriber:", welcome.error)
        return {
          state: "subscribed",
          welcomeSent: false,
          message:
            "You are subscribed. The welcome email did not go out, but you will get the next issue.",
        }
      }

      return {
        state: "subscribed",
        welcomeSent: true,
        message: "You are subscribed. Check your inbox for a welcome email.",
      }
    }

    default:
      console.error("Unexpected subscribe status:", result?.status)
      return {
        state: "error",
        message: "Something went wrong on our side. Please try again in a moment.",
      }
  }
}

/* -------------------------------------------------------------------------- */
/*                                 Unsubscribe                                */
/* -------------------------------------------------------------------------- */

export type UnsubscribeState =
  | "unsubscribed"
  | "already_unsubscribed"
  | "not_found"
  | "invalid"
  | "error"

export type UnsubscribeResult = { state: UnsubscribeState; message: string }

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Removes someone from the list.
 *
 * A token from a newsletter link is preferred and is checked first: it proves
 * the request came from a message actually delivered to that mailbox. A bare
 * address still works, because the unsubscribe URL in an email has to keep
 * working even when it has been copied by hand — but either way this only
 * ever runs from an explicit click on the unsubscribe page, never from a link
 * being loaded, so a scanner prefetching the URL cannot unsubscribe anyone.
 */
export async function unsubscribeFromNewsletter(input: {
  token?: string | null
  email?: string | null
}): Promise<UnsubscribeResult> {
  const token = input.token?.trim()
  const email = input.email?.trim().toLowerCase()

  const hasToken = Boolean(token && UUID_RE.test(token))
  const hasEmail = Boolean(email && emailSchema.safeParse(email).success)

  if (!hasToken && !hasEmail) {
    return {
      state: "invalid",
      message: "That unsubscribe link is not valid. Enter your email address instead.",
    }
  }

  if (!isSupabaseConfigured) {
    return {
      state: "error",
      message: `We could not process that just now. Email ${contact.email} and we will remove you.`,
    }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc("unsubscribe_from_newsletter", {
      p_token: hasToken ? token : null,
      p_email: hasEmail ? email : null,
    })

    if (error) {
      console.error("Unsubscribe failed:", error.message, error.code)
      return {
        state: "error",
        message: `We could not process that just now. Email ${contact.email} and we will remove you.`,
      }
    }

    const status = (data as { status?: string } | null)?.status

    switch (status) {
      case "unsubscribed":
        return {
          state: "unsubscribed",
          message: "You have been unsubscribed. You will not receive any more issues.",
        }
      case "already_unsubscribed":
        return {
          state: "already_unsubscribed",
          message: "That address was already unsubscribed. Nothing more to do.",
        }
      case "not_found":
        return {
          state: "not_found",
          message: "That address is not on our mailing list.",
        }
      default:
        return {
          state: "invalid",
          message: "That unsubscribe link is not valid. Enter your email address instead.",
        }
    }
  } catch (error) {
    console.error("Unsubscribe error:", error)
    return {
      state: "error",
      message: `We could not process that just now. Email ${contact.email} and we will remove you.`,
    }
  }
}
