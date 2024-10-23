// 'use client'
import React from 'react';
// import { Calendar as BigCalendar, momentLocalizer, Event } from 'react-big-calendar';
import { Clock, CheckSquare, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
// import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getOpenShiftCycles } from '@/actions/shiftCyclesActions';
import AvailbilityRequiredComponent from '@/components/employee/AvailbilityRequiredComponent';



// const ShiftEvent: React.FC<ShiftEventProps> = ({ event }) => (
//   <TooltipProvider>
//     <Tooltip>
//       <TooltipTrigger asChild>
//         <div className="shift-event p-1 text-xs overflow-hidden">
//           <strong>{event.title}</strong>
//           <br />
//           {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
//         </div>
//       </TooltipTrigger>
//       <TooltipContent>
//         <p><strong>{event.title}</strong></p>
//         <p>{moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}</p>
//         <p>Area: {event.resource}</p>
//       </TooltipContent>
//     </Tooltip>
//   </TooltipProvider>
// );

// // Dynamically import the ShiftCalendar component with no SSR
// const ShiftCalendar = dynamic(() => import('@/components/employee/ShiftCalendar'), { ssr: false });

// Add this async function at the top level of your component file
async function getShiftCyclesData() {
  return await getOpenShiftCycles();
}

const EnhancedEmployeeDashboard: React.FC = async () => {
  // Use the useToast hook inside your component
  // const { toast } = useToast();
  const { data:shiftCyclesData, error } = await getShiftCyclesData();

  if (error) {
    console.error("Error getting shift cycles:", error);
    

    // Show an error toast
    // toast({
    //   variant: "destructive",
    //   title: "Error",
    //   description: "Failed to fetch shift cycles. Please try again later.",
    // });
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      

      <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-full lg:col-span-1">
            {shiftCyclesData && (
              <AvailbilityRequiredComponent shiftCycles={shiftCyclesData || []} />
            )  }
            
          </div>
          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2" /> Upcoming Shifts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* {shifts.map((shift) => (
                  <div key={shift.id} className="flex justify-between items-center bg-muted p-4 rounded-lg">
                    <div>
                      <p className="font-semibold">{shift.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {moment(shift.start).format('MMM D, HH:mm')} - {moment(shift.end).format('HH:mm')}
                      </p>
                    </div>
                    <Badge variant={shift.resource === 'Floor' ? 'default' : 'secondary'}>
                      {shift.resource}
                    </Badge>
                  </div>
                ))} */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckSquare className="mr-2" /> Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { task: 'Complete training', progress: 75 },
                  { task: 'Inventory check', progress: 30 },
                  { task: 'Clean workstation', progress: 100 },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{item.task}</span>
                      <span className="text-sm text-muted-foreground">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="mr-2" /> Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { metric: 'Customer Satisfaction', value: '4.8/5' },
                  { metric: 'Tasks Completed', value: '95%' },
                  { metric: 'Attendance', value: '100%' },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{item.metric}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* <ShiftCalendar /> */}
        </div>
      </main>
    </div>
  );
};

export default EnhancedEmployeeDashboard;
