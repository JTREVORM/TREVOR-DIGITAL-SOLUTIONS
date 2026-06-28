"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { submitContactForm } from "@/app/actions/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { MapPin, Phone, Mail, Send } from "lucide-react"

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function clientAction(formData: FormData) {
    setIsSubmitting(true)
    
    const data = {
      fullName: formData.get("fullName") as string,
      companyName: formData.get("companyName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      serviceRequired: formData.get("serviceRequired") as string,
      budget: formData.get("budget") as string,
      projectDescription: formData.get("projectDescription") as string,
    }
    
    try {
      const result = await submitContactForm(data)
      if (result.success) {
        toast.success("Message Sent!", {
          description: `Your inquiry has been received. Reference: ${result.reference}`,
        })
        const formElement = document.getElementById("contactForm") as HTMLFormElement;
        if (formElement) formElement.reset()
      } else {
        toast.error("Error", {
          description: result.error || "Failed to send message.",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-20 md:py-32 bg-background relative" id="contact">
      <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full w-[40rem] h-[40rem] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Get In Touch
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="h-1 w-20 bg-primary mx-auto rounded-full mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            Ready to transform your business? Contact us today for a free consultation and let's discuss how we can help you achieve your goals.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border p-8 rounded-2xl shadow-lg"
            >
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href="tel:+256740081305" className="text-muted-foreground hover:text-primary transition-colors">
                      +256 740 081 305
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:trevordigitalsolutions@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                      trevordigitalsolutions@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">Kampala, Uganda</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <h4 className="font-medium mb-4">Connect Directly</h4>
                <Button className="w-full mb-3" asChild>
                  <a href="https://wa.me/256740081305" target="_blank" rel="noopener noreferrer">
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border p-8 md:p-10 rounded-2xl shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
              <form id="contactForm" action={clientAction} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name (Optional)</Label>
                    <Input id="companyName" name="companyName" placeholder="Your Company" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input id="phone" name="phone" placeholder="+256..." />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="serviceRequired">Service Required</Label>
                    <Input id="serviceRequired" name="serviceRequired" placeholder="e.g. Website Development" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Estimated Budget (Optional)</Label>
                    <Input id="budget" name="budget" placeholder="$500 - $1,000" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Project Description</Label>
                  <Textarea 
                    id="projectDescription" 
                    name="projectDescription"
                    placeholder="Tell us about your project requirements..." 
                    className="min-h-[150px] resize-none"
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full md:w-auto px-8" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Submit Message"}
                  {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
