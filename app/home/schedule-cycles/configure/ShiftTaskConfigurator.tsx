import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash, Plus, Clock, Edit, ChevronUp, ChevronDown } from "lucide-react";
import { Shift, ShiftTaskInfo, Task } from "@/types/shift_cycle_types";
import { v4 as uuidv4 } from "uuid";

interface ShiftTaskConfiguratorProps {
  dayIndex: number;
  shiftIndex: number;
  shift: Shift;
  tasks: Task[];
  onChange: (shift: Shift) => void;
}

const TaskModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  shift: Shift;
  tasks: Task[];
  onChange: (updatedShift: Shift) => void;
}> = ({ isOpen, onClose, shift, tasks, onChange }) => {
  const [localShift, setLocalShift] = useState<Shift>(shift);

  const handleAddTask = () => {
    if (tasks.length === 0) return;
    const newTask: ShiftTaskInfo = {
      taskId: tasks[0].id,
      employeesRequired: 1,
    };
    const taskEntryId = uuidv4();
    const updatedTasks = new Map(localShift.tasks);
    updatedTasks.set(taskEntryId, newTask);
    setLocalShift({ ...localShift, tasks: updatedTasks });
  };

  
  const handleTaskChange = (
    taskEntryId: string,
    field: keyof ShiftTaskInfo,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ) => {
    const updatedTasks = new Map(localShift.tasks);
    const task = updatedTasks.get(taskEntryId);
    if (task) {
      updatedTasks.set(taskEntryId, { ...task, [field]: value });
      setLocalShift({ ...localShift, tasks: updatedTasks });
    }
  };

  const handleRemoveTask = (taskEntryId: string) => {
    const updatedTasks = new Map(localShift.tasks);
    updatedTasks.delete(taskEntryId);
    setLocalShift({ ...localShift, tasks: updatedTasks });
  };

  const handleSave = () => {
    onChange(localShift);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Edit Tasks for {shift.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {Array.from(localShift.tasks.entries()).map(([taskEntryId, task]) => (
            <div key={taskEntryId} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
              <Select
                value={task.taskId}
                onValueChange={(value) => handleTaskChange(taskEntryId, "taskId", value)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select a task" />
                </SelectTrigger>
                <SelectContent>
                  {tasks.map((demoTask) => (
                    <SelectItem key={demoTask.id} value={demoTask.id}>
                      {demoTask.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Staff"
                value={task.employeesRequired}
                min={1}
                onChange={(e) => handleTaskChange(taskEntryId, "employeesRequired", Number(e.target.value))}
                className="w-20 bg-white"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveTask(taskEntryId)}
                className="text-gray-400 hover:text-red-500 bg-white"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 space-x-2 flex justify-end bg-gray-100 p-3 rounded-b-lg">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAddTask} disabled={tasks.length === 0} variant="secondary">
            <Plus className="mr-1 h-4 w-4" /> Add Task
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


const ShiftTaskConfigurator: React.FC<ShiftTaskConfiguratorProps> = ({
  shift,
  tasks,
  onChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);

  const getTaskName = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.name : 'Unknown Task';
  };

  const totalEmployees = Array.from(shift.tasks.values()).reduce((sum, task) => sum + task.employeesRequired, 0);
  const taskEntries = Array.from(shift.tasks.entries());
  const displayedTasks = showAllTasks ? taskEntries : taskEntries.slice(0, 4);

  return (
    <Card className="mb-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="bg-gray-50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-lg font-bold text-gray-800">{shift.title}</div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              <span>{shift.startTime} - {shift.endTime}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-gray-700">
              <span className="mr-2">{shift.tasks.size} Tasks</span>
              <span>({totalEmployees} Employees)</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="text-xs">
              <Edit className="h-3 w-3 mr-1" /> Edit
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        {shift.tasks.size > 0 ? (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-1 px-2 font-semibold text-gray-700">Task Name</th>
                  <th className="text-right py-1 px-2 font-semibold text-gray-700">Employees</th>
                </tr>
              </thead>
              <tbody>
                {displayedTasks.map(([taskId, task], index) => (
                  <tr key={taskId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-1 px-2 text-gray-800">{getTaskName(task.taskId)}</td>
                    <td className="py-1 px-2 text-right text-gray-600">{task.employeesRequired}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {shift.tasks.size > 4 && (
              <Button
                variant="ghost"
                className="w-full mt-2 text-xs py-1"
                onClick={() => setShowAllTasks(!showAllTasks)}
              >
                {showAllTasks ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1" />
                    View More ({shift.tasks.size - 4} more)
                  </>
                )}
              </Button>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500 italic py-2">No tasks assigned</div>
        )}
      </CardContent>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shift={shift}
        tasks={tasks}
        onChange={onChange}
      />
    </Card>
  );
};

export default ShiftTaskConfigurator;