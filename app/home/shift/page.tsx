import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  PlusCircle,
  AlertCircle,
  FileText,
  Edit2,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { cn } from "@/lib/utils";
import UpcomingSchedules from "@/components/UpcomingSchedules";
import { getShiftTemplates } from "@/actions/shiftTemplateActions";

const ShiftDurationBadge =({
  duration,
  index,
}: {
  duration: number;
  index: number;
}) => (
  <Badge
    variant="outline"
    className={`mr-1 mb-1 ${
      index % 3 === 0
        ? "bg-blue-100"
        : index % 3 === 1
        ? "bg-green-100"
        : "bg-yellow-100"
    }`}
  >
    Shift {index + 1}: {duration}hrs
  </Badge>
);

const ShiftDashboard = async () => {
  // Mock data for the dashboard
  const currentShifts = [
    {
      id: 1,
      name: "John Doe",
      role: "Cashier",
      startTime: "09:00",
      endTime: "17:00",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Manager",
      startTime: "08:00",
      endTime: "16:00",
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "Sales Associate",
      startTime: "10:00",
      endTime: "18:00",
    },
  ];

  const upcomingShifts = [
    { id: 1, date: "2024-09-24", employees: 5, status: "Scheduled" },
    { id: 2, date: "2024-09-25", employees: 4, status: "Incomplete" },
    { id: 3, date: "2024-09-26", employees: 6, status: "Scheduled" },
  ];

  // Updated mock data for workday shifts plan templates

  const { workDayTemplates, error } = await getShiftTemplates()
  if (error) {
    console.error('Failed to fetch templates:', error);
  }

  // // Helper function to format shift durations
  // const formatShiftDurations = (durations: number[]) => {
  //   return durations
  //     .map((duration, index) => `Shift ${index + 1} - ${duration}hrs`)
  //     .join(", ");
  // };

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
                <div
                  key={shift.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {shift.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{shift.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {shift.role}
                      </p>
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
                      <Badge
                        variant={
                          shift.status === "Scheduled"
                            ? "default"
                            : "destructive"
                        }
                      >
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
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Manage Employees
            </Button>
            <Button
              variant="secondary"
              className="w-full flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              View Shift Conflicts
            </Button>
          </CardContent>
        </Card>
      </div>

      <UpcomingSchedules />

      {/* Updated Workday Shifts Plan Templates section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Workday Shifts Plan Templates
          </CardTitle>
          <CardDescription>
            Available workday shift plan templates for quick scheduling
          </CardDescription>
        </CardHeader>
        <CardContent>
        <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Template Name</TableHead>
          <TableHead className="text-center">Shifts</TableHead>
          <TableHead className="text-center">Workday</TableHead>
          <TableHead className="text-center">Start Time</TableHead>
          <TableHead className="text-center">End Time</TableHead>
          <TableHead>Shift Durations</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workDayTemplates && workDayTemplates.map((template) => (
          <TableRow key={template.id}>
            <TableCell className="font-medium">{template.title}</TableCell>
            <TableCell className="text-center">{template.shifts.length}</TableCell>
            <TableCell className="text-center">{template.duration} hrs</TableCell>
            <TableCell className="text-center">{template.startTime}</TableCell>
            <TableCell className="text-center">{template.endTime}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {template.shifts.map((shift, index) => (
                  <ShiftDurationBadge
                    key={index}
                    duration={shift.duration}
                    index={index}
                  />
                ))}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="outline" 
                size="sm" 
                className="mr-2"
              >
                <Edit2 size={16} className="mr-1" />
                Edit
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </Button>
            </TableCell>
          </TableRow>
        )) || (<p className="w-full justify-center items-center p-3">No templates available.</p>)}
      </TableBody>
    </Table>
          <Link
            href={`/home/register/shift`}
            className={cn(
              "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "h-9 rounded-md px-3 w-full mt-4"
            )}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Template
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
export default ShiftDashboard;
