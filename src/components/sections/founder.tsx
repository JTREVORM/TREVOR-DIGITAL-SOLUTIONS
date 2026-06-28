"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Globe, Link as LinkIcon, Mail, Phone, Download } from "lucide-react"

export function FounderSection() {
  return (
    <section className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Meet Our Founder
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="h-1 w-20 bg-primary mx-auto rounded-full"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative mx-auto w-full max-w-md aspect-square rounded-3xl overflow-hidden border-4 border-border shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
            <Image
              src="/founder.png"
              alt="Mwesigwa Trevor Joseph"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-foreground mb-2">Mwesigwa Trevor Joseph</h3>
            <p className="text-xl text-primary font-medium mb-6">Founder & CEO</p>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Mwesigwa Trevor Joseph is a Software Engineer, Expert Advisor Developer, Technology Consultant, and Digital Entrepreneur.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              He founded Trevor Digital Solutions with the vision of helping businesses leverage technology through software engineering, automation, cloud solutions, and digital innovation.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Button asChild className="gap-2">
                <a href="https://wa.me/256740081305" target="_blank" rel="noopener noreferrer">
                  <Phone className="h-4 w-4" /> WhatsApp
                </a>
              </Button>
              <Button asChild variant="secondary" className="gap-2">
                <a href="mailto:trevordigitalsolutions@gmail.com">
                  <Mail className="h-4 w-4" /> Email
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <a href="tel:+256740081305">
                  <Phone className="h-4 w-4" /> Call
                </a>
              </Button>
              <Button asChild variant="ghost" className="gap-2">
                <a href="#" download>
                  <Download className="h-4 w-4" /> Download CV
                </a>
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-6 border-t border-border">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center">
                <LinkIcon className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center">
                <Globe className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
