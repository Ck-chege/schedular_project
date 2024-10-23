// "use client";

// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Progress } from "@/components/ui/progress";
// import ShiftTaskConfigurator from "./ShiftTaskConfigurator";
// import {
//   WorkdayConfigTemplateWithShiftsTemplate,
// } from "@/types/types";
// import { ShiftCycle, Task, Workday, Shift } from "@/types/shift_cycle_types";
// import PreviewSchedule from "./Preview";
// import { format, addDays } from "date-fns";
// import WorkdayConfigSelector from "./WorkdayConfigSelector";

// interface ConfigureScheduleCycleProps {
//   tasks: Task[];
//   templates: WorkdayConfigTemplateWithShiftsTemplate[];
// }

// const ConfigureScheduleCycle: React.FC<ConfigureScheduleCycleProps> = ({ tasks, templates }) => {
//   const router = useRouter();

//   const [shiftCycle, setShiftCycle] = useState<ShiftCycle>({
//     id: "1",
//     title: "New Shift Cycle",
//     numWorkDays: 5,
//     startDate: "",
//     endDate: "",
//     workdays: new Map<string, Workday>(), // Initialized as empty Map
//   });

//   const [step, setStep] = useState<number>(1);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [editingShiftIds, setEditingShiftIds] = useState<{ [dayIndex: string]: string | null }>({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [endDate, setEndDate] = useState<string>("");

//   const formatDate = (dateString: string) => {
//     return format(new Date(dateString), "EEEE, MMMM d, yyyy");
//   };

//   useEffect(() => {
//     if (shiftCycle.startDate && shiftCycle.numWorkDays > 0) {
//       const startDate = new Date(shiftCycle.startDate);
//       const calculatedEndDate = addDays(startDate, shiftCycle.numWorkDays - 1);
//       setEndDate(format(calculatedEndDate, "yyyy-MM-dd"));
//     }
//   }, [shiftCycle.startDate, shiftCycle.numWorkDays]);

//   // Handle selectLabel updates within each WorkdayConfigSelector
//   // Removed global selectLabel as it's managed within WorkdayConfigSelector

//   const updateWorkdays = useCallback((days: number) => {
//     const map = new Map<string, Workday>();
//     for (let i = 0; i < days; i++) {
//       const dayId = (i + 1).toString();
//       map.set(dayId, {
//         id: dayId,
//         title: `Day ${i + 1}`,
//         date: "",
//         startTime: "",
//         endTime: "",
//         shifts: new Set<Shift>(), // Initialize shifts as Set
//       });
//     }

//     setShiftCycle((prev) => ({
//       ...prev,
//       numWorkDays: days,
//       workdays: map,
//     }));
//   }, []);

//   const calculateWorkdayTimes = useCallback((shifts: Set<Shift>) => {
//     if (shifts.size === 0) {
//       return { startTime: "", endTime: "", isEndTimeNextDay: false };
//     }

//     const shiftArray = Array.from(shifts);

//     const startTimes = shiftArray.map((shift) => {
//       const [hour, minute] = shift.startTime.split(":").map(Number);
//       return hour * 60 + minute;
//     });

//     const endTimes = shiftArray.map((shift) => {
//       let [hour, minute] = shift.endTime.split(":").map(Number);
//       let endTimeInMinutes = hour * 60 + minute;

//       // Assuming shifts are ordered, adjust end time if it passes midnight
//       const correspondingShift = shiftArray.find(
//         (s) => s.endTime === shift.endTime
//       );
//       if (correspondingShift) {
//         const [startHour, startMinute] = correspondingShift.startTime
//           .split(":")
//           .map(Number);
//         const startTimeInMinutes = startHour * 60 + startMinute;
//         if (endTimeInMinutes <= startTimeInMinutes) {
//           endTimeInMinutes += 24 * 60;
//         }
//       }

//       return endTimeInMinutes;
//     });

//     const earliestStart = Math.min(...startTimes);
//     const latestEnd = Math.max(...endTimes);

//     const isEndTimeNextDay = latestEnd >= 24 * 60;

