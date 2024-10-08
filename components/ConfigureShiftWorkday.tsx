import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Clock, TimerIcon, Layers } from "lucide-react";
import ShiftPlanTitleInput from "./ShiftPlanTitleInput";
import { WorkdayConfigTemplate } from "@/types/types";

interface ConfigureWorkdayProps {
  onConfigure: (config: WorkdayConfigTemplate) => void;
  initialConfig: WorkdayConfigTemplate;
  onEndTimeChange: (newEndTime: string) => void;
}

const ConfigureWorkday: React.FC<ConfigureWorkdayProps> = ({ onConfigure, initialConfig }) => {
  const [config, setConfig] = useState<WorkdayConfigTemplate>(initialConfig);
  const [isNextDay, setIsNextDay] = useState(false);

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  const calculateEndTime = useCallback(
    (startTime: string, duration: number) => {
      const start = new Date(`2000-01-01T${startTime}:00`);
      const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
      const newEndTime = end.toTimeString().slice(0, 5);
      const isNextDay = end.getDate() > start.getDate();
      return { newEndTime, isNextDay };
    },
    []
  );

  const updateConfig = useCallback(
    (updates: Partial<WorkdayConfigTemplate>) => {
      setConfig((prevConfig) => {
        const newConfig = { ...prevConfig, ...updates };
        const { newEndTime, isNextDay } = calculateEndTime(newConfig.startTime, newConfig.duration);
        setIsNextDay(isNextDay);
        localStorage.setItem("workdayConfig", JSON.stringify(newConfig));
        // Clear 'shift' from localStorage if the configuration changes
        localStorage.removeItem("shift");
        return { ...newConfig, endTime: newEndTime };
      });
    },
    [calculateEndTime]
  );

  const handleInputChange = useCallback(
    (field: keyof WorkdayConfigTemplate, value: string | number) => {
      if (field === "duration") {
        const numValue = Number(value);
        value = Math.min(Math.max(numValue, 0), 24);
      }
      updateConfig({ [field]: value });
    },
    [updateConfig]
  );

  const handleEndTimeChange = useCallback(
    (newEndTime: string) => {
      const start = new Date(`2000-01-01T${config.startTime}:00`);
      let end = new Date(`2000-01-01T${newEndTime}:00`);

      if (end <= start) {
        end.setDate(end.getDate() + 1);
        setIsNextDay(true);
      } else {
        setIsNextDay(false);
      }

      let newDuration = (end.getTime() - start.getTime()) / (60 * 60 * 1000);
      if (newDuration > 24) newDuration = 24;

      updateConfig({ endTime: newEndTime, duration: newDuration });
    },
    [config.startTime, updateConfig]
  );

  return (
    <div className="space-y-4">
      <ShiftPlanTitleInput
        value={config.title}
        onChange={(value) => handleInputChange("title", value)}
      />
      {[
        { id: "startTime", label: "Start Time", icon: Clock, type: "time" },
        { id: "duration", label: "Workday Duration (hours)", icon: TimerIcon, type: "number" },
        { id: "endTime", label: "End Time", icon: Clock, type: "time", readOnly: false },
      ].map(({ id, label, icon: Icon, type, readOnly }) => (
        <div key={id} className="space-y-2">
          <Label htmlFor={id} className="flex items-center gap-2">
            <Icon size={18} />
            {label}
          </Label>
          <div className="relative">
            <Input
              id={id}
              type={type}
              value={config[id as keyof WorkdayConfigTemplate]}
              onChange={(e) =>
                id === "endTime"
                  ? handleEndTimeChange(e.target.value)
                  : handleInputChange(id as keyof WorkdayConfigTemplate, e.target.value)
              }
              readOnly={readOnly}
              min={type === "number" ? 0 : undefined}
              max={type === "number" ? 24 : undefined}
              step={type === "number" ? 0.5 : undefined}
            />
            {id === "endTime" && isNextDay && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full">
                Next day
              </span>
            )}
          </div>
        </div>
      ))}
      <div className="space-y-2">
        <Label htmlFor="shiftType" className="flex items-center gap-2">
          <Layers size={18} />
          Shift Type
        </Label>
        <Select
          onValueChange={(value) => handleInputChange("shiftType", value as "fixed" | "custom")}
          value={config.shiftType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select shift type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fixed">Fixed Shifts</SelectItem>
            <SelectItem value="custom">Custom Shifts</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={() => onConfigure(config)} className="w-full">
        Next Step
      </Button>
    </div>
  );
};

export default ConfigureWorkday;
