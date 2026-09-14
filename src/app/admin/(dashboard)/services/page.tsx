import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">Manage the services displayed on your website.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
          <CardDescription>
            You currently have no services in the database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-lg bg-muted/20">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No services added</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              Get started by adding your first service offering.
            </p>
            <Button>Add New Service</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
