import { ShiftCycleStatus } from "./shift_cycle_types";
import { Database } from "./supabase";

export type Employee = Database["public"]["Tables"]["employees"]["Row"]

export type EmployeeWithTasks = Employee & {
  tasks: Array<{
    id: string;
    name: string;
    is_primary: boolean;
  }>
};

export type Shift = Database["public"]["Tables"]["shifts"]["Row"];

export type WorkdayWithShifts = Database["public"]["Tables"]["workdays"]["Row"] & {
  shifts: Array<Shift>;
};

export type ShiftCycle = Omit<Database["public"]["Tables"]["shift_cycles"]["Row"], 'status'> & {
  status: ShiftCycleStatus;
};

export type ShiftCycleWithWorkdaysAndShifts = ShiftCycle & {
  status: ShiftCycleStatus;
  workdays: Array<WorkdayWithShifts>;
};


