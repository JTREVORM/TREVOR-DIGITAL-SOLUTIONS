import type {
  Article,
  Author,
  ContentBlock,
  InsightCategory,
  ResolvedArticle,
} from "./insights-types"
import { site } from "@/lib/site"

/* ==========================================================================
   TDS INSIGHTS — content
   --------------------------------------------------------------------------
   PHASE 5 NOTE
   Everything below is read through the helper functions at the bottom of this
   file. When the CMS lands, replace the bodies of those helpers with Supabase
   queries and no component needs to change.

   SAMPLE CONTENT
   The articles here are marked `status: "sample"`. They exist to demonstrate
   the layout and typography, and the site labels them as samples wherever
   they appear so a visitor cannot mistake them for published TDS reporting.

   They deliberately contain no invented statistics, no fabricated events and
   no claims about named organisations. The positions they express are the
   ones this website already states in its services and about pages.

   To publish real editorial: add articles with `status: "published"` and
   delete the samples. Nothing else needs changing.
   ========================================================================== */

export const insightCategories: InsightCategory[] = [
  {
    id: "technology-news",
    slug: "technology-news",
    name: "Technology & News",
    description:
      "Changes in the tools and platforms we build on, and what they mean in practice.",
    iconName: "newspaper",
  },
  {
    id: "software-engineering",
    slug: "software-engineering",
    name: "Software Engineering",
    description:
      "How systems are designed, built and kept running once real people depend on them.",
    iconName: "cpu",
  },
  {
    id: "financial-markets",
    slug: "financial-markets",
    name: "Financial Markets",
    description:
      "Trading technology, automation and the engineering behind market systems.",
    iconName: "line-chart",
  },
  {
    id: "artificial-intelligence",
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    description:
      "Where AI earns its cost in ordinary businesses, and where it does not.",
    iconName: "brain",
  },
  {
    id: "business-digital",
    slug: "business-digital",
    name: "Business & Digital",
    description:
      "Operations, digitisation and the decisions behind buying or building software.",
    iconName: "building",
  },
]

export const authors: Author[] = [
  {
    id: "mwesigwa-trevor-joseph",
    name: site.founder,
    role: site.founderRole,
    company: site.name,
    bio: "Software engineer and technology entrepreneur in Kampala, Uganda. He works across the full software lifecycle — business systems, web and mobile applications, AI and automation, and MetaTrader expert advisor development — and founded Trevor Digital Solutions to do client work the way he thought it should be done.",
    avatar: "/founder.png",
    profileUrl: "/founder",
  },
]

/* ------------------------------- articles ------------------------------- */

