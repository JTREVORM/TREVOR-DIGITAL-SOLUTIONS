"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex-1 flex items-center justify-center py-24">
      <div className="text-center max-w-lg mx-auto px-4">
        <div className="text-8xl md:text-9xl font-extrabold text-destructive/20 mb-4 select-none">500</div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Something Went Wrong</h1>
        <p className="text-lg text-muted-foreground mb-8">
          We encountered an unexpected error. Please try again or contact us if the problem persists.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
