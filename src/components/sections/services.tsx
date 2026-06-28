"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Monitor, Code, Smartphone, Database, BarChart3, Cloud, Server, BrainCircuit, ArrowRight } from "lucide-react"

const SERVICES = [
  {
    slug: "custom-software-development",
    title: "Custom Software Development",
    description: "Tailored enterprise solutions designed specifically for your business processes and requirements.",
    icon: Code,
  },
  {
    slug: "web-development",
    title: "Web Applications",
    description: "Scalable, secure, and modern web applications built with cutting-edge technologies.",
    icon: Monitor,
  },
  {
    slug: "mobile-app-development",
    title: "Mobile Applications",
    description: "Native and cross-platform mobile apps for iOS and Android devices.",
    icon: Smartphone,
  },
  {
    slug: "erp-development",
    title: "Business Management Systems",
    description: "Comprehensive ERP, CRM, and Inventory systems to streamline your operations.",
    icon: Database,
  },
  {
    slug: "forex-expert-advisors",
    title: "Forex Expert Advisors",
    description: "Automated trading algorithms, MT4/MT5 indicators, and trading dashboards.",
    icon: BarChart3,
  },
  {
    slug: "ai-integrations",
    title: "AI Integrations",
    description: "Incorporate artificial intelligence to automate tasks and gain valuable insights.",
    icon: BrainCircuit,
  },
  {
    slug: "cloud-solutions",
    title: "Cloud Solutions",
    description: "Secure and scalable cloud infrastructure deployment and management.",
    icon: Cloud,
  },
  {
    slug: "api-development",
    title: "API Development",
    description: "Robust REST and GraphQL APIs for seamless system integrations.",
    icon: Server,
  },
]

export function ServicesSection() {
  return (
    <section className="py-20 md:py-32 bg-background relative" id="services">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Our Services
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="h-1 w-20 bg-primary mx-auto rounded-full mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            We offer a comprehensive suite of software engineering services to help your business thrive in the digital age.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="h-full flex flex-col bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <CardDescription className="text-base mb-6 flex-1">
                    {service.description}
                  </CardDescription>
                  <Button variant="ghost" className="w-full justify-between group/btn mt-auto" asChild>
                    <Link href={`/services/${service.slug}`}>
                      Learn More
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
