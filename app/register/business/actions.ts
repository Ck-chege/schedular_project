'use server'

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { z } from "zod"

const BusinessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  website: z.string().url("Invalid website URL").optional(),
  description: z.string().max(500, "Description must be 500 characters or less"),
  business_type: z.string().min(1, "Business type is required"),
  industry: z.string().min(1, "Industry is required"),
  location: z.string().min(1, "Location is required"),
  social_media: z.string().optional(),
})

export async function registerBusiness(formData: FormData) {
  const supabase = createClient()

  const rawData = Object.fromEntries(formData.entries())

  try {
    const validatedData = BusinessSchema.parse(rawData)

    const { data, error } = await supabase
      .from("businesses")
      .insert([validatedData])
      .select()

    if (error) {
      console.error(`Error registering business: ${error.message}`)
      return { error: error.message }
    }

    console.log("Successfully registered business:", data)

    if (data && data[0] && data[0].id) {
      // redirect(`/register/user/${data[0].id}`)
      return { success: true, businessId: data[0].id }
    } else {
      return { error: "Failed to retrieve the new business ID" }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod Validation error:", error.errors)
      return { error: error.errors.map((e) => e.message).join(", ") }
    }
    console.error("Unexpected error:", error)
    return { error: "An unexpected error occurred" }
  }
}