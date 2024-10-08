export interface ShiftTemplate {
  id: string;
  duration: number;
  startTime: string;
  endTime: string;
  title: string;
}

export interface WorkdayConfigTemplate {
  title: string;
  startTime: string;

  endTime: string;
  duration: number;
  shiftType: "fixed" | "custom";
}


export interface WorkdayConfigTemplateWithShiftsTemplate extends WorkdayConfigTemplate{
  id: string
  shifts: ShiftTemplate[];
}
