import Link from 'next/link';
import React from 'react';
import { createClient } from "@/utils/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus } from "lucide-react";

interface Business {
  id: string;
  name: string;
  email: string;
  industry: string;
}

const AdminPage: React.FC = async () => {
  const supabase = createClient();
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, name, email, industry')
    .limit(10);

  if (error) {
    console.error('Error fetching businesses:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Welcome to the admin dashboard. Here you can manage businesses and perform other administrative tasks.
      </p>

      <div className="mb-8">
        <Link href="/home/register/business">
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Business
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {businesses && businesses.map((business: Business) => (
              <TableRow key={business.id}>
                <TableCell className="font-medium">{business.name}</TableCell>
                <TableCell>{business.email}</TableCell>
                <TableCell>{business.industry}</TableCell>
                <TableCell>
                  <Link href={`/admin/register/manager/${business.id}`}>
                    <Button size="sm" variant="outline" className="flex items-center">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Register Manager
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminPage;