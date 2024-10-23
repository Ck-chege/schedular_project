"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit2,
  Plus,
  Trash,
  ChevronUp,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { WorkdayConfigTemplateWithShiftsTemplate } from "@/types/types";
import { Shift, ShiftTaskInfo, Workday } from "@/types/shift_cycle_types";
import { useToast } from "@/hooks/use-toast";

interface WorkdayConfigSelectorProps {
  dayIndex: number;
  workday: Workday;
  templates: WorkdayConfigTemplateWithShiftsTemplate[];
  onCreateWorkday: (config: Workday) => void;
  editingShiftId: string | null;
  setEditingShiftId: (id: string | null) => void;
}

const WorkdayConfigSelector: React.FC<WorkdayConfigSelectorProps> = ({
  dayIndex,
  workday,
  templates,
  onCreateWorkday,
  editingShiftId,
  setEditingShiftId,
}) => {
  const { toast } = useToast(); // Initialize toast

  // Local state to manage shifts as an array
  const [shifts, setShifts] = useState<Shift[]>([]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [newSetUp, setNewSetUp] = useState(false);
  const [isSelectDisabled, setIsSelectDisabled] = useState(false);
  const [editedShiftData, setEditedShiftData] = useState<Shift | null>(null);
  const [selectLabel, setSelectLabel] = useState("Select Template"); // Initialize selectLabel

  // Helper function to check for duplicate IDs
  const hasDuplicateIds = (shiftsArray: Shift[]) => {
    const ids = shiftsArray.map((shift) => shift.id);
    return new Set(ids).size !== ids.length;
  };

  // Initialize shifts with unique IDs only once
  useEffect(() => {
    const shiftsWithIds = Array.from(workday.shifts).map((shift) => ({
      ...shift,
      id: shift.id || uuidv4(), // Assign existing ID or generate a new one
    }));

    if (hasDuplicateIds(shiftsWithIds)) {
      console.error("Duplicate shift IDs detected during initialization!");
      toast({
        title: "Initialization Error",
        description: "Duplicate shift IDs detected. Please check your data.",
        variant: "destructive",
      });
    }

    setShifts(shiftsWithIds);
  }, [workday.shifts, toast]);

  // Update the selectLabel based on the conditions
  useEffect(() => {
    if (newSetUp) {
      setSelectLabel("New Setup");
    } else if (selectedTemplateId) {
      const selectedTemplate = templates.find(
        (t) => t.id === selectedTemplateId
      );
      setSelectLabel(
        selectedTemplate ? selectedTemplate.title : "Select Template"
      );
    } else {
      setSelectLabel("Select Template");
    }
  }, [newSetUp, selectedTemplateId, templates]);

  // Set selectedTemplateId based on workday.id
  useEffect(() => {
    if (workday.id) {
      setSelectedTemplateId(workday.id);
    }
  }, [workday.id]);

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

  // Calculate duration between two times
  const calculateDuration = useCallback((start: string, end: string) => {
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    const startTotal = startHour * 60 + startMinute;
    let endTotal = endHour * 60 + endMinute;

    if (endTotal <= startTotal) {
      endTotal += 24 * 60;
    }

    return endTotal - startTotal;
  }, []);

  // Format duration into human-readable string
  const formatDuration = (durationInMinutes: number) => {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours} hours and ${minutes} minutes`;
    } else if (hours > 0) {
      return `${hours} hours`;
    } else {
      return `${minutes} minutes`;
    }
  };

  // Memoized calculation of workday times
  const { startTime, endTime, isEndTimeNextDay } = useMemo(
    () => calculateWorkdayTimes(shifts),
    [shifts, calculateWorkdayTimes]
  );

  // Update workday start and end times when shifts change
  useEffect(() => {
    if (startTime !== workday.startTime || endTime !== workday.endTime) {
      onCreateWorkday({
        ...workday,
        startTime,
        endTime, // Ensure this property is updated
      });
    }
  }, [startTime, endTime, onCreateWorkday, workday]);

  // Handle template selection
  const handleWorkDayTemplateSelect = useCallback(
    (value: string) => {
      setIsSelectDisabled(true);
      const selectedTemplate = templates.find((t) => t.id === value);
      if (selectedTemplate) {
        const newShifts: Shift[] = selectedTemplate.shifts.map((shift) => ({
          ...shift,
          id: uuidv4(), // Ensure unique ID
          tasks: new Map<string, ShiftTaskInfo>(), // Initialize tasks as Map
          duration: calculateDuration(shift.startTime, shift.endTime),
        }));

        setShifts(newShifts);
        onCreateWorkday({
          ...workday,
          id: value,
          title: selectedTemplate.title,
          shifts: newShifts,
        });
        setSelectedTemplateId(value);
        setNewSetUp(false);

        // Show success toast
        toast({
          title: "Template Applied",
          description: `Workday template "${selectedTemplate.title}" has been applied.`,
          variant: "default",
        });
      } else {
        // Show error toast if template not found
        toast({
          title: "Template Not Found",
          description: "The selected template could not be found.",
          variant: "destructive",
        });
      }
      setIsSelectDisabled(false);
    },
    [templates, onCreateWorkday, workday, calculateDuration, toast]
  );

  // Handle adding a new shift
  const handleAddShift = useCallback(() => {
    const lastShift = shifts[shifts.length - 1];
    const newStartTime = lastShift ? lastShift.endTime : "09:00";
    const defaultEndTime = "17:00";

    const newShift: Shift = {
      id: uuidv4(),
      title: "New Shift",
      startTime: newStartTime,
      endTime: defaultEndTime,
      tasks: new Map<string, ShiftTaskInfo>(),
      duration: calculateDuration(newStartTime, defaultEndTime),
    };

    // Ensure uniqueness based on 'id'
    if (!shifts.some((shift) => shift.id === newShift.id)) {
      const updatedShifts = [...shifts, newShift];
      setShifts(updatedShifts);
      onCreateWorkday({ ...workday, shifts: updatedShifts });

      setSelectedTemplateId(null);
      setNewSetUp(true);

      // Show success toast
      toast({
        title: "Shift Added",
        description: `Shift "${newShift.title}" has been added.`,
        variant: "default",
      });
    } else {
      // Show error toast if duplicate
      toast({
        title: "Duplicate Shift",
        description: "A shift with the same ID already exists.",
        variant: "destructive",
      });
    }
  }, [shifts, onCreateWorkday, workday, calculateDuration, toast]);

  // Handle removing a shift
  const handleRemoveShift = useCallback(
    (shiftId: string) => {
      const shiftToRemove = shifts.find((shift) => shift.id === shiftId);
      if (!shiftToRemove) {
        // Show error toast if shift not found
        toast({
          title: "Shift Not Found",
          description: "The shift you are trying to remove does not exist.",
          variant: "destructive",
        });
        return;
      }

      const shiftIndex = shifts.findIndex((shift) => shift.id === shiftId);
      if (shiftIndex === -1) return;

      const updatedShifts = shifts.filter((shift) => shift.id !== shiftId);

      // Update adjacent shifts if necessary
      if (shiftIndex < shifts.length - 1 && updatedShifts.length > 0) {
        const nextShiftIndex = shiftIndex; // Since the array has shifted
        const nextShift = updatedShifts[nextShiftIndex];
        const updatedNextShift: Shift = {
          ...nextShift,
          startTime: shiftToRemove.startTime, // Update to the startTime of the removed shift
          duration: calculateDuration(shiftToRemove.startTime, nextShift.endTime),
        };
        // Replace the next shift in updatedShifts
        updatedShifts[nextShiftIndex] = updatedNextShift;
      }

      // Check for duplicate IDs after removal
      if (hasDuplicateIds(updatedShifts)) {
        console.error("Duplicate shift IDs detected after removal!");
        toast({
          title: "Update Error",
          description: "Duplicate shift IDs detected after removal.",
          variant: "destructive",
        });
        return;
      }

      setShifts(updatedShifts);
      onCreateWorkday({ ...workday, shifts: updatedShifts });

      if (updatedShifts.length > 0) {
        setNewSetUp(true);
      } else {
        setSelectedTemplateId(null);
        setNewSetUp(false);
      }

      // Show success toast
      toast({
        title: "Shift Removed",
        description: `Shift "${shiftToRemove.title}" has been removed.`,
        variant: "default",
      });
    },
    [shifts, onCreateWorkday, workday, calculateDuration, toast]
  );

  // Handle updating multiple fields of a shift
  const handleShiftChangeMultiple = useCallback(
    (shiftId: string, updatedFields: Partial<Shift>) => {
      const shiftIndex = shifts.findIndex((shift) => shift.id === shiftId);
      if (shiftIndex === -1) {
        // Show error toast if shift not found
        toast({
          title: "Shift Not Found",
          description: "The shift you are trying to update does not exist.",
          variant: "destructive",
        });
        return;
      }

      const updatedShifts = [...shifts];
      const existingShift = updatedShifts[shiftIndex];
      const updatedShift: Shift = { ...existingShift, ...updatedFields };

      // Recalculate duration if startTime or endTime changes
      if (updatedFields.startTime || updatedFields.endTime) {
        updatedShift.duration = calculateDuration(
          updatedShift.startTime,
          updatedShift.endTime
        );
      }

      updatedShifts[shiftIndex] = updatedShift;

      // Update adjacent shifts if endTime changes
      if (updatedFields.endTime && shiftIndex < updatedShifts.length - 1) {
        const nextShift = { ...updatedShifts[shiftIndex + 1] };
        nextShift.startTime = updatedFields.endTime;
        nextShift.duration = calculateDuration(nextShift.startTime, nextShift.endTime);
        updatedShifts[shiftIndex + 1] = nextShift;
      }

      // Update adjacent shifts if startTime changes
      if (updatedFields.startTime && shiftIndex > 0) {
        const previousShift = { ...updatedShifts[shiftIndex - 1] };
        previousShift.endTime = updatedFields.startTime;
        previousShift.duration = calculateDuration(previousShift.startTime, updatedFields.startTime);
        updatedShifts[shiftIndex - 1] = previousShift;
      }

      // Check for duplicate IDs after update
      if (hasDuplicateIds(updatedShifts)) {
        console.error("Duplicate shift IDs detected after update!");
        toast({
          title: "Update Error",
          description: "Duplicate shift IDs detected after update.",
          variant: "destructive",
        });
        return;
      }

      setShifts(updatedShifts);
      onCreateWorkday({ ...workday, shifts: updatedShifts });

      // Show success toast
      toast({
        title: "Shift Updated",
        description: `Shift "${updatedShift.title}" has been updated.`,
        variant: "default",
      });
    },
    [shifts, onCreateWorkday, workday, calculateDuration, toast]
  );

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="bg-blue-50 py-3 px-4 border-b border-blue-100">
        <CardTitle className="flex items-center justify-between text-xl font-bold">
          <span className="text-blue-700">
            Day {dayIndex + 1} Configuration
          </span>
          <span className="text-gray-600 text-sm font-medium">
            {workday.date}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Template Selection */}
        <div className="mb-4">
          <Select
            onValueChange={handleWorkDayTemplateSelect}
            value={selectedTemplateId || undefined}
            disabled={isSelectDisabled}
          >
            <SelectTrigger className="w-full border border-gray-300">
              <SelectValue placeholder="Select Shift Template">
                {selectLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Shifts List */}
        <div className="space-y-2 mb-4">
          {shifts.map((shift) => (
            <div
              key={shift.id} // Ensures unique key for each shift
              className="border border-gray-200 rounded-md overflow-hidden"
            >
              <div className="flex items-center justify-between bg-gray-50 p-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{shift.title}</span>
                  <span className="text-sm text-gray-500">
                    {shift.startTime} - {shift.endTime}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({formatDuration(shift.duration)})
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingShiftId(
                        editingShiftId === shift.id ? null : shift.id
                      );
                      setEditedShiftData({ ...shift });
                    }}
                    aria-label="Edit Shift"
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    {editingShiftId === shift.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <Edit2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveShift(shift.id)}
                    aria-label="Remove Shift"
                    className="text-red-500 hover:text-red-600 p-1"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {editingShiftId === shift.id && editedShiftData && (
                <div
                  className="overflow-hidden"
                  style={{
                    height: editingShiftId === shift.id ? "auto" : 0,
                    transition: "height 0.3s",
                  }}
                >
                  <div className="bg-gray-100 p-3">
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {/* Shift Title */}
                      <input
                        type="text"
                        value={editedShiftData.title}
                        onChange={(e) =>
                          setEditedShiftData((prev) =>
                            prev ? { ...prev, title: e.target.value } : null
                          )
                        }
                        className="col-span-3 p-1 border rounded"
                        placeholder="Shift Title"
                      />
                      {/* Start Time */}
                      <div>
                        <Label className="text-xs">Start Time</Label>
                        <TimePicker
                          onChange={(value) =>
                            setEditedShiftData((prev) =>
                              prev ? { ...prev, startTime: value || "" } : null
                            )
                          }
                          value={editedShiftData.startTime}
                          format="HH:mm"
                          disableClock={true}
                          clearIcon={null}
                          className="w-full p-1 border rounded"
                        />
                      </div>
                      {/* End Time */}
                      <div>
                        <Label className="text-xs">End Time</Label>
                        <TimePicker
                          onChange={(value) =>
                            setEditedShiftData((prev) =>
                              prev ? { ...prev, endTime: value || "" } : null
                            )
                          }
                          value={editedShiftData.endTime}
                          format="HH:mm"
                          disableClock={true}
                          clearIcon={null}
                          className="w-full p-1 border rounded"
                        />
                      </div>
                      {/* Save Button */}
                      <Button
                        onClick={() => {
                          if (editedShiftData) {
                            handleShiftChangeMultiple(shift.id, {
                              title: editedShiftData.title,
                              startTime: editedShiftData.startTime,
                              endTime: editedShiftData.endTime,
                            });
                          }
                          setEditingShiftId(null);
                          setEditedShiftData(null);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm p-1"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Shift Button */}
        <Button
          onClick={handleAddShift}
          className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-2 rounded"
        >
          <Plus className="h-4 w-4 mr-1 inline" />
          Add Shift
        </Button>

        {/* Workday Times Display */}
        <div className="mt-4 bg-blue-50 p-2 rounded text-sm">
          <div className="flex justify-between">
            <span>
              Workday: {startTime} - {endTime}
            </span>
            {isEndTimeNextDay && (
              <span className="text-blue-600">Next Day</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkdayConfigSelector;
