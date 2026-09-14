/**
 * Create an admin user, promote an existing one, or reset a password.
 *
 *   node scripts/create-admin.mjs <email>              create, or promote to admin
 *   node scripts/create-admin.mjs <email> <password>   also set/reset the password
 *
 * Uses SUPABASE_SERVICE_ROLE_KEY, which is read from .env and never leaves
 * this process. Run it from a trusted machine only — the service role key
 * bypasses Row Level Security entirely.
 *
 * A password passed on the command line will appear in your shell history.
 * Clear it afterwards, or reset the password from the Supabase dashboard
 * instead if that matters on this machine.
 */

import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { randomBytes } from "node:crypto"
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
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1)
      }
      env[m[1]] = v
    }
  }
  return env
}

const env = loadEnv()
const url = env.NEXT_PUBLIC_SUPABASE_URL || env.VITE_SUPABASE_URL
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env")
  process.exit(1)
}

const [email, passwordArg] = process.argv.slice(2)
if (!email) {
  console.error("usage: node scripts/create-admin.mjs <email> [password]")
  process.exit(1)
}

const password = passwordArg || `Tds-${randomBytes(9).toString("base64url")}`

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data: list, error: listError } = await admin.auth.admin.listUsers()
if (listError) {
  console.error("Could not list users:", listError.message)
  process.exit(1)
}

let user = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
let created = false

if (!user) {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (error) {
    console.error("Could not create user:", error.message)
    process.exit(1)
  }
  user = data.user
  created = true
}

// The handle_new_user trigger creates the profile with the lowest role;
// raising it to admin is a deliberate, separate step.
const { error: roleError } = await admin
  .from("profiles")
  .upsert(
    { id: user.id, email: user.email, role: "admin" },
    { onConflict: "id" }
  )

if (roleError) {
  console.error("Could not set the admin role:", roleError.message)
  process.exit(1)
}

console.log(created ? "Created admin user:" : "Existing user promoted to admin:")
console.log("  email:", user.email)
if (created) {
  console.log("  password:", password)
  console.log("\nSign in at /admin/login and change this password.")
}
