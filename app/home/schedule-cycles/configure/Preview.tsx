"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ShiftCycle } from "@/types/shift_cycle_types";
import { Calendar, Clock, Users, ChevronLeft, ChevronRight, Save } from "lucide-react";

interface PreviewScheduleProps {
  shiftCycle: ShiftCycle;
  onBack: () => void;
  onSubmit: () => void;
}

const PreviewSchedule: React.FC<PreviewScheduleProps> = ({
  shiftCycle,
  onBack,
  onSubmit,
}) => {
  const router = useRouter();

  const handleFinalize = () => {
    console.log("Finalizing schedule:", shiftCycle);
    onSubmit();
    router.push("/schedule-cycles");
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 to-indigo-700 min-h-screen p-6">
      <Card className="max-w-7xl mx-auto shadow-2xl rounded-lg overflow-hidden">
        <CardHeader className="bg-white p-6 border-b border-gray-200">
          <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-between">
            <span>Preview Schedule Cycle</span>
            <div className="text-sm font-normal text-gray-500 flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{shiftCycle.startDate} - {shiftCycle.endDate}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-gray-50 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="bg-white shadow-md">
                <CardHeader className="bg-gray-100 p-4">
                  <CardTitle className="text-xl font-semibold text-gray-800">Cycle Information</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <p className="flex items-center"><span className="font-semibold mr-2">Title:</span> {shiftCycle.title}</p>
                  <p className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> <span className="font-semibold mr-2">Workdays:</span> {shiftCycle.numWorkDays}</p>
                  <p className="flex items-center"><Clock className="w-4 h-4 mr-2" /> <span className="font-semibold mr-2">Total Shifts:</span> {shiftCycle.workdays.reduce((acc, day) => acc + day.shifts.length, 0)}</p>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Workdays Overview</h3>
                {shiftCycle.workdays.map((workday, dayIndex) => (
                  <Card key={workday.id} className="bg-white shadow-md mb-4">
                    <CardHeader className="bg-gray-100 p-4">
                      <CardTitle className="text-xl font-semibold text-gray-800 flex justify-between items-center">
                        <span>Day {dayIndex + 1}: {workday.title}</span>
                        <span className="text-sm font-normal text-gray-500">{workday.shifts.length} Shifts</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      {workday.shifts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {workday.shifts.map((shift, shiftIndex) => (
                            <div key={shift.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                                <Users className="w-5 h-5 mr-2" />
                                Shift {shiftIndex + 1}: {shift.title}
                              </h4>
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600 flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {shift.startTime} - {shift.endTime}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {shift.tasks.length} Tasks
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 italic">No shifts configured for this day.</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-white p-6 flex justify-between border-t border-gray-200">
          <Button variant="outline" onClick={onBack} className="flex items-center">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleFinalize} className="bg-blue-600 text-white hover:bg-blue-700 flex items-center">
            Finalize and Save
            <Save className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PreviewSchedule;