const offlineFirst: ContentBlock[] = [
  {
    type: "paragraph",
    text: "Most software is designed on a fast machine with a stable connection, then deployed to people who have neither. A stock clerk walking between a warehouse and a shop front loses signal twice. A field officer collecting member records works in a village with one bar. If the software assumes the network is always there, it fails exactly when it is being used for real work.",
  },
  {
    type: "paragraph",
    text: "**Offline-first** inverts the assumption. The device holds its own copy of the data, the interface reads and writes locally, and synchronisation happens in the background whenever a connection appears. The network becomes an optimisation rather than a prerequisite.",
  },
  { type: "heading", level: 2, text: "What changes in the design" },
  {
    type: "paragraph",
    text: "Three things have to be decided up front, because retrofitting any of them into a finished system is expensive.",
  },
  {
    type: "list",
    ordered: true,
    items: [
      "**Where the truth lives.** A local write has to be valid on its own, which means the client needs enough context to enforce the rules the server would have enforced.",
      "**How identifiers are created.** Server-generated sequential IDs cannot work offline. Identifiers have to be generated on the device, which in practice means UUIDs.",
      "**What happens on conflict.** Two people edit the same record while both are offline. Last-write-wins is simple and occasionally wrong; a merge rule is harder and usually correct.",
    ],
  },
  {
    type: "callout",
    title: "The rule we apply",
    text: "If a task is part of someone's job, it has to work without a connection. If it is reporting or administration, it can require one. That single distinction settles most of the argument about scope.",
  },
  { type: "heading", level: 2, text: "Identifiers, concretely" },
  {
    type: "paragraph",
    text: "Generating the identifier on the device means a record is complete the moment it is created, and synchronisation becomes an insert rather than a negotiation.",
  },
  {
    type: "code",
    language: "ts",
    caption: "A record that is valid before it ever reaches the server.",
    code: `type StockMovement = {
  id: string          // generated on the device
  productId: string
  quantity: number
  recordedAt: string  // ISO timestamp, device clock
  syncedAt?: string   // set once the server confirms
}

export function recordMovement(
  input: Omit<StockMovement, "id" | "recordedAt" | "syncedAt">,
): StockMovement {
  return {
    ...input,
    id: crypto.randomUUID(),
    recordedAt: new Date().toISOString(),
  }
}`,
  },
  { type: "heading", level: 2, text: "Choosing a conflict rule" },
  {
    type: "paragraph",
    text: "The right rule depends on what the field means, not on what is easiest to implement.",
  },
  {
    type: "table",
    caption: "Conflict strategies and where each one is appropriate.",
    head: ["Data", "Rule", "Why"],
    rows: [
      ["Stock movements", "Append only", "Each entry is a fact; nothing is overwritten."],
      ["Member details", "Last write wins", "A later edit is usually a correction."],
      ["Account balance", "Never synced directly", "Derived from movements on the server."],
      ["Photos and documents", "Both kept", "Cheaper to keep two than to lose one."],
    ],
  },
  {
    type: "quote",
    text: "A balance should never be synchronised. Synchronise the transactions and let the server derive the balance — otherwise two devices will eventually disagree about money.",
  },
  { type: "heading", level: 2, text: "What it costs" },
  {
    type: "paragraph",
    text: "Offline-first is more work: local storage, a sync queue, conflict handling and a testing burden that includes deliberately breaking the network. It is worth it when the alternative is staff standing still, and it is over-engineering when everyone using the system sits at a desk on fixed broadband. That judgement belongs in discovery, before a line of code is written.",
  },
]

const sacooDatabase: ContentBlock[] = [
  {
    type: "paragraph",
    text: "A savings and credit cooperative keeps track of money that belongs to its members. That single sentence settles most of the technical decisions, because money has requirements that ordinary application data does not.",
  },
  { type: "heading", level: 2, text: "Why a relational database" },
  {
    type: "paragraph",
    text: "The question comes up on most projects, usually framed as flexibility. A document database is easier to start with because it does not ask you to decide the shape of your data up front. For financial records, being forced to decide is the point.",
  },
  {
    type: "list",
    items: [
      "**Transactions that actually roll back.** Moving money touches at least two records. Either both change or neither does.",
      "**Constraints the database enforces.** A contribution with no member cannot be written in the first place, rather than being caught by application code someone later forgets to run.",
      "**Joins that stay honest.** Reporting across members, loans and contributions is a query, not a synchronisation job.",
    ],
  },
  { type: "heading", level: 2, text: "Record movements, derive balances" },
  {
    type: "paragraph",
    text: "The most common mistake we see in inherited systems is a `balance` column that is updated in place. It is fast, it is obvious, and it is wrong: the moment two operations overlap, or one fails halfway, the number silently stops matching reality and there is no record of when it diverged.",
  },
  {
    type: "callout",
    title: "The safer shape",
    text: "Store every movement as an immutable row. Derive the balance by summing them, and cache that sum if performance demands it. A cached figure that disagrees can be recomputed; an overwritten one is simply lost.",
  },
  {
    type: "code",
    language: "sql",
    caption: "Movements are immutable; the balance is a query.",
    code: `create table member_transactions (
  id           uuid primary key default gen_random_uuid(),
  member_id    uuid not null references members (id),
  kind         text not null check (kind in ('contribution','withdrawal','loan_repayment')),
  amount_minor bigint not null check (amount_minor > 0),
  occurred_at  timestamptz not null default now(),
  recorded_by  uuid not null references staff (id)
);

-- Balance is derived, never stored in place.
select coalesce(sum(
         case when kind = 'withdrawal' then -amount_minor else amount_minor end
       ), 0) as balance_minor
from member_transactions
where member_id = $1;`,
  },
  { type: "heading", level: 2, text: "Store money as integers" },
  {
    type: "paragraph",
    text: "Floating point numbers cannot represent most decimal fractions exactly, and the error compounds across a ledger. Store the smallest unit as an integer — shillings, or cents where a currency has them — and format for display only at the edge of the system.",
  },
  {
    type: "table",
    head: ["Approach", "Risk"],
    rows: [
      ["`float` / `double`", "Rounding drift across many operations."],
      ["`numeric` / `decimal`", "Correct, slower, still needs care in application code."],
      ["Integer minor units", "Correct and fast; requires disciplined formatting."],
    ],
  },
  {
    type: "paragraph",
    text: "None of this is exotic. It is the ordinary discipline of financial software, and applying it from the first migration costs nothing compared with reconstructing a ledger two years later.",
  },
]

