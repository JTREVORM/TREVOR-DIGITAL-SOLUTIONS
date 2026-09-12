import {
  Banknote,
  Building2,
  FileCode2,
  GraduationCap,
  HeartPulse,
  LineChart,
  MessageSquare,
  Radio,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react"

/**
 * Positioning content: what makes TDS different, how projects run, and the
 * industries it has built for. Shared by the homepage and the About page.
 */

export type Differentiator = {
  title: string
  description: string
  icon: LucideIcon
}

export const differentiators: Differentiator[] = [
  {
    title: "You talk to the engineer",
    description:
      "No account manager relaying messages. You work directly with the people writing your software, which means decisions happen in one conversation instead of three.",
    icon: MessageSquare,
  },
  {
    title: "You own everything we build",
    description:
      "Source code, repository history and deployment configuration are handed over on completion. No licence that expires, no vendor you cannot leave.",
    icon: FileCode2,
  },
  {
    title: "Built for real conditions",
    description:
      "Software that works on mobile data, tolerates a dropped connection and does not assume a fast machine. We design for the network your users actually have.",
    icon: Radio,
  },
  {
    title: "Scoped before it is started",
    description:
      "Discovery produces a written scope, a timeline and a price before development begins, so the budget conversation happens at the start rather than halfway through.",
    icon: ShieldCheck,
  },
  {
    title: "Maintained after launch",
    description:
      "Launch is a milestone, not an exit. We stay on for fixes, updates and the features that only become obvious once people are using the system.",
    icon: Wrench,
  },
  {
    title: "Engineered to grow",
    description:
      "Typed codebases, tested critical paths and documented architecture, so the system can be extended by us or by your own team later.",
    icon: LineChart,
  },
]

export type ProcessStep = {
  id: string
  title: string
  description: string
}

export const processSteps: ProcessStep[] = [
  {
    id: "01",
    title: "Discovery",
    description:
      "We sit with the people who will use the system, map the workflow as it actually runs and agree what success looks like in measurable terms.",
  },
  {
    id: "02",
    title: "Scope & plan",
    description:
      "You get a written scope, an architecture outline, a timeline and a fixed price before any code is written. Nothing starts on a handshake.",
  },
  {
    id: "03",
    title: "Build",
    description:
      "Development in short cycles with a working demo at the end of each one, so you can redirect the work while redirecting is still cheap.",
  },
  {
    id: "04",
    title: "Test & launch",
    description:
      "Automated tests on critical paths, structured acceptance testing with your team, then a supervised release with monitoring and a rollback path.",
  },
  {
    id: "05",
    title: "Support & improve",
    description:
      "Maintenance, training and new features after go-live, informed by how the system is genuinely being used.",
  },
]

export type Industry = {
  name: string
  description: string
  icon: LucideIcon
}

export const industries: Industry[] = [
  {
    name: "Logistics & supply chain",
    description: "Stock, warehousing, fulfilment and multi-location visibility.",
    icon: Truck,
  },
  {
    name: "Healthcare",
    description: "Patient records, scheduling, billing and clinical workflow.",
    icon: HeartPulse,
  },
  {
    name: "Education",
    description: "School management, enrolment, fees, results and reporting.",
    icon: GraduationCap,
  },
  {
    name: "Retail & distribution",
    description: "Point of sale, inventory, pricing and branch reporting.",
    icon: ShoppingCart,
  },
  {
    name: "Finance & trading",
    description: "Analytics platforms, trading automation and reporting tools.",
    icon: Banknote,
  },
  {
    name: "Professional services",
    description: "Client records, project tracking, invoicing and portals.",
    icon: Building2,
  },
]

/**
 * Company principles shown on the About page.
 */
export const coreValues = [
  {
    title: "Say what is true",
    description:
      "Honest timelines, honest limitations and honest test results, including the ones that are inconvenient for us. A client who is surprised late was misled early.",
  },
  {
    title: "Understand before building",
    description:
      "Most failed software solved a problem nobody had. We spend real time on discovery because the cheapest change is the one made before development starts.",
  },
  {
    title: "Engineer for the long run",
    description:
      "Typed, tested, documented code. Software is judged over years of maintenance, not on the day it is handed over.",
  },
  {
    title: "Finish the job",
    description:
      "Migration, training, monitoring and support are part of delivery, not extras. A system nobody was taught to use has not been delivered.",
  },
] as const
