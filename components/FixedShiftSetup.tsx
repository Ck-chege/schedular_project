import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Layers } from 'lucide-react';

interface FixedShiftSetupProps {
  workdayDuration: number;
  startTime: string;
  onComplete: (shifts: { id: string; duration: number; startTime: string; endTime: string; title: string }[]) => void;
}

const FixedShiftSetup: React.FC<FixedShiftSetupProps> = ({ workdayDuration, startTime, onComplete }) => {
  const [shiftDuration, setShiftDuration] = useState<number>(4); // Default shift duration
  const [numberOfShifts, setNumberOfShifts] = useState<number>(0);
  const [unallocatedTime, setUnallocatedTime] = useState<number>(0);
  const [shifts, setShifts] = useState<{ id: string; duration: number; startTime: string; endTime: string; title: string }[]>([]);

  // Load shifts and shiftDuration from localStorage when component mounts
  useEffect(() => {
    const storedShifts = localStorage.getItem('shift');
    const storedShiftDuration = localStorage.getItem('shiftDuration'); // Also retrieve shiftDuration

    if (storedShifts && storedShiftDuration) {
      setShifts(JSON.parse(storedShifts));
      setShiftDuration(Number(storedShiftDuration)); // Restore the saved shiftDuration
    } else {
      generateShifts(Math.floor(workdayDuration / shiftDuration), shiftDuration);
    }
  }, [workdayDuration, shiftDuration]);

  useEffect(() => {
    const calculatedShifts = Math.floor(workdayDuration / shiftDuration);
    const calculatedUnallocatedTime = workdayDuration % shiftDuration;
    setNumberOfShifts(calculatedShifts);
    setUnallocatedTime(calculatedUnallocatedTime);
    generateShifts(calculatedShifts, shiftDuration);
  }, [workdayDuration, shiftDuration]);

  const generateShifts = (count: number, duration: number) => {
    let currentTime = new Date(`2000-01-01T${startTime}`);
    const newShifts = [];
    for (let i = 0; i < count; i++) {
      const shiftStart = new Date(currentTime);
      currentTime.setHours(currentTime.getHours() + Math.floor(duration));
      currentTime.setMinutes(currentTime.getMinutes() + (duration % 1) * 60);
      newShifts.push({
        id: (i + 1).toString(),
        duration,
        startTime: shiftStart.toTimeString().slice(0, 5),
        endTime: currentTime.toTimeString().slice(0, 5),
        title: `Shift ${i + 1}`,
      });
    }
    setShifts(newShifts);
  };

  const handleShiftDurationChange = (value: number) => {
    setShiftDuration(Math.max(0.5, Math.min(value, workdayDuration)));
  };

  // Save the shifts and shiftDuration to localStorage
  const handleSaveShiftStructure = () => {
    localStorage.setItem('shift', JSON.stringify(shifts)); // Save the shift structure
    localStorage.setItem('shiftDuration', String(shiftDuration)); // Save the shift duration
    onComplete(shifts);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Layers className="h-6 w-6" />
            Fixed Shift Setup
          </CardTitle>
          <CardDescription>
            Configure shifts with fixed durations for the workday
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Shift Duration Input */}
          <div className="space-y-2">
            <label htmlFor="shiftDuration" className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              Shift Duration (hours)
            </label>
            <Input
              id="shiftDuration"
              type="number"
              value={shiftDuration}
              onChange={(e) => handleShiftDurationChange(Number(e.target.value))}
              min={0.5}
              max={workdayDuration}
              step={0.5}
            />
          </div>

          {/* Display Number of Shifts and Unallocated Time */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Number of Shifts: {numberOfShifts}</p>
            {unallocatedTime > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  Warning: There are {unallocatedTime.toFixed(1)} hour(s) of unallocated time. Please adjust the shift duration to fully allocate the workday hours.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Shift Visualization */}
          <div className="space-y-4">
            {shifts.map((shift) => (
              <div key={shift.id} className="p-4 bg-muted rounded-lg shadow-inner">
                <p className="font-semibold">{shift.title}</p>
                <p className="text-sm text-muted-foreground">
                  {shift.startTime} - {shift.endTime} ({shift.duration} hours)
                </p>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSaveShiftStructure}
            className="w-full"
            disabled={unallocatedTime > 0}
          >
            Preview Shift Structure
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FixedShiftSetup;
