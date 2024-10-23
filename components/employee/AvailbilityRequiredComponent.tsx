import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShiftCycle } from "@/types/tableDataTypes";
import { CalendarDays, Clock, AlertCircle } from 'lucide-react';

export default function AvailabilityRequiredComponent({ shiftCycles }: { shiftCycles: ShiftCycle[] }) {
  const shiftCycle = shiftCycles?.[0];

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <CardTitle className="flex items-center text-2xl font-bold">
          <CalendarDays className="w-6 h-6 mr-2" />
          Shift Cycle Availability
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {shiftCycle ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm font-medium text-gray-600">Cycle Name</span>
              <span className="text-sm font-semibold">{shiftCycle.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-1" /> Start Date
              </span>
              <span className="text-sm">{new Date(shiftCycle.start_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-1" /> End Date
              </span>
              <span className="text-sm">{new Date(shiftCycle.end_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Status</span>
              <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {shiftCycle.status}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-4 bg-yellow-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
            <p className="text-sm text-yellow-700">
              No shift cycle currently requires availability configuration.
            </p>
          </div>
        )}
        <Button asChild className="w-full mt-6 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
          <Link href={`/employee/availability_config/${shiftCycle?.id}`}>
            Update Availability
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}