"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const TESTIMONIALS = [
  {
    name: "Sarah Kyomugisha",
    role: "Operations Director",
    company: "Lakeside Logistics",
    content: "Trevor Digital Solutions completely transformed our supply chain with their custom ERP system. It's fast, reliable, and the support has been outstanding.",
    rating: 5,
  },
  {
    name: "David Otim",
    role: "CEO",
    company: "FinTech Africa",
    content: "The API integrations and custom dashboards they built for our trading platform are world-class. Highly recommended for any complex software needs.",
    rating: 5,
  },
  {
    name: "Dr. Grace N.",
    role: "Medical Director",
    company: "Kampala Medical Center",
    content: "Our hospital management system was outdated and slow. Trevor and his team developed a modern, secure solution that our staff loves using every day.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32 bg-secondary/10 relative" id="testimonials">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Client Testimonials
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="h-1 w-20 bg-primary mx-auto rounded-full mb-6"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-card border-border relative">
                <div className="absolute top-6 right-6 text-primary/20">
                  <Quote className="h-10 w-10" />
                </div>
                <CardContent className="p-8 pt-10">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-lg text-muted-foreground mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
