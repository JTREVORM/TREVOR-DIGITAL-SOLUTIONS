import type { Metadata } from "next"
import { ProjectsClient } from "./ProjectsClient"

export const metadata: Metadata = {
  title: "Projects — Trevor Digital Solutions",
  description: "Explore our portfolio of enterprise software solutions, web applications, ERP systems, hospital management software, and Forex trading tools delivered for clients across Africa and beyond.",
  keywords: [
    "Trevor Digital Solutions projects",
    "software projects Uganda",
    "ERP projects Uganda",
    "hospital management system Uganda",
    "Forex trading dashboard Uganda",
    "enterprise software portfolio",
  ],
  openGraph: {
    title: "Our Projects | Trevor Digital Solutions",
    description: "Explore our portfolio of enterprise software solutions, web applications, ERP systems, and trading tools.",
    url: "https://trevordigitalsolutions.com/projects",
  },
  alternates: {
    canonical: "https://trevordigitalsolutions.com/projects",
  },
}

export default function ProjectsPage() {
  return <ProjectsClient />
}
