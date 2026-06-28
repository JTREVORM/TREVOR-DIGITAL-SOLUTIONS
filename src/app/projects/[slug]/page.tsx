import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, ArrowLeft, Phone, ExternalLink } from "lucide-react"

type Project = {
  slug: string
  title: string
  category: string
  description: string
  longDescription: string
  client?: string
  industry: string
  technologies: string[]
  features: string[]
  benefits: string[]
  image: string
  gallery: string[]
  projectUrl?: string
}

const PROJECTS_DATA: Record<string, Project> = {
  "enterprise-analytics-dashboard": {
    slug: "enterprise-analytics-dashboard",
    title: "Enterprise SaaS Analytics Dashboard",
    category: "Business Management System",
    description: "A comprehensive analytics platform for enterprise data visualization and reporting.",
    longDescription: "We built a full-featured SaaS analytics dashboard for a fast-growing enterprise client. The platform aggregates data from multiple sources, provides real-time visualizations, and generates automated reports for decision makers at every level of the organization. The system handles millions of data points and delivers insights in milliseconds thanks to careful database optimization and caching strategies.",
    industry: "Finance & Analytics",
    technologies: ["Next.js 14", "Supabase", "Tailwind CSS", "Recharts", "TypeScript", "Vercel"],
    features: ["Real-time data visualization", "Automated report generation", "Multi-user access control", "Custom KPI dashboards", "Data export (CSV, PDF, Excel)", "Mobile responsive", "Dark/Light mode", "Alert notifications"],
    benefits: ["Reduced reporting time by 80%", "Increased data accuracy to 99.9%", "Saved 15+ hours per week in manual work", "Enabled data-driven decision making", "Improved team collaboration"],
    image: "/project1.png",
    gallery: ["/project1.png", "/project2.png", "/project1.png"],
  },
  "global-erp-inventory-system": {
    slug: "global-erp-inventory-system",
    title: "Global Inventory & ERP System",
    category: "ERP & Inventory Management",
    description: "A centralized ERP for managing global supply chains, inventory, and operations.",
    longDescription: "This enterprise resource planning system was built for a client managing inventory across multiple warehouses and locations globally. It integrates procurement, stock management, order fulfillment, and financial tracking into one unified platform accessible from anywhere in the world.",
    industry: "Logistics & Supply Chain",
    technologies: ["React", "Node.js", "PostgreSQL", "Docker", "Redis", "Nginx"],
    features: ["Multi-warehouse management", "Real-time stock tracking", "Purchase order automation", "Supplier management", "Barcode/QR scanning", "Financial reporting", "User roles & permissions", "Audit trails"],
    benefits: ["Eliminated stockouts by 95%", "Reduced procurement costs by 30%", "Full audit trail and compliance", "Eliminated 200+ hours of manual work monthly", "Real-time visibility across all locations"],
    image: "/project2.png",
    gallery: ["/project2.png", "/project1.png", "/project2.png"],
  },
  "hospital-management-system": {
    slug: "hospital-management-system",
    title: "Hospital Management System",
    category: "Healthcare Software",
    description: "A complete digital solution for patient records, appointments, billing, and clinical workflows.",
    longDescription: "A comprehensive hospital management system built for a medical center in Kampala. The system digitizes all patient records, automates appointment scheduling, manages billing and insurance, and provides doctors with real-time access to patient history.",
    industry: "Healthcare",
    technologies: ["React", "Node.js", "PostgreSQL", "TypeScript", "Docker"],
    features: ["Electronic patient records", "Appointment scheduling", "Billing & payments", "Lab results management", "Pharmacy management", "Staff scheduling", "Insurance claims", "Reporting & analytics"],
    benefits: ["Eliminated paper records", "Reduced appointment no-shows by 60%", "Faster billing cycle", "Improved patient satisfaction", "Full regulatory compliance"],
    image: "/project1.png",
    gallery: ["/project1.png", "/project2.png"],
  },
  "forex-trading-dashboard": {
    slug: "forex-trading-dashboard",
    title: "Forex Trading Dashboard",
    category: "Forex & Trading Systems",
    description: "Real-time Forex trading dashboard with automated EA management and portfolio analytics.",
    longDescription: "A sophisticated Forex trading management platform that provides traders with real-time market data, automated EA deployment, portfolio analytics, and risk management tools — all in one unified dashboard.",
    industry: "Finance & Trading",
    technologies: ["MQL5", "Python", "React", "WebSockets", "PostgreSQL"],
    features: ["Real-time market data", "EA management dashboard", "Portfolio analytics", "Risk management", "Trade history", "P&L reporting", "Multiple account management", "Alerts & notifications"],
    benefits: ["24/7 automated trading", "Eliminated emotional trading decisions", "Improved risk management", "Complete trade history", "Multi-account portfolio view"],
    image: "/project2.png",
    gallery: ["/project2.png", "/project1.png"],
  },
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = PROJECTS_DATA[slug]
  if (!project) return { title: "Project Not Found" }
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} | Trevor Digital Solutions`,
      description: project.description,
      url: `https://trevordigitalsolutions.com/projects/${project.slug}`,
      images: [{ url: project.image }],
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(PROJECTS_DATA).map((slug) => ({ slug }))
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = PROJECTS_DATA[slug]
  if (!project) notFound()

  return (
    <>
      {/* Hero */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground hover:text-foreground">
              <Link href="/projects">
                <ArrowLeft className="h-4 w-4" /> All Projects
              </Link>
            </Button>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {project.category}
                </span>
                <span className="text-xs text-muted-foreground">{project.industry}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{project.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <span key={tech} className="text-xs font-medium bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <Button asChild>
                  <Link href="/contact">
                    Request Similar Project <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {project.projectUrl && (
                  <Button variant="outline" asChild>
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                      View Live <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border shadow-2xl">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">{project.longDescription}</p>

              {/* Features */}
              <h3 className="text-xl font-bold mb-4">Key Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
                {project.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Gallery */}
              {project.gallery.length > 0 && (
                <>
                  <h3 className="text-xl font-bold mb-4">Project Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.gallery.map((img, i) => (
                      <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-border">
                        <Image src={img} alt={`${project.title} screenshot ${i + 1}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-border bg-card">
                <h3 className="font-bold text-lg mb-4">Business Benefits</h3>
                <ul className="space-y-3">
                  {project.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-primary/30 bg-primary/5">
                <h3 className="font-bold text-lg mb-2">Want something similar?</h3>
                <p className="text-sm text-muted-foreground mb-4">We can build a similar solution tailored to your business needs.</p>
                <Button className="w-full gap-2 mb-3" asChild>
                  <Link href="/contact">
                    Request a Quote <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full gap-2" asChild>
                  <a href="tel:+256740081305">
                    <Phone className="h-4 w-4" /> Call Us Now
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