const expertAdvisors: ContentBlock[] = [
  {
    type: "paragraph",
    text: "An expert advisor is a program that executes a trading strategy on MetaTrader without a person clicking the buttons. What it does well is narrow and worth understanding before commissioning one.",
  },
  { type: "heading", level: 2, text: "What automation genuinely provides" },
  {
    type: "list",
    items: [
      "**Consistency.** The rules are applied identically every time, including at three in the morning and including after a losing run.",
      "**Speed.** Conditions are evaluated on every tick, which no person can do across several instruments at once.",
      "**A record.** Every decision is logged with the inputs that produced it, so a strategy can be reviewed against what actually happened.",
    ],
  },
  { type: "heading", level: 2, text: "What it does not provide" },
  {
    type: "paragraph",
    text: "Automation executes a strategy. It does not create one, and it does not repair one that loses money when followed by hand. An expert advisor built on a strategy with no edge will lose money faster and more reliably than its author would have.",
  },
  {
    type: "quote",
    text: "No honest developer can guarantee profitability. Past performance does not predict future results. What can be guaranteed is that the program executes the documented strategy correctly, and that the test results you are shown are the real ones.",
    attribution: "The position stated on our Forex and trading technologies service page",
  },
  { type: "heading", level: 2, text: "Reading a backtest properly" },
  {
    type: "paragraph",
    text: "A backtest is evidence about the past under assumptions. Three of those assumptions are worth checking before drawing conclusions from a report.",
  },
  {
    type: "list",
    ordered: true,
    items: [
      "**Spread and slippage.** A test run at a fixed, optimistic spread will flatter any strategy that trades frequently.",
      "**Data quality.** Tick data and one-minute bars produce materially different results for strategies with tight stops.",
      "**Parameter fitting.** A result that only holds for one exact combination of settings has usually been fitted to the history rather than discovered in it.",
    ],
  },
  {
    type: "callout",
    title: "Ambiguity becomes a losing trade",
    text: "The most valuable part of an EA project is writing the strategy down precisely. A rule a person interprets on instinct has to become an explicit condition, and that exercise regularly reveals the strategy was never fully defined.",
  },
  {
    type: "paragraph",
    text: "The honest framing is that an expert advisor is an execution tool. It is worth building when a strategy is defined, tested and understood, and it is worth nothing at all before then.",
  },
]

const aiWhereItPays: ContentBlock[] = [
  {
    type: "paragraph",
    text: "The useful question is not whether a business should use AI. It is which specific task is costing staff hours every week, and whether a model can do that task well enough to be trusted with it.",
  },
  { type: "heading", level: 2, text: "Tasks that tend to pay" },
  {
    type: "list",
    items: [
      "**Reading documents into structured data.** Invoices, delivery notes and forms that are currently re-typed by hand.",
      "**Answering the same questions repeatedly.** A small set of enquiries that make up most of the support load.",
      "**Sorting and routing.** Classifying incoming items so they reach the right person without a human triaging first.",
      "**Summarising long records.** Turning a file of correspondence into something readable before a meeting.",
    ],
  },
  { type: "heading", level: 2, text: "Tasks that tend not to" },
  {
    type: "paragraph",
    text: "Anything where a wrong answer is expensive and hard to detect. Anything requiring a guarantee of correctness — a model that is right ninety-five per cent of the time is excellent for drafting and unacceptable for posting entries to a ledger.",
  },
  {
    type: "callout",
    title: "Measure before trusting",
    text: "Build a set of examples with known correct answers, run the system against it, and get an error rate. Without that number, confidence in an AI feature is an impression rather than a fact.",
  },
  { type: "heading", level: 2, text: "Automation is often the better answer" },
  {
    type: "paragraph",
    text: "A surprising share of problems described as AI problems are integration problems. If data is being copied from one system into another by hand, the fix is usually an API call rather than a language model. It is cheaper, it is deterministic, and it does not need an accuracy measurement.",
  },
  {
    type: "paragraph",
    text: "We start these projects by looking at where time actually goes, then choose the narrowest thing that solves it. Sometimes that is a model. Often it is a well-designed automation and no model at all.",
  },
]

