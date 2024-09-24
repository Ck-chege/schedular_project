import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const FixedShiftSetup = ({ workdayDuration,startTime }: { workdayDuration: number, startTime:string }) => {
  const [shiftDuration, setShiftDuration] = useState(8);
  const [numberOfShifts, setNumberOfShifts] = useState(0);
  const [unallocatedTime, setUnallocatedTime] = useState(0);

  useEffect(() => {
    const calculatedShifts = Math.floor(workdayDuration / shiftDuration);
    setNumberOfShifts(calculatedShifts);
    setUnallocatedTime(workdayDuration % shiftDuration);
  }, [workdayDuration, shiftDuration]);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Fixed Shifts Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Shift Duration (hours)</label>
            <input
              type="number"
              min="1"
              max={workdayDuration}
              value={shiftDuration}
              onChange={(e) => setShiftDuration(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Number of Shifts: {numberOfShifts}</p>
          </div>
          {unallocatedTime > 0 && (
            <Alert className="mb-4" >
              <AlertDescription>
                There is {unallocatedTime} hour(s) of unallocated time.
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

export default FixedShiftSetup;