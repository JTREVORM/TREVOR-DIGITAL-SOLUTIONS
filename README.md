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

# Server only — NEVER prefix any of these with NEXT_PUBLIC_
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # bypasses RLS entirely
DATABASE_URL=postgresql://...                     # direct Postgres, migrations only
NEWSLETTER_INTERNAL_SECRET=random-32-bytes        # shared with the Edge Function
```

`RESEND_API_KEY` is deliberately **not** in this list. It is set as a Supabase
Edge Function secret and never reaches this application at all — see
[Newsletter](#newsletter).

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
node scripts/db.mjs apply supabase/migrations/0005_newsletter.sql
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

```bash
node scripts/verify-newsletter.mjs <admin-email> <admin-password>
```

The same treatment for the newsletter: confirms the public can subscribe and
unsubscribe but cannot read the subscriber list, forge a send-history entry, or
claim an issue for sending.

## Newsletter

Subscribers sign up from the form on every Insights page. Issues are written in
the admin portal at `/admin/newsletter` and delivered through
[Resend](https://resend.com).

### Where the secrets live

The Resend API key is held **only** in Supabase Edge Function secrets. This
application never sees it, and no browser code ever talks to Resend. All mail
goes through the `send-newsletter-email` Edge Function, which is gated twice:

1. `NEWSLETTER_INTERNAL_SECRET`, a shared secret proving the request came from
   this server rather than from someone who found the function's URL.
2. For anything that sends an issue, the calling admin's own access token,
   which the function verifies against `profiles` using the service role.

The public subscribe and unsubscribe paths never touch the tables directly.
`anon` holds EXECUTE on two `SECURITY DEFINER` functions and no privilege on
`newsletter_subscribers` at all, so there is no policy that could be loosened by
accident into exposing the list.

### Deploying the Edge Function

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>

npx supabase secrets set RESEND_API_KEY=re_xxxxxxxx
npx supabase secrets set NEWSLETTER_INTERNAL_SECRET=<same value as .env>
npx supabase secrets set SITE_URL=https://trevordigitalsolutions.com

npx supabase functions deploy send-newsletter-email
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected by the platform —
do not set them yourself.

Optional secrets:

| Secret | Default |
| --- | --- |
| `NEWSLETTER_FROM` | `Trevor Digital Solutions <insights@trevordigitalsolutions.com>` |
| `NEWSLETTER_REPLY_TO` | unset (no Reply-To header) |
| `SITE_URL` | `https://trevordigitalsolutions.com` |

The sending domain `trevordigitalsolutions.com` must be verified in Resend
(SPF and DKIM records added at your DNS host) before any mail will be accepted.

### Sending an issue

Write it at `/admin/newsletter/issues/new`. **Saving stores a draft and sends
nothing** — there is no path from the save button to Resend. Send yourself a
test first, then use *Send newsletter*, which asks for confirmation and names
the number of recipients.

An issue can only be sent once: `begin_newsletter_send` claims it atomically, so
a double click, a retried request or two admins pressing Send together all lose
the race and are told so.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/app/` | Routes (App Router) |
| `src/lib/site.ts` | Brand strings, navigation, contact details |
| `src/lib/content/` | Services, projects, technologies, industries, testimonials — the single source of truth for site copy |
| `src/components/site/` | Design-system primitives: `Section`, `PageHero`, `CtaBand`, `ProjectCard`, logo, `Reveal` |
| `src/components/sections/` | Homepage and page sections |
| `src/components/ui/` | shadcn primitives |
| `src/lib/newsletter/` | Newsletter types, admin data service, and the server-only bridge to the Edge Function |
| `supabase/functions/` | Deno Edge Functions. Excluded from the app's tsconfig — they have their own runtime and type checker |
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
