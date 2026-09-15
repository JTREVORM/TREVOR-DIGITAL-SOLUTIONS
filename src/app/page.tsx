import type { Metadata } from "next"
import { HeroSection } from "@/components/sections/hero"
import { ServicesSection } from "@/components/sections/services"
import { WhyTdsSection } from "@/components/sections/why-tds"
import { ProjectsSection } from "@/components/sections/projects"
import { TechnologiesSection } from "@/components/sections/technologies"
import { ProcessSection } from "@/components/sections/process"
import { IndustriesSection } from "@/components/sections/industries"
import { CtaBand } from "@/components/site/cta-band"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "Trevor Digital Solutions — Software Engineering Company in Uganda",
  description:
    "We build custom software, business management systems, websites, mobile apps, AI solutions and trading technology. Software engineering from Kampala, Uganda.",
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
    title: "Trevor Digital Solutions — Software Engineering Company in Uganda",
    description:
      "We build the software behind better businesses: custom software, business management systems, websites, mobile applications, AI solutions and trading technologies.",
    url: "https://trevordigitalsolutions.com",
    siteName: "Trevor Digital Solutions",
    type: "website",
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: "Trevor Digital Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trevor Digital Solutions — Software Engineering Company in Uganda",
    description:
      "We build the software behind better businesses: custom software, business management systems, websites, mobile applications, AI solutions and trading technologies.",
    images: [site.ogImage],
  },
  alternates: {
    canonical: "https://trevordigitalsolutions.com",
  },
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <WhyTdsSection />
      <ProjectsSection />
      <TechnologiesSection />
      <ProcessSection />
      <IndustriesSection />
      <CtaBand />
    </>
  )
}
