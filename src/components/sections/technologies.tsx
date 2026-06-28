"use client"

import { motion } from "framer-motion"

const TECHNOLOGIES = [
  "React", "Next.js", "TypeScript", "Tailwind CSS",
  "Node.js", "Python", "Django", "PostgreSQL",
  "MongoDB", "Supabase", "Flutter", "React Native",
  "MetaTrader 4", "MetaTrader 5", "MQL4", "MQL5",
  "AWS", "Google Cloud", "Docker", "Kubernetes"
]

export function TechnologiesSection() {
  return (
    <section className="py-20 bg-background border-y border-border/50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-muted-foreground uppercase tracking-widest">
          Powered By Modern Technologies
        </h2>
      </div>
      
      {/* Auto-scrolling marquee effect */}
      <div className="relative w-full flex overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-background to-transparent" />
        
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30,
          }}
        >
          <div className="flex gap-8 md:gap-16 px-4 md:px-8 items-center">
            {TECHNOLOGIES.map((tech, i) => (
              <span key={i} className="text-xl md:text-3xl font-extrabold text-foreground/20 hover:text-primary transition-colors cursor-default">
                {tech}
              </span>
            ))}
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex gap-8 md:gap-16 px-4 md:px-8 items-center">
            {TECHNOLOGIES.map((tech, i) => (
              <span key={`dup-${i}`} className="text-xl md:text-3xl font-extrabold text-foreground/20 hover:text-primary transition-colors cursor-default">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
