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
  Clock,
  Edit2,
  Plus,
  Trash,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { WorkdayConfigTemplateWithShiftsTemplate } from "@/types/types";
import { Shift, Workday } from "@/types/shift_cycle_types";

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
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [newSetUp, setNewSetUp] = useState(false);
  const [isSelectDisabled, setIsSelectDisabled] = useState(false);
  const [expandedShifts, setExpandedShifts] = useState<string[]>([]);
  const [editedShiftData, setEditedShiftData] = useState<Shift | null>(null);
  const [selectLabel, setSelectLabel] = useState("Select Template"); // Initialize selectLabel
  
  useEffect(() => {
    // Update the selectLabel based on the conditions
    if (newSetUp) {
      setSelectLabel("New Setup");
    } else if (selectedTemplateId) {
      const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
      setSelectLabel(selectedTemplate ? selectedTemplate.title : "Select Template");
    } else {
      setSelectLabel("Select Template");
    }
  }, [newSetUp, selectedTemplateId, templates]);

  useEffect(() => {
    if (workday.id) {
      setSelectedTemplateId(workday.id);
    }
  }, [workday.id]);

  const calculateWorkdayTimes = useCallback((shifts: Shift[]) => {
    if (shifts.length === 0) {
      return { startTime: "", endTime: "", isEndTimeNextDay: false };
    }

    const startTimes = shifts.map((shift) => {
      const [hour, minute] = shift.startTime.split(":").map(Number);
      return hour * 60 + minute;
    });

    const endTimes = shifts.map((shift) => {
      let [hour, minute] = shift.endTime.split(":").map(Number);
      let endTimeInMinutes = hour * 60 + minute;

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

  const calculateDuration = useCallback((start: string, end: string) => {
    let [startHour, startMinute] = start.split(":").map(Number);
    let [endHour, endMinute] = end.split(":").map(Number);

    let startTotal = startHour * 60 + startMinute;
    let endTotal = endHour * 60 + endMinute;

    if (endTotal <= startTotal) {
      endTotal += 24 * 60;
    }

    return endTotal - startTotal;
  }, []);

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

  const { startTime, endTime, isEndTimeNextDay } = useMemo(
    () => calculateWorkdayTimes(workday.shifts),
    [workday.shifts, calculateWorkdayTimes]
  );

  useEffect(() => {
    if (startTime !== workday.startTime || endTime !== workday.endTime) {
      onCreateWorkday({
        ...workday,
        startTime,
        endTime,
      });
    }
  }, [startTime, endTime, onCreateWorkday, workday]);

  const handleWorkDayTemplateSelect = useCallback(
    (value: string) => {
      setIsSelectDisabled(true);
      const selectedTemplate = templates.find((t) => t.id === value);
      if (selectedTemplate) {
        const updatedShifts = selectedTemplate.shifts.map((shift) => ({
          ...shift,
          id: uuidv4(),
          startTime: shift.startTime,
          endTime: shift.endTime,
          tasks: [],
          duration: calculateDuration(shift.startTime, shift.endTime),
        }));
        onCreateWorkday({
          ...workday,
          id: value,
          title: selectedTemplate.title,
          shifts: updatedShifts,
        });
        setSelectedTemplateId(value);
        setNewSetUp(false);
      }
      setIsSelectDisabled(false);
    },
    [templates, onCreateWorkday, workday, calculateDuration]
  );

  const handleAddShift = useCallback(() => {
    const lastShift = workday.shifts[workday.shifts.length - 1];
    const newStartTime = lastShift ? lastShift.endTime : "09:00";
    const defaultEndTime = "17:00";

    const newShift: Shift = {
      id: uuidv4(),
      title: "New Shift",
      startTime: newStartTime,
      endTime: defaultEndTime,
      tasks: [],
      duration: calculateDuration(newStartTime, defaultEndTime),
    };
    onCreateWorkday({ ...workday, shifts: [...workday.shifts, newShift] });
    setSelectedTemplateId(null);
    setNewSetUp(true);
  }, [workday, onCreateWorkday, calculateDuration]);

  const handleRemoveShift = useCallback(
    (shiftId: string) => {
      const shiftIndex = workday.shifts.findIndex(
        (shift) => shift.id === shiftId
      );
      if (shiftIndex === -1) return;

      const updatedShifts = workday.shifts.filter(
        (shift) => shift.id !== shiftId
      );

      if (shiftIndex < workday.shifts.length - 1 && updatedShifts.length > 0) {
        const removedShift = workday.shifts[shiftIndex];
        const nextShift = updatedShifts[shiftIndex];
        const updatedNextShift: Shift = {
          ...nextShift,
          startTime: removedShift.endTime,
          duration: calculateDuration(removedShift.endTime, nextShift.endTime),
        };
        updatedShifts[shiftIndex] = updatedNextShift;
      }

      onCreateWorkday({ ...workday, shifts: updatedShifts });

      if (updatedShifts.length > 0) {
        setNewSetUp(true);
      } else {
        setSelectedTemplateId(null);
        setNewSetUp(false);
      }
    },
    [workday, onCreateWorkday, calculateDuration]
  );

  const handleShiftChange = useCallback(
    (shiftId: string, field: keyof Shift, value: string) => {
      const shiftIndex = workday.shifts.findIndex(
        (shift) => shift.id === shiftId
      );
      if (shiftIndex === -1) return;

      const updatedShifts = workday.shifts.map((shift) => ({ ...shift }));

      if (field === "startTime" || field === "endTime" || field === "title") {
        updatedShifts[shiftIndex][field] = value;
      }

      const currentShift = updatedShifts[shiftIndex];
      currentShift.duration = calculateDuration(
        currentShift.startTime,
        currentShift.endTime
      );

      if (field === "endTime" && shiftIndex < updatedShifts.length - 1) {
        const nextShift = updatedShifts[shiftIndex + 1];
        nextShift.startTime = value;
        nextShift.duration = calculateDuration(
          nextShift.startTime,
          nextShift.endTime
        );
      }

      if (field === "startTime" && shiftIndex > 0) {
        const previousShift = updatedShifts[shiftIndex - 1];
        previousShift.endTime = value;
        previousShift.duration = calculateDuration(
          previousShift.startTime,
          previousShift.endTime
        );
      }

      onCreateWorkday({ ...workday, shifts: updatedShifts });
    },
    [workday, onCreateWorkday, calculateDuration]
  );

  const toggleShiftExpansion = (shiftId: string) => {
    setExpandedShifts((prev) =>
      prev.includes(shiftId)
        ? prev.filter((id) => id !== shiftId)
        : [...prev, shiftId]
    );
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="bg-blue-50 py-3 px-4 border-b border-blue-100">
        <CardTitle className="text-lg font-semibold text-blue-800">
          Day {dayIndex + 1} Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <Select
            onValueChange={handleWorkDayTemplateSelect}
            value={selectedTemplateId || undefined}
            
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

        <div className="space-y-2 mb-4">
          {workday.shifts.map((shift) => (
            <div
              key={shift.id}
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
              {editingShiftId === shift.id && (
                <div
                  className="overflow-hidden"
                  style={{
                    height: editingShiftId === shift.id ? "auto" : 0,
                    transition: "height 0.3s",
                  }}
                >
                  <div className="bg-gray-100 p-3">
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <input
                        type="text"
                        value={editedShiftData?.title || ""}
                        onChange={(e) =>
                          setEditedShiftData((prev) =>
                            prev ? { ...prev, title: e.target.value } : null
                          )
                        }
                        className="col-span-3 p-1 border rounded"
                        placeholder="Shift Title"
                      />
                      <div>
                        <Label className="text-xs">Start Time</Label>
                        <TimePicker
                          onChange={(value) =>
                            setEditedShiftData((prev) =>
                              prev ? { ...prev, startTime: value || "" } : null
                            )
                          }
                          value={editedShiftData?.startTime || ""}
                          format="HH:mm"
                          disableClock={true}
                          clearIcon={null}
                          className="w-full p-1 border rounded"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">End Time</Label>
                        <TimePicker
                          onChange={(value) =>
                            setEditedShiftData((prev) =>
                              prev ? { ...prev, endTime: value || "" } : null
                            )
                          }
                          value={editedShiftData?.endTime || ""}
                          format="HH:mm"
                          disableClock={true}
                          clearIcon={null}
                          className="w-full p-1 border rounded"
                        />
                      </div>
                      <Button
                        onClick={() => {
                          if (editedShiftData) {
                            handleShiftChange(
                              shift.id,
                              "title",
                              editedShiftData.title
                            );
                            handleShiftChange(
                              shift.id,
                              "startTime",
                              editedShiftData.startTime
                            );
                            handleShiftChange(
                              shift.id,
                              "endTime",
                              editedShiftData.endTime
                            );
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

        <Button
          onClick={handleAddShift}
          className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-2 rounded"
        >
          <Plus className="h-4 w-4 mr-1 inline" />
          Add Shift
        </Button>

        <div className="mt-4 bg-blue-50 p-2 rounded text-sm">
          <div className="flex justify-between">
            <span>
              Workday: {workday.startTime} - {workday.endTime}
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
