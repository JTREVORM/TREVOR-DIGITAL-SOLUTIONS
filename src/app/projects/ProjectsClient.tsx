"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ExternalLink, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

const ALL_PROJECTS = [
  {
    slug: "enterprise-analytics-dashboard",
    title: "Enterprise SaaS Analytics Dashboard",
    category: "Business Management System",
    description: "A comprehensive analytics platform for enterprise data visualization and reporting with real-time dashboards.",
    image: "/project1.png",
    technologies: ["Next.js", "Supabase", "Tailwind CSS", "Recharts"],
    industry: "Finance & Analytics",
  },
  {
    slug: "global-erp-inventory-system",
    title: "Global Inventory & ERP System",
    category: "ERP & Inventory Management",
    description: "A centralized ERP for managing global supply chains, inventory tracking, and business operations.",
    image: "/project2.png",
    technologies: ["React", "Node.js", "PostgreSQL", "Docker"],
    industry: "Logistics & Supply Chain",
  },
  {
    slug: "hospital-management-system",
    title: "Hospital Management System",
    category: "Healthcare Software",
    description: "A complete digital solution for patient records, appointments, billing, and clinical workflows.",
    image: "/project1.png",
    technologies: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    industry: "Healthcare",
  },
  {
    slug: "forex-trading-dashboard",
    title: "Forex Trading Dashboard",
    category: "Forex & Trading Systems",
    description: "Real-time Forex trading dashboard with automated EA management and portfolio analytics.",
    image: "/project2.png",
    technologies: ["MQL5", "Python", "React", "WebSockets"],
    industry: "Finance & Trading",
  },
]

const CATEGORIES = ["All", "Business Management System", "ERP & Inventory Management", "Healthcare Software", "Forex & Trading Systems"]

export function ProjectsClient() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filtered = activeCategory === "All"
    ? ALL_PROJECTS
    : ALL_PROJECTS.filter((p) => p.category === activeCategory)

  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-28 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-[16rem] w-[16rem] sm:h-[20rem] sm:w-[20rem] md:h-[24rem] md:w-[24rem] bg-primary/10 rounded-full blur-[80px] opacity-60" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
            Our Portfolio
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Projects</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our portfolio of enterprise software solutions, web applications, ERP systems, and trading tools delivered for clients across Africa and beyond.
          </p>
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap mb-10">
            <Filter className="h-4 w-4 text-muted-foreground mr-1" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {filtered.map((project, index) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-border bg-card group h-full">
                  <div className="relative aspect-video overflow-hidden border-b border-border">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" className="gap-2 rounded-full shadow-lg" asChild>
                        <Link href={`/projects/${project.slug}`}>
                          View Details <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{project.industry}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="text-xs font-medium text-foreground bg-secondary px-2.5 py-1 rounded-md">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 group/btn" asChild>
                      <Link href={`/projects/${project.slug}`}>
                        View Project <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary/5 border-y border-border">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Have a project in mind?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
            We&apos;d love to add your project to our portfolio. Get in touch for a free consultation.
          </p>
          <Button size="lg" asChild>
            <Link href="/contact">
              Start Your Project <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
