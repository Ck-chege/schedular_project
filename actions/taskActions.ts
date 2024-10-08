"use server";

import { Task } from "@/types/shift_cycle_types";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";

// UUID regex for version 4 UUIDs
const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

const TaskSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  description: z.string().min(1, "Please add description on the task"),
  business_id: z
    .string()
    .uuid()
    .refine((val) => uuidRegex.test(val), {
      message: `Invalid UUID format for business_id`,
    }),
});

export async function registerTask(formData: FormData) {
  const supabase = createClient();

  const rawData = Object.fromEntries(formData.entries());

  try {
    const validatedData = TaskSchema.parse(rawData);

    const { data, error } = await supabase
      .from("tasks")
      .insert(validatedData)
      .select();

    if (error) {
      console.error("Error inserting task:", error);
      return { error: error.message };
    }

    console.log("Successfully registered task:", validatedData);
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

export async function getTasks() {
  const supabase = createClient();

  

  try {

    const {
      data: { user },
    } = await supabase.auth.getUser()
  
    if (!user) {
      return { error: "User not authenticated" }
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("business_id", user.user_metadata.business_id);

    if (error) {
      console.error("Error fetching tasks:", error);
      return { error: error.message };
    }


    const transformedData: Task[] = data.map(task => ({
      id: task.id,
      name: task.name,
      description: task.description,
    }))

    return { success: true, data: transformedData };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: `An unexpected error occurred while fetching tasks ${error}` };
  }
}

