import {
  BrainCircuit,
  Building2,
  Cpu,
  LineChart,
  Newspaper,
  type LucideIcon,
} from "lucide-react"
import type { CategoryIconName } from "@/lib/content/insights-types"

/**
 * Resolves a category's icon name to a component.
 *
 * Categories carry a string rather than a component so the same object can be
 * stored in a database and passed from a server component to a client one.
 * This registry is the single place those names are mapped.
 */
const REGISTRY: Record<CategoryIconName, LucideIcon> = {
  newspaper: Newspaper,
  cpu: Cpu,
  "line-chart": LineChart,
  brain: BrainCircuit,
  building: Building2,
}

export function CategoryIcon({
  name,
  className,
}: {
  name: CategoryIconName
  className?: string
}) {
  const Icon = REGISTRY[name] ?? Newspaper
  return <Icon className={className} aria-hidden />
}
