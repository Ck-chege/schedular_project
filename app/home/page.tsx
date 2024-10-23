import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
import EmployeesInfoComponent from "@/components/EmployeesInfoComponent";
import TasksInfoComponent from "@/components/TasksInfoComponent";
import ManagerInfoComponent from "@/components/ManagerInfoComponent";
import OpenCycles from "@/components/OpenCyclesComponent";

const BusinessLandingPage = async () => {
  

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      {/* <div className="flex flex-row gap-2 w-full max-w-4xl mx-auto p-4 overflow-x-auto">
        <Link
          href="/admin/register/manager"
          className={"bg-primary text-primary-foreground hover:bg-primary/90"}
        >
          Business
        </Link>
        
      </div> */}

      <header className="mb-12">
        <h1 className="text-4xl font-bold text-primary mb-2">
          Welcome to Your Business Dashboard
        </h1>
        <p className="text-xl text-muted-foreground">
          Manage your company, tasks, employees, and shifts all in one place.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card className="col-span-1 md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Company Info</CardTitle>
          </CardHeader>
          <CardContent>
            <p>View and manage your company details here.</p>
            <Button className="mt-4">Edit Company Info</Button>
          </CardContent>
        </Card>

        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <ManagerInfoComponent />
        </div>

        {/* <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Manager Info</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Access manager details and permissions.</p>
            <Button className="mt-4">Manage Roles</Button>
          </CardContent>
        </Card> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        <div className="col-span-2 md:col-span-1 lg:col-span-1">
          <TasksInfoComponent />
        </div>

        <div className="col-span-2 md:col-span-1 lg:col-span-2">
          <EmployeesInfoComponent />
        </div>
      </div>

      <div className="">
        <OpenCycles />
      </div>
    </div>
  );
};

export default BusinessLandingPage;


