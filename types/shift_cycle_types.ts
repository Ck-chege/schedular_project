import { GalleryThumbnails } from "lucide-react";
import { ShiftTemplate } from "./types";

export interface ShiftTaskInfo {
  taskId: string;
  employeesRequired: number;
}

export interface Shift extends ShiftTemplate {
  tasks: ShiftTaskInfo[];
}

export interface Workday {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  shifts: Shift[];
}

export interface ShiftCycle {
  id: string;
  title: string;
  numWorkDays: number;
  startDate: string;
  endDate: string;
  workdays: Workday[];
}

export interface Task {
  id: string;
  name: string;
  description: string;
}