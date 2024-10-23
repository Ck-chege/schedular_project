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





function mapShiftTemplate(shift: any): ShiftTemplate {
  return {
    id: shift.id,
    duration: shift.duration,
    startTime: shift.start_time,
    endTime: shift.end_time,
    title: shift.title,
  };
}

function mapWorkdayConfigTemplate(shiftTemplateRow: any): WorkdayConfigTemplateWithShiftsTemplate {
  return {
    id: shiftTemplateRow.id,
    title: shiftTemplateRow.title,
    startTime: shiftTemplateRow.start_time,
    endTime: shiftTemplateRow.end_time,
    duration: shiftTemplateRow.duration,
    shiftType: shiftTemplateRow.shift_type === 'fixed' ? 'fixed' : 'custom',
    shifts: shiftTemplateRow.shifts.map((shift: any) => mapShiftTemplate(shift)), // assuming `shifts` is an array of JSON objects
  };
}