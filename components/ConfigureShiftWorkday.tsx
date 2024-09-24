import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Clock, TimerIcon, Layers } from "lucide-react";
import ShiftPlanTitleInput from "./ShiftPlanTitleInput";

interface ConfigureWorkdayProps {
  onConfigure: (config: WorkdayConfig) => void;
  initialConfig: WorkdayConfig;
}

export interface WorkdayConfig {
    title: string;
  startTime: string;

  endTime: string;
  duration: number;
  shiftType: "fixed" | "custom";
}

const ConfigureWorkday: React.FC<ConfigureWorkdayProps> = ({
  onConfigure,
  initialConfig,
}) => {
  const [config, setConfig] = useState<WorkdayConfig>(initialConfig);
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
    (updates: Partial<WorkdayConfig>) => {
      setConfig((prevConfig) => {
        const newConfig = { ...prevConfig, ...updates };
        const { newEndTime, isNextDay } = calculateEndTime(
          newConfig.startTime,
          newConfig.duration
        );
        setIsNextDay(isNextDay);
        return { ...newConfig, endTime: newEndTime };
      });
    },
    [calculateEndTime]
  );

  const handleInputChange = useCallback(
    (field: keyof WorkdayConfig, value: string | number) => {
      if (field === "duration") {
        const numValue = Number(value);
        value = Math.min(Math.max(numValue, 0), 24);
      }
      updateConfig({ [field]: value });
    },
    [updateConfig]
  );

  return (
    <div className="space-y-4">
      <ShiftPlanTitleInput
        value={config.title}
        onChange={(value) => handleInputChange("title", value)}
      />
      {[
        { id: "startTime", label: "Start Time", icon: Clock, type: "time" },
        {
          id: "duration",
          label: "Workday Duration (hours)",
          icon: TimerIcon,
          type: "number",
        },
        {
          id: "endTime",
          label: "End Time",
          icon: Clock,
          type: "time",
          readOnly: true,
        },
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
              value={config[id as keyof WorkdayConfig]}
              onChange={(e) =>
                handleInputChange(id as keyof WorkdayConfig, e.target.value)
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
          onValueChange={(value) =>
            handleInputChange("shiftType", value as "fixed" | "custom")
          }
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

// import React, { useState, useEffect, useCallback } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Clock, TimerIcon, Layers } from 'lucide-react';

// interface ConfigureWorkdayProps {
//   onConfigure: (config: WorkdayConfig) => void;
//   initialConfig: WorkdayConfig;
// }

// export interface WorkdayConfig {
//   startTime: string;
//   endTime: string;
//   duration: number;
//   shiftType: 'fixed' | 'custom';
// }

// const ConfigureWorkday: React.FC<ConfigureWorkdayProps> = ({ onConfigure, initialConfig }) => {
//   const [config, setConfig] = useState<WorkdayConfig>(initialConfig);
//   const [isNextDay, setIsNextDay] = useState(false);

//   const updateConfig = useCallback((newPartialConfig: Partial<WorkdayConfig>) => {
//     setConfig(prevConfig => {
//       const updatedConfig = { ...prevConfig, ...newPartialConfig };
//       onConfigure(updatedConfig);
//       return updatedConfig;
//     });
//   }, [onConfigure]);

//   const updateEndTime = useCallback(() => {
//     const start = new Date(`2000-01-01T${config.startTime}:00`);
//     const end = new Date(start.getTime() + config.duration * 60 * 60 * 1000);
//     const newEndTime = end.toTimeString().slice(0, 5);
//     setIsNextDay(end.getDate() > start.getDate());
//     updateConfig({ endTime: newEndTime });
//   }, [config.startTime, config.duration, updateConfig]);

//   useEffect(() => {
//     updateEndTime();
//   }, [config.startTime, config.duration, updateEndTime]);

//   const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     updateConfig({ startTime: e.target.value });
//   };

//   const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newEndTime = e.target.value;
//     const start = new Date(`2000-01-01T${config.startTime}:00`);
//     let end = new Date(`2000-01-01T${newEndTime}:00`);

//     if (end <= start) {
//       end.setDate(end.getDate() + 1);
//       setIsNextDay(true);
//     } else {
//       setIsNextDay(false);
//     }

//     let newDuration = (end.getTime() - start.getTime()) / (60 * 60 * 1000);
//     if (newDuration > 24) newDuration = 24;

//     updateConfig({ endTime: newEndTime, duration: newDuration });
//   };

//   const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let newDuration = Number(e.target.value);
//     if (newDuration > 24) newDuration = 24;
//     if (newDuration < 0) newDuration = 0;
//     updateConfig({ duration: newDuration });
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Configure Your Workday</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="startTime" className="flex items-center gap-2">
//               <Clock size={18} />
//               Start Time
//             </Label>
//             <Input
//               id="startTime"
//               type="time"
//               value={config.startTime}
//               onChange={handleStartTimeChange}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="endTime" className="flex items-center gap-2">
//               <Clock size={18} />
//               End Time
//             </Label>
//             <div className="relative">
//               <Input
//                 id="endTime"
//                 type="time"
//                 value={config.endTime}
//                 onChange={handleEndTimeChange}
//               />
//               {isNextDay && (
//                 <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full">
//                   Next day
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="duration" className="flex items-center gap-2">
//               <TimerIcon size={18} />
//               Workday Duration (hours)
//             </Label>
//             <Input
//               id="duration"
//               type="number"
//               min="0"
//               max="24"
//               step="0.5"
//               value={config.duration}
//               onChange={handleDurationChange}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="shiftType" className="flex items-center gap-2">
//               <Layers size={18} />
//               Shift Type
//             </Label>
//             <Select
//               onValueChange={(value: 'fixed' | 'custom') => updateConfig({ shiftType: value })}
//               value={config.shiftType}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select shift type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="fixed">Fixed Shifts</SelectItem>
//                 <SelectItem value="custom">Custom Shifts</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default ConfigureWorkday;
