import { ShiftTemplate } from "./types";

export interface ShiftTaskInfo {
  taskId: string;
  employeesRequired: number;
}

export interface Shift extends ShiftTemplate {
  tasks: Map<string, ShiftTaskInfo>; // Using Map to store tasks by taskId
}

export interface Workday {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  shifts: Shift[]; // Using Set to store unique Shift objects
}


export interface Task {
  id: string;
  name: string;
  description: string;
}

export enum ShiftCycleStatus {
  Created = 'created',
  SchedulingInProcess = 'scheduling_in_process',
  SchedulingComplete = 'scheduling_complete',
  Active = 'active',
  Complete = 'complete'
}

export interface ShiftCycle {
  id: string;
  title: string;
  numWorkDays: number;
  startDate: string;
  endDate: string;
  status: ShiftCycleStatus;
  workdays: Map<string, Workday>;
}



