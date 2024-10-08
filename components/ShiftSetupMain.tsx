import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ConfigureWorkday from "./ConfigureShiftWorkday";
import FixedShiftSetup from "./FixedShiftSetup";
import CustomShiftSetup from "./CustomShiftSetup";
import ShiftReview from "./ShiftReviewComponent";
import { WorkdayConfigTemplate } from "@/types/types";

const defaultWorkdayConfig: WorkdayConfigTemplate = {
  title: "",
  startTime: "09:00",
  endTime: "17:00",
  duration: 8,
  shiftType: "custom",
};

type SetupStep = "configure" | "fixed" | "custom" | "review";

const stepInfo: { [key in SetupStep]: { title: string; description: string } } = {
  configure: {
    title: "Configure Workday",
    description: "Set up your basic workday parameters",
  },
  fixed: {
    title: "Shift Planning",
    description: "Configure fixed-duration shifts",
  },
  custom: { title: "Shift Planning", description: "Set up custom shifts" },
  review: { title: "Review", description: "Review your shift setup" },
};

const ShiftSetupWizard = () => {
  const [workdayConfig, setWorkdayConfig] = useState<WorkdayConfigTemplate>(defaultWorkdayConfig);
  const [currentStep, setCurrentStep] = useState<SetupStep>("configure");
  const [shiftSetup, setShiftSetup] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false); // Track whether the component has mounted

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure this code only runs on the client
      const savedConfig = localStorage.getItem("workdayConfig");
      const savedStep = localStorage.getItem("currentStep");
      const savedShifts = localStorage.getItem("shiftSetup");

      if (savedConfig) {
        setWorkdayConfig(JSON.parse(savedConfig));
      }
      if (savedStep) {
        setCurrentStep(savedStep as SetupStep);
      }
      if (savedShifts) {
        setShiftSetup(JSON.parse(savedShifts));
      }
    }
    setIsMounted(true); // Set to true after the component has mounted
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("workdayConfig", JSON.stringify(workdayConfig));
    }
  }, [workdayConfig, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("currentStep", currentStep);
    }
  }, [currentStep, isMounted]);

  useEffect(() => {
    if (shiftSetup && isMounted) {
      localStorage.setItem("shiftSetup", JSON.stringify(shiftSetup));
    }
  }, [shiftSetup, isMounted]);

  const updateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const endDate = new Date(2000, 0, 1, hours, minutes);
    endDate.setHours(endDate.getHours() + Math.floor(duration));
    endDate.setMinutes(endDate.getMinutes() + (duration % 1) * 60);
    return endDate.toTimeString().slice(0, 5);
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startDate = new Date(2000, 0, 1, startHours, startMinutes);
    const endDate = new Date(2000, 0, 1, endHours, endMinutes);

    let duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    if (duration < 0) duration += 24; // Handle cases where end time is past midnight

    return duration;
  };

  const handleWorkdayConfigChange = (config: WorkdayConfigTemplate) => {
    const updatedEndTime = updateEndTime(config.startTime, config.duration);
    setWorkdayConfig({ ...config, endTime: updatedEndTime });
    setCurrentStep(config.shiftType);
  };

  const handleEndTimeChange = (newEndTime: string) => {
    const newDuration = calculateDuration(workdayConfig.startTime, newEndTime);
    setWorkdayConfig({ ...workdayConfig, endTime: newEndTime, duration: newDuration });
  };

  const steps = useMemo(() => {
    return ["configure", workdayConfig.shiftType, "review"] as SetupStep[];
  }, [workdayConfig.shiftType]);

  const handleShiftSetup = (shifts: any) => {
    setShiftSetup(shifts);
    setCurrentStep("review");
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "configure":
        return (
          <div>
            <ConfigureWorkday
              onConfigure={handleWorkdayConfigChange}
              initialConfig={workdayConfig}
              onEndTimeChange={handleEndTimeChange}
            />
          </div>
        );
      case "fixed":
        return (
          <FixedShiftSetup
            workdayDuration={workdayConfig.duration}
            startTime={workdayConfig.startTime}
            onComplete={handleShiftSetup}
          />
        );
      case "custom":
        return (
          <CustomShiftSetup
            workdayDuration={workdayConfig.duration}
            startTime={workdayConfig.startTime}
            onComplete={handleShiftSetup}
          />
        );
      case "review":
        return (
          <ShiftReview
            workdayConfig={workdayConfig}
            shifts={shiftSetup}
            onEdit={() => setCurrentStep("custom")}
            onConfirm={() => {
              localStorage.clear();
            }}
          />
        );
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>
            <div className="text-xs mt-1">{stepInfo[step].title}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Shift Template Setup Wizard
      </h1>
      {renderStepIndicator()}
      <Card>
        <CardHeader>
          <CardTitle>{stepInfo[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>
      {currentStep !== "configure" && (
        <Button onClick={handleBack} className="mt-4">
          Back
        </Button>
      )}
    </div>
  );
};

export default ShiftSetupWizard;
