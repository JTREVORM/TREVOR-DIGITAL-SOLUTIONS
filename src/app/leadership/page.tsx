import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Target, Lightbulb, Shield, Handshake } from "lucide-react"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Company Leadership | Trevor Digital Solutions",
  description: "Learn about the leadership team at Trevor Digital Solutions. Led by Mwesigwa Trevor Joseph, our leadership drives innovation, excellence, and client success in software engineering.",
  keywords: [
    "Trevor Digital Solutions leadership",
    "Mwesigwa Trevor Joseph CEO",
    "software company leadership Uganda",
    "technology leadership Kampala",
    "company leadership Uganda",
    "software engineering leadership",
  ],
  openGraph: {
    title: "Company Leadership | Trevor Digital Solutions",
    description: "Led by Mwesigwa Trevor Joseph, our leadership team drives innovation and excellence in software engineering across Uganda and Africa.",
    url: "https://trevordigitalsolutions.com/leadership",
    siteName: "Trevor Digital Solutions",
    type: "website",
    images: [
      {
        url: "/founder.png",
        width: 1200,
        height: 630,
        alt: "Leadership at Trevor Digital Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Company Leadership | Trevor Digital Solutions",
    description: "Led by Mwesigwa Trevor Joseph, our leadership team drives innovation and excellence in software engineering across Uganda and Africa.",
    images: ["/founder.png"],
  },
  alternates: {
    canonical: "https://trevordigitalsolutions.com/leadership",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Trevor Digital Solutions",
  url: "https://trevordigitalsolutions.com",
  logo: "https://trevordigitalsolutions.com/logo.png",
  founder: {
    "@type": "Person",
    name: "Mwesigwa Trevor Joseph",
    jobTitle: "Founder & CEO",
    url: "https://trevordigitalsolutions.com/founder",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kampala",
    addressCountry: "UG",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+256-740-081-305",
    contactType: "customer service",
    areaServed: "UG",
    availableLanguage: "English",
  },
  sameAs: [
    "https://linkedin.com/in/mwesigwa-trevor",
    "https://github.com",
    "https://wa.me/256740081305",
  ],
}

const LEADERSHIP_VALUES = [
  {
    icon: Target,
    title: "Vision-Driven Leadership",
    description:
      "Our leadership sets a clear direction for the company — focusing on long-term innovation, sustainable growth, and delivering measurable impact for our clients.",
  },
  {
    icon: Users,
    title: "Client-Centric Culture",
    description:
      "Every decision starts with the client. We build teams and processes that prioritize understanding client needs and delivering exceptional outcomes.",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description:
      "We encourage continuous learning and experimentation. Our leaders stay ahead of technology trends to keep the company competitive and future-ready.",
  },
  {
    icon: Shield,
    title: "Integrity & Excellence",
    description:
      "We uphold the highest standards of quality, transparency, and ethical business practices in every project and client relationship.",
  },
  {
    icon: Handshake,
    title: "Collaborative Environment",
    description:
      "Great software is built by great teams. We foster a collaborative culture where engineers, designers, and consultants work together seamlessly.",
  },
]

const LEADERSHIP_TEAM = [
  {
    name: "Mwesigwa Trevor Joseph",
    role: "Founder & CEO",
    focus: "Overall strategy, technology vision, and client partnerships",
    bio: "Software Engineer, Expert Advisor Developer, and Technology Consultant with 5+ years of experience building enterprise software solutions. Leads the company's technical direction and Forex trading systems division.",
  },
]

export default function LeadershipPage() {
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
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
            Our Leadership
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Company Leadership
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            At Trevor Digital Solutions, strong leadership is the foundation of everything we build. 
            Our leadership team combines deep technical expertise with business acumen to deliver 
            world-class software solutions.
          </p>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 text-center">
            Meet Our Leadership
          </h2>
          <div className="max-w-4xl mx-auto">
            {LEADERSHIP_TEAM.map((leader) => (
              <div
                key={leader.name}
                className="p-8 md:p-10 rounded-3xl border border-border bg-card shadow-lg"
              >
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  <div className="relative mx-auto md:mx-0 w-48 h-48 rounded-2xl overflow-hidden border-4 border-border shadow-xl shrink-0">
                    <Image
                      src="/founder.png"
                      alt={leader.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-1">{leader.name}</h3>
                    <p className="text-primary font-semibold text-lg mb-4">{leader.role}</p>
                    <p className="text-sm text-muted-foreground mb-4">{leader.focus}</p>
                    <p className="text-muted-foreground leading-relaxed">{leader.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Values */}
      <section className="py-20 bg-secondary/10">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 text-center">
            What Drives Our Leadership
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {LEADERSHIP_VALUES.map((value) => (
              <div
                key={value.title}
                className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-center">
              Building a Culture of Excellence
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Trevor Digital Solutions was founded on the principle that great software comes from great leadership. 
                Under the guidance of <strong className="text-foreground">Mwesigwa Trevor Joseph</strong>, 
                the company has cultivated a culture where technical excellence, client satisfaction, and continuous 
                innovation are non-negotiable.
              </p>
              <p>
                Our leadership believes in empowering every team member to take ownership, think critically, and 
                deliver solutions that exceed expectations. This philosophy has enabled us to build lasting 
                partnerships with 40+ clients and deliver 50+ successful projects across multiple industries.
              </p>
              <p>
                From enterprise ERP systems and hospital management platforms to automated Forex trading systems 
                and mobile applications, our leadership ensures that every engagement is managed with the same 
                level of dedication, transparency, and technical rigor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary/5 border-y border-border">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to Partner With Us?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience leadership that delivers. Let&apos;s discuss your project and how Trevor Digital Solutions 
            can help you achieve your business goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">
                Get Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/founder">About the Founder</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
