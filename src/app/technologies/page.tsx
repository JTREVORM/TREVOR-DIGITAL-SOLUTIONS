import type { Metadata } from "next"
import { TechnologiesSection } from "@/components/sections/technologies"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Technologies",
  description: "Explore the modern technology stack used by Trevor Digital Solutions — React, Next.js, Flutter, Python, MQL5, PostgreSQL, AWS, and more.",
  openGraph: {
    title: "Our Technology Stack | Trevor Digital Solutions",
    description: "Cutting-edge technologies powering enterprise software solutions.",
    url: "https://trevordigitalsolutions.com/technologies",
  },
}

const TECH_CATEGORIES = [
  {
    category: "Frontend",
    techs: [
      { name: "React", description: "UI library for building component-based interfaces." },
      { name: "Next.js", description: "Full-stack React framework with server-side rendering." },
      { name: "TypeScript", description: "Strongly-typed superset of JavaScript." },
      { name: "Tailwind CSS", description: "Utility-first CSS framework for rapid styling." },
    ],
  },
  {
    category: "Backend",
    techs: [
      { name: "Node.js", description: "JavaScript runtime for server-side applications." },
      { name: "Python", description: "Versatile language for backend and AI/ML." },
      { name: "Django", description: "High-level Python web framework." },
      { name: "FastAPI", description: "Modern, fast Python web framework for APIs." },
    ],
  },
  {
    category: "Databases",
    techs: [
      { name: "PostgreSQL", description: "Advanced open-source relational database." },
      { name: "Supabase", description: "Open-source Firebase alternative with PostgreSQL." },
      { name: "MongoDB", description: "Document-based NoSQL database." },
      { name: "Redis", description: "In-memory data structure store for caching." },
    ],
  },
  {
    category: "Mobile",
    techs: [
      { name: "Flutter", description: "Google's cross-platform mobile framework." },
      { name: "React Native", description: "JavaScript-based cross-platform mobile framework." },
      { name: "Dart", description: "Language optimized for Flutter development." },
    ],
  },
  {
    category: "Forex & Trading",
    techs: [
      { name: "MQL4", description: "Language for MetaTrader 4 EAs and indicators." },
      { name: "MQL5", description: "Language for MetaTrader 5 EAs and indicators." },
      { name: "MetaTrader 4", description: "Industry-standard trading platform." },
      { name: "MetaTrader 5", description: "Advanced next-generation trading platform." },
    ],
  },
  {
    category: "Cloud & DevOps",
    techs: [
      { name: "AWS", description: "Amazon Web Services — world's leading cloud." },
      { name: "Google Cloud", description: "Google's cloud platform for AI and infrastructure." },
      { name: "Docker", description: "Containerization for consistent deployments." },
      { name: "Kubernetes", description: "Container orchestration at scale." },
      { name: "Vercel", description: "Deployment platform optimized for Next.js." },
    ],
  },
]

export default function TechnologiesPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-28 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-[16rem] w-[16rem] sm:h-[20rem] sm:w-[20rem] md:h-[24rem] md:w-[24rem] bg-primary/10 rounded-full blur-[80px] opacity-60" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
            Tech Stack
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Technologies</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We stay at the cutting edge of technology to build solutions that are modern, scalable, and future-proof.
          </p>
        </div>
      </section>

      {/* Marquee */}
      <TechnologiesSection />

      {/* Grid by Category */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-16">
            {TECH_CATEGORIES.map((cat) => (
              <div key={cat.category}>
                <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-border">{cat.category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {cat.techs.map((tech) => (
                    <div key={tech.name} className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors group">
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{tech.name}</h3>
                      <p className="text-sm text-muted-foreground">{tech.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary/5 border-y border-border">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to build with modern technology?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
            Let&apos;s discuss the right technology stack for your project.
          </p>
          <Button size="lg" asChild>
            <Link href="/contact">
              Get Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
