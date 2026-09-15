/**
 * Newsletter security and behaviour verification against the live database.
 *
 * Exercises the newsletter surface the way an attacker would: with the anon
 * key, straight at the API, with the application nowhere in the picture. Then
 * repeats the parts that should work as a signed-in admin.
 *
 * This does not send any email. Resend is only reachable through the Edge
 * Function, which is deployed separately — see README.md.
 *
 *   node scripts/verify-newsletter.mjs [admin-email] [admin-password]
 */

import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { createClient } from "@supabase/supabase-js"

function loadEnv() {
  const env = {}
  for (const file of [".env", ".env.local"]) {
    let raw
    try {
      raw = readFileSync(resolve(process.cwd(), file), "utf8")
    } catch {
      continue
    }
    for (const line of raw.split(/\r?\n/)) {
      const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line)
      if (!m) continue
      let v = m[2].trim()
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
        v = v.slice(1, -1)
      env[m[1]] = v
    }
  }
  return env
}

const env = loadEnv()
const url = env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY
const [adminEmail, adminPassword] = process.argv.slice(2)

if (!url || !anonKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.")
  process.exit(1)
}

const anon = createClient(url, anonKey, { auth: { persistSession: false } })
const service = serviceKey
  ? createClient(url, serviceKey, { auth: { persistSession: false } })
  : null

let pass = 0
let fail = 0
function check(name, ok, detail = "") {
  if (ok) {
    pass++
    console.log(`  PASS  ${name}`)
  } else {
    fail++
    console.log(`  FAIL  ${name}${detail ? "  — " + detail : ""}`)
  }
}

/** Every address this script touches, so cleanup can be exact. */
const MARKER = `nlcheck-${Date.now()}`
const ADDRESS = `${MARKER}@example.com`

console.log("=== As an anonymous visitor (the public internet) ===")

{
  const { data, error } = await anon.from("newsletter_subscribers").select("*")
  check(
    "CANNOT read the subscriber list",
    Boolean(error) || (data ?? []).length === 0,
    error ? "" : `returned ${data.length} rows`
  )
}

{
  const { error } = await anon
    .from("newsletter_subscribers")
    .insert({ email: "intruder@example.com" })
  check("CANNOT insert a subscriber directly", Boolean(error))
}

{
  const { data, error } = await anon.from("newsletters").select("*")
  check(
    "CANNOT read newsletters",
    Boolean(error) || (data ?? []).length === 0,
    error ? "" : `returned ${data.length} rows`
  )
}

{
  const { data, error } = await anon.from("newsletter_sends").select("*")
  check(
    "CANNOT read the send history",
    Boolean(error) || (data ?? []).length === 0,
    error ? "" : `returned ${data.length} rows`
  )
}

{
  const { data, error } = await anon.from("newsletter_signup_attempts").select("*")
  check(
    "CANNOT read the rate-limit table",
    Boolean(error) || (data ?? []).length === 0,
    error ? "" : `returned ${data.length} rows`
  )
}

{
  const { error } = await anon.rpc("begin_newsletter_send", {
    p_newsletter_id: "00000000-0000-0000-0000-000000000000",
  })
  check("CANNOT claim a newsletter for sending", Boolean(error))
}

console.log("\n=== Subscribing, as an anonymous visitor ===")

{
  // Deliberately messy: mixed case and surrounding whitespace.
  const { data, error } = await anon.rpc("subscribe_to_newsletter", {
    p_email: `  ${MARKER.toUpperCase()}@Example.COM  `,
    p_source: "verification",
    p_client_key: null,
  })
  check("CAN subscribe", !error && data?.status === "subscribed", error?.message ?? data?.status)
  check("normalises to lowercase and trims", data?.email === ADDRESS, data?.email ?? "")
  check("returns an unsubscribe token", Boolean(data?.unsubscribe_token))
}

{
  const { data } = await anon.rpc("subscribe_to_newsletter", {
    p_email: ADDRESS,
    p_source: "verification",
    p_client_key: null,
  })
  check("rejects a duplicate subscription", data?.status === "already_subscribed", data?.status)
}

{
  const { data } = await anon.rpc("subscribe_to_newsletter", {
    p_email: "not-an-address",
    p_source: "verification",
    p_client_key: null,
  })
  check("rejects a malformed address", data?.status === "invalid_email", data?.status)
}

