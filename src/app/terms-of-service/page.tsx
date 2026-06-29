import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Trevor Digital Solutions — the legal agreement governing use of our services.",
}

export default function TermsOfServicePage() {
  const lastUpdated = "June 28, 2025"
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing our website or engaging our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">2. Services</h2>
            <p>
              Trevor Digital Solutions provides software development, web development, mobile app development, ERP/CRM systems, Forex Expert Advisors, AI integrations, cloud solutions, and API development services. The specific scope of any engagement is defined in a separate project agreement or proposal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">3. Payment Terms</h2>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>A deposit (typically 50%) is required before project commencement.</li>
              <li>Remaining balance is due upon project completion or as specified in the project agreement.</li>
              <li>Payments are non-refundable once work has commenced unless otherwise agreed.</li>
              <li>Late payments may incur additional fees.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">4. Intellectual Property</h2>
            <p>
              Upon receipt of full payment, the client receives full ownership of the custom code and design created specifically for their project. Trevor Digital Solutions retains rights to any pre-existing frameworks, libraries, or tools used in the development.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">5. Project Revisions</h2>
            <p>
              Each project includes a defined number of revision rounds as specified in the project proposal. Additional revisions beyond the agreed scope may be subject to additional fees.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">6. Confidentiality</h2>
            <p>
              We treat all client information as strictly confidential. We will not share your business information, project details, or data with third parties without your explicit consent, except as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">7. Disclaimer of Warranties</h2>
            <p>
              Our services are provided &quot;as is.&quot; While we strive for excellence, we do not warrant that our software will be error-free or uninterrupted. We will promptly address any bugs reported during the warranty period specified in the project agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Trevor Digital Solutions shall not be liable for indirect, incidental, or consequential damages arising from the use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">9. Governing Law</h2>
            <p>
              These terms shall be governed by the laws of Uganda. Any disputes shall be resolved through amicable negotiation or, if necessary, through the competent courts of Uganda.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">10. Contact</h2>
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
