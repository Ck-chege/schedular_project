import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock } from 'lucide-react';
import { ShiftTemplate, WorkdayConfigTemplate } from '@/types/types';

interface ShiftVisualProps {
  workdayConfig: WorkdayConfigTemplate;
  shifts: ShiftTemplate[];
}

const ShiftVisual: React.FC<ShiftVisualProps> = ({ workdayConfig, shifts }) => {
  // Helper function to convert "HH:MM" to minutes from midnight
  const getMinutesFromMidnight = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Helper function to format "HH:MM:SS" to "HH:MM"
  const formatTime = (time: string): string => {
    return time.split(':').slice(0, 2).join(':');
  };

  // Helper function to calculate end time
  const calculateEndTime = (start: string, duration: number): string => {
    const startMinutes = getMinutesFromMidnight(start);
    const endMinutes = (startMinutes + duration * 60) % 1440;
    const hours = Math.floor(endMinutes / 60);
    const minutes = endMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Determine if the workday spans over midnight
  const workdayStartMinutes = getMinutesFromMidnight(workdayConfig.startTime);
  const workdayEndMinutes = getMinutesFromMidnight(workdayConfig.endTime);
  const workdaySpansOverMidnight = workdayEndMinutes <= workdayStartMinutes;

  // Determine timeline start
  let timelineStartMinutes = 0; // Default start at midnight
  if (workdaySpansOverMidnight) {
    // Find the earliest shift start time
    const shiftStartMinutesArray = shifts.map(shift => getMinutesFromMidnight(shift.startTime));
    const earliestShiftStartMinutes = Math.min(...shiftStartMinutesArray);

    // Set timeline start to one hour before earliest shift
    timelineStartMinutes = earliestShiftStartMinutes - 60;
    if (timelineStartMinutes < 0) {
      timelineStartMinutes += 1440;
    }
  }

  const timelineDurationMinutes = 1440; // Always 24 hours

  // Function to calculate position and width based on timeline
  const getPositionAndWidth = (start: string, duration: number) => {
    const startMinutes = getMinutesFromMidnight(start);
    const durationMinutes = duration * 60;

    // Calculate position relative to timelineStartMinutes
    let positionMinutes = startMinutes - timelineStartMinutes;
    if (positionMinutes < 0) {
      positionMinutes += 1440;
    }

    const startPercentage = (positionMinutes / timelineDurationMinutes) * 100;
    const widthPercentage = (durationMinutes / timelineDurationMinutes) * 100;
    return { left: `${startPercentage}%`, width: `${widthPercentage}%` };
  };

  // Shift colors with accessible, high-contrast colors
  const shiftColors = [
    'bg-blue-600', 'bg-green-600', 'bg-yellow-600', 'bg-purple-600', 'bg-pink-600',
    'bg-indigo-600', 'bg-red-600', 'bg-orange-600', 'bg-teal-600', 'bg-cyan-600'
  ];

  // Only show "Midnight" when the workday spans two days
  const showMidnight = workdaySpansOverMidnight;

  // Generate hour markers
  const hourMarkers = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const currentMinute = (timelineStartMinutes + i * 60) % 1440;
      const leftPercentage = (i / 24) * 100;

      // Determine if this marker is midnight
      const isMidnight = currentMinute === 0;
      const label = isMidnight ? 'Midnight' : `${Math.floor(currentMinute / 60).toString().padStart(2, '0')}:00`;

      return (
        <div
          key={i}
          className="absolute top-0 bottom-0 border-l border-gray-300"
          style={{ left: `${leftPercentage}%` }}
        >
          {showMidnight && isMidnight ? (
            <span className="absolute -top-7 -left-2 text-xs text-gray-700 font-semibold">
              {label}
            </span>
          ) : (
            <span className="absolute -top-6 -left-2 text-xs text-gray-500">
              {label}
            </span>
          )}
        </div>
      );
    });
  }, [timelineStartMinutes, showMidnight]);

  return (
    <Card className="mt-8 shadow-xl rounded-lg overflow-hidden">
      <CardHeader className="bg-gray-100 border-b">
        <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
          <Clock className="w-6 h-6 text-gray-700" />
          Shift Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-32 w-full">
          {/* Timeline scale */}
          <div className="absolute top-0 left-0 right-0 h-6 flex items-center">
            {hourMarkers}
          </div>
          
          {/* Shift timeline */}
          <div className="absolute bottom-0 left-0 right-0 h-20 rounded-md overflow-hidden bg-gray-50 border border-gray-300 shadow-inner">
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
                        className={`absolute inset-y-0 ${colorClass} flex items-center justify-center text-xs font-medium text-white border-l border-r border-white cursor-pointer`}
                      >
                        <span className="truncate px-2">{`Shift ${shift.id}`}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-gray-800 p-2 rounded-lg shadow-lg">
                      <div className="text-sm">
                        <p className="font-bold">{`Shift ${shift.id}`}</p>
                        <p><span className="font-semibold">Start:</span> {formatTime(shift.startTime)}</p>
                        <p><span className="font-semibold">End:</span> {formatTime(endTime)}</p>
                        <p><span className="font-semibold">Duration:</span> {shift.duration} hours</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span><span className="font-semibold">Start:</span> {formatTime(workdayConfig.startTime)}</span>
          <span><span className="font-semibold">End:</span> {formatTime(workdayConfig.endTime)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShiftVisual;
