"use client";
import CustomShiftSetup from "@/components/CustomShiftSetup";
import FixedShiftSetup from "@/components/FixedShiftSetup";
import ShiftSetupMain from "@/components/ShiftSetupMain";

export default function BusinessRegistrationPage({
    params,
  }: {
    params: { business_id: string };
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full p-6">
        <ShiftSetupMain/>
      </div>
    </div>
  )
}