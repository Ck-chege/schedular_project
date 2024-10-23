"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Employee, EmployeeWithTasks } from '@/types/tableDataTypes';
import AuthPopup from './AuthPopup';
import { registerEmployeeAuth } from '@/actions/EmployeeActions';

interface EmployeeListProps {
  employees: EmployeeWithTasks[];
  business_id: string;
}

function EmployeeList({ employees, business_id }: EmployeeListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAuth = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsAuthDialogOpen(true);
  };

  const handleCloseAuth = () => {
    setSelectedEmployee(null);
    setIsAuthDialogOpen(false);
  };

  const handleSetPassword = async (formData: FormData) => {
    if (selectedEmployee) {
        
        const { error } = await registerEmployeeAuth(formData)
        if (error) {
            console.error('Failed to set password:', error);
        } else {
            console.log('Password set successfully!');
            handleCloseAuth();
        }
      
      // You might want to refresh the employee data here
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Employees</CardTitle>
          <Link href={`/home/register/employee/${business_id}`}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Input 
              placeholder="Search employees..." 
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="secondary">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Primary Task</TableHead>
                <TableHead>Secondary Tasks</TableHead>
                <TableHead>Max Hours</TableHead>
                <TableHead>Auth Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>
                    {/* {employee.secondary_tasks && employee.secondary_tasks.map((task: string, index: number) => (
                      <Badge key={index} variant="secondary" className="mr-1">
                        {task}
                      </Badge>
                    ))} */}
                    {employee.tasks.map((task, index) => (
                      <Badge key={index} variant="secondary" className="mr-1">
                        {task.name}
                      </Badge>
                    ))}
                  
                  </TableCell>
                  <TableCell>{employee.max_hours} hours/week</TableCell>
                  <TableCell>
                    {employee.is_auth_set ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddAuth(employee)}
                      >
                        Add Auth
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedEmployee && (
        <AuthPopup
          isOpen={isAuthDialogOpen}
          onClose={() => handleCloseAuth()}
          employee={selectedEmployee}
          onSetPassword={formData => handleSetPassword(formData)}
        />
      )}
    </div>
  );
}

export default EmployeeList;