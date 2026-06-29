import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code2, TrendingUp, GraduationCap, Briefcase } from "lucide-react"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Mwesigwa Trevor Joseph — Founder & CEO | Trevor Digital Solutions",
  description: "Meet Mwesigwa Trevor Joseph, Founder & CEO of Trevor Digital Solutions. Software Engineer, Forex Expert Advisor Developer, and Technology Consultant based in Kampala, Uganda.",
  keywords: [
    "Mwesigwa Trevor Joseph",
    "Mwesigwa Trevor",
    "Trevor Joseph",
    "Founder of Trevor Digital Solutions",
    "Software Engineer Uganda",
    "Software Engineer Kampala",
    "Forex Developer Uganda",
    "EA Developer Uganda",
    "MT4 Developer Uganda",
    "MT5 Developer Uganda",
    "Expert Advisor Developer",
    "Algorithmic Trading Developer",
    "Forex Expert Advisor Developer",
    "MQL4 Developer",
    "MQL5 Developer",
    "Technology Consultant Uganda",
    "Digital Entrepreneur Uganda",
    "CEO Trevor Digital Solutions",
  ],
  openGraph: {
    title: "Mwesigwa Trevor Joseph — Founder & CEO | Trevor Digital Solutions",
    description: "Software Engineer, Forex Expert Advisor Developer, and Technology Consultant. Founder of Trevor Digital Solutions in Kampala, Uganda.",
    url: "https://trevordigitalsolutions.com/founder",
    siteName: "Trevor Digital Solutions",
    type: "website",
    images: [
      {
        url: "/founder.png",
        width: 1200,
        height: 630,
        alt: "Mwesigwa Trevor Joseph - Founder & CEO of Trevor Digital Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mwesigwa Trevor Joseph — Founder & CEO | Trevor Digital Solutions",
    description: "Software Engineer, Forex Expert Advisor Developer, and Technology Consultant. Founder of Trevor Digital Solutions in Kampala, Uganda.",
    images: ["/founder.png"],
  },
  alternates: {
    canonical: "https://trevordigitalsolutions.com/founder",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mwesigwa Trevor Joseph",
  givenName: "Mwesigwa",
  familyName: "Trevor Joseph",
  jobTitle: "Founder & CEO",
  worksFor: {
    "@type": "Organization",
    name: "Trevor Digital Solutions",
    url: "https://trevordigitalsolutions.com",
  },
  url: "https://trevordigitalsolutions.com/founder",
  image: "https://trevordigitalsolutions.com/founder.png",
  description:
    "Mwesigwa Trevor Joseph is a Software Engineer, Expert Advisor Developer, Technology Consultant, and Digital Entrepreneur. Founder of Trevor Digital Solutions based in Kampala, Uganda.",
  sameAs: [
    "https://linkedin.com/in/mwesigwa-trevor",
    "https://github.com",
    "https://wa.me/256740081305",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kampala",
    addressCountry: "UG",
  },
  knowsAbout: [
    "Software Engineering",
    "Custom Software Development",
    "Web Development",
    "Mobile App Development",
    "Forex Expert Advisor Development",
    "MQL4",
    "MQL5",
    "Algorithmic Trading",
    "MetaTrader 4",
    "MetaTrader 5",
    "ERP Development",
    "Business Management Systems",
    "Cloud Solutions",
    "AI Integration",
    "Technology Consulting",
  ],
}

const ACHIEVEMENTS = [
  {
    icon: Briefcase,
    title: "Founded Trevor Digital Solutions",
    description: "Established a leading software engineering company in Kampala, Uganda, delivering enterprise solutions to clients across Africa and beyond.",
  },
  {
    icon: TrendingUp,
    title: "Forex & Trading Systems Expert",
    description: "Developed professional Expert Advisors (EAs) for MetaTrader 4 and 5, custom indicators, and automated trading systems for traders worldwide.",
  },
  {
    icon: Code2,
    title: "50+ Enterprise Projects Delivered",
    description: "Led the design and delivery of over 50 enterprise software solutions including ERPs, hospital management systems, analytics dashboards, and trading platforms.",
  },
  {
    icon: GraduationCap,
    title: "Continuous Innovation",
    description: "Committed to staying at the forefront of technology trends — from AI and cloud infrastructure to cross-platform mobile development and algorithmic trading.",
  },
]

const SKILLS = [
  { category: "Software Development", items: ["Next.js", "React", "TypeScript", "Node.js", "Python", "Flutter", "PostgreSQL"] },
  { category: "Forex & Trading", items: ["MQL4", "MQL5", "MetaTrader 4", "MetaTrader 5", "Algorithmic Trading", "Backtesting"] },
  { category: "Enterprise Systems", items: ["ERP Development", "CRM Systems", "Inventory Management", "Business Intelligence"] },
  { category: "Cloud & DevOps", items: ["AWS", "Google Cloud", "Docker", "Kubernetes", "CI/CD", "Terraform"] },
]

export default function FounderPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="py-20 md:py-28 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-[16rem] w-[16rem] sm:h-[20rem] sm:w-[20rem] md:h-[24rem] md:w-[24rem] bg-primary/10 rounded-full blur-[80px] opacity-60" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                About the Founder
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                Meet Mwesigwa Trevor Joseph
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                Founder & CEO of Trevor Digital Solutions
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Software Engineer, Expert Advisor Developer, Technology Consultant, and Digital Entrepreneur based in Kampala, Uganda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
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
            <div className="relative mx-auto w-full max-w-md aspect-square rounded-3xl overflow-hidden border-4 border-border shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
              <Image
                src="/founder.png"
                alt="Mwesigwa Trevor Joseph"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Biography */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-center">
              The Journey of a Software Engineer & Entrepreneur
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Mwesigwa Trevor Joseph is a seasoned <strong className="text-foreground">Software Engineer</strong>, 
                <strong className="text-foreground"> Expert Advisor Developer</strong>, 
                <strong className="text-foreground"> Technology Consultant</strong>, and 
                <strong className="text-foreground"> Digital Entrepreneur</strong> based in Kampala, Uganda. 
                With a passion for building powerful, scalable software solutions, he has dedicated his career to helping 
                businesses leverage technology for growth and transformation.
              </p>
              <p>
                His expertise spans the full software development lifecycle — from architecting enterprise-grade backend 
                systems and designing intuitive frontend interfaces to deploying robust cloud infrastructure. He has 
                successfully delivered over <strong className="text-foreground">50 enterprise projects</strong> for clients 
                across finance, healthcare, logistics, and trading sectors.
              </p>
              <p>
                In the Forex and trading technology space, Mwesigwa Trevor Joseph is recognized as a leading 
                <strong className="text-foreground"> Expert Advisor (EA) Developer</strong> in Uganda. He specializes in 
                building automated trading systems for MetaTrader 4 (MT4) and MetaTrader 5 (MT5), including custom EAs, 
                indicators, and algorithmic trading strategies using MQL4 and MQL5. His trading systems are designed with 
                rigorous backtesting, risk management protocols, and real-time market data integration.
              </p>
              <p>
                He founded <strong className="text-foreground">Trevor Digital Solutions</strong> with the vision of 
                empowering businesses through innovative software engineering, automation, cloud solutions, and digital 
                innovation. Under his leadership, the company has grown to serve 40+ clients across Africa and beyond, 
                delivering custom software, web applications, mobile apps, ERP systems, hospital management software, 
                and Forex trading technologies.
              </p>
              <p>
                As a <strong className="text-foreground">Technology Consultant</strong>, Mwesigwa Trevor Joseph advises 
                organizations on digital transformation strategies, cloud migration, system architecture, and emerging 
                technologies such as AI and automation. His client-centric approach and commitment to excellence have 
                made him a trusted partner for businesses seeking reliable, future-proof software solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-secondary/10">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 text-center">
            Key Achievements & Expertise
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {ACHIEVEMENTS.map((item) => (
              <div key={item.title} className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 text-center">
            Technical Skills & Specializations
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {SKILLS.map((skillGroup) => (
              <div key={skillGroup.category} className="p-6 rounded-2xl border border-border bg-card">
                <h3 className="text-xl font-bold mb-4 text-primary">{skillGroup.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill) => (
                    <span
                      key={skill}
                      className="text-sm font-medium bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 bg-primary/5 border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
              Leadership Philosophy
            </h2>
            <blockquote className="text-2xl md:text-3xl font-medium text-foreground mb-8 leading-relaxed">
              &ldquo;Technology should solve real problems. I build software that transforms businesses, 
              automates the mundane, and empowers people to achieve more than they thought possible.&rdquo;
            </blockquote>
            <p className="text-lg text-muted-foreground">
              — Mwesigwa Trevor Joseph
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Want to work with Trevor Digital Solutions?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you need custom software, a Forex trading system, or a complete digital transformation — 
            let&apos;s discuss how we can help your business grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">
                Start a Project <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">About Our Company</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
