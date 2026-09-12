import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono, Sora } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { contact, site } from "@/lib/site"

/**
 * Type system:
 *   Sora          — headings and the brand lockup. Geometric and squared,
 *                   which sits naturally with the logo's letterforms.
 *   Inter         — body copy and interface text.
 *   JetBrains Mono — eyebrows, technology chips and numeric labels.
 * All three are variable fonts, loaded as CSS variables and self-hosted by
 * next/font, so there is no layout shift and no request to Google at runtime.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    template: `%s | ${site.name}`,
    default: "Trevor Digital Solutions — Transforming Ideas Into Powerful Digital Solutions",
  },
  description:
    "Trevor Digital Solutions builds custom software, business management systems, websites, mobile applications, AI solutions and trading technologies from Kampala, Uganda.",
  applicationName: site.name,
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
    "Mwesigwa Trevor Joseph",
  ],
  authors: [{ name: site.founder }],
  creator: site.founder,
  publisher: site.name,
  openGraph: {
    type: "website",
    locale: "en_UG",
    url: site.url,
    title: site.name,
    description: "Transforming ideas into powerful digital solutions.",
    siteName: site.name,
    images: [{ url: "/logo.png", width: 1536, height: 1024, alt: site.name }],
  },
}

export const viewport: Viewport = {
  themeColor: "#070d18",
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        alternateName: "TDS",
        url: site.url,
        logo: `${site.url}/logo.png`,
        description:
          "Software engineering company building custom software, business management systems, websites, mobile applications, AI solutions and trading technologies.",
        slogan: site.tagline,
        founder: { "@id": `${site.url}/#founder` },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kampala",
          addressCountry: "UG",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+256-740-081-305",
          email: contact.email,
          contactType: "customer service",
          areaServed: "UG",
          availableLanguage: "English",
        },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${site.url}/#service`,
        name: site.name,
        url: site.url,
        image: `${site.url}/logo.png`,
        parentOrganization: { "@id": `${site.url}/#organization` },
        areaServed: "UG",
        telephone: "+256-740-081-305",
      },
      {
        "@type": "Person",
        "@id": `${site.url}/#founder`,
        name: site.founder,
        url: `${site.url}/founder`,
        jobTitle: site.founderRole,
        worksFor: { "@id": `${site.url}/#organization` },
        sameAs: [contact.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        publisher: { "@id": `${site.url}/#organization` },
      },
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable} flex min-h-screen flex-col bg-background font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ScrollToTop />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main" className="flex flex-1 flex-col pt-16 sm:pt-[4.5rem]">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
