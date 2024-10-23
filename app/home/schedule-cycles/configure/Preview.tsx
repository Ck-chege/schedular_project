import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { NewShiftCycle, Task, Workday } from "@/types/shift_cycle_types";
import { Calendar, Clock, Users, CheckSquare, ChevronLeft, Save } from "lucide-react";

interface PreviewScheduleProps {
  shiftCycle: NewShiftCycle;
  tasks: Task[];
  onBack: () => void;
  onSubmit: () => void;
}

const PreviewSchedule: React.FC<PreviewScheduleProps> = ({
  shiftCycle,
  tasks,
  onBack,
  onSubmit,
}) => {

  const handleFinalize = () => {
    console.log("Finalizing schedule:", shiftCycle);
    onSubmit();
  };

  // Helper function to find task by ID
  const findTaskById = (taskId: string): Task | undefined => {
    return tasks.find(task => task.id === taskId);
  };

  const WorkdayCard = ({ workday, dayIndex }: { workday: Workday; dayIndex: number }) => (
    <Card className="bg-gray-100 rounded-lg p-4 mb-6">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-xl font-bold flex justify-between items-center">
          <span>Day {dayIndex + 1}: {workday.title}</span>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{workday.date}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <div className="text-sm text-gray-600 mb-4">
        Hours: {workday.startTime} - {workday.endTime}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
        {workday.shifts.map((shift) => (
          <Card key={shift.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{shift.title}</h3>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                <span>{shift.tasks.size} tasks</span>
              </div>
            </div>
            <div className="flex items-center text-gray-600 mb-2">
              <Clock className="w-4 h-4 mr-2" />
              <span>{shift.startTime} - {shift.endTime}</span>
            </div>
            <div className="text-sm text-gray-500 mb-3">
              Duration: {(new Date(`2000-01-01T${shift.endTime}:00`).getTime() - new Date(`2000-01-01T${shift.startTime}:00`).getTime()) / 60000} minutes
            </div>
            <div className="mt-3">
              <h4 className="text-sm font-semibold mb-2">Tasks:</h4>
              <div className="grid grid-cols-2 gap-2">
                {Array.from(shift.tasks.entries()).map(([id, taskInfo]) => {
                  const task = findTaskById(taskInfo.taskId);
                  return (
                    <div key={id} className="bg-gray-50 p-2 rounded flex items-center">
                      <CheckSquare className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                      <span className="text-sm">
                        <strong>{task ? task.name : 'Unknown Task'}</strong>
                        {taskInfo.employeesRequired && ` (${taskInfo.employeesRequired} ${taskInfo.employeesRequired === 1 ? 'staff' : 'staffs'})`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">{shiftCycle.title}</CardTitle>
          <div className="text-gray-600">
            {shiftCycle.startDate} to {shiftCycle.endDate} ({shiftCycle.numWorkDays} work days)
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-gray-600 space-x-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Workdays: {shiftCycle.numWorkDays}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>Total Shifts: {Array.from(shiftCycle.workdays.values()).reduce((acc, workday) => acc + workday.shifts.length, 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-6">
        {Array.from(shiftCycle.workdays.entries()).map(([id, workday], index) => (
          <WorkdayCard key={id} workday={workday} dayIndex={index} />
        ))}
      </div>
      <Card className="mt-8">
        <CardFooter className="flex justify-between">
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

