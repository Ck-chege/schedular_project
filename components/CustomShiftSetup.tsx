import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import ShiftInput from './ShiftInputComponent';

export interface Shift {
  id: string;
  duration: number;
  startTime: string;
  endTime: string;
}

const CustomShiftSetup = ({ workdayDuration, startTime, onComplete }: { workdayDuration: number, startTime: string, onComplete: (shifts: Shift[]) => void }) => {
  const [shifts, setShifts] = useState<Shift[]>([{ id: '1', duration: workdayDuration, startTime, endTime: '' }]);
  const [unallocatedTime, setUnallocatedTime] = useState(0);

  const calculateShiftTimes = useCallback((currentShifts: Shift[]): Shift[] => {
    let currentTime = new Date(`2000-01-01T${startTime}`);
    return currentShifts.map((shift) => {
      const shiftStart = new Date(currentTime);
      const hours = Math.floor(shift.duration);
      const minutes = Math.round((shift.duration - hours) * 60);
      
      currentTime.setHours(currentTime.getHours() + hours);
      currentTime.setMinutes(currentTime.getMinutes() + minutes);
      
      return {
        ...shift,
        startTime: shiftStart.toTimeString().slice(0, 5),
        endTime: currentTime.toTimeString().slice(0, 5)
      };
    });
  }, [startTime]);

  const updateShiftsAndTime = useCallback((currentShifts: Shift[]) => {
    const updatedShifts = calculateShiftTimes(currentShifts);
    const totalAllocated = updatedShifts.reduce((sum, shift) => sum + shift.duration, 0);
    const newUnallocatedTime = Math.round((workdayDuration - totalAllocated) * 100) / 100;
    
    setShifts(updatedShifts);
    setUnallocatedTime(newUnallocatedTime);
  }, [calculateShiftTimes, workdayDuration]);

  useEffect(() => {
    updateShiftsAndTime(shifts);
  }, [startTime, workdayDuration]); // Only re-run when startTime or workdayDuration changes

  const addShift = () => {
    const newShiftId = (parseInt(shifts[shifts.length - 1].id) + 1).toString();
    const newShifts = [...shifts, { id: newShiftId, duration: 1, startTime: '', endTime: '' }];
    updateShiftsAndTime(newShifts);
  };

  const updateShiftDuration = (id: string, duration: number) => {
    const updatedShifts = shifts.map(shift => 
      shift.id === id ? { ...shift, duration: Math.max(0.5, Math.min(duration, workdayDuration)) } : shift
    );
    updateShiftsAndTime(updatedShifts);
  };

  const removeShift = (id: string) => {
    const updatedShifts = shifts.filter(shift => shift.id !== id);
    updateShiftsAndTime(updatedShifts);
  };

  const handleSaveShiftStructure = () => {
    onComplete(shifts);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Custom Shifts</CardTitle>
        <CardDescription>Brakedown of shift for the work day</CardDescription>
      </CardHeader>
      <CardContent>
        {shifts.map((shift) => (
          <ShiftInput
            key={shift.id}
            shift={shift}
            workdayDuration={workdayDuration}
            updateShiftDuration={updateShiftDuration}
            removeShift={removeShift}
            isRemoveDisabled={shifts.length === 1}
          />
        ))}
        <Button onClick={addShift} className="mb-4">Add Shift</Button>
        {unallocatedTime !== 0 && (
          <Alert variant={unallocatedTime > 0 ? "default" : "destructive"} className="mb-4">
            <AlertDescription>
              {unallocatedTime > 0 
                ? `There is ${unallocatedTime.toFixed(1)} hour(s) of unallocated time.`
                : `Shifts exceed workday duration by ${Math.abs(unallocatedTime).toFixed(1)} hour(s).`}
            </AlertDescription>
          </Alert>
        )}
        <Button onClick={handleSaveShiftStructure} className="w-full">Save Shift Structure</Button>
      </CardContent>
    </Card>
  );
};

export default CustomShiftSetup;