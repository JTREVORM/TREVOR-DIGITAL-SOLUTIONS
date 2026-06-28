import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: messages } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
        <p className="text-muted-foreground mt-2">
          View inquiries from the website contact form.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {messages && messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="p-4 border border-border rounded-lg bg-muted/20">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{msg.full_name}</h4>
                      <p className="text-sm text-muted-foreground">{msg.email} | {msg.phone || 'No phone'}</p>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Ref: {msg.reference_number}
                    </span>
                  </div>
                  <div className="mt-4 text-sm">
                    <p className="font-medium text-foreground mb-1">Service: {msg.service_required || 'Not specified'}</p>
                    <p className="font-medium text-foreground mb-1">Budget: {msg.budget || 'Not specified'}</p>
                    <p className="mt-2 p-3 bg-background border border-border rounded-md text-muted-foreground">
                      {msg.project_description}
                    </p>
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground text-right">
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No messages found. Messages will appear here when submitted.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
