import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-24">
      <div className="text-center max-w-lg mx-auto px-4">
        <div className="text-8xl md:text-9xl font-extrabold text-primary/20 mb-4 select-none">404</div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Page Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">
              <ArrowLeft className="mr-2 h-4 w-4" /> Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
