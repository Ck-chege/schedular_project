// import React, { useState, useEffect, useCallback } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import ShiftInput from './ShiftInputComponent';
// import { Shift } from '@/types/types';



// const CustomShiftSetup = ({ workdayDuration, startTime, onComplete }: { workdayDuration: number, startTime: string, onComplete: (shifts: Shift[]) => void }) => {
//   const [shifts, setShifts] = useState<Shift[]>([{ id: '1', duration: workdayDuration, startTime, endTime: '', title: `Shift _`}]);
//   const [unallocatedTime, setUnallocatedTime] = useState(0);

//   const calculateShiftTimes = useCallback((currentShifts: Shift[]): Shift[] => {
//     let currentTime = new Date(`2000-01-01T${startTime}`);
//     return currentShifts.map((shift) => {
//       const shiftStart = new Date(currentTime);
//       const hours = Math.floor(shift.duration);
//       const minutes = Math.round((shift.duration - hours) * 60);
      
//       currentTime.setHours(currentTime.getHours() + hours);
//       currentTime.setMinutes(currentTime.getMinutes() + minutes);
      
//       return {
//         ...shift,
//         startTime: shiftStart.toTimeString().slice(0, 5),
//         endTime: currentTime.toTimeString().slice(0, 5)
//       };
//     });
//   }, [startTime]);

//   const updateShiftsAndTime = useCallback((currentShifts: Shift[]) => {
//     const updatedShifts = calculateShiftTimes(currentShifts);
//     const totalAllocated = updatedShifts.reduce((sum, shift) => sum + shift.duration, 0);
//     const newUnallocatedTime = Math.round((workdayDuration - totalAllocated) * 100) / 100;
    
//     setShifts(updatedShifts);
//     setUnallocatedTime(newUnallocatedTime);
//   }, [calculateShiftTimes, workdayDuration]);

//   useEffect(() => {
//     updateShiftsAndTime(shifts);
//   }, [startTime, workdayDuration]); // Only re-run when startTime or workdayDuration changes

//   const addShift = () => {
//     const newShiftId = (parseInt(shifts[shifts.length - 1].id) + 1).toString();
//     const newShifts = [...shifts, { id: newShiftId, duration: 1, startTime: '', endTime: '', title: `Shift ${newShiftId}` }];
//     updateShiftsAndTime(newShifts);
//   };

//   const updateShiftDuration = (id: string, duration: number) => {
//     const updatedShifts = shifts.map(shift => 
//       shift.id === id ? { ...shift, duration: Math.max(0.5, Math.min(duration, workdayDuration)) } : shift
//     );
//     updateShiftsAndTime(updatedShifts);
//   };

//   const removeShift = (id: string) => {
//     const updatedShifts = shifts.filter(shift => shift.id !== id);
//     updateShiftsAndTime(updatedShifts);
//   };

//   const handleSaveShiftStructure = () => {
//     onComplete(shifts);
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Configure Custom Shifts</CardTitle>
//         <CardDescription>Brakedown of shift for the work day</CardDescription>
//       </CardHeader>
//       <CardContent>
//         {shifts.map((shift) => (
//           <ShiftInput
//             key={shift.id}
//             shift={shift}
//             workdayDuration={workdayDuration}
//             updateShiftDuration={updateShiftDuration}
//             removeShift={removeShift}
//             isRemoveDisabled={shifts.length === 1}
//           />
//         ))}
//         <Button onClick={addShift} className="mb-4">Add Shift</Button>
//         {unallocatedTime !== 0 && (
//           <Alert variant={unallocatedTime > 0 ? "default" : "destructive"} className="mb-4">
//             <AlertDescription>
//               {unallocatedTime > 0 
//                 ? `There is ${unallocatedTime.toFixed(1)} hour(s) of unallocated time.`
//                 : `Shifts exceed workday duration by ${Math.abs(unallocatedTime).toFixed(1)} hour(s).`}
//             </AlertDescription>
//           </Alert>
//         )}
//         <Button onClick={handleSaveShiftStructure} className="w-full">Save Shift Structure</Button>
//       </CardContent>
//     </Card>
//   );
// };

// export default CustomShiftSetup;


import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Layers, Trash } from 'lucide-react';
import { ShiftTemplate } from '@/types/types';

interface CustomShiftSetupProps {
  workdayDuration: number;
  startTime: string;
  onComplete: (shifts: ShiftTemplate[]) => void;
}

