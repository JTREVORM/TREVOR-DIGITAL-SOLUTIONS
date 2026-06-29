import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, ArrowLeft, Phone } from "lucide-react"

type ServiceData = {
  slug: string
  title: string
  description: string
  longDescription: string
  features: string[]
  benefits: string[]
  technologies: string[]
  process: { step: number; title: string; description: string }[]
  faq: { question: string; answer: string }[]
}

const SERVICES_DATA: Record<string, ServiceData> = {
  "custom-software-development": {
    slug: "custom-software-development",
    title: "Custom Software Development",
    description: "Tailored enterprise solutions designed specifically for your business processes and requirements.",
    longDescription: "We build software that fits your business perfectly — not the other way around. Our custom software development service covers the entire lifecycle from requirements gathering and architecture design to development, testing, deployment, and long-term maintenance. Whether you need an internal tool, a customer-facing platform, or a complex enterprise system, we have the expertise to deliver.",
    features: ["Full-cycle development", "Requirements analysis & planning", "Custom architecture design", "Agile development methodology", "Comprehensive testing & QA", "Deployment & DevOps", "Ongoing maintenance & support", "Source code ownership"],
    benefits: ["Software built exactly for your workflow", "Scalable as your business grows", "Full IP ownership", "Lower long-term costs vs. SaaS", "Competitive advantage"],
    technologies: ["React", "Next.js", "Node.js", "Python", "Django", "PostgreSQL", "MySQL", "Docker", "AWS"],
    process: [
      { step: 1, title: "Discovery & Requirements", description: "We meet with your team to deeply understand your business, workflows, and requirements." },
      { step: 2, title: "Architecture & Planning", description: "Our engineers design the system architecture, select the right technologies, and create a project plan." },
      { step: 3, title: "Development", description: "We develop your software in agile sprints, delivering working software frequently for your feedback." },
      { step: 4, title: "Testing & QA", description: "Rigorous testing including unit tests, integration tests, and user acceptance testing." },
      { step: 5, title: "Deployment", description: "We deploy your application to your preferred environment with zero downtime." },
      { step: 6, title: "Support & Maintenance", description: "Ongoing support, updates, and feature enhancements to keep your software running optimally." },
    ],
    faq: [
      { question: "How long does custom software development take?", answer: "Timelines vary by complexity. A simple internal tool may take 4-8 weeks, while a complex enterprise system may take 3-6 months. We provide a detailed timeline during our discovery phase." },
      { question: "Do I own the source code?", answer: "Yes. Once the project is completed and payment is received, you own 100% of the source code and intellectual property." },
      { question: "Can you work with an existing codebase?", answer: "Absolutely. We can extend, refactor, or modernize existing software systems." },
    ],
  },
  "web-development": {
    slug: "web-development",
    title: "Web Applications",
    description: "Scalable, secure, and modern web applications built with cutting-edge technologies.",
    longDescription: "From simple business websites to complex web applications with thousands of users, we build web solutions that perform, scale, and convert. We use modern frameworks like Next.js and React to build fast, SEO-friendly, and visually stunning web applications.",
    features: ["Responsive design (mobile-first)", "SEO optimization", "Performance optimization", "CMS integration", "E-commerce functionality", "PWA support", "Analytics integration", "Accessibility (WCAG)"],
    benefits: ["Reach customers on any device", "Higher Google rankings", "Faster page load times", "Lower bounce rates", "More conversions"],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vercel"],
    process: [
      { step: 1, title: "Discovery & Strategy", description: "Understanding your goals, audience, and competitive landscape." },
      { step: 2, title: "Design & Prototyping", description: "Creating wireframes and interactive prototypes before a single line of code is written." },
      { step: 3, title: "Development", description: "Building your web application with clean, maintainable code." },
      { step: 4, title: "Testing & Optimization", description: "Performance testing, browser compatibility, and SEO optimization." },
      { step: 5, title: "Launch", description: "Deploying to production with domain setup, SSL, and monitoring." },
      { step: 6, title: "Growth", description: "Ongoing updates, content management, and feature additions." },
    ],
    faq: [
      { question: "What is the difference between a website and a web application?", answer: "A website is primarily informational (like a brochure site). A web application is interactive and allows users to perform tasks like submitting forms, managing data, or making purchases." },
      { question: "Will my website rank on Google?", answer: "We build every website with SEO best practices — proper meta tags, structured data, fast load times, and mobile optimization — giving you the best foundation for ranking." },
    ],
  },
  "mobile-app-development": {
    slug: "mobile-app-development",
    title: "Mobile Applications",
    description: "Native and cross-platform mobile apps for iOS and Android devices.",
    longDescription: "We build beautiful, performant mobile applications for iOS and Android. Using Flutter for cross-platform development, we can deliver apps that feel native on both platforms at a fraction of the cost of building two separate apps.",
    features: ["iOS & Android development", "Flutter cross-platform", "Offline-first architecture", "Push notifications", "Biometric authentication", "App Store & Play Store submission", "In-app purchases", "Analytics"],
    benefits: ["Single codebase for both platforms", "Faster time to market", "Lower development cost", "Native performance", "Easy maintenance"],
    technologies: ["Flutter", "Dart", "React Native", "Swift", "Kotlin", "Firebase", "Supabase"],
    process: [
      { step: 1, title: "Ideation & Research", description: "Defining app concept, target users, and core features." },
      { step: 2, title: "UI/UX Design", description: "Designing intuitive and beautiful mobile interfaces." },
      { step: 3, title: "Development", description: "Building the app with Flutter for cross-platform or native for platform-specific needs." },
      { step: 4, title: "Testing", description: "Testing on real devices across iOS and Android." },
      { step: 5, title: "App Store Submission", description: "Handling the complete submission process for App Store and Play Store." },
      { step: 6, title: "Post-Launch Support", description: "Updates, bug fixes, and new feature development." },
    ],
    faq: [
      { question: "Should I build a native app or a cross-platform app?", answer: "For most businesses, a cross-platform app built with Flutter offers the best balance of cost, quality, and time to market. We recommend native only for apps with very specific platform requirements." },
    ],
  },
  "erp-development": {
    slug: "erp-development",
    title: "Business Management Systems",
    description: "Comprehensive ERP, CRM, and Inventory systems to streamline your operations.",
    longDescription: "Stop managing your business with spreadsheets. We build custom business management systems — ERPs, CRMs, inventory management, and more — that automate your operations, eliminate human error, and give you real-time visibility into every aspect of your business.",
    features: ["Inventory & stock management", "Order management", "HR & payroll", "Customer relationship management", "Financial reporting", "Multi-user access control", "Audit trails", "Data export & reporting"],
    benefits: ["Eliminate manual data entry", "Real-time business visibility", "Reduce errors by 95%", "Improve team productivity", "Scale without growing headcount"],
    technologies: ["React", "Node.js", "PostgreSQL", "Docker", "Redis", "Supabase"],
    process: [
      { step: 1, title: "Business Process Mapping", description: "Documenting your current workflows, pain points, and desired outcomes." },
      { step: 2, title: "System Design", description: "Designing the database schema, user roles, and module structure." },
      { step: 3, title: "Development", description: "Building each module iteratively with regular demos." },
      { step: 4, title: "Data Migration", description: "Migrating your existing data from spreadsheets or legacy systems." },
      { step: 5, title: "Training", description: "Training your team to use the new system effectively." },
      { step: 6, title: "Go-Live & Support", description: "Supervised go-live with ongoing support." },
    ],
    faq: [
      { question: "Can you build a system for my specific industry?", answer: "Yes. We have experience building systems for healthcare, logistics, retail, hospitality, schools, and many other industries." },
    ],
  },
  "forex-expert-advisors": {
    slug: "forex-expert-advisors",
    title: "Forex Expert Advisors",
    description: "Automated trading algorithms, MT4/MT5 indicators, and trading dashboards.",
    longDescription: "We develop professional automated trading systems for MetaTrader 4 and MetaTrader 5 platforms. Our expert advisors (EAs) are built to your exact trading strategy specifications, rigorously backtested, and optimized for live trading performance.",
    features: ["MT4 & MT5 Expert Advisors", "Custom indicators (MQL4/MQL5)", "Strategy backtesting", "Risk management systems", "Multi-currency support", "VPS deployment", "Signal services", "Trading dashboards"],
    benefits: ["Trade 24/7 without monitoring", "Eliminate emotional trading", "Consistent strategy execution", "Detailed performance analytics", "Scalable to any account size"],
    technologies: ["MQL4", "MQL5", "MetaTrader 4", "MetaTrader 5", "Python", "C++"],
    process: [
      { step: 1, title: "Strategy Documentation", description: "Documenting your exact trading rules, entry/exit conditions, and risk parameters." },
      { step: 2, title: "Development", description: "Coding the EA in MQL4/MQL5 with clean, commented code." },
      { step: 3, title: "Backtesting", description: "Testing against historical data to validate performance." },
      { step: 4, title: "Optimization", description: "Fine-tuning parameters for optimal performance." },
      { step: 5, title: "Demo Testing", description: "Running on a demo account to verify live behavior." },
      { step: 6, title: "Live Deployment", description: "Deploying to your live account or VPS with monitoring." },
    ],
    faq: [
      { question: "Can you guarantee profitability?", answer: "No legitimate developer can guarantee profitability — past performance does not guarantee future results. We build EAs that faithfully execute your strategy and provide honest backtesting results." },
    ],
  },
  "ai-integrations": {
    slug: "ai-integrations",
    title: "AI & Automation",
    description: "Incorporate artificial intelligence to automate tasks and gain valuable insights.",
    longDescription: "AI is no longer a luxury — it's a competitive necessity. We help businesses integrate AI and automation into their existing workflows and build AI-powered products. From AI chatbots to predictive analytics and process automation, we make AI practical and accessible for your business.",
    features: ["AI chatbots & virtual assistants", "Process automation (RPA)", "Predictive analytics", "Natural language processing", "Document processing", "Image recognition", "Recommendation systems", "LLM integrations (OpenAI, Gemini)"],
    benefits: ["Automate repetitive tasks", "24/7 customer service", "Data-driven decisions", "Reduce operational costs", "Personalized customer experiences"],
    technologies: ["Python", "TensorFlow", "OpenAI API", "Google Gemini", "LangChain", "FastAPI", "PostgreSQL"],
    process: [
      { step: 1, title: "AI Opportunity Assessment", description: "Identifying the highest-impact AI opportunities in your business." },
      { step: 2, title: "Proof of Concept", description: "Building a small prototype to validate the AI solution." },
      { step: 3, title: "Full Development", description: "Building, training, and integrating the AI solution." },
      { step: 4, title: "Evaluation", description: "Measuring accuracy, performance, and business impact." },
      { step: 5, title: "Integration", description: "Integrating with your existing systems." },
      { step: 6, title: "Monitoring", description: "Ongoing monitoring and model retraining as needed." },
    ],
    faq: [
      { question: "Do I need a large dataset to use AI?", answer: "Not always. Many AI solutions like LLM integrations work out-of-the-box. For custom models, we assess your data and advise on the best approach." },
    ],
  },
  "cloud-solutions": {
    slug: "cloud-solutions",
    title: "Cloud Solutions",
    description: "Secure and scalable cloud infrastructure deployment and management.",
    longDescription: "Move to the cloud or optimize your existing cloud infrastructure. We help businesses migrate to AWS, Google Cloud, or Azure — setting up scalable, secure, and cost-efficient infrastructure that grows with your business.",
    features: ["Cloud migration", "Infrastructure as code (Terraform)", "Auto-scaling", "Load balancing", "Disaster recovery", "Security & compliance", "Cost optimization", "24/7 monitoring"],
    benefits: ["Pay only for what you use", "Auto-scale under load", "99.9%+ uptime", "Enterprise-grade security", "Global reach"],
    technologies: ["AWS", "Google Cloud", "Docker", "Kubernetes", "Terraform", "Nginx", "PostgreSQL"],
    process: [
      { step: 1, title: "Infrastructure Audit", description: "Assessing your current infrastructure and migration requirements." },
      { step: 2, title: "Architecture Design", description: "Designing a cloud architecture that meets your performance and cost goals." },
      { step: 3, title: "Migration", description: "Migrating your applications and data with zero downtime." },
      { step: 4, title: "Security Hardening", description: "Implementing security best practices and compliance controls." },
      { step: 5, title: "Optimization", description: "Right-sizing resources and optimizing costs." },
      { step: 6, title: "Monitoring & Support", description: "24/7 monitoring with alerting and incident response." },
    ],
    faq: [
      { question: "Which cloud provider do you recommend?", answer: "It depends on your needs. AWS has the widest service catalog; Google Cloud excels for AI/ML workloads; Azure integrates well with Microsoft products. We help you choose the right fit." },
    ],
  },
  "api-development": {
    slug: "api-development",
    title: "API Development",
    description: "Robust REST and GraphQL APIs for seamless system integrations.",
    longDescription: "APIs are the connective tissue of modern software. We build secure, well-documented, and high-performance APIs that allow your systems to communicate with each other and with third-party services.",
    features: ["REST API development", "GraphQL APIs", "Third-party integrations", "Authentication (JWT, OAuth)", "Rate limiting", "API documentation", "Versioning", "Webhooks"],
    benefits: ["Connect any system or service", "Enable mobile & web apps", "Scalable to millions of requests", "Secure with industry standards", "Complete documentation"],
    technologies: ["Node.js", "Python", "FastAPI", "Express.js", "GraphQL", "JWT", "Swagger"],
    process: [
      { step: 1, title: "API Design", description: "Designing the API contract, endpoints, and data models." },
      { step: 2, title: "Development", description: "Building the API with proper error handling and validation." },
      { step: 3, title: "Security", description: "Implementing authentication, authorization, and rate limiting." },
      { step: 4, title: "Testing", description: "Comprehensive API testing including load testing." },
      { step: 5, title: "Documentation", description: "Generating and publishing complete API documentation." },
      { step: 6, title: "Deployment", description: "Deploying with monitoring and alerting." },
    ],
    faq: [
      { question: "Should I use REST or GraphQL?", answer: "REST is simpler and widely supported — ideal for most use cases. GraphQL is better when clients need to query complex, nested data with flexibility. We advise based on your specific needs." },
    ],
  },
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = SERVICES_DATA[slug]
  if (!service) return { title: "Service Not Found" }
  return {
    title: service.title,
    description: service.description,
    openGraph: {
      title: `${service.title} | Trevor Digital Solutions`,
      description: service.description,
      url: `https://trevordigitalsolutions.com/services/${service.slug}`,
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(SERVICES_DATA).map((slug) => ({ slug }))
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = SERVICES_DATA[slug]
  if (!service) notFound()

  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-24 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-[16rem] w-[16rem] sm:h-[20rem] sm:w-[20rem] md:h-[24rem] md:w-[24rem] bg-primary/10 rounded-full blur-[80px] opacity-60" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground hover:text-foreground">
              <Link href="/services">
                <ArrowLeft className="h-4 w-4" /> All Services
              </Link>
            </Button>
          </div>
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              Service
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{service.title}</h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">{service.description}</p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">{service.longDescription}</p>

              {/* Features */}
              <h3 className="text-xl font-bold mb-4">What&apos;s Included</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Process */}
              <h3 className="text-xl font-bold mb-6">Our Process</h3>
              <div className="space-y-4 mb-8">
                {service.process.map((step) => (
                  <div key={step.step} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ */}
              <h3 className="text-xl font-bold mb-4">FAQ</h3>
              <div className="space-y-4">
                {service.faq.map((item) => (
                  <div key={item.question} className="p-5 rounded-xl border border-border bg-card">
                    <h4 className="font-semibold mb-2">{item.question}</h4>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Benefits */}
              <div className="p-6 rounded-2xl border border-border bg-card">
                <h3 className="font-bold text-lg mb-4">Business Benefits</h3>
                <ul className="space-y-3">
                  {service.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Tech Stack */}
              <div className="p-6 rounded-2xl border border-border bg-card">
                <h3 className="font-bold text-lg mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech) => (
                    <span key={tech} className="text-xs font-medium bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              {/* CTA */}
              <div className="p-6 rounded-2xl border border-primary/30 bg-primary/5">
                <h3 className="font-bold text-lg mb-2">Ready to get started?</h3>
                <p className="text-sm text-muted-foreground mb-4">Book a free consultation and let&apos;s discuss your project.</p>
                <Button className="w-full gap-2 mb-3" asChild>
                  <Link href="/contact">
                    Get Free Consultation <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full gap-2" asChild>
                  <a href="tel:+256740081305">
                    <Phone className="h-4 w-4" /> Call Us Now
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
