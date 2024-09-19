import React from "react";
import { Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import SignOutButton from "./SignOutButton";
import Link from "next/link";

export default async function TopNavBar({ business_name }: { business_name: string }) {

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/home" className="flex items-center">
            <span className="text-xl font-bold text-gray-800">
              {business_name}
            </span>
            </Link>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-4">
              <Bell className="h-5 w-5" />
            </Button>
            <SignOutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
