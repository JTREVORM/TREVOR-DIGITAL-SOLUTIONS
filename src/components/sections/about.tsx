"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

export function AboutSection() {
  return (
    <section className="py-20 md:py-32 bg-secondary/30 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Empowering Businesses Through <span className="text-primary">Digital Transformation</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Trevor Digital Solutions is a modern software engineering company specializing in developing reliable, scalable, and secure digital solutions.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We build software that transforms businesses by improving efficiency, automating operations, and delivering exceptional user experiences. Our services cover everything from business management systems to enterprise applications, websites, mobile apps, cloud platforms, and custom software.
            </p>
            
            <ul className="space-y-4">
              {[
                "Reliable, Scalable, and Secure Digital Solutions",
                "Improving Efficiency & Automating Operations",
                "Exceptional User Experiences",
                "Enterprise Applications & Cloud Platforms"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                  <span className="text-foreground font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl transform rotate-3" />
            <div className="relative bg-card border border-border p-8 md:p-10 rounded-3xl shadow-2xl">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground mb-8">
                To empower businesses through innovative software development, automation, and digital transformation.
              </p>
              
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                To become one of Africa&apos;s leading software engineering and technology consulting companies.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