//     const formatTime = (minutes: number) => {
//       const adjustedMinutes = minutes % (24 * 60);
//       const hrs = Math.floor(adjustedMinutes / 60);
//       const mins = adjustedMinutes % 60;
//       const pad = (n: number) => n.toString().padStart(2, "0");
//       return `${pad(hrs)}:${pad(mins)}`;
//     };

//     return {
//       startTime: formatTime(earliestStart),
//       endTime: formatTime(latestEnd),
//       isEndTimeNextDay,
//     };
//   }, []);

//   const calculateDuration = useCallback((start: string, end: string) => {
//     let [startHour, startMinute] = start.split(":").map(Number);
//     let [endHour, endMinute] = end.split(":").map(Number);

//     let startTotal = startHour * 60 + startMinute;
//     let endTotal = endHour * 60 + endMinute;

//     if (endTotal <= startTotal) {
//       endTotal += 24 * 60;
//     }

//     return endTotal - startTotal;
//   }, []);

//   const formatDuration = (durationInMinutes: number) => {
//     const hours = Math.floor(durationInMinutes / 60);
//     const minutes = durationInMinutes % 60;

//     if (hours > 0 && minutes > 0) {
//       return `${hours} hours and ${minutes} minutes`;
//     } else if (hours > 0) {
//       return `${hours} hours`;
//     } else {
//       return `${minutes} minutes`;
//     }
//   };

//   const { startTime, endTime, isEndTimeNextDay } = useMemo(() => {
//     let allShifts = new Set<Shift>();
//     shiftCycle.workdays.forEach((workday) => {
//       workday.shifts.forEach((shift) => allShifts.add(shift));
//     });
//     return calculateWorkdayTimes(allShifts);
//   }, [shiftCycle.workdays, calculateWorkdayTimes]);

//   useEffect(() => {
//     if (
//       startTime !== shiftCycle.startDate ||
//       endTime !== shiftCycle.endDate
//     ) {
//       setShiftCycle((prev) => ({
//         ...prev,
//         startTime,
//         endTime,
//         isEndTimeNextDay,
//       }));
//     }
//   }, [startTime, endTime, isEndTimeNextDay, shiftCycle.startDate, shiftCycle.endDate]);

//   const handleNext = useCallback(() => {
//     if (step === 1) {
//       if (shiftCycle.numWorkDays < 1) {
//         setErrors({ cycleDays: "Cycle duration must be at least 1 day." });
//         return;
//       }
//       if (!shiftCycle.startDate) {
//         setErrors({ startDate: "Start date is required." });
//         return;
//       }
//       updateWorkdays(shiftCycle.numWorkDays);
//     }
//     setErrors({});
//     setStep((prev) => prev + 1);
//     console.log(`shiftCycle ->`, shiftCycle);
//   }, [step, shiftCycle.numWorkDays, shiftCycle.startDate, updateWorkdays, shiftCycle]);

//   const handleBack = useCallback(() => {
//     setErrors({});
//     setStep((prev) => prev - 1);
//   }, []);

//   const handleSubmit = useCallback(() => {
//     console.log("Configuration saved:", shiftCycle);
//     // Implement actual saving logic here
//     router.push("/schedule-cycles");
//   }, [shiftCycle, router]);

//   const handleWorkdayUpdate = useCallback((key: string, updatedWorkday: Workday) => {
//     setShiftCycle((prev) => {
//       const newWorkdays = new Map(prev.workdays);
//       newWorkdays.set(key, updatedWorkday);
//       return { ...prev, workdays: newWorkdays };
//     });
//   }, []);

//   return (
//     <Card className="mx-auto mt-10">
//       <CardHeader>
//         <CardTitle>Configure Schedule Cycle</CardTitle>
//         <CardDescription>
//           {step === 1 && "Step 1: Specify the cycle duration and start date."}
//           {step === 2 && "Step 2: Select workday plans for each day."}
//           {step === 3 && "Step 3: Assign tasks to each shift."}
//           {step === 4 && "Step 4: Review your schedule."}
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Progress value={(step / 4) * 100} className="mb-4" />

