# Trevor Digital Solutions

Marketing site and admin portal for Trevor Digital Solutions (TDS), built with
Next.js 16 (App Router), Tailwind CSS v4 and Supabase.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The marketing pages render from local content and work without configuration.
Insights (the blog) and the admin portal read from Supabase, so they need the
environment variables below.

## Environment variables

Create `.env` (or `.env.local`) in the project root. This project is
**Next.js**, so only `NEXT_PUBLIC_`-prefixed variables reach the browser —
`VITE_` names are ignored by the framework entirely.

```bash
# Public — safe in the browser, constrained by Row Level Security
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key

# Server only — NEVER prefix either of these with NEXT_PUBLIC_
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # bypasses RLS entirely
DATABASE_URL=postgresql://...                     # direct Postgres, migrations only
```

`.env*` is gitignored. Never commit real keys.

Restart the server after editing — `NEXT_PUBLIC_` values are compiled in, so
changes take effect only on restart.

## Database

Schema, policies, storage and seed data live in `supabase/migrations/` and are
applied in order. Every migration is idempotent, so re-running is safe.

```bash
node scripts/db.mjs inspect                                   # tables, RLS, policies, buckets
node scripts/db.mjs apply supabase/migrations/0001_core_schema.sql
node scripts/db.mjs apply supabase/migrations/0002_rls_policies.sql
node scripts/db.mjs apply supabase/migrations/0003_storage.sql
node scripts/db.mjs apply supabase/migrations/0004_seed.sql
```

### Admin users

New accounts get the lowest role (`viewer`) and cannot reach the CMS.
Promoting someone is a deliberate, separate step:

```bash
node scripts/create-admin.mjs someone@example.com
```

Uses the service-role key locally; it never reaches the browser.

### Verifying security

```bash
node scripts/verify-security.mjs <admin-email> <admin-password>
```

Attacks the database with the anon key the way a crafted request would, then
repeats the checks as a signed-in admin. Every assertion must pass.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/app/` | Routes (App Router) |
| `src/lib/site.ts` | Brand strings, navigation, contact details |
| `src/lib/content/` | Services, projects, technologies, industries, testimonials — the single source of truth for site copy |
| `src/components/site/` | Design-system primitives: `Section`, `PageHero`, `CtaBand`, `ProjectCard`, logo, `Reveal` |
| `src/components/sections/` | Homepage and page sections |
| `src/components/ui/` | shadcn primitives |
| `src/proxy.ts` | Request middleware; guards `/admin/*` |
| `src/app/globals.css` | Brand design tokens sampled from the TDS logo |

### Editing site content

Copy lives in `src/lib/content/`, not in components. To add a service or
project, add an entry there — the homepage grid, index page, detail page,
footer and sitemap all pick it up automatically.

Slugs in those files are URL segments. Changing one changes the page's URL and
breaks existing links, so treat them as fixed once published.

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

## Design system

Colours are sampled from the official logo (`public/logo.png`) and defined once
in `src/app/globals.css`: deep navy field, TDS electric blue (`#0799fc`) as the
single accent, silver/white for text. The site ships one dark identity.

The logo file is a wide presentation lockup. `LogoMark` shows the TDS monogram
for small placements (navbar, footer) and `LogoFull` shows the complete lockup
where it has room to be read. See `src/components/site/logo.tsx`.
