/**
 * Security verification against the live database.
 *
 * Exercises the RLS policies the way an attacker would: with the anon key,
 * directly against the API, bypassing the application entirely. Then repeats
 * the checks as a signed-in admin to confirm legitimate access still works.
 *
 *   node scripts/verify-security.mjs <admin-email> <admin-password>
 */

import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { createClient } from "@supabase/supabase-js"

function loadEnv() {
  const env = {}
  for (const file of [".env", ".env.local"]) {
    let raw
    try { raw = readFileSync(resolve(process.cwd(), file), "utf8") } catch { continue }
    for (const line of raw.split(/\r?\n/)) {
      const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line)
      if (!m) continue
      let v = m[2].trim()
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
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

const anon = () => createClient(url, anonKey, { auth: { persistSession: false } })
const service = createClient(url, serviceKey, { auth: { persistSession: false } })

let pass = 0, fail = 0
function check(name, ok, detail = "") {
  if (ok) { pass++; console.log(`  PASS  ${name}`) }
  else { fail++; console.log(`  FAIL  ${name}${detail ? "  — " + detail : ""}`) }
}

console.log("=== Seeding a draft and a future-scheduled article (service role) ===")
const { data: cat } = await service.from("categories").select("id").limit(1).single()
const { data: author } = await service.from("authors").select("id").limit(1).single()

const seeded = []
for (const [slug, status, when] of [
  ["sec-check-draft", "draft", null],
  ["sec-check-future", "scheduled", new Date(Date.now() + 86400000 * 30).toISOString()],
  ["sec-check-live", "published", new Date(Date.now() - 3600000).toISOString()],
]) {
  await service.from("articles").delete().eq("slug", slug)
  const { data, error } = await service.from("articles").insert({
    title: `Security check ${status}`,
    slug, excerpt: "Temporary row created by the security verification script.",
    content: [{ type: "paragraph", text: "Temporary." }],
    category_id: cat?.id ?? null, author_id: author?.id ?? null,
    reading_time: 1, status, published_date: when,
  }).select("id").single()
  if (error) console.log("   seed error:", error.message)
  else seeded.push(data.id)
}
console.log(`   seeded ${seeded.length} rows`)

console.log("\n=== ANONYMOUS (what a stranger or a crafted request can do) ===")
{
  const a = anon()

  const { data: arts } = await a.from("articles").select("slug,status")
  const slugs = (arts ?? []).map(r => r.slug)
  check("published article IS readable", slugs.includes("sec-check-live"))
  check("draft article is NOT readable", !slugs.includes("sec-check-draft"))
  check("future-scheduled article is NOT readable", !slugs.includes("sec-check-future"))

  const { error: insErr } = await a.from("articles").insert({
    title: "anon insert", slug: "anon-should-fail-" + Date.now(),
    excerpt: "x", content: [], reading_time: 1, status: "published",
    published_date: new Date().toISOString(),
  })
  check("cannot CREATE an article", Boolean(insErr), insErr ? "" : "insert succeeded!")

  const { error: updErr, count: updCount } = await a
    .from("articles").update({ title: "hijacked" }).eq("slug", "sec-check-live").select("id", { count: "exact" })
  check("cannot UPDATE an article", Boolean(updErr) || (updCount ?? 0) === 0)

  const { error: delErr, count: delCount } = await a
    .from("articles").delete().eq("slug", "sec-check-live").select("id", { count: "exact" })
  check("cannot DELETE an article", Boolean(delErr) || (delCount ?? 0) === 0)

  const { error: catErr } = await a.from("categories").insert({ name: "x", slug: "anon-cat-" + Date.now() })
  check("cannot create a category", Boolean(catErr))

  const { error: authErr } = await a.from("authors").insert({ name: "Fake Person" })
  check("cannot create an author", Boolean(authErr))

  const { error: mediaErr } = await a.from("media").insert({
    file_name: "x.png", file_path: "anon/" + Date.now(), file_url: "http://x",
    file_type: "image/png", file_size: 1,
  })
  check("cannot create a media record", Boolean(mediaErr))

  const { error: msgErr } = await a.from("contact_messages").insert({
    name: "Security Check", email: "check@example.com",
    message: "Automated verification that the public may submit an enquiry.",
  })
  check("CAN submit a contact message", !msgErr, msgErr?.message ?? "")

  const { data: msgs } = await a.from("contact_messages").select("id")
  check("cannot READ contact messages", (msgs ?? []).length === 0)

  const { data: profs } = await a.from("profiles").select("id")
  check("cannot READ profiles", (profs ?? []).length === 0)

  const { error: upErr } = await a.storage.from("tds-media")
    .upload(`anon/${Date.now()}.txt`, new Blob(["x"]), { contentType: "text/plain" })
  check("cannot UPLOAD to storage", Boolean(upErr))
}

if (adminEmail && adminPassword) {
  console.log("\n=== ADMIN (signed in) ===")
  const a = anon()
  const { error: signInError } = await a.auth.signInWithPassword({
    email: adminEmail, password: adminPassword,
  })
  check("can sign in", !signInError, signInError?.message ?? "")

  if (!signInError) {
    const { data: arts } = await a.from("articles").select("slug,status")
    const slugs = (arts ?? []).map(r => r.slug)
    check("CAN see drafts", slugs.includes("sec-check-draft"))
    check("CAN see scheduled", slugs.includes("sec-check-future"))

    const testSlug = "admin-can-create-" + Date.now()
    const { data: made, error: createErr } = await a.from("articles").insert({
      title: "Admin create check", slug: testSlug, excerpt: "x",
      content: [{ type: "paragraph", text: "x" }],
      category_id: cat?.id ?? null, author_id: author?.id ?? null,
      reading_time: 1, status: "draft",
    }).select("id").single()
    check("CAN create an article", !createErr, createErr?.message ?? "")

    if (made) {
      const { error: pubErr } = await a.from("articles")
        .update({ status: "published", published_date: new Date().toISOString() })
        .eq("id", made.id)
      check("CAN publish an article", !pubErr, pubErr?.message ?? "")

      const { error: rmErr } = await a.from("articles").delete().eq("id", made.id)
      check("CAN delete an article", !rmErr, rmErr?.message ?? "")
    }

    const { data: msgs, error: msgErr } = await a.from("contact_messages").select("id")
    check("CAN read contact messages", !msgErr && Array.isArray(msgs), msgErr?.message ?? "")

    const path = `verify/${Date.now()}.png`
    const png = Uint8Array.from(atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="), c => c.charCodeAt(0))
    const { error: upErr } = await a.storage.from("tds-media")
      .upload(path, new Blob([png], { type: "image/png" }), { contentType: "image/png" })
    check("CAN upload to storage", !upErr, upErr?.message ?? "")
    if (!upErr) await a.storage.from("tds-media").remove([path])

    await a.auth.signOut()
  }
} else {
  console.log("\n(skipping admin checks — pass email and password to run them)")
}

console.log("\n=== cleanup ===")
await service.from("articles").delete().in("slug", ["sec-check-draft", "sec-check-future", "sec-check-live"])
await service.from("contact_messages").delete().eq("email", "check@example.com")
console.log("temporary rows removed")

console.log(`\n=== ${pass} passed, ${fail} failed ===`)
process.exit(fail > 0 ? 1 : 0)
