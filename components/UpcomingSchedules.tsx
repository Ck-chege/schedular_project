"use client";
// components/ShiftDashboard/UpcomingSchedules.tsx

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, AlertCircle, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Assuming you're using Next.js

interface UpcomingShift {
  id: number;
  date: string;
  employees: number;
  status: "Scheduled" | "Incomplete";
}

const getUpcomingShifts = async (): Promise<{
  ok: boolean;
  json: () => Promise<UpcomingShift[]>;
}> => {
  // Mock response data
  const demoData: UpcomingShift[] = [
    // Uncomment these lines to simulate data
    // { id: 1, date: "2024-09-24", employees: 5, status: "Scheduled" },
    // { id: 2, date: "2024-09-25", employees: 4, status: "Incomplete" },
    // { id: 3, date: "2024-09-26", employees: 6, status: "Scheduled" },
  ];

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return demo data instead of making an API call
  return { ok: true, json: async () => demoData };
};

const UpcomingSchedules: React.FC = () => {
  const [upcomingShifts, setUpcomingShifts] = useState<UpcomingShift[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter(); // Initialize router for navigation

  useEffect(() => {
    const fetchUpcomingShifts = async () => {
      try {
        const response = await getUpcomingShifts();
        if (!response.ok) {
          throw new Error("Failed to fetch upcoming shifts.");
        }
        const data = await response.json();

        setUpcomingShifts(data as UpcomingShift[]);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchUpcomingShifts();
  }, []);

  // Handler for the "Start Configuration" button
  const handleStartConfiguration = () => {
    // Implement the logic to start configuration.
    // This could involve navigating to a configuration page or opening a modal.
    // Example using Next.js router:
    router.push("/home/schedule-cycles/configure");
    // If using a modal, you might set a state to open the modal instead.
  };

  // Common Card Header with Updated Title
  const cardHeader = (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Upcoming Schedule Cycle
      </CardTitle>
      <CardDescription>Next 3 days of shifts</CardDescription>
    </CardHeader>
  );

  if (loading) {
    return (
      <Card>
        {cardHeader}
        <CardContent>
          <div className="flex items-center space-x-2">
            <span>Loading...</span>
            <svg
              className="animate-spin h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        {cardHeader}
        <CardContent>
          <div className="flex items-center space-x-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <span>Error: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (upcomingShifts.length === 0) {
    return (
      <Card>
        {cardHeader}
        <CardContent className="flex flex-col items-center space-y-4 py-10">
          <AlertCircle className="h-12 w-12 text-gray-400" />
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-700">
              Schedule Cycles Not Configured
            </h3>
            <p className="text-sm text-gray-500">
              You have not configured any schedule cycles yet. Start configuring
              to manage upcoming shifts effectively.
            </p>
          </div>
          <Button
            onClick={handleStartConfiguration}
            variant="default"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Start Configuration
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {cardHeader}
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
                      shift.status === "Scheduled" ? "default" : "destructive"
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
  );
};
export default UpcomingSchedules;
