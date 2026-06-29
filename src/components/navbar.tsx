"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Founder", href: "/founder" },
  { name: "Leadership", href: "/leadership" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Technologies", href: "/technologies" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

   return (
     <header
       className={cn(
         "fixed top-0 w-full z-50 transition-all duration-300",
         isScrolled
           ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
           : "bg-transparent"
       )}
     >
       {/* Top bar: logo corner, title centered, hamburger corner */}
       <div className="container mx-auto px-4 md:px-6">
         <div className="flex items-center justify-between">
           <Link href="/" className="flex items-center gap-2 min-w-0">
             <Image
               src="/logo.png"
               alt="Trevor Digital Solutions Logo"
               width={120}
               height={40}
               className="h-8 sm:h-10 w-auto object-contain shrink-0"
               priority
             />
           </Link>

           <h1 className="text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.2em] text-foreground text-center leading-tight">
             TREVOR DIGITAL SOLUTIONS
           </h1>

           <button
             className="lg:hidden p-2 text-foreground"
             onClick={() => setIsOpen(!isOpen)}
             aria-label="Toggle Menu"
           >
             {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
           </button>
         </div>
       </div>

       {/* Desktop Navigation */}
       <nav className="hidden lg:flex items-center justify-center gap-6">
         {NAV_LINKS.map((link) => (
           <Link
             key={link.name}
             href={link.href}
             className={cn(
               "text-sm font-medium transition-colors hover:text-primary",
               pathname === link.href ? "text-primary" : "text-muted-foreground"
             )}
           >
             {link.name}
           </Link>
         ))}
       </nav>

       <div className="hidden lg:flex items-center justify-center gap-4 mt-3">
         <Button variant="ghost" onClick={() => router.push("/contact")}>
           Get Free Consultation
         </Button>
         <Button onClick={() => router.push("/contact")}>
           Request Quote
         </Button>
       </div>

       {/* Mobile Navigation */}
       {isOpen && (
         <div className="lg:hidden absolute top-full left-0 w-full bg-background border-b border-border p-4 flex flex-col gap-4 shadow-lg">
           <nav className="flex flex-col gap-2">
             {NAV_LINKS.map((link) => (
               <Link
                 key={link.name}
                 href={link.href}
                 className={cn(
                   "p-2 text-base font-medium rounded-md transition-colors hover:bg-muted",
                   pathname === link.href ? "text-primary bg-primary/10" : "text-foreground"
                 )}
                 onClick={() => setIsOpen(false)}
               >
                 {link.name}
               </Link>
             ))}
           </nav>
           <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
             <Button variant="outline" className="w-full justify-center" onClick={() => { router.push("/contact"); setIsOpen(false); }}>
               Get Free Consultation
             </Button>
             <Button className="w-full justify-center" onClick={() => { router.push("/contact"); setIsOpen(false); }}>
               Request Quote
             </Button>
           </div>
         </div>
       )}
     </header>
   )
}
