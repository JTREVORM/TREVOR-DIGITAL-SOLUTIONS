import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Trevor Digital Solutions — how we collect, use, and protect your personal information.",
}

export default function PrivacyPolicyPage() {
  const lastUpdated = "June 28, 2025"
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">1. Introduction</h2>
            <p>
              Trevor Digital Solutions (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong>trevordigitalsolutions.com</strong> or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Personal Information:</strong> Name, email address, phone number, company name when you submit our contact form.</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, browser type, IP address (via analytics tools).</li>
              <li><strong>Communication Data:</strong> Content of messages you send us through our contact form or email.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Respond to your inquiries and provide requested services.</li>
              <li>Send you project proposals, quotes, and relevant communication.</li>
              <li>Improve our website and services.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">4. Data Storage and Security</h2>
            <p>
              Your data is stored securely using Supabase, a platform with enterprise-grade security. We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">5. Third-Party Services</h2>
            <p>We may use third-party services including:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Supabase</strong> — for database storage</li>
              <li><strong>Vercel</strong> — for website hosting</li>
              <li><strong>Google Analytics</strong> — for usage analytics</li>
            </ul>
            <p className="mt-3">These services have their own privacy policies which govern their handling of your data.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data.</li>
              <li>Withdraw consent at any time.</li>
            </ul>
            <p className="mt-3">To exercise these rights, contact us at <a href="mailto:trevordigitalsolutions@gmail.com" className="text-primary hover:underline">trevordigitalsolutions@gmail.com</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">7. Cookies</h2>
            <p>
              Our website may use cookies to enhance your browsing experience. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">8. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us:</p>
            <div className="mt-3 p-4 rounded-lg bg-card border border-border">
              <p><strong>Trevor Digital Solutions</strong></p>
              <p>Kampala, Uganda</p>
              <p>Email: <a href="mailto:trevordigitalsolutions@gmail.com" className="text-primary hover:underline">trevordigitalsolutions@gmail.com</a></p>
              <p>Phone: <a href="tel:+256740081305" className="text-primary hover:underline">+256 740 081 305</a></p>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}
