/**
 * The technology stack, grouped by discipline. Shared by the homepage
 * technologies section and the /technologies page.
 */

export type Technology = {
  name: string
  description: string
}

export type TechGroup = {
  category: string
  /** Short line explaining why this group matters to a client. */
  intent: string
  techs: Technology[]
}

export const techGroups: TechGroup[] = [
  {
    category: "Frontend",
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
    intent: "The logic, rules and processing behind the interface.",
    techs: [
      { name: "Node.js", description: "JavaScript runtime for APIs and services." },
      { name: "Python", description: "Backend services, data work and machine learning." },
      { name: "Django", description: "Batteries-included Python framework for larger systems." },
      { name: "FastAPI", description: "High-performance Python framework for APIs." },
    ],
  },
  {
    category: "Databases",
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
    intent: "Android and iOS from one maintained codebase.",
    techs: [
      { name: "Flutter", description: "Cross-platform framework for Android and iOS." },
      { name: "Dart", description: "The language behind Flutter applications." },
      { name: "React Native", description: "JavaScript-based cross-platform mobile framework." },
      { name: "Firebase", description: "Authentication, messaging and analytics for mobile." },
    ],
  },
  {
    category: "Trading systems",
    intent: "Automated trading built to a documented strategy.",
    techs: [
      { name: "MQL5", description: "Language for MetaTrader 5 expert advisors and indicators." },
      { name: "MQL4", description: "Language for MetaTrader 4 expert advisors and indicators." },
      { name: "MetaTrader 5", description: "Current-generation trading and backtesting platform." },
      { name: "MetaTrader 4", description: "Long-established retail trading platform." },
    ],
  },
  {
    category: "Cloud & DevOps",
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
