"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import {
  WorkdayConfigTemplateWithShiftsTemplate,
} from "@/types/types";
import { ShiftCycle, Task, Workday } from "@/types/shift_cycle_types";
import PreviewSchedule from "./Preview";
import { format, addDays } from "date-fns";
import WorkdayConfigSelector from "./WorkdayConfigSelector";

interface ConfigureScheduleCycleProps {
  tasks: Task[];
  templates: WorkdayConfigTemplateWithShiftsTemplate[];
}

const ConfigureScheduleCycle: React.FC<ConfigureScheduleCycleProps> = ({tasks, templates}) => {
  const router = useRouter();
  const [shiftCycle, setShiftCycle] = useState<ShiftCycle>({
    id: "1",
    title: "New Shift Cycle",
    numWorkDays: 5,
    startDate: "",
    endDate: "",
    workdays: [],
  });
  const [step, setStep] = useState<number>(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [editingShiftIds, setEditingShiftIds] = useState<{[dayIndex: string]: string | null;}>({});
  // const [templates, setTemplates] = useState<WorkdayConfigTemplateWithShiftsTemplate[]>([]);
  // const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [endDate, setEndDate] = useState<string>("");

  // const fetchTasks = useCallback(async () => {
  //   if (tasks.length > 0) return; // Don't fetch if we already have tasks
  //   setIsLoading(true);
  //   try {
  //     const result = await getTasks();
  //     if (result.success && result.data) {
  //       setTasks(result.data.map((task: Task) => ({
  //         ...task,
  //         id: task.id
  //       })));
  //     } else {
  //       setErrors(prev => ({ ...prev, fetchError: result.error || 'Unknown error occurred' }));
  //     }
  //   } catch (error) {
  //     setErrors(prev => ({ ...prev, fetchError: 'An error occurred while fetching tasks' }));
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [tasks.length]);

  // const fetchShiftTemplates = useCallback(async () => {
  //   if (templates.length > 0) return; // Don't fetch if we already have templates
  //   setIsLoading(true);
  //   try {
  //     const result = await getShiftTemplates();
  //     if (result.success) {
  //       setTemplates(result.data);
  //       console.log("shift templates successfully fetched");
  //     } else {
  //       setErrors(prev => ({
  //         ...prev,
  //         fetchError: result.error || "An error occurred while fetching shift templates.",
  //       }));
  //     }
  //   } catch (error) {
  //     setErrors(prev => ({ ...prev, fetchError: 'An error occurred while fetching shift templates' }));
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [templates.length]);

  // useEffect(() => {
  //   fetchTasks();
  //   fetchShiftTemplates();
  // }, [fetchTasks, fetchShiftTemplates]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE, MMMM d, yyyy");
  };

  useEffect(() => {
    if (shiftCycle.startDate && shiftCycle.numWorkDays > 0) {
      const startDate = new Date(shiftCycle.startDate);
      const calculatedEndDate = addDays(startDate, shiftCycle.numWorkDays - 1);
      setEndDate(format(calculatedEndDate, "yyyy-MM-dd"));
    }
  }, [shiftCycle.startDate, shiftCycle.numWorkDays]);

  const updateWorkdays = useCallback((days: number) => {
    const array = Array.from({ length: days }, (_, index) => ({
      id: (index + 1).toString(),
      title: `Day ${index + 1}`,
      date: "",
      startTime:"",
      endTime:"",
      shifts: [],
    }));

    setShiftCycle((prev) => ({
      ...prev,
      numWorkDays: days,
      workdays: array,
    }));
  }, []);

  const handleNext = useCallback(() => {
    if (step === 1) {
      if (shiftCycle.numWorkDays < 1) {
        setErrors({ cycleDays: "Cycle duration must be at least 1 day." });
        return;
      }
      if (!shiftCycle.startDate) {
        setErrors({ startDate: "Start date is required." });
        return;
      }
      updateWorkdays(shiftCycle.numWorkDays);
    }
    setErrors({});
    setStep((prev) => prev + 1);
    console.log(`shiftCycle ->`, shiftCycle);
  }, [step, shiftCycle.numWorkDays, shiftCycle.startDate, updateWorkdays]);

  const handleBack = useCallback(() => {
    setErrors({});
    setStep((prev) => prev - 1);
  }, []);

  const handleSubmit = useCallback(() => {
    console.log("Configuration saved:", shiftCycle);
    // Implement actual saving logic here
    router.push("/schedule-cycles");
  }, [shiftCycle, router]);

  const handleWorkdayUpdate = useCallback((index: number, updatedWorkday: Workday) => {
    setShiftCycle((prev) => {
      const newWorkdays = [...prev.workdays];
      newWorkdays[index] = updatedWorkday;
      return { ...prev, workdays: newWorkdays };
    });
  }, []);

  return (
    <Card className="mx-auto mt-10">
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
        <Progress value={(step / 4) * 100} className="mb-4" />

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cycleDays">Number of Days in Cycle</Label>
              <Input
                id="cycleDays"
                type="number"
                value={shiftCycle.numWorkDays}
                onChange={(e) => setShiftCycle(prev => ({ ...prev, numWorkDays: Number(e.target.value) }))}
                min={1}
              />
              {errors.cycleDays && (
                <p className="text-red-500 text-sm">{errors.cycleDays}</p>
              )}
            </div>

            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={shiftCycle.startDate}
                onChange={(e) => setShiftCycle(prev => ({ ...prev, startDate: e.target.value }))}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">{errors.startDate}</p>
              )}
              {shiftCycle.startDate && (
                <p className="text-sm text-gray-600 mt-1">
                  Cycle starts on: {formatDate(shiftCycle.startDate)}
                </p>
              )}
            </div>

            {endDate && (
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  disabled
                />
                <p className="text-sm text-gray-600 mt-1">
                  Cycle ends on: {formatDate(endDate)}
                </p>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {shiftCycle.workdays.map((workday, index) => (
              <WorkdayConfigSelector
                key={workday.id}
                dayIndex={index}
                workday={workday}
                templates={templates}
                onCreateWorkday={(updatedWorkday) => handleWorkdayUpdate(index, updatedWorkday)}
                editingShiftId={editingShiftIds[index]}
                setEditingShiftId={(id) => setEditingShiftIds(prev => ({ ...prev, [index]: id }))}
              />
            ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            {shiftCycle.workdays.map((config, dayIndex) => (
              <div key={config.id}>
                <h3 className="text-lg font-medium mb-2">
                  Day {dayIndex + 1}: {config.title}
                </h3>
                
                  {config.shifts.map((shift, shiftIndex) => (
                  <ShiftTaskConfigurator
                    key={shift.id}
                    dayIndex={dayIndex}
                    shiftIndex={shiftIndex}
                    shift={{ ...shift, startTime: format(new Date(`1970-01-01T${shift.startTime}:00`), "hh:mm a"), endTime: format(new Date(`1970-01-01T${shift.endTime}:00`), "hh:mm a") }}
                    tasks={tasks}
                    onChange={(updatedShift) => {
                      handleWorkdayUpdate(dayIndex, {
                        ...config,
                        shifts: config.shifts.map((s, idx) => idx === shiftIndex ? updatedShift : s)
                      });
                    }}
                  />
                ))}
                
              </div>
            ))}
          </div>
        )}

        {step === 4 && (
          <PreviewSchedule
            shiftCycle={shiftCycle}
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