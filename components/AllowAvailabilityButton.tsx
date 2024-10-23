'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { allowEmployeeAvailabilityConfig } from "@/actions/shiftCyclesActions";

export default function AllowAvailabilityButton({ cycleId }: { cycleId: string }) {
  const handleAllowAvailability = async () => {
    try {
      await allowEmployeeAvailabilityConfig(cycleId);
      // You might want to add some feedback here, like a toast notification
    } catch (error) {
      console.error("Error allowing availability configuration:", error);
      // Handle the error, maybe show an error message to the user
    }
  };

  return (
    <Button onClick={handleAllowAvailability} size="sm">
      Allow Availability Configuration
    </Button>
  );
}