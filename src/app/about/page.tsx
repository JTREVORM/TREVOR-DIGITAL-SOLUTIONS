import type { Metadata } from "next"
import { AboutSection } from "@/components/sections/about"
import { FounderSection } from "@/components/sections/founder"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, Users, Lightbulb, Target, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us — Trevor Digital Solutions",
  description: "Learn about Trevor Digital Solutions — a modern software engineering company based in Kampala, Uganda, founded by Mwesigwa Trevor Joseph. Discover our mission, vision, core values, and leadership.",
  keywords: [
    "About Trevor Digital Solutions",
    "Trevor Digital Solutions Uganda",
    "Software Company Kampala",
    "Software Company Uganda",
    "Mwesigwa Trevor Joseph",
    "Trevor Joseph founder",
    "software company about us",
  ],
  openGraph: {
    title: "About Trevor Digital Solutions",
    description: "Modern software engineering company transforming businesses through digital innovation. Founded by Mwesigwa Trevor Joseph in Kampala, Uganda.",
    url: "https://trevordigitalsolutions.com/about",
  },
}

const CORE_VALUES = [
  { icon: Target, title: "Excellence", description: "We deliver nothing short of the best. Every line of code, every design decision, every client interaction meets the highest standards." },
  { icon: Users, title: "Client-Centric", description: "Our clients' success is our success. We listen, understand, and build solutions that truly solve their problems." },
  { icon: Lightbulb, title: "Innovation", description: "We stay ahead of technology trends to bring you solutions that keep you competitive in the digital age." },
  { icon: CheckCircle2, title: "Reliability", description: "When we commit to a deadline or a feature, we deliver. No excuses, no shortcuts." },
]

const COMPANY_STATS = [
  { value: "50+", label: "Projects Delivered" },
  { value: "40+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "24/7", label: "Support Available" },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="py-20 md:py-28 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-[30rem] w-[30rem] bg-primary/10 rounded-full blur-[80px] opacity-60" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
            About Us
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Who We Are
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Trevor Digital Solutions is a modern software engineering company based in Kampala, Uganda — building powerful digital solutions for businesses worldwide.
          </p>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-12 pt-10 border-t border-border/50">
            {COMPANY_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Core Values */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Our Core Values</h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_VALUES.map((value) => (
              <div key={value.title} className="p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <FounderSection />

      {/* Founder Page Link */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Get to Know Our Founder
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
            Learn more about Mwesigwa Trevor Joseph — Software Engineer, Forex Expert Advisor Developer, 
            and the vision behind Trevor Digital Solutions.
          </p>
          <Button size="lg" asChild>
            <Link href="/founder">
              Meet the Founder <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary/5 border-y border-border">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Ready to work with us?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Let&apos;s discuss how we can build the software solution that will transform your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">
                Get Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">View Our Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
