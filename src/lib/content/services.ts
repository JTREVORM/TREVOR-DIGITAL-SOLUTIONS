import {
  BarChart3,
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  Monitor,
  Server,
  Smartphone,
  type LucideIcon,
} from "lucide-react"

/**
 * The service catalogue. Slugs are route segments under /services/[slug] and
 * must not change. Everything the homepage grid, the services index and the
 * service detail pages render comes from this one list.
 */

export type ServiceStep = {
  title: string
  description: string
}

export type ServiceFaq = {
  question: string
  answer: string
}

export type Service = {
  slug: string
  title: string
  /** One line for cards and grids. */
  summary: string
  /** Two or three sentences for the detail page. */
  overview: string
  icon: LucideIcon
  /** Short labels used on the services index cards. */
  highlights: string[]
  features: string[]
  outcomes: string[]
  technologies: string[]
  process: ServiceStep[]
  faq: ServiceFaq[]
}

export const services: Service[] = [
  {
    slug: "custom-software-development",
    title: "Custom Software Development",
    summary:
      "Systems built around the way your business already works, instead of forcing your team to work around someone else's software.",
    overview:
      "Off-the-shelf software asks you to change your process to match its assumptions. We do the opposite: we map how your business actually runs, then engineer a system around it. We handle the full lifecycle, from requirements and architecture through development, testing, deployment and long-term maintenance, whether that means an internal tool, a customer-facing platform or a system that ties several departments together.",
    icon: Code2,
    highlights: [
      "Requirements and process mapping",
      "Architecture and technical planning",
      "Iterative delivery in short cycles",
      "Testing, QA and handover",
    ],
    features: [
      "Full-cycle development",
      "Requirements analysis and planning",
      "Custom architecture design",
      "Agile delivery in two-week cycles",
      "Automated and manual testing",
      "Deployment and DevOps setup",
      "Ongoing maintenance and support",
      "Full source code ownership",
    ],
    outcomes: [
      "Software shaped to your workflow, not a vendor's template",
      "Room to grow without re-platforming",
      "Complete ownership of the code and the data",
      "No per-seat licence that grows with your headcount",
    ],
    technologies: [
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "Django",
      "PostgreSQL",
      "Docker",
      "AWS",
    ],
    process: [
      {
        title: "Discovery and requirements",
        description:
          "We sit with the people who will use the system and document the workflows, the exceptions and the reporting they actually need.",
      },
      {
        title: "Architecture and planning",
        description:
          "We design the data model and system architecture, choose the stack and agree a delivery plan with dates you can hold us to.",
      },
      {
        title: "Development",
        description:
          "We build in short cycles and put working software in front of you throughout, so course corrections are cheap.",
      },
      {
        title: "Testing and QA",
        description:
          "Automated tests on the critical paths, plus structured acceptance testing with your team before anything goes live.",
      },
      {
        title: "Deployment",
        description:
          "We release to your environment with monitoring, backups and a rollback path in place from day one.",
      },
      {
        title: "Support and improvement",
        description:
          "Maintenance, fixes and new features after launch, because the first release is never the last one.",
      },
    ],
    faq: [
      {
        question: "How long does custom software take to build?",
        answer:
          "It depends on scope. A focused internal tool is typically four to eight weeks; a system spanning several departments runs three to six months. You get a written scope and timeline after discovery, before any development starts.",
      },
      {
        question: "Do I own the source code?",
        answer:
          "Yes. On final payment you receive the full source code, the repository history and the deployment configuration. There is no lock-in.",
      },
      {
        question: "Can you work on software we already have?",
        answer:
          "Yes. We regularly extend, repair and modernise existing systems, including ones built by another team. We start with a short audit so you know what you are dealing with before committing to work.",
      },
    ],
  },
  {
    slug: "web-development",
    title: "Web Applications & Websites",
    summary:
      "Fast, secure web platforms and company websites engineered for search visibility and for the connections your customers actually have.",
    overview:
      "We build everything from a company website that has to rank and convert, to web applications carrying thousands of users and real transactional load. We work primarily in Next.js and React, which gives you server-rendered pages search engines can read, load times that hold up on mobile data, and a codebase your team can keep building on.",
    icon: Monitor,
    highlights: [
      "Mobile-first responsive build",
      "Technical SEO and structured data",
      "Performance and Core Web Vitals",
      "Content management where you need it",
    ],
    features: [
      "Mobile-first responsive design",
      "Technical SEO and structured data",
      "Performance and Core Web Vitals tuning",
      "Content management integration",
      "E-commerce and payment flows",
      "Progressive web app support",
      "Analytics and conversion tracking",
      "Accessibility to WCAG guidelines",
    ],
    outcomes: [
      "Pages that load quickly on mobile networks",
      "A site search engines can crawl and rank",
      "Content your team can update without a developer",
      "A front end that stays fast as the site grows",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "PostgreSQL",
      "Vercel",
    ],
    process: [
      {
        title: "Discovery and strategy",
        description:
          "We establish who the site is for, what it has to achieve, and how it should compare with the alternatives your customers are looking at.",
      },
      {
        title: "Structure and design",
        description:
          "Sitemap, page structure and interface design, reviewed and signed off before development begins.",
      },
      {
        title: "Development",
        description:
          "Clean, typed, component-based code your team or ours can extend later without unpicking it.",
      },
      {
        title: "Testing and optimisation",
        description:
          "Cross-browser and cross-device checks, performance budgets and an SEO pass on every page.",
      },
      {
        title: "Launch",
        description:
          "Domain, SSL, analytics, sitemap submission and monitoring, handled as one deployment.",
      },
      {
        title: "Growth",
        description:
          "Ongoing content updates, new sections and iteration based on what the analytics actually show.",
      },
    ],
    faq: [
      {
        question: "What is the difference between a website and a web application?",
        answer:
          "A website mainly presents information: pages, services, contact details. A web application does work, such as managing records, processing orders or handling logins and payments. Many projects need both, and we build them as one system.",
      },
      {
        question: "Will the site rank on Google?",
        answer:
          "We build every site on the technical foundations ranking depends on: server-rendered markup, correct metadata, structured data, fast mobile load times and a clean URL structure. Rankings also depend on content and competition, which is why we advise on both rather than promising a position.",
      },
    ],
  },
  {
    slug: "mobile-app-development",
    title: "Mobile Applications",
    summary:
      "Android and iOS apps from a single codebase, built to stay usable when the network drops.",
    overview:
      "We build mobile applications with Flutter, which gives you Android and iOS from one codebase and one maintenance stream rather than two separate builds. Where an app needs to work in the field, we design offline-first: it holds data locally, keeps working without signal and reconciles when the connection comes back.",
    icon: Smartphone,
    highlights: [
      "One codebase, both platforms",
      "Offline-first data handling",
      "Store submission handled",
      "Push notifications and updates",
    ],
    features: [
      "Android and iOS from one codebase",
      "Offline-first architecture",
      "Push notifications",
      "Biometric and PIN authentication",
      "Play Store and App Store submission",
      "In-app purchases and subscriptions",
      "Crash reporting and analytics",
      "Native modules where needed",
    ],
    outcomes: [
      "One codebase to maintain instead of two",
      "An app that still works on a weak connection",
      "Faster release cycles after launch",
      "Lower total cost than two native builds",
    ],
    technologies: [
      "Flutter",
      "Dart",
      "React Native",
      "Swift",
      "Kotlin",
      "Firebase",
      "Supabase",
    ],
    process: [
      {
        title: "Concept and scope",
        description:
          "Defining who the app is for, what it must do on day one, and what can wait for version two.",
      },
      {
        title: "Interface design",
        description:
          "Designing screens and flows for thumbs and small screens, reviewed before any code is written.",
      },
      {
        title: "Development",
        description:
          "Building in Flutter for both platforms, or native where a platform capability genuinely requires it.",
      },
      {
        title: "Device testing",
        description:
          "Testing on real Android and iOS hardware, including low-end devices and poor network conditions.",
      },
      {
        title: "Store submission",
        description:
          "Listings, screenshots, privacy declarations and the full review process on both stores.",
      },
      {
        title: "Post-launch support",
        description:
          "Updates for new OS versions, bug fixes and new features as usage tells you what matters.",
      },
    ],
    faq: [
      {
        question: "Should I build native or cross-platform?",
        answer:
          "For most businesses, Flutter is the better trade-off: one codebase, near-native performance and a single maintenance stream. We recommend native when an app leans heavily on platform-specific hardware or APIs, and we will say so rather than sell you the easier build.",
      },
    ],
  },
  {
    slug: "erp-development",
    title: "Business Management Systems",
    summary:
      "ERP, CRM, inventory, POS and school systems that replace the spreadsheets and paper files your business has outgrown.",
    overview:
      "Most businesses reach a point where spreadsheets and paper start costing more than they save: numbers disagree, stock goes missing and nobody can answer a simple question about last month. We build the management systems that replace them, covering stock, sales, purchasing, customers, staff and reporting, with roles and audit trails so you know who changed what.",
    icon: Database,
    highlights: [
      "Stock, sales and purchasing",
      "Role-based access and audit trails",
      "Migration off spreadsheets",
      "Reporting management can act on",
    ],
    features: [
      "Inventory and stock control",
      "Sales, orders and invoicing",
      "Purchasing and supplier records",
      "Customer relationship management",
      "HR and payroll",
      "Role-based access control",
      "Audit trails on every record",
      "Financial and operational reporting",
    ],
    outcomes: [
      "One set of numbers everyone works from",
      "Manual re-entry between systems removed",
      "A record of who changed what, and when",
      "Reporting available without a month-end scramble",
    ],
    technologies: [
      "React",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "Redis",
      "Supabase",
    ],
    process: [
      {
        title: "Process mapping",
        description:
          "We document how the work is done now, including the workarounds, because those are usually where the real requirements hide.",
      },
      {
        title: "System design",
        description:
          "Data model, user roles and module structure, agreed with you before development starts.",
      },
      {
        title: "Development",
        description:
          "Module by module, with a working demo at the end of each cycle so nothing is a surprise at the end.",
      },
      {
        title: "Data migration",
        description:
          "Moving your existing records out of spreadsheets or a legacy system, cleaned and reconciled against your own totals.",
      },
      {
        title: "Training",
        description:
          "Hands-on sessions with the people who will use it daily, plus written guides for new staff.",
      },
      {
        title: "Go-live and support",
        description:
          "A supervised switchover with us on call, then ongoing support as real usage surfaces the next round of needs.",
      },
    ],
    faq: [
      {
        question: "Can you build a system for my industry?",
        answer:
          "The underlying building blocks, stock, orders, customers, staff, roles and reporting, are common across industries. What changes is the vocabulary and the rules, and that is what the discovery phase is for.",
      },
      {
        question: "What happens to the data we already have?",
        answer:
          "It gets migrated. We import from spreadsheets or an existing database, clean what needs cleaning and reconcile the result against your own figures before go-live.",
      },
    ],
  },
  {
    slug: "forex-expert-advisors",
    title: "Forex & Trading Technologies",
    summary:
      "MetaTrader 4 and MetaTrader 5 expert advisors, custom indicators and trading dashboards, built to your strategy specification.",
    overview:
      "We develop automated trading systems for MetaTrader 4 and MetaTrader 5: expert advisors coded to your exact entry, exit and risk rules, custom indicators, and dashboards for monitoring accounts and positions. Every EA is backtested against historical data and demo-tested before it touches a live account, and you get the honest results, favourable or not.",
    icon: BarChart3,
    highlights: [
      "MT4 and MT5 expert advisors",
      "Custom MQL4 / MQL5 indicators",
      "Backtesting and optimisation",
      "VPS deployment and monitoring",
    ],
    features: [
      "MT4 and MT5 expert advisors",
      "Custom indicators in MQL4 and MQL5",
      "Strategy backtesting and reporting",
      "Risk and money management modules",
      "Multi-symbol and multi-account support",
      "VPS deployment",
      "Trading dashboards and reporting",
      "Commented, maintainable source code",
    ],
    outcomes: [
      "Your strategy executed the same way every time",
      "Rules followed without hesitation or second-guessing",
      "Backtest and demo evidence before live capital",
      "Position and performance visibility in one place",
    ],
    technologies: [
      "MQL4",
      "MQL5",
      "MetaTrader 4",
      "MetaTrader 5",
      "Python",
      "C++",
    ],
    process: [
      {
        title: "Strategy documentation",
        description:
          "We write your rules down precisely: entries, exits, filters, position sizing and risk limits. Ambiguity here is what breaks EAs later.",
      },
      {
        title: "Development",
        description:
          "Clean, commented MQL4 or MQL5 you or another developer can still read in a year.",
      },
      {
        title: "Backtesting",
        description:
          "Testing against historical data across different market conditions, with the full report handed to you.",
      },
      {
        title: "Optimisation",
        description:
          "Parameter tuning, with attention to the difference between a robust setting and one fitted to the past.",
      },
      {
        title: "Demo testing",
        description:
          "Running live-market conditions on a demo account to confirm real execution matches the backtest.",
      },
      {
        title: "Live deployment",
        description:
          "Deployment to your account or VPS, with monitoring and a documented set of parameters.",
      },
    ],
    faq: [
      {
        question: "Can you guarantee the EA will be profitable?",
        answer:
          "No, and no honest developer will. Past performance does not predict future results. What we guarantee is that the EA executes your documented strategy correctly and that you receive genuine backtesting and demo results, including the unflattering ones.",
      },
      {
        question: "Do I get the source code?",
        answer:
          "Yes. You receive the commented MQL source alongside the compiled EA, so you are never dependent on us to make a change.",
      },
    ],
  },
  {
    slug: "ai-integrations",
    title: "AI & Automation",
    summary:
      "Practical AI: document processing, support assistants and automation that takes manual data entry off your team.",
    overview:
      "AI is useful when it removes specific work, and mostly noise otherwise. We start from the tasks that eat your team's time, such as reading invoices, answering the same customer questions, sorting records or summarising documents, and build the narrowest thing that solves them. Sometimes that is a language model integration; sometimes it is a well-designed automation and no model at all.",
    icon: BrainCircuit,
    highlights: [
      "Document and invoice processing",
      "Support and internal assistants",
      "Workflow automation",
      "Model integration and evaluation",
    ],
    features: [
      "Support and internal assistants",
      "Document and invoice extraction",
      "Workflow and process automation",
      "Natural language search over your own data",
      "Classification and routing",
      "Predictive and trend analysis",
      "Large language model integration",
      "Evaluation and monitoring of accuracy",
    ],
    outcomes: [
      "Repetitive data entry removed from the workload",
      "Common questions answered without a queue",
      "Records handled consistently, at any volume",
      "A measured accuracy figure, not a guess",
    ],
    technologies: [
      "Python",
      "FastAPI",
      "Claude API",
      "OpenAI API",
      "Google Gemini",
      "LangChain",
      "PostgreSQL",
    ],
    process: [
      {
        title: "Opportunity assessment",
        description:
          "We look at where time actually goes and identify the tasks where automation pays for itself fastest.",
      },
      {
        title: "Proof of concept",
        description:
          "A small working prototype on your real data, so the decision to continue is based on evidence.",
      },
      {
        title: "Development",
        description:
          "Building the solution properly, with the prompts, retrieval and fallbacks that production use requires.",
      },
      {
        title: "Evaluation",
        description:
          "Measuring accuracy against a labelled set, so you know the error rate before it reaches customers.",
      },
      {
        title: "Integration",
        description:
          "Wiring it into the systems your team already uses, rather than adding another window to check.",
      },
      {
        title: "Monitoring",
        description:
          "Ongoing quality monitoring, with review and adjustment as your data and usage change.",
      },
    ],
    faq: [
      {
        question: "Do we need a large dataset to use AI?",
        answer:
          "Usually not. Many useful applications run on current language models and need no training data at all, only your documents and clear instructions. Custom models need data, and we will tell you plainly if that is the case.",
      },
      {
        question: "Where does our data go?",
        answer:
          "That is a design decision we make with you. We can keep processing inside your own infrastructure, or use a hosted model under terms you have reviewed. Either way you know what leaves your systems before we build it.",
      },
    ],
  },
  {
    slug: "cloud-solutions",
    title: "Cloud & Infrastructure",
    summary:
      "Deployment pipelines, monitoring and cloud infrastructure that make releases boring and outages short.",
    overview:
      "Software that works on a developer's machine is only half the job. We set up the infrastructure around it: deployment pipelines that release without drama, monitoring that tells you about a problem before your customers do, backups that have actually been restored, and access controls that survive an audit. We work across AWS, Google Cloud and Azure, and we right-size for your real traffic rather than a hypothetical.",
    icon: Cloud,
    highlights: [
      "Deployment pipelines",
      "Monitoring and alerting",
      "Backups and recovery",
      "Cost right-sizing",
    ],
    features: [
      "Cloud migration and setup",
      "Infrastructure as code",
      "Continuous deployment pipelines",
      "Autoscaling and load balancing",
      "Backup and disaster recovery",
      "Security hardening and access control",
      "Cost review and right-sizing",
      "Monitoring, logging and alerting",
    ],
    outcomes: [
      "Releases that are routine rather than risky",
      "Alerts that reach you before customers do",
      "A recovery path that has been tested",
      "Infrastructure costs matched to real usage",
    ],
    technologies: [
      "AWS",
      "Google Cloud",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Nginx",
      "PostgreSQL",
    ],
    process: [
      {
        title: "Infrastructure audit",
        description:
          "What you run today, what it costs, where it is fragile and what would happen if the main server disappeared.",
      },
      {
        title: "Architecture design",
        description:
          "A design that meets your availability and performance needs at a cost you have agreed to.",
      },
      {
        title: "Migration",
        description:
          "Moving applications and data with a rehearsed cutover and a rollback plan, scheduled around your business hours.",
      },
      {
        title: "Security hardening",
        description:
          "Least-privilege access, secret management, encryption in transit and at rest, and patching that happens.",
      },
      {
        title: "Optimisation",
        description:
          "Right-sizing instances and storage once real usage data exists, which is usually where the savings are.",
      },
      {
        title: "Monitoring and support",
        description:
          "Dashboards, alert thresholds and a documented incident response, so problems have an owner.",
      },
    ],
    faq: [
      {
        question: "Which cloud provider should we use?",
        answer:
          "It depends on the workload. AWS has the widest service catalogue, Google Cloud is strong for data and machine learning, and Azure fits organisations already committed to Microsoft. We recommend based on your requirements and your team's existing skills, not on a partnership.",
      },
      {
        question: "Can you work with our existing setup?",
        answer:
          "Yes. A full migration is often unnecessary. We frequently improve what is already running: add monitoring, fix backups, automate deployment and reduce the bill.",
      },
    ],
  },
  {
    slug: "api-development",
    title: "APIs & System Integration",
    summary:
      "REST and GraphQL APIs that connect your systems to payments, messaging and the third-party platforms you depend on.",
    overview:
      "Most business problems that look like software problems are really integration problems: the accounting system does not talk to the shop, payments are reconciled by hand, two departments keep the same list twice. We build the APIs and integrations that connect those systems, with authentication, validation, rate limiting and documentation that makes the next developer's job straightforward.",
    icon: Server,
    highlights: [
      "REST and GraphQL APIs",
      "Payment and messaging integration",
      "Authentication and rate limiting",
      "Documentation and versioning",
    ],
    features: [
      "REST API design and development",
      "GraphQL APIs",
      "Third-party and legacy integration",
      "Payment gateway and mobile money integration",
      "SMS and messaging gateways",
      "Authentication with JWT and OAuth",
      "Rate limiting and abuse protection",
      "Versioning, webhooks and documentation",
    ],
    outcomes: [
      "Systems that exchange data without manual re-entry",
      "One API serving your web and mobile clients",
      "Documented endpoints any developer can pick up",
      "Failures that are logged and retried, not silent",
    ],
    technologies: [
      "Node.js",
      "Python",
      "FastAPI",
      "Express",
      "GraphQL",
      "PostgreSQL",
      "OpenAPI",
    ],
    process: [
      {
        title: "API design",
        description:
          "Endpoints, payloads and error contracts agreed up front, so clients can be built in parallel with the server.",
      },
      {
        title: "Development",
        description:
          "Implementation with validation, structured errors and logging built in rather than added later.",
      },
      {
        title: "Security",
        description:
          "Authentication, authorisation, rate limiting and input hardening on every endpoint.",
      },
      {
        title: "Testing",
        description:
          "Contract and integration tests, plus load testing at the volumes you expect to reach.",
      },
      {
        title: "Documentation",
        description:
          "Published, accurate reference documentation generated from the implementation, not from memory.",
      },
      {
        title: "Deployment",
        description:
          "Release with monitoring, alerting and a versioning strategy that will not break existing clients.",
      },
    ],
    faq: [
      {
        question: "Should we use REST or GraphQL?",
        answer:
          "REST is simpler to build, cache and debug, and it is the right default for most systems. GraphQL earns its complexity when clients need to fetch varied, deeply nested data and you cannot predict their queries. We recommend based on the clients you actually have.",
      },
      {
        question: "Can you integrate with a system that has no API?",
        answer:
          "Often, yes. Depending on the system we can work against its database, scheduled file exchanges or a scraping layer built to be resilient. We will be clear about which approach applies and how fragile it is likely to be.",
      },
    ],
  },
]

export const serviceBySlug = new Map(services.map((service) => [service.slug, service]))

/** The four services surfaced in the footer. */
export const footerServiceSlugs = [
  "custom-software-development",
  "web-development",
  "mobile-app-development",
  "erp-development",
] as const
