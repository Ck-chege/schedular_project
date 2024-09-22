import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { List, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils"; // Make sure you have this utility function

export default async function EmployeesInfoComponent() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const business_id = user?.user_metadata.business_id;

  // Fetch employees data
  const { data: employees, error } = await supabase
    .from('employees')
    .select('name, email, primary_task')
    .eq('business_id', business_id)
    .limit(3);

  if (error) {
    console.error('Error fetching employees:', error);
  }

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Employees Info</CardTitle>
        <Link
          href={`/home/register/employee/${business_id}`}
          className={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "h-9 rounded-md px-3"
          )}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Employee
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Primary Task</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees && employees.map((employee, index) => (
              <TableRow key={index}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.primary_task}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end">
          
          <Link
            href="/employees"
            className={cn(
              "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              "h-10 px-4 py-2"
            )}
          >
            <List className="mr-2 h-4 w-4" />
            View More
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}