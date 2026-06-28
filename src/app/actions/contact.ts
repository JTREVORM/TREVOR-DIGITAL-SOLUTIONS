"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const contactSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  companyName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  serviceRequired: z.string().optional(),
  budget: z.string().optional(),
  projectDescription: z.string().min(10, "Please provide more details about your project"),
})

export async function submitContactForm(data: z.infer<typeof contactSchema>) {
  try {
    const validatedData = contactSchema.parse(data)
    const supabase = await createClient()
    
    // Generate a reference number
    const refNumber = `TDS-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`

    const { error } = await supabase
      .from("contact_messages")
      .insert({
        reference_number: refNumber,
        full_name: validatedData.fullName,
        company_name: validatedData.companyName,
        email: validatedData.email,
        phone: validatedData.phone,
        service_required: validatedData.serviceRequired,
        budget: validatedData.budget,
        project_description: validatedData.projectDescription,
      })

    if (error) {
      console.error("Supabase Error:", error)
      return { success: false, error: "Failed to submit form. Please try again later." }
    }

    return { 
      success: true, 
      reference: refNumber,
      message: "Thank you for contacting us. We will get back to you shortly!" 
    }
  } catch (error) {
    return { success: false, error: "Invalid form data" }
  }
}
