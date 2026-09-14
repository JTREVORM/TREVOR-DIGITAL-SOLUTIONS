/**
 * Database helper for schema inspection and migrations.
 *
 * Reads DATABASE_URL from the project's .env. Nothing in here ever prints a
 * credential — connection details are used, never logged.
 *
 *   node scripts/db.mjs inspect            list tables, columns, RLS, policies
 *   node scripts/db.mjs apply <file.sql>   run a migration inside a transaction
 *   node scripts/db.mjs query "<sql>"      run a read-only statement
 */

import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import pg from "pg"

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
      const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line)
      if (!match) continue
      let value = match[2].trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      env[match[1]] = value
    }
  }
  return env
}

const env = loadEnv()
const connectionString = env.DATABASE_URL

if (!connectionString) {
  console.error("DATABASE_URL is not set in .env")
  process.exit(1)
}

async function connect() {
  const client = new pg.Client({
    connectionString,
    // Supabase requires TLS; its pooler presents a cert chain node does not
    // ship a root for, so verification is relaxed for this admin connection.
    ssl: { rejectUnauthorized: false },
    statement_timeout: 120_000,
  })
  await client.connect()
  return client
}

async function inspect() {
  const client = await connect()
  try {
    const tables = await client.query(`
      select c.relname as table_name,
             c.relrowsecurity as rls_enabled,
             (select count(*) from pg_policy p where p.polrelid = c.oid) as policies
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind = 'r'
      order by c.relname
    `)

    console.log("=== public tables ===")
    if (tables.rows.length === 0) console.log("(none)")
    for (const row of tables.rows) {
      let count = "?"
      try {
        const r = await client.query(
          `select count(*)::int as n from public."${row.table_name}"`
        )
        count = r.rows[0].n
      } catch {
        count = "n/a"
      }
      console.log(
        `${row.table_name.padEnd(24)} rows=${String(count).padEnd(6)} rls=${row.rls_enabled} policies=${row.policies}`
      )
    }

    const buckets = await client.query(`
      select id, public from storage.buckets order by id
    `).catch(() => ({ rows: [] }))
    console.log("\n=== storage buckets ===")
    if (buckets.rows.length === 0) console.log("(none)")
    buckets.rows.forEach((b) => console.log(`${b.id} (public=${b.public})`))

    const users = await client
      .query(`select count(*)::int as n from auth.users`)
      .catch(() => ({ rows: [{ n: "n/a" }] }))
    console.log(`\n=== auth.users: ${users.rows[0].n} ===`)
  } finally {
    await client.end()
  }
}

async function apply(file) {
  const sql = readFileSync(resolve(process.cwd(), file), "utf8")
  const client = await connect()
  try {
    await client.query("begin")
    await client.query(sql)
    await client.query("commit")
    console.log(`applied: ${file}`)
  } catch (error) {
    await client.query("rollback").catch(() => {})
    console.error(`FAILED (rolled back): ${file}`)
    console.error(error.message)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

async function query(sql) {
  const client = await connect()
  try {
    const result = await client.query(sql)
    console.log(JSON.stringify(result.rows, null, 2))
  } finally {
    await client.end()
  }
}

const [command, arg] = process.argv.slice(2)

if (command === "inspect") await inspect()
else if (command === "apply" && arg) await apply(arg)
else if (command === "query" && arg) await query(arg)
else {
  console.error("usage: node scripts/db.mjs inspect | apply <file.sql> | query <sql>")
  process.exit(1)
}
