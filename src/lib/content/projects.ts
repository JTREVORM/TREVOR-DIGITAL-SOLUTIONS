/**
 * Project portfolio.
 *
 * This is the existing project data, consolidated from the three places it
 * used to be duplicated (homepage section, projects index, project detail).
 * Slugs are route segments under /projects/[slug] and must not change.
 *
 * `image` and `gallery` currently point at the placeholder interface mockups
 * in /public. Replacing those files, and filling in `client` and `year`, is
 * all that is needed to turn these into real case studies.
 */

export type Project = {
  slug: string
  title: string
  category: string
  industry: string
  /** One line for cards. */
  summary: string
  /** Full narrative for the detail page. */
  overview: string
  /** Set once a client agrees to be named. */
  client?: string
  /** Set once confirmed. */
  year?: string
  technologies: string[]
  capabilities: string[]
  outcomes: string[]
  image: string
  gallery: string[]
  projectUrl?: string
  featured: boolean
}

export const projects: Project[] = [
  {
    slug: "enterprise-analytics-dashboard",
    title: "Enterprise SaaS Analytics Dashboard",
    category: "Business Management System",
    industry: "Finance & Analytics",
    summary:
      "An analytics platform that pulls data from several systems into one place and turns it into reporting the leadership team actually uses.",
    overview:
      "The client's reporting lived in exported spreadsheets that were out of date by the time anyone read them. We built a single analytics platform that connects directly to the source systems, keeps its figures current, and gives each level of the organisation the view it needs. Careful indexing and a caching layer keep queries responsive as the dataset grows.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Tailwind CSS",
      "Recharts",
    ],
    capabilities: [
      "Live data visualisation",
      "Scheduled report generation",
      "Role-based access control",
      "Configurable KPI dashboards",
      "Export to CSV, Excel and PDF",
      "Threshold alerts and notifications",
      "Responsive on phones and tablets",
      "Full audit trail",
    ],
    outcomes: [
      "One reporting source replacing circulated spreadsheets",
      "Figures current at the moment they are read",
      "Self-service reporting for department heads",
      "Manual report assembly removed from the month-end routine",
    ],
    image: "/project1.png",
    gallery: ["/project1.png", "/project2.png"],
    featured: true,
  },
  {
    slug: "global-erp-inventory-system",
    title: "Inventory & ERP System",
    category: "ERP & Inventory Management",
    industry: "Logistics & Supply Chain",
    summary:
      "A single system covering stock across multiple warehouses, with purchasing, fulfilment and financial tracking in one place.",
    overview:
      "Stock was tracked separately at each location, so head office never had a reliable picture and reconciliation was a monthly argument. We built a central ERP covering procurement, stock movement, order fulfilment and financial tracking, with every location working against the same records and every change attributable to a user.",
    technologies: ["React", "Node.js", "PostgreSQL", "Redis", "Docker", "Nginx"],
    capabilities: [
      "Multi-warehouse stock control",
      "Live stock levels and movement history",
      "Purchase order workflow",
      "Supplier records and pricing",
      "Barcode and QR scanning",
      "Financial and stock valuation reporting",
      "User roles and permissions",
      "Audit trail on every transaction",
    ],
    outcomes: [
      "One stock figure shared by every location",
      "Purchasing triggered by real stock levels",
      "Reconciliation replaced by a continuous record",
      "A complete, attributable transaction history",
    ],
    image: "/project2.png",
    gallery: ["/project2.png", "/project1.png"],
    featured: true,
  },
  {
    slug: "hospital-management-system",
    title: "Hospital Management System",
    category: "Healthcare Software",
    industry: "Healthcare",
    summary:
      "Patient records, appointments, billing and clinical workflow in one system, built to replace paper files.",
    overview:
      "A medical centre in Kampala was running on paper files, which made patient history slow to retrieve and billing slow to close. We digitised patient records, appointment scheduling, billing and laboratory results, and gave clinicians immediate access to a patient's history at the point of care, with the access controls that medical records require.",
    technologies: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker"],
    capabilities: [
      "Electronic patient records",
      "Appointment scheduling and reminders",
      "Billing, payments and insurance claims",
      "Laboratory results management",
      "Pharmacy and dispensing records",
      "Staff rosters and scheduling",
      "Role-based clinical access",
      "Reporting and returns",
    ],
    outcomes: [
      "Patient history retrievable in seconds at the point of care",
      "Appointments tracked and reminded rather than written down",
      "Billing closed against the record instead of from memory",
      "Access to records restricted by clinical role",
    ],
    image: "/project1.png",
    gallery: ["/project1.png", "/project2.png"],
    featured: false,
  },
  {
    slug: "forex-trading-dashboard",
    title: "Forex Trading Dashboard",
    category: "Forex & Trading Systems",
    industry: "Finance & Trading",
    summary:
      "A monitoring dashboard for automated trading: expert advisor management, position visibility and performance reporting across accounts.",
    overview:
      "Running several expert advisors across multiple accounts meant logging into each terminal to find out what was happening. We built a dashboard that consolidates live market data, EA status, open positions and performance across every account, with the risk controls and history needed to judge whether a strategy is behaving as specified.",
    technologies: ["MQL5", "Python", "React", "WebSockets", "PostgreSQL"],
    capabilities: [
      "Live market and account data",
      "Expert advisor deployment and status",
      "Position and exposure monitoring",
      "Risk limits and controls",
      "Full trade history",
      "Profit and loss reporting",
      "Multiple account management",
      "Alerts and notifications",
    ],
    outcomes: [
      "Every account visible from one screen",
      "Strategies running unattended, with monitoring",
      "Exposure measurable across accounts rather than per terminal",
      "A complete trade record for reviewing strategy behaviour",
    ],
    image: "/project2.png",
    gallery: ["/project2.png", "/project1.png"],
    featured: false,
  },
]

export const projectBySlug = new Map(projects.map((project) => [project.slug, project]))

export const featuredProjects = projects.filter((project) => project.featured)

/** Filter options for the projects index, derived from the data itself. */
export const projectCategories = [
  "All",
  ...Array.from(new Set(projects.map((project) => project.category))),
]
