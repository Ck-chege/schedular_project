import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, PlusCircle, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ShiftDashboard = () => {
  // Mock data for the dashboard
  const currentShifts = [
    { id: 1, name: 'John Doe', role: 'Cashier', startTime: '09:00', endTime: '17:00' },
    { id: 2, name: 'Jane Smith', role: 'Manager', startTime: '08:00', endTime: '16:00' },
    { id: 3, name: 'Mike Johnson', role: 'Sales Associate', startTime: '10:00', endTime: '18:00' },
  ];

  const upcomingShifts = [
    { id: 1, date: '2024-09-24', employees: 5, status: 'Scheduled' },
    { id: 2, date: '2024-09-25', employees: 4, status: 'Incomplete' },
    { id: 3, date: '2024-09-26', employees: 6, status: 'Scheduled' },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Shift Management Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Current Shifts
            </CardTitle>
            <CardDescription>Employees currently on shift</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentShifts.map((shift) => (
                <div key={shift.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{shift.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{shift.name}</p>
                      <p className="text-sm text-muted-foreground">{shift.role}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {shift.startTime} - {shift.endTime}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Schedules
            </CardTitle>
            <CardDescription>Next 3 days of shifts</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingShifts.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell>{shift.date}</TableCell>
                    <TableCell>{shift.employees}</TableCell>
                    <TableCell>
                      <Badge variant={shift.status === 'Scheduled' ? 'default' : 'destructive'}>
                        {shift.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Manage shifts and employees</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create New Shift
            </Button>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Users className="h-4 w-4" />
              Manage Employees
            </Button>
            <Button variant="secondary" className="w-full flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              View Shift Conflicts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShiftDashboard;