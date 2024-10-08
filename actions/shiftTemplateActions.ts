'use server'

import { createClient } from "@/utils/supabase/server"
import { WorkdayConfigTemplate, ShiftTemplate, WorkdayConfigTemplateWithShiftsTemplate } from "@/types/types"

export async function saveShiftTemplate(workdayConfig: WorkdayConfigTemplate, shifts: ShiftTemplate[]) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  const { data, error } = await supabase
    .from('shift_templates')
    .insert({
      business_id: user.user_metadata.business_id,
      title: workdayConfig.title,
      start_time: workdayConfig.startTime,
      end_time: workdayConfig.endTime,
      duration: workdayConfig.duration,
      shift_type: workdayConfig.shiftType,
      shifts: shifts
    })
    .select()

  if (error) {
    console.error("Error saving shift template:", error)
    return { error: error.message }
  }

  return { success: true, data }
}

export async function getShiftTemplates() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }
  

  const { data, error } = await supabase
    .from('shift_templates')
    .select('*')
    .eq('business_id', user.user_metadata.business_id)

  if (error) {
    console.error("Error fetching shift templates:", error)
    return { error: error.message }
  }


  const transformedData: WorkdayConfigTemplateWithShiftsTemplate[] = data.map(template => ({
    id: template.id,
    title: template.title,
    startTime: template.start_time,
    endTime: template.end_time,
    duration: template.duration,
    shiftType: template.shift_type,
    shifts: template.shifts.map((shift: any, index: number): ShiftTemplate => ({
      id: shift.id || index + 1,
      title: shift.title,
      startTime: shift.startTime,
      endTime: shift.endTime,
      duration: shift.duration
    }))
  }))

  return { success: true, data: transformedData }
}