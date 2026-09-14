"use server"

import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured, missingSupabaseEnvVars } from "@/lib/supabase/config"
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
  // Without Supabase there is nowhere to store the enquiry. Say so and point
  // at the phone and email routes rather than failing opaquely.
  if (!isSupabaseConfigured) {
    console.error(
      "Contact form submitted but Supabase is not configured. Missing:",
      missingSupabaseEnvVars().join(", ")
    )
    return {
      success: false,
      error:
        "Our enquiry form is temporarily unavailable. Please email trevordigitalsolutions@gmail.com or call +256 740 081 305 and we will respond the same way.",
    }
  }

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
    // A Zod failure is the user's input; anything else is ours, and
    // reporting it as "invalid form data" would send them hunting for a
    // mistake they did not make.
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message ?? "Please check the form and try again.",
      }
    }

    console.error("Contact form error:", error)
    return {
      success: false,
      error: "Something went wrong on our side. Please try again, or email us directly.",
    }
  }
}
