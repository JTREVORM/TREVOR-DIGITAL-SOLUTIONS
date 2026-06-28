import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://trevordigitalsolutions.com"),
  title: {
    template: "%s | Trevor Digital Solutions",
    default: "Trevor Digital Solutions - Transforming Ideas Into Powerful Digital Solutions",
  },
  description: "Enterprise software, websites, mobile applications, automation systems, AI solutions, and Forex trading technologies in Uganda. Founded by Mwesigwa Trevor Joseph.",
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
  authors: [{ name: "Mwesigwa Trevor Joseph" }],
  openGraph: {
    type: "website",
    locale: "en_UG",
    url: "https://trevordigitalsolutions.com",
    title: "Trevor Digital Solutions",
    description: "Transforming Ideas Into Powerful Digital Solutions in Africa and beyond.",
    siteName: "Trevor Digital Solutions",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Trevor Digital Solutions",
        "operatingSystem": "Web",
        "applicationCategory": "BusinessApplication"
      },
      {
        "@type": "Organization",
        "name": "Trevor Digital Solutions",
        "url": "https://trevordigitalsolutions.com",
        "logo": "https://trevordigitalsolutions.com/logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+256-740-081-305",
          "contactType": "customer service",
          "areaServed": "UG",
          "availableLanguage": "English"
        }
      },
      {
        "@type": "Person",
        "name": "Mwesigwa Trevor Joseph",
        "url": "https://trevordigitalsolutions.com/founder",
        "jobTitle": "Founder & CEO",
        "worksFor": {
          "@type": "Organization",
          "name": "Trevor Digital Solutions"
        },
        "sameAs": [
          "https://linkedin.com/in/mwesigwa-trevor",
          "https://github.com"
        ]
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-background antialiased flex flex-col overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ScrollToTop />
          <Navbar />
          <main className="flex-1 flex flex-col pt-[88px]">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
