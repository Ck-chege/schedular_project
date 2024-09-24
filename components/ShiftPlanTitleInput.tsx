import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from 'lucide-react';

interface ShiftPlanTitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ShiftPlanTitleInput: React.FC<ShiftPlanTitleInputProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label
        htmlFor="shiftPlanTitle"
        className="flex items-center gap-2 text-lg font-semibold"
      >
        <FileText size={18} />
        Shift Plan Template Title
      </Label>
      <Input
        id="shiftPlanTitle"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter a title for your shift plan template"
        className="text-lg"
      />
    </div>
  );
};

export default ShiftPlanTitleInput;