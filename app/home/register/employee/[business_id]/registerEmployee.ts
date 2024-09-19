"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";

// UUID regex for version 4 UUIDs
const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

const UserAdminSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Provide a valide phone number"),
  role: z.enum(["admin", "manager", "employee"], {
    errorMap: () => ({ message: "Invalid role" }),
  }),
  business_id: z
    .string()
    .uuid()
    .refine((val) => uuidRegex.test(val), {
      message: `Invalid UUID format for business_id`,
    }),
});

export async function registerEmployee(formData: FormData) {
  const supabase = createClient();

  const rawData = Object.fromEntries(formData.entries())

  try {
    const validatedData = UserAdminSchema.parse(rawData)

    
    console.log("Successfully registered user:", validatedData);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod Validation error:", error.errors);
      return { error: error.errors.map((e) => e.message).join(", ") };
    }
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}
