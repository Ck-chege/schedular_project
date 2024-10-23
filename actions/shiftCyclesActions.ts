"use server";

import { createClient } from "@/utils/supabase/server";
import {
  Shift,
  NewShiftCycle,
  ShiftCycleStatus,
  ShiftTaskInfo,
  Workday,
} from "@/types/shift_cycle_types";
import { v4 as uuid } from "uuid";
import { getUserBusinessId } from "./UserActions";
import { ShiftCycle, ShiftCycleWithWorkdaysAndShifts } from "@/types/tableDataTypes";

export async function insertShiftCycleData(shiftCycle: NewShiftCycle) {
  const supabase = createClient();
  try {
    // Set initial status to Created
    shiftCycle.status = ShiftCycleStatus.Created;
    const { id: cycle_id, error } = await insertShiftCycle(
      supabase,
      shiftCycle
    );
   
    if (error != null) throw new Error(`Error inserting shift cycle: ${error}`);

    // // Update status to SchedulingInProcess
    // await updateShiftCycleStatus(
    //   supabase,
    //   cycleData.id,
    //   ShiftCycleStatus.SchedulingInProcess
    // );

    Array.from(shiftCycle.workdays.values()).map(async (workday) => {
      const { id: work_day_id, error } = await insertWorkday(
        supabase,
        workday,
        cycle_id
      );
      console.log(work_day_id, error);
      if (error != null) throw new Error(`Error inserting workday: ${error}`);

      workday.shifts.map(async (shift) => {
        const { id: shift_id, error } = await insertShift(
          supabase,
          shift,
          work_day_id
        );
        if (error != null) throw new Error(`Error inserting shift: ${error}`);

        Array.from(shift.tasks.entries()).map(async ([taskId, taskInfo]) => {
          const {error}= await insertShiftTask(supabase, shift_id, taskInfo.taskId, taskInfo);
          if (error != null) throw new Error(`Error inserting shift task: ${error}`);
        });
      });
    });

    // // Update status to SchedulingComplete
    // await updateShiftCycleStatus(
    //   supabase,
    //   cycle_id,
    //   ShiftCycleStatus.SchedulingComplete
    // );

    return { success: true };
  } catch (error) {
    console.error("Error inserting shift cycle:", error);
    return { success: false, error: (error as Error).message };
  }
}


export async function insertShiftCycle(supabase: any, shiftCycle: NewShiftCycle) {

  const business_id = await getUserBusinessId()

  const { data, error } = await supabase
    .from("shift_cycles")
    .insert({
      id: uuid(),
      title: shiftCycle.title,
      num_work_days: shiftCycle.numWorkDays,
      start_date: shiftCycle.startDate,
      end_date: shiftCycle.endDate,
      status: shiftCycle.status,
      business_id: business_id,
    })
    .select("id")
    .single();

  if (error)
    return {
      error: error.message,
    };
  return { id: data.id, error: null };
}

export async function updateShiftCycleStatus(
  supabase: any,
  cycleId: string,
  status: ShiftCycleStatus
) {
  
  const { data, error } = await supabase
    .from("shift_cycles")
    .update({ status:  status })
    .eq("id", cycleId)
    .select()
    .single();

  if (error)
    throw new Error(`Error updating shift cycle status: ${error.message}`);
  return data;
}

export async function allowEmployeeAvailabilityConfig(cycleId: string,) {
  const supabase = createClient();
  try {
    const updatedCycle = await updateShiftCycleStatus(
      supabase,
      cycleId,
      ShiftCycleStatus.SchedulingInProcess
    );
    return { success: true, data: updatedCycle };
  } catch (error) {
    console.error("Error allowing employee availability configuration:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function activateShiftCycle(cycleId: string) {
  const supabase = createClient();
  try {
    const updatedCycle = await updateShiftCycleStatus(
      supabase,
      cycleId,
      ShiftCycleStatus.Active
    );
    return { success: true, data: updatedCycle };
  } catch (error) {
    console.error("Error activating shift cycle:", error);
    return { success: false, error: (error as Error).message };
  }
}



export async function completeShiftCycle(cycleId: string) {
  const supabase = createClient();
  try {
    const updatedCycle = await updateShiftCycleStatus(
      supabase,
      cycleId,
      ShiftCycleStatus.Complete
    );
    return { success: true, data: updatedCycle };
  } catch (error) {
    console.error("Error completing shift cycle:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function insertShiftTask(
  supabase: any,
  shiftId: string,
  taskId: string,
  taskInfo: ShiftTaskInfo
) {
  const { error } = await supabase.from("shift_tasks").insert({
    id: uuid(),
    shift_id: shiftId,
    task_id: taskId,
    employees_required: taskInfo.employeesRequired,
  });

  if (error) return { error: error.message };

  return { success: true };
}

export async function insertShift(
  supabase: any,
  shift: Shift,
  workdayId: string
) {
  const { data, error } = await supabase
    .from("shifts")
    .insert({
      id: uuid(),
      workday_id: workdayId,
      duration: shift.duration,
      start_time: shift.startTime,
      end_time: shift.endTime,
      title: shift.title,
    })
    .select("id")
    .single();

  if (error)
    return {
      error: error.message,
    };
  return { id: data.id };
}

export async function insertWorkday(
  supabase: any,
  workday: Workday,
  shiftCycleId: string
) {
  const { data, error } = await supabase
    .from("workdays")
    .insert({
      id: uuid(),
      shift_cycle_id: shiftCycleId,
      title: workday.title,
      date: workday.date,
      start_time: workday.startTime,
      end_time: workday.endTime,
    })
    .select("id")
    .single();

  if (error)
    return {
      error: error.message,
    };
  return { id: data.id };
}


export async function getShiftCycle(cycleId: string) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("shift_cycles")
      .select("*")
      .eq("id", cycleId)
      .single();

      if (error) {
        console.error("Error getting shift cycle:", error);
        return { error: (error).message };
      }

      return { success: true, data: data };
  }
  catch (error) {
    console.error("Error getting shift cycle:", error);
    return { error: (error as Error).message };
  }
}

export async function getShiftCycleWithWorkdaysAndShifts(cycleId: string) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("shift_cycles")
      .select("*, workdays(*, shifts(*))")
      .eq("id", cycleId)
      .single();

      if (error) {
        console.error("Error getting shift cycle:", error);
        return { error: (error).message };
      }

      return {data: data as ShiftCycleWithWorkdaysAndShifts };
  }
  catch (error) {
    console.error("Error getting shift cycle:", error);
    return { error: (error as Error).message };
  }
}

export async function getOpenShiftCycles() {
  const supabase = createClient();

  const { data, error } = await supabase
      .from("shift_cycles")
      .select("*")
      .neq("status", ShiftCycleStatus.Complete);

    if (error) {
      console.error("Error getting shift cycle:", error);
      return { error: error.message };
    }

    return { data: data as ShiftCycle[] };
}


export async function getShiftCyclesInSchedulingProcess() {
  const supabase = createClient();

  const { data, error } = await supabase
      .from("shift_cycles")
      .select("*")
      .eq("status", ShiftCycleStatus.SchedulingInProcess)
      .order("start_date", { ascending: true });

    if (error) {
      console.error("Error getting shift cycle:", error);
      return { error: error.message };
    }

    return { data: data as ShiftCycle[] };
}