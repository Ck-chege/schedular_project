
// SignOutButton.tsx
"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/actions/signoutAction";

export default function SignOutButton() {
  return (
    <form action={signOut}>
      <Button variant="outline" type="submit">
        <LogOut className="h-5 w-5 mr-2" />
        Sign out
      </Button>
    </form>
  );
}
