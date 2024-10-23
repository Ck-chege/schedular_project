"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { getUserBusinessId } from "./UserActions";
import { Employee, EmployeeWithTasks } from "@/types/tableDataTypes";

// UUID regex for version 4 UUIDs
const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;


  export async function registerAdmin() {
    const supabase = createClient();
    const business_id = await getUserBusinessId();
  
    try {
      
  
      // // Insert the validated data into the 'users' table
      // const { data, error } = await supabase
      //   .from("users")
      //   .insert({
      //     full_name: validatedData.name,
      //     email: validatedData.email,
      //     business_id: business_id,
      //     role: "manager",
      //   })
      //   .select();
  
      // if (error) {
      //   console.error("Error inserting manager:", error);
      //   return { error: error.message };
      // }
  
      const respo = await supabase.auth.signUp({
        email: "kamauchege45@gmail.com",
        password: "54321",
        options: {
          data: {
            full_name: "Kamauchege",
            business_id: business_id,
            role: "admin",
          },
        },
      });
  
      if (respo.error) {
        console.error("Error creating auth user:", respo.error);
        return { error: respo.error.message };
      }
  
      console.log("Successfully registered admin:", respo.data);
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

const EmployeeSchema = z.object({
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
  maxHours: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 0 && val <= 168, {
      message: "Maximum hours must be between 0 and 168",
    }),
});

export async function registerEmployee(formData: FormData) {
  const supabase = createClient();

  const rawData = Object.fromEntries(formData.entries());

  try {
    const validatedData = EmployeeSchema.parse(rawData);

    // Insert the validated data into the 'employees' table
    const { data, error } = await supabase
      .from("employees")
      .insert([
        {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          business_id: validatedData.business_id,
          primary_task: validatedData.primaryTask,
          secondary_tasks: validatedData.secondaryTasks,
          max_hours: validatedData.maxHours,
        },
      ])
      .select("id")
      .single();

    if (error || !data) {
      console.error("Error inserting employee:", error);
      return { error: error?.message || "Failed to insert employee" };
    }

    const employeeId = data.id;

    await supabase.from("employee_tasks").insert({
      employee_id: employeeId,
      task_id: validatedData.primaryTask,
      is_primary: true,
    });

    for (const task of validatedData.secondaryTasks) {
      await supabase.from("employee_tasks").insert({
        employee_id: employeeId,
        task_id: task,
        is_primary: false,
      });
    }

    console.log("Successfully registered employee:", data);
    return { success: true, employee: data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod Validation error:", error.errors);
      return { error: error.errors.map((e) => e.message).join(", ") };
    }
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function registerEmployeeAuth(formData: FormData) {
  const supabase = createClient();
  const rawData = Object.fromEntries(formData.entries());

  try {
    const employeeId = rawData.employee_id as string;

    // Query the employee's email using the employee_id
    const { data: employeeData, error: employeeError } = await supabase
      .from("employees")
      .select("email")
      .eq("id", employeeId)
      .single();

    if (employeeError) {
      console.error("Error fetching employee email:", employeeError);
      return { error: employeeError.message };
    }

    if (!employeeData) {
      return { error: "Employee not found" };
    }

    // Create Supabase user auth with password and email
    const { data, error } = await supabase.auth.signUp({
      email: employeeData.email,
      password: rawData.password as string,
      options: {
        data: {
          employee_id: employeeId,
          role: "employee",
          business_id: await getUserBusinessId(),
        },
      },
    });

    if (error) {
      console.error("Error creating user auth:", error);
      return { error: error.message };
    }

    const { error: employeeAuthError } = await supabase
      .from("employees")
      .update({ is_auth_set: true })
      .eq("email", data.user?.email as string);

    if (employeeAuthError) {
      console.error("Error updating employee:", employeeAuthError);
      return { error: employeeAuthError.message };
    }

    console.log("Successfully created user auth for employee:", data);
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

const ManagerSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Provide a valid phone number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export async function registerManager(formData: FormData) {
  const supabase = createClient();

  const rawData = Object.fromEntries(formData.entries());

  const business_id = rawData.business_id as string;

  try {
    const validatedData = ManagerSchema.parse(rawData);

    // Insert the validated data into the 'users' table
    const { data, error } = await supabase
      .from("users")
      .insert({
        full_name: validatedData.name,
        email: validatedData.email,
        business_id: business_id,
        role: "manager",
      })
      .select();

    if (error) {
      console.error("Error inserting manager:", error);
      return { error: error.message };
    }

    const respo = await supabase.auth.signUp({
      email: validatedData.email,
      password: rawData.password as string,
      options: {
        data: {
          full_name: validatedData.name,
          business_id: business_id,
          role: "manager",
        },
      },
    });

    if (respo.error) {
      console.error("Error creating auth user:", respo.error);
      return { error: respo.error.message };
    }

    console.log("Successfully registered manager:", data);
    return { success: true, manager: data[0] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod Validation error:", error.errors);
      return { error: error.errors.map((e) => e.message).join(", ") };
    }
    console.error("Unexpected error:", error);
    return { error: `An unexpected error occurred. ${error}` };
  }
}

export async function getEmployeesWithTasks() {
  const supabase = createClient();

  const business_id = await getUserBusinessId();

  const { data, error } = await supabase
    .from('employees')
    .select(`
      *,
      tasks:employee_tasks!inner(
        is_primary,
        task:tasks!inner(
          id,
          name
        )
      )
    `)
    .eq('business_id', business_id);

  if (error) {
    console.error("Error fetching employees with tasks:", error);
    return { error: error.message };
  }

  // Process the data to match the EmployeeWithTasks type
  const processedData: EmployeeWithTasks[] = data?.map(employee => ({
    ...employee,
    tasks: employee.tasks.map(taskRelation => ({
      id: taskRelation.task.id,
      name: taskRelation.task.name,
      is_primary: taskRelation.is_primary
    }))
  }));

  return { data: processedData };
}

export async function getEmployees() {
  const supabase = createClient();

  const business_id = await getUserBusinessId();

  const { data, error } = await supabase
    .from('employees')
    .select(`*`)
    .eq('business_id', business_id);

  if (error) {
    console.error("Error fetching employees:", error);
    return { error: error.message };
  }

  return { data: data as Employee[] };
}

export async function getEmployeeEnfor(employeeId: string) {
  const supabase = createClient();

  const business_id = await getUserBusinessId();

  const { data, error } = await supabase
    .from("employees")
    .select(
      "business_id,email,id,max_hours,name,phone,primary_task,secondary_tasks"
    )
    .eq("business_id", business_id)
    .eq("id", employeeId);

  if (error) {
    console.error("Error fetching employees:", error);
    return { error: error.message };
  }

  return { data: data };
}

export async function getEmployeesInfo() {
  const supabase = createClient();

  const business_id = await getUserBusinessId();

  const { data, error } = await supabase
    .from("employees")
    .select("email,id,name,phone,primary_task,secondary_tasks")
    .eq("business_id", business_id);

  if (error) {
    console.error("Error fetching employees:", error);
    return { error: error.message };
  }

  return { data: data };
}

export async function getEmployeesDashboard() {
  const supabase = createClient();
  const business_id = await getUserBusinessId();

  const { data:employees, error } = await supabase
    .from('employees')
    .select(`
      *,
      tasks:employee_tasks!inner(
        is_primary,
        task:tasks!inner(
          id,
          name
        )
      )
    `)
    .eq('business_id', business_id)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching employees:", error);
    return { error: error.message };
  }

  // Process the data to match the EmployeeWithTasks type
  const processedData: EmployeeWithTasks[] = employees?.map(employee => ({
    ...employee,
    tasks: employee.tasks.map(taskRelation => ({
      id: taskRelation.task.id,
      name: taskRelation.task.name,
      is_primary: taskRelation.is_primary
    }))
  }));

  return { data: processedData };
}
