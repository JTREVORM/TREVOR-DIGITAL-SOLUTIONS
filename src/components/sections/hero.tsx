"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code2, Users, Building2, Clock } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 md:pt-32 pb-16 md:pb-24">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[40rem] w-[40rem] bg-primary/20 rounded-full blur-[100px] opacity-50" />
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
          Enterprise-Grade Software Engineering
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-4xl text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl leading-tight break-words mb-6 text-foreground"
        >
          Building Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Software Solutions</span> for Modern Businesses
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-2xl md:max-w-3xl text-base sm:text-lg md:text-xl text-muted-foreground mb-10"
        >
          Trevor Digital Solutions builds enterprise software, websites, mobile applications, automation systems, AI-powered solutions, cloud software, and trading technologies for businesses worldwide.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <Button size="lg" className="h-12 px-8 text-base group" asChild>
            <Link href="/projects">
              View Our Projects
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm" asChild>
            <Link href="/contact">Get Free Consultation</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-8 border-t border-border/50 w-full max-w-4xl"
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 bg-primary/10 rounded-2xl mb-2">
              <Code2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-foreground">50+</h3>
            <p className="text-sm font-medium text-muted-foreground">Projects Completed</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 bg-primary/10 rounded-2xl mb-2">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-foreground">40+</h3>
            <p className="text-sm font-medium text-muted-foreground">Happy Clients</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 bg-primary/10 rounded-2xl mb-2">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-foreground">100+</h3>
            <p className="text-sm font-medium text-muted-foreground">Solutions Delivered</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 bg-primary/10 rounded-2xl mb-2">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-foreground">24/7</h3>
            <p className="text-sm font-medium text-muted-foreground">Support</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
