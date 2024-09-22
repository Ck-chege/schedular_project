import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";


const CustomShiftSetup = ({ workdayDuration }: { workdayDuration: number }) => {
  const [shifts, setShifts] = useState([{ duration: 8 }]);
  const [unallocatedTime, setUnallocatedTime] = useState(workdayDuration);

  useEffect(() => {
    const totalAllocated = shifts.reduce((sum, shift) => sum + shift.duration, 0);
    setUnallocatedTime(workdayDuration - totalAllocated);
  }, [shifts, workdayDuration]);

  const addShift = () => {
    setShifts([...shifts, { duration: 1 }]);
  };

  const updateShiftDuration = (index: number, duration: string) => {
    const newShifts = [...shifts];
    newShifts[index].duration = Number(duration);
    setShifts(newShifts);
  };

  const removeShift = (index: number) => {
    setShifts(shifts.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Configure Custom Shifts</CardTitle>
        </CardHeader>
        <CardContent>
          {shifts.map((shift, index) => (
            <div key={index} className="mb-4 flex items-center">
              <input
                type="number"
                min="1"
                max={workdayDuration}
                value={shift.duration}
                onChange={(e) => updateShiftDuration(index, e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mr-2"
              />
              <Button onClick={() => removeShift(index)} variant="destructive">Remove</Button>
            </div>
          ))}
          <Button onClick={addShift} className="mb-4">Add Shift</Button>
          {unallocatedTime !== 0 && (
            <Alert variant={unallocatedTime > 0 ? "default" : "destructive"} className="mb-4">
              <AlertDescription>
                {unallocatedTime > 0 
                  ? `There is ${unallocatedTime} hour(s) of unallocated time.`
                  : `Shifts exceed workday duration by ${Math.abs(unallocatedTime)} hour(s).`}
              </AlertDescription>
            </Alert>
          )}
          <div className="mb-4">
            {/* Placeholder for shift visualization */}
            <div className="bg-gray-100 p-4 rounded">
              Shift visualization will be displayed here
            </div>
          </div>
          <Button className="w-full">Save Shift Structure</Button>
        </CardContent>
      </Card>
    </div>
  );
};
export default CustomShiftSetup;