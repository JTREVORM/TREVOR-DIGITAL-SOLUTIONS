/**
 * One-off: add Next.js-style environment variable names to .env.
 *
 * The file arrived with VITE_* names, which belong to Vite. Next.js only
 * exposes variables prefixed NEXT_PUBLIC_ to the browser and ignores VITE_*
 * entirely, so the app could not see the credentials at all.
 *
 * This copies the existing values to the correct names. It prints nothing but
 * variable names, never values, and leaves the originals in place.
 */

import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const path = resolve(process.cwd(), ".env")
const raw = readFileSync(path, "utf8")

const values = {}
for (const line of raw.split(/\r?\n/)) {
  const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line)
  if (!match) continue
  let value = match[2].trim()
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1)
  }
  values[match[1]] = value
}

const url = values.NEXT_PUBLIC_SUPABASE_URL || values.VITE_SUPABASE_URL
const anon =
  values.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  values.VITE_SUPABASE_PUBLISHABLE_KEY ||
  values.VITE_SUPABASE_ANON_KEY

if (!url || !anon) {
  console.error("Could not find a Supabase URL and publishable/anon key in .env")
  process.exit(1)
}

const additions = []
if (!values.NEXT_PUBLIC_SUPABASE_URL) {
  additions.push(`NEXT_PUBLIC_SUPABASE_URL=${url}`)
}
if (!values.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  additions.push(`NEXT_PUBLIC_SUPABASE_ANON_KEY=${anon}`)
}

if (additions.length === 0) {
  console.log("NEXT_PUBLIC_* variables already present. No change.")
  process.exit(0)
}

const header = [
  "",
  "# --- Next.js names -------------------------------------------------------",
  "# This project is Next.js, not Vite. Only NEXT_PUBLIC_* variables reach the",
  "# browser; VITE_* names are ignored by the framework. The values below are",
  "# the same credentials under the names the app actually reads.",
  "#",
  "# SUPABASE_SERVICE_ROLE_KEY and DATABASE_URL above are server-only secrets.",
  "# Never give either of them a NEXT_PUBLIC_ prefix.",
  "# -------------------------------------------------------------------------",
]

const next = raw.replace(/\s*$/, "\n") + header.join("\n") + "\n" + additions.join("\n") + "\n"
writeFileSync(path, next, "utf8")

console.log("Added to .env:")
additions.forEach((line) => console.log("  " + line.split("=")[0]))
