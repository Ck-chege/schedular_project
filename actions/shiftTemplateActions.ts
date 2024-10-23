"use server";

import { createClient } from "@/utils/supabase/server";
import {
  WorkdayConfigTemplate,
  ShiftTemplate,
  WorkdayConfigTemplateWithShiftsTemplate,
} from "@/types/types";
import { getUserBusinessId } from "./UserActions";

export async function saveShiftTemplate(
  workdayConfig: WorkdayConfigTemplate,
  shifts: ShiftTemplate[]
) {
  const supabase = createClient();

  const business_id = await getUserBusinessId();

  const { data, error } = await supabase
    .from("shift_templates")
    .insert({
      business_id: business_id,
      title: workdayConfig.title,
      start_time: workdayConfig.startTime,
      end_time: workdayConfig.endTime,
      duration: workdayConfig.duration,
      shift_type: workdayConfig.shiftType,
      shifts: JSON.stringify(shifts),
    })
    .select();

  if (error) {
    console.error("Error saving shift template:", error);
    return { error: error.message };
  }

  return { success: true, data };
}

export async function getShiftTemplates() {
  const supabase = createClient();


  const business_id = await getUserBusinessId()

  console.log("business_id", business_id)

  const { data, error } = await supabase
    .from("shift_templates")
    .select("*")
    .eq("business_id", business_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching shift templates:", error);
    return { error: error.message };
  }

  console.log("data------------------------------", data)


  const transformedData: WorkdayConfigTemplateWithShiftsTemplate[] = data.map(
    (template) => ({
      id: template.id,
      title: template.title,
      startTime: template.start_time,
      endTime: template.end_time,
      duration: template.duration,
      shiftType: template.shift_type as "fixed" | "custom",
      shifts: template.shifts ? JSON.parse(template.shifts as string).map((shift: any, index: number): ShiftTemplate => ({
        id: shift.id || index + 1,
        title: shift.title,
        startTime: shift.startTime,
        endTime: shift.endTime,
        duration: shift.duration,
      })) : [],
      // shifts: Array.isArray(template.shifts)
      // ? template.shifts.map((shift: any, index: number): ShiftTemplate => ({
      //     id: shift.id || index + 1,
      //     title: shift.title,
      //     startTime: shift.startTime,
      //     endTime: shift.endTime,
      //     duration: shift.duration,
      //   }))
      // : [],
    })
  );

  console.log("data*************", transformedData)
  return { workDayTemplates: transformedData }
}
