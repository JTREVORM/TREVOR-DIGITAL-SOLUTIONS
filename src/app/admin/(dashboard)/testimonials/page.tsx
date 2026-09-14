import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

export default function AdminTestimonialsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground">Manage client testimonials displayed on your website.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Testimonials</CardTitle>
          <CardDescription>
            You currently have no testimonials in the database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-lg bg-muted/20">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No testimonials added</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              Add positive feedback from your clients to build trust with new visitors.
            </p>
            <Button>Add New Testimonial</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