//         {step === 1 && (
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="cycleDays">Number of Days in Cycle</Label>
//               <Input
//                 id="cycleDays"
//                 type="number"
//                 value={shiftCycle.numWorkDays}
//                 onChange={(e) => setShiftCycle(prev => ({ ...prev, numWorkDays: Number(e.target.value) }))}
//                 min={1}
//               />
//               {errors.cycleDays && (
//                 <p className="text-red-500 text-sm">{errors.cycleDays}</p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="startDate">Start Date</Label>
//               <Input
//                 id="startDate"
//                 type="date"
//                 value={shiftCycle.startDate}
//                 onChange={(e) => setShiftCycle(prev => ({ ...prev, startDate: e.target.value }))}
//               />
//               {errors.startDate && (
//                 <p className="text-red-500 text-sm">{errors.startDate}</p>
//               )}
//               {shiftCycle.startDate && (
//                 <p className="text-sm text-gray-600 mt-1">
//                   Cycle starts on: {formatDate(shiftCycle.startDate)}
//                 </p>
//               )}
//             </div>

//             {endDate && (
//               <div>
//                 <Label htmlFor="endDate">End Date</Label>
//                 <Input
//                   id="endDate"
//                   type="date"
//                   value={endDate}
//                   disabled
//                 />
//                 <p className="text-sm text-gray-600 mt-1">
//                   Cycle ends on: {formatDate(endDate)}
//                 </p>
//               </div>
//             )}
//           </div>
//         )}

//         {step === 2 && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
//               {Array.from(shiftCycle.workdays.entries()).map(([key, workday], index) => (
//                 <WorkdayConfigSelector
//                   key={key}
//                   dayIndex={index}
//                   workday={workday}
//                   templates={templates}
//                   onCreateWorkday={(updatedWorkday) => handleWorkdayUpdate(key, updatedWorkday)}
//                   editingShiftId={editingShiftIds[index]}
//                   setEditingShiftId={(id) => setEditingShiftIds(prev => ({ ...prev, [index]: id }))}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {step === 3 && (
//           <div className="space-y-6">
//             {Array.from(shiftCycle.workdays.entries()).map(([key, workday], dayIndex) => (
//               <div key={key}>
//                 <h3 className="text-lg font-medium mb-2">
//                   Day {dayIndex + 1}: {workday.title}
//                 </h3>

//                 {Array.from(workday.shifts).map((shift) => (
//                   <ShiftTaskConfigurator
//                     key={shift.id}
//                     dayIndex={dayIndex}
//                     shift={shift}
//                     tasks={tasks}
//                     onChange={(updatedShift: Shift) => {
//                       setShiftCycle((prev) => {
//                         const newWorkdays = new Map(prev.workdays);
//                         const workdayToUpdate = newWorkdays.get(key);
//                         if (!workdayToUpdate) return prev;

//                         const updatedShifts = new Set<Shift>(workdayToUpdate.shifts);
//                         updatedShifts.delete(shift);
//                         updatedShifts.add(updatedShift);

//                         newWorkdays.set(key, {
//                           ...workdayToUpdate,
//                           shifts: updatedShifts,
//                         });

//                         return { ...prev, workdays: newWorkdays };
//                       });
//                     } } shiftIndex={0}                  />
//                 ))}
//               </div>
//             ))}
//           </div>
//         )}

//         {step === 4 && (
//           <PreviewSchedule
//             shiftCycle={shiftCycle}
//             onBack={handleBack}
//             onSubmit={handleSubmit}
//           />
//         )}
//       </CardContent>
//       <CardFooter className="flex justify-between">
//         {step > 1 && step < 4 && (
//           <Button variant="secondary" onClick={handleBack}>
//             Back
//           </Button>
//         )}
//         {step < 4 && (
//           <Button onClick={handleNext} disabled={!shiftCycle.startDate}>
//             Next
//           </Button>
//         )}
//       </CardFooter>
//     </Card>
//   );
// };

// export default ConfigureScheduleCycle;

"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import ShiftTaskConfigurator from "./ShiftTaskConfigurator";
import { WorkdayConfigTemplateWithShiftsTemplate } from "@/types/types";
import {
  NewShiftCycle,
  Task,
  Workday,
  Shift,
  ShiftCycleStatus,
} from "@/types/shift_cycle_types";
import PreviewSchedule from "./Preview";
import { format, addDays, parse } from "date-fns";
import WorkdayConfigSelector from "./WorkdayConfigSelector";
import { useToast } from "@/hooks/use-toast"; // Adjust the path as per your project structure
import { insertShiftCycleData } from "@/actions/shiftCyclesActions";