const nextSixteen: ContentBlock[] = [
  {
    type: "paragraph",
    text: "This website runs on Next.js 16. A few of the changes in that release affect how applications are written rather than how they are configured, and they are easy to miss when upgrading.",
  },
  { type: "heading", level: 2, text: "Middleware is now proxy" },
  {
    type: "paragraph",
    text: "The file previously known as `middleware.ts` is `proxy.ts`, exporting a function named `proxy`. The matcher configuration is unchanged. Because this file runs on every request, anything that can throw inside it takes the whole site down — our own proxy checks that its dependencies are configured before using them, and passes requests straight through when they are not.",
  },
  { type: "heading", level: 2, text: "`priority` on images is deprecated" },
  {
    type: "paragraph",
    text: "The `priority` prop on `next/image` has been replaced by `preload`, which makes the behaviour explicit. The documentation's own guidance is that most cases are better served by `loading` and `fetchPriority` directly, reserving `preload` for a single unambiguous largest-contentful-paint image.",
  },
  {
    type: "code",
    language: "tsx",
    caption: "The replacement for a below-the-fold image that still needs to load eagerly.",
    code: `// Deprecated in Next.js 16
<Image src={src} alt={alt} priority />

// Preferred
<Image src={src} alt={alt} loading="eager" fetchPriority="high" />`,
  },
  { type: "heading", level: 2, text: "Documentation ships with the package" },
  {
    type: "paragraph",
    text: "Version-matched documentation is bundled inside `node_modules/next/dist/docs`. For teams using AI coding assistants this matters more than it sounds: an assistant working from training data will confidently write the previous version's APIs, and pointing it at the bundled docs is the difference between correct code and plausible code.",
  },
  {
    type: "callout",
    title: "Worth checking on any upgrade",
    text: "Deprecations that still compile are the ones that survive an upgrade unnoticed. A build passing is not evidence that an application is using the current API.",
  },
]

/**
 * Sample articles. See the note at the top of this file: these demonstrate
 * the layout and are labelled as samples throughout the interface.
 */
export const articles: Article[] = [
  {
    title: "Offline-first is not optional for software used outside an office",
    slug: "offline-first-software",
    excerpt:
      "Software designed on a stable connection fails exactly where it is used for real work. What changes in the design when the network is treated as an optimisation rather than a prerequisite.",
    content: offlineFirst,
    categoryId: "software-engineering",
    tags: ["Architecture", "Mobile", "Field operations"],
    authorId: "mwesigwa-trevor-joseph",
    publishedDate: "2026-08-26",
    status: "sample",
    featured: true,
    seoDescription:
      "Why offline-first design matters for business software used outside an office, and the three decisions that have to be made before development starts.",
  },
  {
    title: "Choosing a database for a SACCO management system",
    slug: "database-for-a-sacco-system",
    excerpt:
      "A cooperative keeps track of money that belongs to its members. That requirement settles most of the technical decisions — including the one about storing balances.",
    content: sacooDatabase,
    categoryId: "business-digital",
    tags: ["PostgreSQL", "Financial systems", "Data modelling"],
    authorId: "mwesigwa-trevor-joseph",
    publishedDate: "2026-08-12",
    status: "sample",
  },
  {
    title: "What a Forex expert advisor can and cannot do",
    slug: "what-an-expert-advisor-can-do",
    excerpt:
      "Automation executes a strategy consistently. It does not create one, and it will not rescue a strategy that loses money when followed by hand.",
    content: expertAdvisors,
    categoryId: "financial-markets",
    tags: ["MetaTrader", "MQL5", "Automation"],
    authorId: "mwesigwa-trevor-joseph",
    publishedDate: "2026-07-29",
    status: "sample",
  },
  {
    title: "Where AI actually earns its cost in a small business",
    slug: "where-ai-earns-its-cost",
    excerpt:
      "The useful question is not whether to use AI, but which specific task is consuming staff hours and whether a model can be trusted with it.",
    content: aiWhereItPays,
    categoryId: "artificial-intelligence",
    tags: ["AI", "Automation", "Operations"],
    authorId: "mwesigwa-trevor-joseph",
    publishedDate: "2026-07-15",
    status: "sample",
  },
  {
    title: "Three changes in Next.js 16 worth knowing about",
    slug: "next-js-16-changes-worth-knowing",
    excerpt:
      "Middleware was renamed, an image prop was deprecated, and the documentation now ships inside the package. Notes from upgrading this website.",
    content: nextSixteen,
    categoryId: "technology-news",
    tags: ["Next.js", "React", "Upgrades"],
    authorId: "mwesigwa-trevor-joseph",
    publishedDate: "2026-07-02",
    status: "sample",
  },
]

