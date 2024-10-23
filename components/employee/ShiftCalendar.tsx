'use client'

import React from 'react';
import { Calendar as BigCalendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface Shift extends Event {
  id: number;
  title: string;
  resource: string;
}

const shifts: Shift[] = [
  {
    id: 1,
    title: 'Morning Shift',
    start: new Date(2024, 9, 1, 6, 0),
    end: new Date(2024, 9, 1, 14, 0),
    resource: 'Floor'
  },
  {
    id: 2,
    title: 'Evening Shift',
    start: new Date(2024, 9, 1, 14, 0),
    end: new Date(2024, 9, 1, 22, 0),
    resource: 'Bar'
  },
];

interface ShiftEventProps {
  event: Shift;
}

const ShiftEvent: React.FC<ShiftEventProps> = ({ event }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="shift-event p-1 text-xs overflow-hidden">
          <strong>{event.title}</strong>
          <br />
          {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p><strong>{event.title}</strong></p>
        <p>{moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}</p>
        <p>Area: {event.resource}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const ShiftCalendar: React.FC = () => {
  const eventStyleGetter = (event: Shift) => {
    const style: React.CSSProperties = {
      backgroundColor: event.resource === 'Floor' ? '#3498db' : '#e74c3c',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return { style };
  };

  return (
    <BigCalendar
      localizer={localizer}
      events={shifts}
      startAccessor="start"
      endAccessor="end"
      style={{ height: '600px' }}
      views={['week', 'day']}
      defaultView='week'
      step={30}
      timeslots={2}
      min={moment().startOf('day').toDate()}
      max={moment().endOf('day').toDate()}
      eventPropGetter={eventStyleGetter}
      components={{
        event: ShiftEvent 
      }}
    />
  );
};

export default ShiftCalendar;
