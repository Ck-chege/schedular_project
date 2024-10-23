import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import SignOutButton from "../SignOutButton";

export default function TopNavBarEmployee() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome back, Alex!</h1>
          <nav className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  Dashboard <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Overview</DropdownMenuItem>
                <DropdownMenuItem>Performance</DropdownMenuItem>
                <DropdownMenuItem>Tasks</DropdownMenuItem>
                <Link href="/employee/availability_config">
                <DropdownMenuItem>Configure Availability</DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  Schedule <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>My Shifts</DropdownMenuItem>
                <DropdownMenuItem>Request Time Off</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <SignOutButton />
          </nav>
        </div>
      </header>
  )
}
