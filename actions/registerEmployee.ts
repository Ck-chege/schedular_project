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
  phone: z.string().min(10, "Provide a valid phone number"),
  business_id: z
    .string()
    .uuid()
    .refine((val) => uuidRegex.test(val), {
      message: `Invalid UUID format for business_id`,
    }),
  primaryTask: z.string().min(1, "Primary task is required"),
  secondaryTasks: z.string().transform((val) => JSON.parse(val) as string[]),
  maxHours: z.string().transform((val) => parseInt(val, 10)).refine((val) => val >= 0 && val <= 168, {
    message: "Maximum hours must be between 0 and 168",
  }),
});

export async function registerEmployee(formData: FormData) {
  const supabase = createClient();

  const rawData = Object.fromEntries(formData.entries());

  try {
    const validatedData = UserAdminSchema.parse(rawData);

    // Insert the validated data into the 'employees' table
    const { data, error } = await supabase
      .from('employees')
      .insert([
        {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          business_id: validatedData.business_id,
          primary_task: validatedData.primaryTask,
          secondary_tasks: validatedData.secondaryTasks,
          max_hours: validatedData.maxHours,
        }
      ])
      .select();

    if (error) {
      console.error("Error inserting employee:", error);
      return { error: error.message };
    }

    console.log("Successfully registered employee:", data);
    return { success: true, employee: data[0] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod Validation error:", error.errors);
      return { error: error.errors.map((e) => e.message).join(", ") };
    }
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}