/**
 * SEO and header audit against a running server.
 *
 *   node scripts/seo-audit.mjs [baseUrl]
 *
 * Checks every public route for a unique title and description, a canonical
 * pointing at the production origin, Open Graph and Twitter cards, exactly one
 * <h1>, valid JSON-LD, and that no localhost or preview URL leaks into any of
 * it. Also confirms /admin is noindex and security headers are present.
 */

const BASE = process.argv[2] ?? "http://localhost:3000"
const PROD = "https://trevordigitalsolutions.com"

const ROUTES = [
  "/", "/about", "/services", "/projects", "/technologies", "/insights",
  "/contact", "/founder", "/leadership", "/testimonials",
  "/privacy-policy", "/terms-of-service",
  "/services/custom-software-development", "/services/erp-development",
  "/projects/chetu-microfinance", "/projects/trevor-tutor-ai",
  "/insights/category/software-engineering",
]

const pick = (html, re) => (html.match(re)?.[1] ?? null)

let pass = 0, fail = 0, warn = 0
const titles = new Map(), descs = new Map()

function ok(cond, label, detail = "") {
  if (cond) pass++
  else { fail++; console.log(`   FAIL ${label}${detail ? " — " + detail : ""}`) }
}

console.log(`Auditing ${BASE}\n`)

for (const route of ROUTES) {
  const res = await fetch(BASE + route)
  const html = await res.text()

  const title = pick(html, /<title>([^<]*)<\/title>/)
  const desc = pick(html, /<meta name="description" content="([^"]*)"/)
  const canonical = pick(html, /<link rel="canonical" href="([^"]*)"/)
  const ogTitle = pick(html, /<meta property="og:title" content="([^"]*)"/)
  const ogImage = pick(html, /<meta property="og:image[^"]*" content="([^"]*)"/)
  const twCard = pick(html, /<meta name="twitter:card" content="([^"]*)"/)
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]

  const problems = []
  if (res.status !== 200) problems.push(`HTTP ${res.status}`)
  if (!title) problems.push("no title")
  if (!desc) problems.push("no description")
  if (!canonical) problems.push("no canonical")
  else if (!canonical.startsWith(PROD)) problems.push(`canonical not production: ${canonical}`)
  if (!ogTitle) problems.push("no og:title")
  if (!ogImage) problems.push("no og:image")
  if (!twCard) problems.push("no twitter:card")
  if (h1s !== 1) problems.push(`${h1s} <h1> tags`)

  // Structured data must parse and must not contain non-production URLs.
  let ldTypes = []
  for (const [, body] of ld) {
    try {
      const parsed = JSON.parse(body.trim())
      const nodes = parsed["@graph"] ?? [parsed]
      ldTypes.push(...nodes.map((n) => n["@type"]).flat())
    } catch {
      problems.push("invalid JSON-LD")
    }
  }

  for (const bad of ["localhost", "127.0.0.1", "vercel.app", "http://"]) {
    if (canonical?.includes(bad)) problems.push(`canonical contains ${bad}`)
    if (ld.some(([, b]) => b.includes(bad))) problems.push(`JSON-LD contains ${bad}`)
  }

  if (title) {
    if (titles.has(title)) problems.push(`duplicate title with ${titles.get(title)}`)
    else titles.set(title, route)
  }
  if (desc) {
    if (descs.has(desc)) problems.push(`duplicate description with ${descs.get(desc)}`)
    else descs.set(desc, route)
  }

  if (problems.length === 0) {
    pass++
    console.log(`PASS ${route.padEnd(44)} ld=[${ldTypes.join(",") || "none"}]`)
  } else {
    fail++
    console.log(`FAIL ${route.padEnd(44)} ${problems.join("; ")}`)
  }

  if (title && title.length > 65) { warn++; console.log(`     warn: title ${title.length} chars`) }
  if (desc && (desc.length < 70 || desc.length > 175)) {
    warn++; console.log(`     warn: description ${desc.length} chars`)
  }
}

console.log("\n=== robots.txt ===")
const robots = await (await fetch(BASE + "/robots.txt")).text()
console.log(robots.trim())
ok(robots.includes("/admin"), "robots disallows /admin")
ok(robots.includes(`${PROD}/sitemap.xml`), "robots points at the production sitemap")

console.log("\n=== sitemap.xml ===")
const sitemap = await (await fetch(BASE + "/sitemap.xml")).text()
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
console.log(`${urls.length} URLs`)
ok(urls.length > 0, "sitemap has URLs")
ok(urls.every((u) => u.startsWith(PROD)), "every sitemap URL uses the production origin",
   urls.find((u) => !u.startsWith(PROD)) ?? "")
ok(!urls.some((u) => u.includes("/admin")), "sitemap excludes /admin")
ok(new Set(urls).size === urls.length, "no duplicate sitemap URLs")

console.log("\n=== security headers (/) ===")
const headRes = await fetch(BASE + "/")
for (const h of ["x-content-type-options", "x-frame-options", "referrer-policy", "permissions-policy"]) {
  const v = headRes.headers.get(h)
  ok(Boolean(v), `${h} present`, v ?? "missing")
  if (v) console.log(`   ${h}: ${v}`)
}
ok(!headRes.headers.get("x-powered-by"), "x-powered-by removed")

console.log("\n=== /admin is noindex ===")
const adminRes = await fetch(BASE + "/admin", { redirect: "manual" })
const xRobots = adminRes.headers.get("x-robots-tag")
console.log(`   status ${adminRes.status}, x-robots-tag: ${xRobots}`)
ok(xRobots?.includes("noindex"), "admin sends noindex")
ok([307, 302, 303].includes(adminRes.status), "admin redirects when signed out")

console.log(`\n=== ${pass} passed, ${fail} failed, ${warn} warnings ===`)
process.exit(fail > 0 ? 1 : 0)
