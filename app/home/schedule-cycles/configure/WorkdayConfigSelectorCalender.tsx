import React, { useState, useCallback, useEffect } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ShiftTemplate, WorkdayConfigTemplate } from '@/types/types';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

interface ShiftTaskInfo {
  taskId: number;
  employeesRequired: number;
}

interface ShiftWithTasks extends ShiftTemplate {
  tasks: ShiftTaskInfo[];
}

interface WorkdayConfigWithTasks extends WorkdayConfigTemplate {
  shifts: ShiftWithTasks[];
}

interface WorkdayConfigSelectorProps {
  dayIndex: number;
  config: WorkdayConfigWithTasks;
  onChange: (config: WorkdayConfigWithTasks) => void;
}

const WorkdayConfigSelectorCalender: React.FC<WorkdayConfigSelectorProps> = ({
  dayIndex,
  config,
  onChange,
}) => {
  const [shifts, setShifts] = useState<ShiftWithTasks[]>(config.shifts || []);

  useEffect(() => {
    setShifts(config.shifts || []);
  }, [config.shifts]);

  const handleAddShift = () => {
    const newShift: ShiftWithTasks = {
        id: Date.now().toString(),
        startTime: '09:00',
        endTime: '17:00',
        tasks: [],
        duration: 8,
        title: ''
    };
    const updatedShifts = [...shifts, newShift];
    setShifts(updatedShifts);
    onChange({ ...config, shifts: updatedShifts });
  };

  const handleRemoveShift = (shiftId: string) => {
    const updatedShifts = shifts.filter((shift) => shift.id !== shiftId);
    setShifts(updatedShifts);
    onChange({ ...config, shifts: updatedShifts });
  };

  const handleShiftChange = (
    shiftId: string,
    field: keyof ShiftWithTasks,
    value: string
  ) => {
    const updatedShifts = shifts.map((shift) =>
      shift.id === shiftId ? { ...shift, [field]: value } : shift
    );
    setShifts(updatedShifts);
    onChange({ ...config, shifts: updatedShifts });
  };

  const onEventResize = useCallback(
    ({ event, start, end }: { event: Event; start: Date; end: Date }) => {
      const updatedShifts = shifts.map((shift) =>
        shift.title === event.title
          ? {
              ...shift,
              startTime: moment(start).format('HH:mm'),
              endTime: moment(end).format('HH:mm'),
              duration: moment(end).diff(moment(start), 'hours', true),
            }
          : shift
      );
      setShifts(updatedShifts);
      onChange({ ...config, shifts: updatedShifts });
    },
    [shifts, onChange, config]
  );

  const onEventDrop = useCallback(
    ({ event, start, end }: { event: Event; start: Date; end: Date }) => {
      const updatedShifts = shifts.map((shift) =>
        shift.title === event.title
          ? {
              ...shift,
              startTime: moment(start).format('HH:mm'),
              endTime: moment(end).format('HH:mm'),
              duration: moment(end).diff(moment(start), 'hours', true),
            }
          : shift
      );
      setShifts(updatedShifts);
      onChange({ ...config, shifts: updatedShifts });
    },
    [shifts, onChange, config]
  );

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const updatedShifts = Array.from(shifts);
    const [reorderedShift] = updatedShifts.splice(result.source.index, 1);
    updatedShifts.splice(result.destination.index, 0, reorderedShift);

    setShifts(updatedShifts);
    onChange({ ...config, shifts: updatedShifts });
  };

  const calendarShifts = shifts.map((shift) => ({
    id: shift.id,
    title: "Shift " + shift.id,
    start: moment().set({ hour: parseInt(shift.startTime.split(':')[0]), minute: parseInt(shift.startTime.split(':')[1]) }).toDate(),
    end: moment().set({ hour: parseInt(shift.endTime.split(':')[0]), minute: parseInt(shift.endTime.split(':')[1]) }).toDate(),
  }));

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Day {dayIndex + 1} Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Calendar
            localizer={localizer}
            events={calendarShifts}
            startAccessor="start"
            endAccessor="end"
            defaultView="day"
            views={['day']}
            step={30}
            timeslots={2}
            defaultDate={moment().toDate()}
            // onEventDrop={onEventDrop}
            // onEventResize={onEventResize}
            // resizable
            style={{ height: '500px' }}
          />
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="shifts">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {shifts.map((shift, index) => (
                  <Draggable key={shift.id} draggableId={shift.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card key={shift.id} className="mb-4 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Input
                              value={`Shift ${shift.id}`}
                              onChange={(e) =>
                                handleShiftChange(shift.id, 'title', e.target.value)
                              }
                              className="w-1/3"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveShift(shift.id)}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <Label htmlFor={`start-time-${shift.id}`}>Start Time</Label>
                              <Input
                                id={`start-time-${shift.id}`}
                                type="time"
                                value={shift.startTime}
                                onChange={(e) =>
                                  handleShiftChange(shift.id, 'startTime', e.target.value)
                                }
                              />
                            </div>
                            <div className="flex-1">
                              <Label htmlFor={`end-time-${shift.id}`}>End Time</Label>
                              <Input
                                id={`end-time-${shift.id}`}
                                type="time"
                                value={shift.endTime}
                                onChange={(e) =>
                                  handleShiftChange(shift.id, 'endTime', e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <Button onClick={handleAddShift} className="w-full">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Shift
        </Button>
      </CardContent>
    </Card>
  );
};

export default WorkdayConfigSelectorCalender;