/* ------------------------------- helpers -------------------------------- */

const categoryById = new Map(insightCategories.map((c) => [c.id, c]))
const categoryBySlugMap = new Map(insightCategories.map((c) => [c.slug, c]))
const authorById = new Map(authors.map((a) => [a.id, a]))

/** Plain text of a block, for reading time and search. */
function blockText(block: ContentBlock): string {
  switch (block.type) {
    case "heading":
    case "paragraph":
      return block.text
    case "list":
      return block.items.join(" ")
    case "quote":
      return `${block.text} ${block.attribution ?? ""}`
    case "code":
      return block.caption ?? ""
    case "image":
      return `${block.alt} ${block.caption ?? ""}`
    case "table":
      return [...block.head, ...block.rows.flat(), block.caption ?? ""].join(" ")
    case "callout":
      return `${block.title ?? ""} ${block.text}`
    case "embed":
      return block.title
    default:
      return ""
  }
}

/** Words per minute used for the reading estimate. */
const WPM = 200

export function readingTimeOf(content: ContentBlock[]): number {
  const words = content
    .map(blockText)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / WPM))
}

function resolve(article: Article): ResolvedArticle {
  const category = categoryById.get(article.categoryId)
  const author = authorById.get(article.authorId)

  if (!category) {
    throw new Error(`Article "${article.slug}" references unknown category "${article.categoryId}".`)
  }
  if (!author) {
    throw new Error(`Article "${article.slug}" references unknown author "${article.authorId}".`)
  }

  return { ...article, category, author, readingTime: readingTimeOf(article.content) }
}

/** Articles the public site may show, newest first. Drafts never appear. */
export function getVisibleArticles(): ResolvedArticle[] {
  return articles
    .filter((article) => article.status !== "draft")
    .map(resolve)
    .sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    )
}

export function getArticleBySlug(slug: string): ResolvedArticle | undefined {
  const article = articles.find(
    (item) => item.slug === slug && item.status !== "draft"
  )
  return article ? resolve(article) : undefined
}

export function getCategoryBySlug(slug: string): InsightCategory | undefined {
  return categoryBySlugMap.get(slug)
}

export function getArticlesInCategory(categoryId: string): ResolvedArticle[] {
  return getVisibleArticles().filter((article) => article.categoryId === categoryId)
}

/** The pinned featured article, falling back to the most recent. */
export function getFeaturedArticle(): ResolvedArticle | undefined {
  const visible = getVisibleArticles()
  return visible.find((article) => article.featured) ?? visible[0]
}

/**
 * Related articles: same category first, then most recent, never the article
 * itself.
 */
export function getRelatedArticles(
  article: ResolvedArticle,
  limit = 3
): ResolvedArticle[] {
  const others = getVisibleArticles().filter((item) => item.slug !== article.slug)
  const sameCategory = others.filter((item) => item.categoryId === article.categoryId)
  const rest = others.filter((item) => item.categoryId !== article.categoryId)
  return [...sameCategory, ...rest].slice(0, limit)
}

/** Categories that currently have at least one visible article. */
export function getActiveCategories(): InsightCategory[] {
  const visible = getVisibleArticles()
  return insightCategories.filter((category) =>
    visible.some((article) => article.categoryId === category.id)
  )
}

/** Lowercased haystack used by client-side search. */
export function searchIndexOf(article: ResolvedArticle): string {
  return [
    article.title,
    article.excerpt,
    article.category.name,
    article.author.name,
    ...article.tags,
    ...article.content.map(blockText),
  ]
    .join(" ")
    .toLowerCase()
}

export function formatArticleDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}
