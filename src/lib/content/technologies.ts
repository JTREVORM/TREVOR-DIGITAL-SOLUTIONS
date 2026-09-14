import {
  Cloud,
  Database,
  LineChart,
  Monitor,
  Server,
  Smartphone,
  type LucideIcon,
} from "lucide-react"

/**
 * The technology stack, grouped by discipline. Shared by the homepage
 * technologies section and the /technologies page.
 *
 * This list is deliberately conservative: it names only what the company
 * actually builds with. Adding a technology here is a capability claim, so
 * nothing goes in that TDS would not be comfortable being asked about.
 */

export type Technology = {
  name: string
  description: string
}

export type TechGroup = {
  category: string
  icon: LucideIcon
  /** Short line explaining why this group matters to a client. */
  intent: string
  techs: Technology[]
}

export const techGroups: TechGroup[] = [
  {
    category: "Frontend",
    icon: Monitor,
    intent: "The interface your customers and staff actually touch.",
    techs: [
      { name: "React", description: "Component-based user interface library." },
      { name: "Next.js", description: "Server-rendered React framework for fast, indexable pages." },
      { name: "TypeScript", description: "Typed JavaScript that catches errors before release." },
      { name: "Tailwind CSS", description: "Utility-first styling for consistent design systems." },
    ],
  },
  {
    category: "Backend",
    icon: Server,
    intent: "The logic, rules and processing behind the interface.",
    techs: [
      { name: "Node.js", description: "JavaScript runtime for APIs and services." },
      { name: "Python", description: "Backend services, data work and machine learning." },
      { name: "Django", description: "Batteries-included Python framework for larger systems." },
      { name: "FastAPI", description: "High-performance Python framework for APIs." },
    ],
  },
  {
    category: "Database",
    icon: Database,
    intent: "Where your records live, and how safely they are kept.",
    techs: [
      { name: "PostgreSQL", description: "Relational database for transactional business data." },
      { name: "Supabase", description: "Managed Postgres with authentication and storage." },
      { name: "MongoDB", description: "Document database for flexible, evolving records." },
      { name: "Redis", description: "In-memory cache and queue for responsiveness at load." },
    ],
  },
  {
    category: "Mobile",
    icon: Smartphone,
    intent: "Android and iOS from one maintained codebase.",
    techs: [
      { name: "Flutter", description: "Cross-platform framework for Android and iOS." },
      { name: "Dart", description: "The language behind Flutter applications." },
      { name: "React Native", description: "JavaScript-based cross-platform mobile framework." },
      { name: "Firebase", description: "Authentication, messaging and analytics for mobile." },
    ],
  },
  {
    category: "Cloud & DevOps",
    icon: Cloud,
    intent: "How software gets deployed, watched and recovered.",
    techs: [
      { name: "AWS", description: "Amazon Web Services infrastructure and managed services." },
      { name: "Google Cloud", description: "Cloud platform with strong data and AI tooling." },
      { name: "Docker", description: "Containers for identical behaviour across environments." },
      { name: "Kubernetes", description: "Container orchestration for services at scale." },
      { name: "Terraform", description: "Infrastructure defined as reviewable code." },
      { name: "Vercel", description: "Deployment platform optimised for Next.js." },
    ],
  },
  {
    category: "Trading Technology",
    icon: LineChart,
    intent: "Automated trading built to a documented strategy.",
    techs: [
      { name: "MQL4", description: "Language for MetaTrader 4 expert advisors and indicators." },
      { name: "MQL5", description: "Language for MetaTrader 5 expert advisors and indicators." },
      { name: "MetaTrader 4", description: "Long-established retail trading platform." },
      { name: "MetaTrader 5", description: "Current-generation trading and backtesting platform." },
    ],
  },
]

/** Flat list used for the compact homepage strip. */
export const primaryTechnologies = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Flutter",
  "PostgreSQL",
  "Supabase",
  "Docker",
  "AWS",
  "MQL5",
  "Tailwind CSS",
] as const