const CustomShiftSetup: React.FC<CustomShiftSetupProps> = ({ workdayDuration, startTime, onComplete }) => {
  useEffect(() => {
    const savedShifts = localStorage.getItem('shifts');
    if (savedShifts) {
      setShifts(JSON.parse(savedShifts));
    }
  }, []);

  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date(2000, 0, 1, hours, minutes);
    date.setHours(date.getHours() + Math.floor(duration));
    date.setMinutes(date.getMinutes() + Math.round((duration % 1) * 60));
    return date.toTimeString().slice(0, 5);
  };

  const [shifts, setShifts] = useState<ShiftTemplate[]>(() => {
    const savedShifts = localStorage.getItem('shifts');
    return savedShifts ? JSON.parse(savedShifts) : [{ id: '1', duration: 1, startTime, endTime: calculateEndTime(startTime, 1), title: 'Shift 1' }];
  });
  const [unallocatedTime, setUnallocatedTime] = useState<number>(workdayDuration - 1);

  useEffect(() => {
    updateUnallocatedTime(shifts);
    updateShiftEndTimes();
  }, [shifts]);

  const updateUnallocatedTime = useCallback((currentShifts: ShiftTemplate[]) => {
    const totalAllocated = currentShifts.reduce((sum, shift) => sum + shift.duration, 0);
    setUnallocatedTime(workdayDuration - totalAllocated);
  }, [workdayDuration]);

  const updateShiftEndTimes = () => {
    setShifts((prevShifts) => {
      let updatedShifts = [...prevShifts];
      for (let i = 0; i < updatedShifts.length; i++) {
        const startTime = i === 0 ? updatedShifts[i].startTime : updatedShifts[i - 1].endTime;
        updatedShifts[i] = {
          ...updatedShifts[i],
          startTime,
          endTime: calculateEndTime(startTime, updatedShifts[i].duration),
        };
      }
      return updatedShifts;
    });
  };

  const handleShiftChange = (id: string, field: keyof ShiftTemplate, value: number | string) => {
    setShifts((prevShifts) =>
      prevShifts.map((shift) =>
        shift.id === id
          ? {
              ...shift,
              [field]: value,
            }
          : shift
      )
    );
  };

  const addShift = () => {
    if (unallocatedTime > 0) {
      const newShiftId = (shifts.length + 1).toString();
      const lastShiftEndTime = shifts.length > 0 ? shifts[shifts.length - 1].endTime : startTime;
      const newShiftDuration = Math.min(unallocatedTime, 1);
      setShifts((prevShifts) => [
        ...prevShifts,
        {
          id: newShiftId,
          duration: newShiftDuration,
          startTime: lastShiftEndTime,
          endTime: calculateEndTime(lastShiftEndTime, newShiftDuration),
          title: `Shift ${newShiftId}`,
        },
      ]);
    }
  };

  const removeShift = (id: string) => {
    if (id === '1') return; // Prevent the first shift from being deleted
    const updatedShifts = shifts.filter((shift) => shift.id !== id);
    setShifts(updatedShifts.length > 0 ? updatedShifts : [{ id: '1', duration: 1, startTime, endTime: calculateEndTime(startTime, 1), title: 'Shift 1' }]);
  };

  const handleSaveShifts = () => {
    localStorage.setItem('shifts', JSON.stringify(shifts));
    onComplete(shifts);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Layers className="h-6 w-6" />
            Custom Shift Setup
          </CardTitle>
          <CardDescription>
            Configure custom shifts for the workday
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {shifts.map((shift) => (
            <div key={shift.id} className="p-4 bg-muted rounded-lg shadow-inner space-y-2">
              <div className="flex items-center gap-4">
                <p className="font-semibold text-lg">{shift.title}</p>
                {shift.id !== '1' && (
                  <Button onClick={() => removeShift(shift.id)} variant="outline" size="icon" className="ml-auto">
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor={`startTime-${shift.id}`} className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    Start Time
                  </label>
                  <Input
                    id={`startTime-${shift.id}`}
                    type="time"
                    value={shift.startTime}
                    onChange={(e) => handleShiftChange(shift.id, 'startTime', e.target.value)}
                    step="300"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor={`duration-${shift.id}`} className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    Duration (hours)
                  </label>
                  <Input
                    id={`duration-${shift.id}`}
                    type="number"
                    value={shift.duration}
                    onChange={(e) => handleShiftChange(shift.id, 'duration', Number(e.target.value))}
                    min={0.5}
                    max={workdayDuration}
                    step={0.5}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                End Time: {shift.endTime}
              </p>
            </div>
          ))}
          {unallocatedTime > 0 && (
            <Alert variant="default">
              <AlertDescription>
                You have {unallocatedTime} hour(s) left to allocate.
              </AlertDescription>
            </Alert>
          )}
          {unallocatedTime < 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                Warning: The total duration of shifts exceeds the workday by {Math.abs(unallocatedTime)} hour(s). Please adjust accordingly.
              </AlertDescription>
            </Alert>
          )}
          <Button onClick={addShift} disabled={unallocatedTime <= 0} className="w-full">
            Add Shift
          </Button>
          <Button onClick={handleSaveShifts} disabled={unallocatedTime !== 0} className="w-full" variant="default">
            Preview Shift Structure
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomShiftSetup;
