"use client";
import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Types and interfaces
type TimeCategory = "Unavailable" | "Desirable" | "Undesirable" | "None";

interface Shift {
  id: string;
  duration: number;
  startTime: string;
  endTime: string;
  title: string;
}

interface Workday {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  shifts: Shift[];
}

interface ShiftCycle {
  id: string;
  title: string;
  numWorkDays: number;
  startDate: string;
  endDate: string;
  workdays: Workday[];
}

interface ShiftPreference {
  workdayId: string;
  shiftId: string;
  category: TimeCategory;
}

interface EmployeeShiftAvailabilityPageProps {
  shiftCycle: ShiftCycle;
}

const EmployeeShiftAvailabilityPage: React.FC<EmployeeShiftAvailabilityPageProps> = ({shiftCycle}) => {
  const [shiftPreferences, setShiftPreferences] = useState<Map<string, ShiftPreference>>(new Map());

  const handleShiftPreference = (workdayId: string, shiftId: string, category: TimeCategory) => {
    const key = `${workdayId}-${shiftId}`;
    setShiftPreferences((prev) => {
      const updated = new Map(prev);
      updated.set(key, { workdayId, shiftId, category });
      return updated;
    });
  };

  const getShiftCategory = (workdayId: string, shiftId: string): TimeCategory => {
    const key = `${workdayId}-${shiftId}`;
    return shiftPreferences.get(key)?.category || "None";
  };

  const getCategoryColor = (category: TimeCategory) => {
    switch (category) {
      case "Unavailable": return "bg-red-100 border-red-400";
      case "Desirable": return "bg-green-100 border-green-400";
      case "Undesirable": return "bg-yellow-100 border-yellow-400";
      default: return "bg-gray-100 border-gray-300";
    }
  };

  return (
    <Card className="max-w-6xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-6 h-6" />
          {shiftCycle.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {shiftCycle.workdays.map((workday) => (
            <Card key={workday.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {format(parseISO(workday.date), "EEE, MMM d")} - {workday.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {workday.shifts.map((shift) => (
                    <div key={shift.id} className={`p-3 rounded-md border ${getCategoryColor(getShiftCategory(workday.id, shift.id))}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{shift.title}</span>
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="text-sm mb-2">{shift.startTime} - {shift.endTime}</div>
                      <Select
                        value={getShiftCategory(workday.id, shift.id)}
                        onValueChange={(value) => handleShiftPreference(workday.id, shift.id, value as TimeCategory)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">Select</SelectItem>
                          <SelectItem value="Unavailable">Unavailable</SelectItem>
                          <SelectItem value="Desirable">Desirable</SelectItem>
                          <SelectItem value="Undesirable">Undesirable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={() => console.log("Shift Preferences Submitted:", Array.from(shiftPreferences.entries()))}>
          Submit Shift Preferences
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmployeeShiftAvailabilityPage;

