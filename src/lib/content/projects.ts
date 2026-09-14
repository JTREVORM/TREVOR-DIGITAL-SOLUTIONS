import {
  BarChart3,
  BrainCircuit,
  Database,
  Landmark,
  Monitor,
  Smartphone,
  type LucideIcon,
} from "lucide-react"

/* ==========================================================================
   PROJECT PORTFOLIO
   --------------------------------------------------------------------------
   HOW TO PUBLISH A CASE STUDY

   Every project below carries the facts we can state today: the client's
   name, their sector, and the category of work. The narrative fields
   (`overview`, `challenge`, `solution`, `features`) and `screenshots` are
   deliberately left unset, because that detail is not recorded anywhere in
   this project and writing it from imagination would put invented claims
   about named, real organisations on a public website.

   A project renders as a full case study as soon as it has all four
   narrative fields — see `isCaseStudyReady` below. Until then it appears in
   the portfolio with its real name, sector and category, and its detail page
   shows the case-study structure with an honest "in preparation" note. No
   code changes are needed to promote one; just fill the fields in.

   To publish a case study, fill in:

     overview      What the system is, in two or three sentences.
     challenge     The business or technical problem it addressed.
     solution      What TDS actually built.
     features      6-8 concrete capabilities.
     technologies  The real stack used on that project.
     screenshots   Real images placed in /public/projects/<slug>/.
     image         The card and hero image (usually screenshots[0].src).

   Optional: solutionType, platforms, year, projectUrl, client.

   Only add a screenshot that is a genuine image of the delivered system.
   Do not point these at the generic mockups in /public (project1.png,
   project2.png) — those are unrelated stock interface renders and using them
   here would present another product's UI as a client's system.
   ========================================================================== */

export type ProjectCategoryId =
  | "business-systems"
  | "financial-technology"
  | "web-applications"
  | "mobile-applications"
  | "ai-automation"
  | "trading-technology"

export type ProjectCategory = {
  id: ProjectCategoryId
  /** Full name, used on cards and detail pages. */
  name: string
  /** Short label, used in the filter bar. */
  filterLabel: string
  icon: LucideIcon
}

export const projectCategories: ProjectCategory[] = [
  {
    id: "business-systems",
    name: "Business Systems",
    filterLabel: "Business Systems",
    icon: Database,
  },
  {
    id: "financial-technology",
    name: "Financial Technology",
    filterLabel: "Finance",
    icon: Landmark,
  },
  {
    id: "web-applications",
    name: "Web Applications",
    filterLabel: "Web",
    icon: Monitor,
  },
  {
    id: "mobile-applications",
    name: "Mobile Applications",
    filterLabel: "Mobile",
    icon: Smartphone,
  },
  {
    id: "ai-automation",
    name: "AI & Automation",
    filterLabel: "AI",
    icon: BrainCircuit,
  },
  {
    id: "trading-technology",
    name: "Trading Technology",
    filterLabel: "Trading",
    icon: BarChart3,
  },
]

export const categoryById = new Map(projectCategories.map((c) => [c.id, c]))

export type Screenshot = {
  /** Path under /public, e.g. /projects/chetu-microfinance/dashboard.png */
  src: string
  /** Describe what the screen shows. Required for accessibility. */
  alt: string
  caption?: string
}

export type Project = {
  slug: string
  name: string
  categoryId: ProjectCategoryId
  /** The client's sector. Taken from the organisation's own name. */
  industry: string
  /** One neutral line for cards. */
  summary: string
  featured: boolean

  /* ---- Case-study content. Unset until the real detail is confirmed. ---- */
  overview?: string
  challenge?: string
  solution?: string
  features?: string[]
  technologies?: string[]
  screenshots?: Screenshot[]
  /** Card and hero image. Only ever a real image of the delivered system. */
  image?: string

  /* ---- Optional project facts ---- */
  solutionType?: string
  platforms?: string[]
  year?: string
  projectUrl?: string
  client?: string
}

/**
 * The portfolio.
 *
 * Names, sectors and categories are real. Narrative and screenshots are
 * pending — see the note at the top of this file.
 */
export const projects: Project[] = [
  {
    slug: "chetu-microfinance",
    name: "Chetu Microfinance",
    categoryId: "financial-technology",
    industry: "Microfinance",
    summary:
      "Software engineering for a microfinance provider, covering the record-keeping and reporting a lending operation runs on.",
    featured: true,
  },
  {
    slug: "bakenye-unity-and-development-sacco",
    name: "Bakenye Unity and Development SACCO",
    categoryId: "financial-technology",
    industry: "Savings and credit cooperative",
    summary:
      "A management system for a savings and credit cooperative, handling member records, contributions and loan administration.",
    featured: true,
  },
  {
    slug: "ramosmax-automotive-care",
    name: "RamosMAX Automotive Care",
    categoryId: "business-systems",
    industry: "Automotive services",
    summary:
      "Operational software for an automotive care business, covering the day-to-day running of a service workshop.",
    featured: true,
  },
  {
    slug: "wabwire-hardware",
    name: "Wabwire Hardware",
    categoryId: "business-systems",
    industry: "Hardware retail and distribution",
    summary:
      "Stock and trading software for a hardware retailer, where accurate inventory is the difference between profit and guesswork.",
    featured: true,
  },
  {
    slug: "awptech-electricals",
    name: "AWPTECH Electricals",
    categoryId: "business-systems",
    industry: "Electrical supplies and services",
    summary:
      "Business software for an electrical supplies and services company, built around how the business actually trades.",
    featured: false,
  },
  {
    slug: "trevor-tutor-ai",
    name: "Trevor Tutor AI",
    categoryId: "ai-automation",
    industry: "Education technology",
    summary:
      "An AI-assisted tutoring product built in-house by Trevor Digital Solutions, applying language models to structured learning.",
    featured: false,
  },
]

export const projectBySlug = new Map(projects.map((project) => [project.slug, project]))

/**
 * A project is publishable as a full case study once it has the narrative.
 * Until then the detail page renders the structure with an honest note
 * rather than empty headings or invented prose.
 */
export function isCaseStudyReady(project: Project): boolean {
  return Boolean(
    project.overview &&
      project.challenge &&
      project.solution &&
      project.features &&
      project.features.length > 0
  )
}

export function categoryOf(project: Project): ProjectCategory {
  const category = categoryById.get(project.categoryId)
  if (!category) {
    throw new Error(
      `Project "${project.slug}" has unknown categoryId "${project.categoryId}".`
    )
  }
  return category
}

/** Featured projects for the homepage, capped so the section stays tight. */
export const featuredProjects = projects.filter((p) => p.featured).slice(0, 4)

/** Categories that actually have projects, for the filter bar. */
export const activeProjectCategories = projectCategories.filter((category) =>
  projects.some((project) => project.categoryId === category.id)
)

/** Distinct industries served, derived from the portfolio itself. */
export const projectIndustries = Array.from(
  new Set(projects.map((project) => project.industry))
)
