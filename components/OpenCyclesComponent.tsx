import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  getOpenShiftCycles,
} from "@/actions/shiftCyclesActions";
import { ArrowRight, CalendarDays, Users } from "lucide-react";
import { ShiftCycleStatus } from "@/types/shift_cycle_types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AllowAvailabilityButton from "./AllowAvailabilityButton";

const getStatusColor = (status: ShiftCycleStatus): string => {
  switch (status) {
    case ShiftCycleStatus.Created:
      return "bg-yellow-100 text-yellow-800";
    case ShiftCycleStatus.SchedulingInProcess:
      return "bg-blue-100 text-blue-800";
    case ShiftCycleStatus.SchedulingComplete:
      return "bg-green-100 text-green-800";
    case ShiftCycleStatus.Active:
      return "bg-purple-100 text-purple-800";
    case ShiftCycleStatus.Complete:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default async function OpenCycles() {
  const { data: cycles, error } = await getOpenShiftCycles();

  if (error) {
    console.error("Error getting shift cycles:", error);
    return <div>Error getting shift cycles</div>;
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Shift Cycles</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-6">
          Manage and view current shift schedules.
        </p>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Work Days</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cycles?.map((cycle) => (
                <TableRow key={cycle.id}>
                  <TableCell className="font-medium">{cycle.title}</TableCell>
                  <TableCell
                    className={`capitalize ${getStatusColor(cycle.status)}`}
                  >
                    {cycle.status}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CalendarDays className="w-4 h-4 mr-2 text-gray-400" />
                      <span>
                        {new Date(cycle.start_date).toLocaleDateString()} -{" "}
                        {new Date(cycle.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{cycle.num_work_days}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {cycle.status === ShiftCycleStatus.Created && (
                      <AllowAvailabilityButton cycleId={cycle.id} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Button asChild className="w-full sm:w-auto mt-6">
          <Link href={`/home/shift`}>
            View All Shifts <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}