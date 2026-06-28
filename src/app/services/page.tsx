"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Monitor, Code, Smartphone, Database, BarChart3, Cloud, Server, BrainCircuit, ArrowRight, CheckCircle2 } from "lucide-react"

const SERVICES = [
  {
    slug: "custom-software-development",
    title: "Custom Software Development",
    description: "Tailored enterprise solutions designed specifically for your business processes and requirements.",
    icon: Code,
    features: ["Requirements analysis", "Architecture design", "Agile development", "Testing & QA"],
  },
  {
    slug: "web-development",
    title: "Web Applications",
    description: "Scalable, secure, and modern web applications built with cutting-edge technologies.",
    icon: Monitor,
    features: ["Responsive design", "SEO optimization", "Performance tuning", "CMS integration"],
  },
  {
    slug: "mobile-app-development",
    title: "Mobile Applications",
    description: "Native and cross-platform mobile apps for iOS and Android devices.",
    icon: Smartphone,
    features: ["iOS & Android", "Cross-platform (Flutter)", "App Store submission", "Offline support"],
  },
  {
    slug: "erp-development",
    title: "Business Management Systems",
    description: "Comprehensive ERP, CRM, and Inventory systems to streamline your operations.",
    icon: Database,
    features: ["Inventory management", "Order management", "HR & payroll", "Financial reporting"],
  },
  {
    slug: "forex-expert-advisors",
    title: "Forex Expert Advisors",
    description: "Automated trading algorithms, MT4/MT5 indicators, and trading dashboards.",
    icon: BarChart3,
    features: ["MT4/MT5 EAs", "Custom indicators", "Backtesting", "Risk management"],
  },
  {
    slug: "ai-integrations",
    title: "AI & Automation",
    description: "Incorporate artificial intelligence to automate tasks and gain valuable insights.",
    icon: BrainCircuit,
    features: ["AI chatbots", "Process automation", "Data analysis", "Machine learning"],
  },
  {
    slug: "cloud-solutions",
    title: "Cloud Solutions",
    description: "Secure and scalable cloud infrastructure deployment and management.",
    icon: Cloud,
    features: ["Cloud migration", "Auto-scaling", "Disaster recovery", "Security & compliance"],
  },
  {
    slug: "api-development",
    title: "API Development",
    description: "Robust REST and GraphQL APIs for seamless system integrations.",
    icon: Server,
    features: ["REST APIs", "GraphQL", "Third-party integrations", "Documentation"],
  },
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-28 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-[30rem] w-[30rem] bg-primary/10 rounded-full blur-[80px] opacity-60" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
            What We Do
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Our Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We offer a comprehensive suite of software engineering services to help your business thrive in the digital age.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full bg-card border-border hover:border-primary/50 transition-all group overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <service.icon className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-1">{service.title}</CardTitle>
                        <CardDescription className="text-base">{service.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="group/btn gap-2" asChild>
                      <Link href={`/services/${service.slug}`}>
                        Learn More <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
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
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Not sure which service you need?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Book a free consultation and let our team recommend the perfect solution for your business.
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
