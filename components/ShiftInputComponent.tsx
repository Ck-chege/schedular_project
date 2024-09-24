import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';

interface Shift {
  id: string;
  duration: number;
  startTime: string;
  endTime: string;
}

interface ShiftInputProps {
  shift: Shift;
  workdayDuration: number;
  updateShiftDuration: (id: string, duration: number) => void;
  removeShift: (id: string) => void;
  isRemoveDisabled: boolean;
}

const ShiftInput: React.FC<ShiftInputProps> = ({
  shift,
  workdayDuration,
  updateShiftDuration,
  removeShift,
  isRemoveDisabled
}) => {
  return (
    <div className="mb-4">
      <Label htmlFor={`shift-${shift.id}`} className="mb-2 block">Shift {shift.id}</Label>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-grow-0 flex-shrink-0 w-24">
          <Input
            id={`shift-${shift.id}`}
            type="number"
            min="0.5"
            step="0.5"
            max={workdayDuration}
            value={shift.duration}
            onChange={(e) => updateShiftDuration(shift.id, parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <span className="text-sm text-gray-500 flex-grow-0 flex-shrink-0">hours</span>
        <span className="text-sm flex-grow whitespace-nowrap">
          ({shift.startTime} - {shift.endTime})
        </span>
        <Button 
          onClick={() => removeShift(shift.id)} 
          variant="destructive" 
          size="icon"
          className="flex-shrink-0"
          disabled={isRemoveDisabled}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ShiftInput;