"use server"

import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured, missingSupabaseEnvVars } from "@/lib/supabase/config"
import { z } from "zod"

/**
 * Contact form submission.
 *
 * Runs on the server. The payload is validated here rather than trusting the
 * browser, and the database applies its own CHECK constraints on top, so a
 * request that bypasses this action entirely still cannot write nonsense.
 *
 * RLS lets anyone insert a contact message but nobody read one back except an
 * admin — an enquiry contains a name, an email and a description of someone's
 * business.
 */

const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name.").max(200),
  companyName: z.string().trim().max(200).optional(),
  email: z.string().trim().email("Please enter a valid email address.").max(320),
  phone: z.string().trim().max(50).optional(),
  serviceRequired: z.string().trim().max(200).optional(),
  budget: z.string().trim().max(100).optional(),
  projectDescription: z
    .string()
    .trim()
    .min(10, "Please describe the project in a little more detail.")
    .max(5000, "That description is too long. Please keep it under 5000 characters."),
})

export type ContactResult = {
  success: boolean
  reference?: string
  error?: string
}

export async function submitContactForm(
  data: z.infer<typeof contactSchema>
): Promise<ContactResult> {
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

  let validated: z.infer<typeof contactSchema>
  try {
    validated = contactSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message ?? "Please check the form and try again.",
      }
    }
    return { success: false, error: "Please check the form and try again." }
  }

  const reference = `TDS-${Date.now().toString(36).toUpperCase()}-${Math.floor(
    Math.random() * 1000
  )
    .toString()
    .padStart(3, "0")}`

  try {
    const supabase = await createClient()

    const { error } = await supabase.from("contact_messages").insert({
      reference_number: reference,
      name: validated.fullName,
      email: validated.email,
      phone: validated.phone || null,
      company: validated.companyName || null,
      subject: validated.serviceRequired || null,
      budget: validated.budget || null,
      message: validated.projectDescription,
      status: "new",
    })

    if (error) {
      console.error("Contact form insert failed:", error.message, error.code)
      return {
        success: false,
        error:
          "We could not save your message just now. Please try again, or email us directly at trevordigitalsolutions@gmail.com.",
      }
    }

    return { success: true, reference }
  } catch (error) {
    console.error("Contact form error:", error)
    return {
      success: false,
      error: "Something went wrong on our side. Please try again, or email us directly.",
    }
  }
}