interface ConfigureScheduleCycleProps {
  tasks: Task[];
  templates: WorkdayConfigTemplateWithShiftsTemplate[];
}

const ConfigureScheduleCycle: React.FC<ConfigureScheduleCycleProps> = ({
  tasks,
  templates,
}) => {
  const router = useRouter();
  const { toast } = useToast(); // Initialize toast

  const [shiftCycle, setShiftCycle] = useState<NewShiftCycle>({
    id: "1",
    title: "New Shift Cycle",
    numWorkDays: 5,
    startDate: "",
    endDate: "",
    status: ShiftCycleStatus.Created,
    workdays: new Map<string, Workday>(),
  });

  const [step, setStep] = useState<number>(1);
  const [editingShiftIds, setEditingShiftIds] = useState<{
    [dayIndex: string]: string | null;
  }>({});

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = parse(dateString, "yyyy-MM-dd", new Date());
    return format(date, "EEEE, MMMM d, yyyy");
  };

  // Update workdays based on number of days and start date
  const updateWorkdays = useCallback((days: number, startDate: string) => {
    if (!startDate) return;

    const map = new Map<string, Workday>();
    for (let i = 0; i < days; i++) {
      const dayId = (i + 1).toString();
      const currentDate = addDays(new Date(startDate), i);
      const formattedDate = format(currentDate, "yyyy-MM-dd");

      map.set(dayId, {
        id: dayId,
        title: `Day ${i + 1}`,
        date: formattedDate,
        startTime: "",
        endTime: "",
        shifts: [], // Changed from Set<Shift> to Shift[]
      });
    }

    setShiftCycle((prev) => ({
      ...prev,
      workdays: map,
    }));
  }, []);

  // Calculate cycle end date and update workdays when startDate or numWorkDays changes
  useEffect(() => {
    if (shiftCycle.startDate && shiftCycle.numWorkDays > 0) {
      const startDate = new Date(shiftCycle.startDate + "T00:00:00");
      const calculatedEndDate = addDays(
        startDate,
        Math.max(0, shiftCycle.numWorkDays - 1)
      );

      setShiftCycle((prev) => ({
        ...prev,
        endDate: format(calculatedEndDate, "yyyy-MM-dd"),
      }));
      updateWorkdays(shiftCycle.numWorkDays, shiftCycle.startDate);
    }
  }, [shiftCycle.startDate, shiftCycle.numWorkDays, updateWorkdays]);

  // Calculate workday times based on shifts
  const calculateWorkdayTimes = useCallback((shifts: Shift[]) => {
    if (shifts.length === 0) {
      return { startTime: "", endTime: "", isEndTimeNextDay: false };
    }

    const startTimes = shifts.map((shift) => {
      const [hour, minute] = shift.startTime.split(":").map(Number);
      return hour * 60 + minute;
    });

    const endTimes = shifts.map((shift) => {
      const [hour, minute] = shift.endTime.split(":").map(Number);
      let endTimeInMinutes = hour * 60 + minute;

      // Adjust for shifts ending next day
      const correspondingShift = shifts.find(
        (s) => s.endTime === shift.endTime
      );
      if (correspondingShift) {
        const [startHour, startMinute] = correspondingShift.startTime
          .split(":")
          .map(Number);
        const startTimeInMinutes = startHour * 60 + startMinute;
        if (endTimeInMinutes <= startTimeInMinutes) {
          endTimeInMinutes += 24 * 60;
        }
      }

      return endTimeInMinutes;
    });

    const earliestStart = Math.min(...startTimes);
    const latestEnd = Math.max(...endTimes);

    const isEndTimeNextDay = latestEnd >= 24 * 60;

    const formatTime = (minutes: number) => {
      const adjustedMinutes = minutes % (24 * 60);
      const hrs = Math.floor(adjustedMinutes / 60);
      const mins = adjustedMinutes % 60;
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${pad(hrs)}:${pad(mins)}`;
    };

    return {
      startTime: formatTime(earliestStart),
      endTime: formatTime(latestEnd),
      isEndTimeNextDay,
    };
  }, []);

  // // Calculate duration between two times
  // const calculateDuration = useCallback((start: string, end: string) => {
  //   let [startHour, startMinute] = start.split(":").map(Number);
  //   let [endHour, endMinute] = end.split(":").map(Number);

  //   let startTotal = startHour * 60 + startMinute;
  //   let endTotal = endHour * 60 + endMinute;

  //   if (endTotal <= startTotal) {
  //     endTotal += 24 * 60;
  //   }

  //   return endTotal - startTotal;
  // }, []);

  // // Format duration into human-readable string
  // const formatDuration = (durationInMinutes: number) => {
  //   const hours = Math.floor(durationInMinutes / 60);
  //   const minutes = durationInMinutes % 60;

  //   if (hours > 0 && minutes > 0) {
  //     return `${hours} hours and ${minutes} minutes`;
  //   } else if (hours > 0) {
  //     return `${hours} hours`;
  //   } else {
  //     return `${minutes} minutes`;
  //   }
  // };

  // Memoized calculation of workday times
  const { startTime, endTime, isEndTimeNextDay } = useMemo(
    () =>
      calculateWorkdayTimes(
        Array.from(shiftCycle.workdays.values()).flatMap(
          (workday) => workday.shifts
        )
      ),
    [shiftCycle.workdays, calculateWorkdayTimes]
  );

  // Update workday start and end times when shifts change
  useEffect(() => {
    setShiftCycle((prev) => {
      const newWorkdays = new Map(prev.workdays);
      for (const [key, workday] of Array.from(newWorkdays)) {
        const { startTime, endTime } = calculateWorkdayTimes(
          workday.shifts
        );
        newWorkdays.set(key, {
          ...workday,
          startTime,
          endTime,
        });
      }
      return { ...prev, workdays: newWorkdays };
    });
  }, [startTime, endTime, isEndTimeNextDay, calculateWorkdayTimes]);
  // Handle moving to the next step with validations
  const handleNext = useCallback(() => {
    if (step === 1) {
      if (shiftCycle.numWorkDays < 1) {
        toast({
          title: "Invalid Cycle Duration",
          description: "Cycle duration must be at least 1 day.",
          variant: "destructive",
        });
        return;
      }
      if (!shiftCycle.startDate) {
        toast({
          title: "Missing Start Date",
          description: "Start date is required.",
          variant: "destructive",
        });
        return;
      }
    }
    console.log("shiftCycle ->", shiftCycle);
    setStep((prev) => prev + 1);
  }, [step, shiftCycle.numWorkDays, shiftCycle.startDate, toast, shiftCycle]);

  // Handle moving back to the previous step
  const handleBack = useCallback(() => {
    setStep((prev) => prev - 1);
  }, []);

  // Handle submitting the configured schedule
  const handleSubmit = useCallback(async () => {
    console.log("Configuration saved:", shiftCycle);
    // Implement actual saving logic here

    const {success, error} = await insertShiftCycleData(shiftCycle)

    if (error || !success) {
      console.error("Error saving shift template", error);
        toast({
          title: "Error saving shift template",
          description: `${error}`,
          variant: "destructive",
        });
    }

    if (success) {
      console.log("Shift template saved.");
      toast({
        title: "Schedule Saved",
        description: "Your schedule cycle has been successfully saved.",
        variant: "default",
      });
      router.push("/home/shift");
    }
  }, [shiftCycle, router, toast]);

  // Handle updating a specific workday
  const handleWorkdayUpdate = useCallback(
    (key: string, updatedWorkday: Workday) => {
      setShiftCycle((prev) => {
        const newWorkdays = new Map(prev.workdays);
        const { startTime, endTime } = calculateWorkdayTimes(
          updatedWorkday.shifts
        );
        newWorkdays.set(key, {
          ...updatedWorkday,
          startTime,
          endTime,
        });
        return { ...prev, workdays: newWorkdays };
      });
    },
    [calculateWorkdayTimes]
  );

  return (
    <Card className="mx-auto mt-10 max-w-7xl">
      <CardHeader>
        <CardTitle>Configure Schedule Cycle</CardTitle>
        <CardDescription>
          {step === 1 && "Step 1: Specify the cycle duration and start date."}
          {step === 2 && "Step 2: Select workday plans for each day."}
          {step === 3 && "Step 3: Assign tasks to each shift."}
          {step === 4 && "Step 4: Review your schedule."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <Progress value={(step / 4) * 100} className="mb-4" />

        {/* Step 1: Specify Cycle Duration and Start Date */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Number of Workdays */}
            <div>
              <Label htmlFor="cycleDays">Number of Days in Cycle</Label>
              <Input
                id="cycleDays"
                type="number"
                value={shiftCycle.numWorkDays}
                onChange={(e) => {
                  const days = Math.max(1, parseInt(e.target.value) || 1);
                  setShiftCycle((prev) => ({ ...prev, numWorkDays: days }));
                }}
                min={1}
              />
            </div>

            {/* Start Date */}
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={shiftCycle.startDate}
                onChange={(e) =>
                  setShiftCycle((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
              />
              {shiftCycle.startDate && (
                <p className="text-sm text-gray-600 mt-1">
                  Cycle starts on: {formatDate(shiftCycle.startDate)}
                </p>
              )}
            </div>

            {/* End Date */}
            {shiftCycle.endDate && (
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={shiftCycle.endDate}
                  disabled
                />
                <p className="text-sm text-gray-600 mt-1">
                  Cycle ends on: {formatDate(shiftCycle.endDate)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Workday Plans */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {Array.from(shiftCycle.workdays.entries()).map(
                ([key, workday], index) => (
                  <WorkdayConfigSelector
                    key={key}
                    dayIndex={index}
                    workday={workday}
                    templates={templates}
                    onCreateWorkday={(updatedWorkday) =>
                      handleWorkdayUpdate(key, updatedWorkday)
                    }
                    editingShiftId={editingShiftIds[key]}
                    setEditingShiftId={(id) =>
                      setEditingShiftIds((prev) => ({
                        ...prev,
                        [key]: id,
                      }))
                    }
                  />
                )
              )}
            </div>
          </div>
        )}

        {/* Step 3: Assign Tasks to Each Shift */}
        {step === 3 && (
          <div className="space-y-6">
            {Array.from(shiftCycle.workdays.entries()).map(
              ([key, workday], dayIndex) => (
                <div key={key}>
                  <h3 className="text-lg font-medium mb-2">
                    Day {dayIndex + 1}: {workday.title} (
                    {formatDate(workday.date)})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                    {workday.shifts.map((shift, index) => (
                      <ShiftTaskConfigurator
                        key={shift.id}
                        dayIndex={dayIndex}
                        shiftIndex={index}
                        shift={shift}
                        tasks={tasks}
                        onChange={(updatedShift: Shift) => {
                          setShiftCycle((prev) => {
                            const newWorkdays = new Map(prev.workdays);
                            const workdayToUpdate = newWorkdays.get(key);
                            if (!workdayToUpdate) return prev;

                            // Update the specific shift in the shifts array
                            const updatedShifts = workdayToUpdate.shifts.map(
                              (s) =>
                                s.id === updatedShift.id ? updatedShift : s
                            );

                            // Calculate workday times based on updated shifts
                            const { startTime, endTime } =
                              calculateWorkdayTimes(updatedShifts);

                            newWorkdays.set(key, {
                              ...workdayToUpdate,
                              shifts: updatedShifts,
                              startTime,
                              endTime,
                            });

                            // Show success toast
                            toast({
                              title: "Shift Updated",
                              description: `Shift "${updatedShift.title}" has been updated.`,
                              variant: "default",
                            });

                            return { ...prev, workdays: newWorkdays };
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Step 4: Preview Schedule */}
        {step === 4 && (
          <PreviewSchedule
            shiftCycle={shiftCycle}
            tasks={tasks}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 && step < 4 && (
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
        )}
        {step < 4 && (
          <Button onClick={handleNext} disabled={!shiftCycle.startDate}>
            Next
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ConfigureScheduleCycle;
