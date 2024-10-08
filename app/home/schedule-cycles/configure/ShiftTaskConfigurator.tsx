"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash, Plus, Clock, Users } from "lucide-react";
import { Shift, ShiftTaskInfo } from "@/types/shift_cycle_types";

interface Task {
  id: string;
  name: string;
  description: string;
}

interface ShiftTaskConfiguratorProps {
  dayIndex: number;
  shiftIndex: number;
  shift: Shift;
  tasks: Task[];
  onChange: (shift: Shift) => void;
}

const ShiftTaskConfigurator: React.FC<ShiftTaskConfiguratorProps> = ({
  shift,
  tasks,
  onChange,
}) => {
  const handleAddTask = () => {
    if (tasks.length === 0) return;
    const newTask: ShiftTaskInfo = {
      taskId: tasks[0].id,
      employeesRequired: 1,
    };
    onChange({ ...shift, tasks: [...shift.tasks, newTask] });
  };

  const handleTaskChange = (
    index: number,
    field: keyof ShiftTaskInfo,
    value: any
  ) => {
    const updatedTasks = shift.tasks.map((task, idx) =>
      idx === index ? { ...task, [field]: value } : task
    );
    onChange({ ...shift, tasks: updatedTasks });
  };

  const handleRemoveTask = (index: number) => {
    const updatedTasks = shift.tasks.filter((_, idx) => idx !== index);
    onChange({ ...shift, tasks: updatedTasks });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mb-8 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">{shift.title}</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{shift.startTime} - {shift.endTime}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <span>{shift.tasks.length} Tasks</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {shift.tasks.map((task, index) => (
            <Card key={index} className="bg-gray-50 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-grow">
                    <Label htmlFor={`task-${index}`} className="mb-1 block text-sm font-medium">
                      Task
                    </Label>
                    <Select
                      value={task.taskId.toString()}
                      onValueChange={(value) =>
                        handleTaskChange(index, "taskId", value)
                      }
                    >
                      <SelectTrigger id={`task-${index}`} className="w-full">
                        <SelectValue placeholder="Select a task" />
                      </SelectTrigger>
                      <SelectContent>
                        {tasks.map((demoTask) => (
                          <SelectItem key={demoTask.id} value={demoTask.id.toString()}>
                            {demoTask.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-32">
                    <Label htmlFor={`employees-${index}`} className="mb-1 block text-sm font-medium">
                      Employees
                    </Label>
                    <Input
                      id={`employees-${index}`}
                      type="number"
                      placeholder="Required"
                      value={task.employeesRequired}
                      min={1}
                      onChange={(e) =>
                        handleTaskChange(index, "employeesRequired", Number(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveTask(index)}
                      className="h-10 w-10"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-6 flex justify-center">
        <Button
          variant="outline"
          onClick={handleAddTask}
          disabled={tasks.length === 0}
          className="w-full max-w-xs"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShiftTaskConfigurator;