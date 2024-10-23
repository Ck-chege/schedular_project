import React from "react";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import SignOutButton from "./SignOutButton";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function TopNavBar({ businessName }: { businessName: string }) {
  return (
    <nav className=" w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/home" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-800">
              {businessName}
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {/* <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80"
            >
              Dashboard
            </Link>
            <Link
              href="/customers"
              className="transition-colors hover:text-foreground/80"
            >
              Customers
            </Link>
            <Link
              href="/products"
              className="transition-colors hover:text-foreground/80"
            >
              Products
            </Link> */}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="outline" className="inline-flex items-center md:hidden">
              <span className="font-bold">{businessName}</span>
            </Button>
          </div>
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="mr-2" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2" aria-label="User menu">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <SignOutButton />
          </nav>
        </div>
      </div>
    </nav>
  )
}