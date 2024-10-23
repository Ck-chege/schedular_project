"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { redirect } from "next/navigation";

// UUID regex for version 4 UUIDs
const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

const UserAdminSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
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

export async function registerUserAdmin(formData: FormData) {
  const supabase = createClient();

  const rawData = Object.fromEntries(formData.entries());
  console.log(`----- ${formData.get("business_id")}`);

  try {
    const validatedData = UserAdminSchema.parse(rawData);

    // Register the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          full_name: validatedData.name,
          business_id: validatedData.business_id,
          role: validatedData.role,
        },
      },
    });

    if (authError) {
      console.error(`Error registering user: ${authError.message}`);
      return { error: authError.message };
    }

    if (!authData.user) {
      return { error: "Failed to create user" };
    }

    console.log("Successfully registered user:", authData.user.email);
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


export async function getUser() {
  const supabase = createClient()
  const {data: { user }} = await supabase.auth.getUser();

  if (!user) {
    supabase.auth.signOut()
    redirect('/login')
  }

  return user;
}

export async function getUserBusinessId() {
  const user = await getUser()
  const business_id = user.user_metadata.business_id;
  return business_id as string;
}