{
  const key = `verify-${Date.now()}`
  const results = []
  for (let i = 0; i < 7; i++) {
    const { data } = await anon.rpc("subscribe_to_newsletter", {
      p_email: `${MARKER}-flood-${i}@example.com`,
      p_source: "verification",
      p_client_key: key,
    })
    results.push(data?.status)
  }
  check(
    "rate-limits repeated sign-ups from one client",
    results.filter((s) => s === "rate_limited").length >= 2,
    results.join(", ")
  )
}

console.log("\n=== Unsubscribing, as an anonymous visitor ===")

{
  const { data } = await anon.rpc("unsubscribe_from_newsletter", {
    p_token: null,
    p_email: ADDRESS.toUpperCase(),
  })
  check("CAN unsubscribe by address", data?.status === "unsubscribed", data?.status)
}

{
  const { data } = await anon.rpc("unsubscribe_from_newsletter", {
    p_token: null,
    p_email: ADDRESS,
  })
  check("reports an already-unsubscribed address", data?.status === "already_unsubscribed", data?.status)
}

{
  const { data } = await anon.rpc("unsubscribe_from_newsletter", {
    p_token: null,
    p_email: "someone-who-never-signed-up@example.com",
  })
  check("reports an unknown address", data?.status === "not_found", data?.status)
}

{
  const { data } = await anon.rpc("subscribe_to_newsletter", {
    p_email: ADDRESS,
    p_source: "verification",
    p_client_key: null,
  })
  check("resubscribing reactivates the same record", data?.status === "reactivated", data?.status)

  if (data?.unsubscribe_token) {
    const { data: byToken } = await anon.rpc("unsubscribe_from_newsletter", {
      p_token: data.unsubscribe_token,
      p_email: null,
    })
    check("CAN unsubscribe by token", byToken?.status === "unsubscribed", byToken?.status)
  }
}

console.log("\n=== As a signed-in admin ===")

if (adminEmail && adminPassword) {
  const admin = createClient(url, anonKey, { auth: { persistSession: false } })
  const { error: signInError } = await admin.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  })

  if (signInError) {
    check("sign in", false, signInError.message)
  } else {
    const { data: subs, error: subsError } = await admin
      .from("newsletter_subscribers")
      .select("id, email, status")
    check("CAN read the subscriber list", !subsError && Array.isArray(subs), subsError?.message ?? "")

    const { data: made, error: makeError } = await admin
      .from("newsletters")
      .insert({
        subject: `Verification draft ${MARKER}`,
        preview_text: "Created by scripts/verify-newsletter.mjs.",
        content_html: "<p>Temporary.</p>",
        status: "draft",
      })
      .select("id, status")
      .single()
    check("CAN create a draft newsletter", !makeError && made?.status === "draft", makeError?.message ?? "")

    if (made?.id) {
      const { error: markError } = await admin
        .from("newsletters")
        .update({ status: "sent", recipient_count: 9999 })
        .eq("id", made.id)

      // The update is refused by the WITH CHECK clause, or silently matches no
      // row. Either way the status must not have moved.
      const { data: after } = await admin
        .from("newsletters")
        .select("status")
        .eq("id", made.id)
        .maybeSingle()
      check(
        "CANNOT mark a newsletter sent by hand",
        after?.status === "draft",
        markError ? "" : `status is now ${after?.status}`
      )

      const { error: sendLogError } = await admin.from("newsletter_sends").insert({
        newsletter_id: made.id,
        kind: "broadcast",
        status: "success",
        recipient_count: 1,
        succeeded: 1,
      })
      check("CANNOT write a fake send-history entry", Boolean(sendLogError))

      await admin.from("newsletters").delete().eq("id", made.id)
    }

    await admin.auth.signOut()
  }
} else {
  console.log("  (skipped — pass an admin email and password to run these)")
}

console.log("\n=== cleanup ===")
if (service) {
  const { error } = await service
    .from("newsletter_subscribers")
    .delete()
    .like("email", `${MARKER}%`)
  await service.from("newsletter_signup_attempts").delete().like("client_key", "verify-%")
  console.log(error ? `cleanup failed: ${error.message}` : "temporary rows removed")
} else {
  console.log(`no service-role key; remove rows matching ${MARKER}% by hand`)
}

console.log(`\n=== ${pass} passed, ${fail} failed ===`)
process.exit(fail > 0 ? 1 : 0)
