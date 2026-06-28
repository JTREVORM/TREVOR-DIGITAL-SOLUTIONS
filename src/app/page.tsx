import type { Metadata } from "next"
import { HeroSection } from "@/components/sections/hero"
import { AboutSection } from "@/components/sections/about"
import { FounderSection } from "@/components/sections/founder"
import { ServicesSection } from "@/components/sections/services"
import { ProjectsSection } from "@/components/sections/projects"
import { TechnologiesSection } from "@/components/sections/technologies"
import { TestimonialsSection } from "@/components/sections/testimonials"
import { ContactSection } from "@/components/sections/contact"

export const metadata: Metadata = {
  title: "Trevor Digital Solutions — Enterprise Software Engineering Company",
  description: "Trevor Digital Solutions builds enterprise software, websites, mobile applications, automation systems, AI solutions, cloud software, and Forex trading technologies. Based in Kampala, Uganda.",
  keywords: [
    "Trevor Digital Solutions",
    "Trevor Digital Solutions Uganda",
    "Software Development Uganda",
    "Software Company Kampala",
    "Software Company Uganda",
    "Custom Software Uganda",
    "Website Development Uganda",
    "Web Developers Uganda",
    "Mobile App Development Uganda",
    "Business Management Systems Uganda",
    "Inventory Management System Uganda",
    "School Management System Uganda",
    "ERP Uganda",
    "CRM Uganda",
    "Forex Expert Advisor Developer",
    "MT4 Developer",
    "MT5 Developer",
    "Expert Advisor Development",
    "Algorithmic Trading Developer",
    "Digital Solutions Uganda",
  ],
  openGraph: {
    title: "Trevor Digital Solutions — Enterprise Software Engineering Company",
    description: "Building powerful software solutions for modern businesses. Enterprise software, websites, mobile apps, automation, AI, and Forex trading technologies.",
    url: "https://trevordigitalsolutions.com",
    siteName: "Trevor Digital Solutions",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Trevor Digital Solutions - Enterprise Software Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trevor Digital Solutions — Enterprise Software Engineering Company",
    description: "Building powerful software solutions for modern businesses. Enterprise software, websites, mobile apps, automation, AI, and Forex trading technologies.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://trevordigitalsolutions.com",
  },
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FounderSection />
      <ServicesSection />
      <ProjectsSection />
      <TechnologiesSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  )
}
