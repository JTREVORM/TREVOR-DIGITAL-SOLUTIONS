import { LayoutGrid } from "lucide-react"

/** Icon for the "All" filter, which has no category behind it. */
export function AllIcon({ className }: { className?: string }) {
  return <LayoutGrid className={className} aria-hidden />
}
