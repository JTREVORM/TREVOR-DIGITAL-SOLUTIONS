# Trevor Digital Solutions

Marketing site and admin portal for Trevor Digital Solutions (TDS), built with
Next.js 16 (App Router), Tailwind CSS v4 and Supabase.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The public site runs with **no configuration** — every marketing page renders
from local content, so `npm run dev` works on a fresh clone.

## Environment variables

Supabase powers two things only: the **admin portal** (`/admin`) and the
**contact-form inbox**. Everything else works without it.

Create a `.env.local` in the project root to enable them:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Both values come from your Supabase project under **Settings → API**. Restart
the dev server after adding them. Set the same two variables in your hosting
provider's environment settings when deploying.

Without them:

- public pages render normally
- `/admin/*` returns `503` with a message explaining what is missing
- the contact form tells the visitor to email or call instead

`.env.local` is gitignored — never commit real keys.

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
