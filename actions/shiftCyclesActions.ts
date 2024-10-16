"use server";

import { createClient } from "@/utils/supabase/server";
import {
  Shift,
  ShiftCycle,
  ShiftCycleStatus,
  ShiftTaskInfo,
  Workday,
} from "@/types/shift_cycle_types";

export async function insertShiftCycleData(shiftCycle: ShiftCycle) {
  try {
    // Set initial status to Created
    shiftCycle.status = ShiftCycleStatus.Created;
    const cycleData = await insertShiftCycle(shiftCycle);

    // Update status to SchedulingInProcess
    await updateShiftCycleStatus(
      cycleData.id,
      ShiftCycleStatus.SchedulingInProcess
    );

    const workdayInserts = Array.from(shiftCycle.workdays.values()).map(
      async (workday) => {
        const workdayData = await insertWorkday(workday, shiftCycle.id);

        const shiftInserts = workday.shifts.map(async (shift) => {
          const shiftData = await insertShift(shift, workdayData.id);

          const taskInserts = Array.from(shift.tasks.entries()).map(
            async ([taskId, taskInfo]) => {
              await insertShiftTask(shiftData.id, taskId, taskInfo);
            }
          );

          await Promise.all(taskInserts);
        });

        await Promise.all(shiftInserts);
      }
    );

    await Promise.all(workdayInserts);

    // Update status to SchedulingComplete
    await updateShiftCycleStatus(
      cycleData.id,
      ShiftCycleStatus.SchedulingComplete
    );

    return { success: true };
  } catch (error) {
    console.error("Error inserting shift cycle data:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function insertShiftCycleDataTransaction(shiftCycle: ShiftCycle) {
  const supabase = createClient();

  try {
    // Start transaction
    const { error: beginError } = await supabase.rpc("begin_transaction");
    if (beginError)
      throw new Error(`Error starting transaction: ${beginError.message}`);

    // Set initial status to Created
    shiftCycle.status = ShiftCycleStatus.Created;
    const cycleData = await insertShiftCycle(supabase, shiftCycle);

    // Update status to SchedulingInProcess
    await updateShiftCycleStatus(
      supabase,
      cycleData.id,
      ShiftCycleStatus.SchedulingInProcess
    );

    for (const workday of Array.from(shiftCycle.workdays.values())) {
      const workdayData = await insertWorkday(supabase, workday, cycleData.id);

      for (const shift of workday.shifts) {
        const shiftData = await insertShift(supabase, shift, workdayData.id);

        for (const [taskId, taskInfo] of Array.from(shift.tasks.entries())) {
          await insertShiftTask(supabase, shiftData.id, taskId, taskInfo);
        }
      }
    }

    // Update status to SchedulingComplete
    await updateShiftCycleStatus(
      supabase,
      cycleData.id,
      ShiftCycleStatus.SchedulingComplete
    );

    // Commit transaction
    const { error: commitError } = await supabase.rpc("commit_transaction");
    if (commitError)
      throw new Error(`Error committing transaction: ${commitError.message}`);

    return { success: true };
  } catch (error) {
    // Rollback transaction on error
    const { error: rollbackError } = await supabase.rpc("rollback_transaction");
    if (rollbackError)
      console.error("Error rolling back transaction:", rollbackError);

    console.error("Error inserting shift cycle data:", error);
    return { success: false, error: (error as Error).message };
  }
}





export async function insertShiftCycle(supabase: any,shiftCycle: ShiftCycle) {

  const { data, error } = await supabase
    .from("shift_cycles")
    .insert({
      title: shiftCycle.title,
      num_work_days: shiftCycle.numWorkDays,
      start_date: shiftCycle.startDate,
      end_date: shiftCycle.endDate,
      status: shiftCycle.status,
    })
    .select("id")
    .single();

  if (error) {
    error: error.message;
  }
  return { id: data.id };
}

export async function updateShiftCycleStatus(
  supabase: any,
  cycleId: string,
  status: ShiftCycleStatus
) {

  const { data, error } = await supabase
    .from("shift_cycles")
    .update({ status })
    .eq("id", cycleId)
    .select()
    .single();

  if (error)
    throw new Error(`Error updating shift cycle status: ${error.message}`);
  return data;
}

export async function activateShiftCycle(cycleId: string) {
  try {
    const updatedCycle = await updateShiftCycleStatus(
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
  try {
    const updatedCycle = await updateShiftCycleStatus(
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
    shift_id: shiftId,
    task_id: taskId,
    employees_required: taskInfo.employeesRequired,
  });

  if (error) throw new Error(`Error inserting shift task: ${error.message}`);
}

export async function insertShift(supabase: any,shift: Shift, workdayId: string) {

  const { data, error } = await supabase
    .from("shifts")
    .insert({
      workday_id: workdayId,
      duration: shift.duration,
      start_time: shift.startTime,
      end_time: shift.endTime,
      title: shift.title,
    })
    .select()
    .single();

  if (error) throw new Error(`Error inserting shift: ${error.message}`);
  return data;
}

export async function insertWorkday(supabase: any,workday: Workday, shiftCycleId: string) {

  const { data, error } = await supabase
    .from("workdays")
    .insert({
      id: workday.id,
      shift_cycle_id: shiftCycleId,
      title: workday.title,
      date: workday.date,
      start_time: workday.startTime,
      end_time: workday.endTime,
    })
    .select()
    .single();

  if (error) throw new Error(`Error inserting workday: ${error.message}`);
  return data;
}
