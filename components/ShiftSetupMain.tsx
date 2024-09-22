import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from '@radix-ui/react-label';
import { Clock, TimerIcon, Layers, Info } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ShiftSetupMain = ({ onContinue }: { onContinue: (data: { startTime: string; endTime: string; duration: number; shiftType: string; schedulingCycle: string }) => void }) => {
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('09:00');
    const [duration, setDuration] = useState(24);
    const [shiftType, setShiftType] = useState('');
    const [schedulingCycle, setSchedulingCycle] = useState('');
    const [isNextDay, setIsNextDay] = useState(false);
  
    useEffect(() => {
      updateEndTime();
    }, [startTime, duration]);
  
    const updateEndTime = () => {
      const start = new Date(`2000-01-01T${startTime}:00`);
      const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
      setEndTime(end.toTimeString().slice(0, 5));
      setIsNextDay(end.getDate() > start.getDate());
    };
  
    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setStartTime(e.target.value);
    };
  
    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newEndTime = e.target.value;
      setEndTime(newEndTime);
      
      const start = new Date(`2000-01-01T${startTime}:00`);
      const end = new Date(`2000-01-01T${newEndTime}:00`);
      if (end <= start) {
        end.setDate(end.getDate() + 1);
        setIsNextDay(true);
      } else {
        setIsNextDay(false);
      }
      
      let newDuration = (end.getTime() - start.getTime()) / (60 * 60 * 1000);
      if (newDuration > 24) newDuration = 24;
      setDuration(newDuration);
    };
  
    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newDuration = Number(e.target.value);
      if (newDuration > 24) newDuration = 24;
      if (newDuration < 0) newDuration = 0;
      setDuration(newDuration);
    };
  
    const handleContinue = () => {
      onContinue({ startTime, endTime, duration, shiftType, schedulingCycle });
    };
  
    return (
        <div className="container mx-auto p-4 max-w-2xl">
          <h1 className="text-3xl font-bold mb-6 text-center text-primary">Shift Setup</h1>
          <Card className="shadow-lg">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="text-2xl">Configure Your Workday</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="flex items-center gap-2">
                    <Clock size={18} />
                    Start Time
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={handleStartTimeChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="flex items-center gap-2">
                    <Clock size={18} />
                    End Time
                  </Label>
                  <div className="relative">
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={handleEndTimeChange}
                    />
                    {isNextDay && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full">
                        Next day
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="flex items-center gap-2">
                    <TimerIcon size={18} />
                    Workday Duration (hours)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={duration}
                    onChange={handleDurationChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shiftType" className="flex items-center gap-2">
                    <Layers size={18} />
                    Shift Type
                  </Label>
                  <Select onValueChange={setShiftType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Shifts</SelectItem>
                      <SelectItem value="custom">Custom Shifts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedulingCycle" className="flex items-center gap-2">
                  <TimerIcon size={18} />
                  Scheduling Cycle
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info size={18} className="text-gray-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The scheduling cycle determines how far in advance you create schedules. For example, a 2-week cycle means you'll create schedules for the next 2 weeks at a time.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select onValueChange={setSchedulingCycle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scheduling cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1week">1 Week</SelectItem>
                    <SelectItem value="2weeks">2 Weeks</SelectItem>
                    <SelectItem value="4weeks">4 Weeks</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full mt-6" 
                onClick={handleContinue} 
                disabled={!shiftType || !schedulingCycle}
              >
                Continue to Shift Setup
              </Button>
            </CardContent>
          </Card>
        </div>
      );
  };
  
  export default ShiftSetupMain;