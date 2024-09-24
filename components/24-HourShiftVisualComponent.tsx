import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock } from 'lucide-react';
import { WorkdayConfig } from './ConfigureShiftWorkday';
import { Shift } from './CustomShiftSetup';

interface ShiftVisualProps {
  workdayConfig: WorkdayConfig;
  shifts: Shift[];
}

const ShiftVisual: React.FC<ShiftVisualProps> = ({ workdayConfig, shifts }) => {
  const getMinutesFromMidnight = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (time: string): string => {
    return time.split(':').slice(0, 2).join(':');
  };

  const getPositionAndWidth = (start: string, duration: number) => {
    const startMinutes = getMinutesFromMidnight(start);
    const durationMinutes = duration * 60;
    const startPercentage = (startMinutes / 1440) * 100;
    const widthPercentage = (durationMinutes / 1440) * 100;
    return { left: `${startPercentage}%`, width: `${widthPercentage}%` };
  };

  const calculateEndTime = (start: string, duration: number): string => {
    const startMinutes = getMinutesFromMidnight(start);
    const endMinutes = startMinutes + duration * 60;
    const hours = Math.floor(endMinutes / 60) % 24;
    const minutes = endMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const shiftColors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-red-500', 'bg-orange-500', 'bg-teal-500', 'bg-cyan-500'
  ];

  const hourMarkers = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => (
      <div
        key={i}
        className="absolute top-0 bottom-0 border-l border-gray-300"
        style={{ left: `${(i / 24) * 100}%` }}
      >
        <span className="absolute -top-6 -left-2 text-xs text-gray-500">
          {i === 24 ? '24' : i.toString().padStart(2, '0')}
        </span>
      </div>
    ));
  }, []);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Clock className="w-5 h-5" />
          24-Hour Shift Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-24 w-full">
          {/* 24-hour scale */}
          <div className="absolute top-0 left-0 right-0 h-6">
            {hourMarkers}
          </div>
          
          {/* Shift timeline */}
          <div className="absolute bottom-0 left-0 right-0 h-16 rounded-md overflow-hidden bg-gray-100 border border-gray-300 shadow-inner">
            <TooltipProvider>
              {shifts.map((shift, index) => {
                const style = getPositionAndWidth(shift.startTime, shift.duration);
                const colorClass = shiftColors[index % shiftColors.length];
                const endTime = calculateEndTime(shift.startTime, shift.duration);
                return (
                  <Tooltip key={shift.id}>
                    <TooltipTrigger>
                      <div
                        style={style}
                        className={`absolute inset-y-0 ${colorClass} flex items-center justify-center text-xs font-medium text-white border-l border-r border-white`}
                      >
                        <span className="truncate px-2">{`Shift ${shift.id}`}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <p className="font-bold">{`Shift ${shift.id}`}</p>
                        <p>Start: {formatTime(shift.startTime)}</p>
                        <p>End: {formatTime(endTime)}</p>
                        <p>Duration: {shift.duration} hours</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatTime(workdayConfig.startTime)}</span>
          <span>{formatTime(workdayConfig.endTime)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShiftVisual;