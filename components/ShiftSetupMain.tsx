import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ConfigureWorkday, { WorkdayConfig } from "./ConfigureShiftWorkday";
import FixedShiftSetup from "./FixedShiftSetup";
import CustomShiftSetup from "./CustomShiftSetup";
import ShiftReview from "./ShiftReviewComponent";
import { Label } from "@radix-ui/react-label";
import { FileText } from "lucide-react";
import { Input } from "./ui/input";

const defaultWorkdayConfig: WorkdayConfig = {
  title:"",
  startTime: "09:00",
  endTime: "17:00",
  duration: 8,
  shiftType: "custom",
};

type SetupStep = "configure" | "fixed" | "custom" | "review";

const stepInfo: { [key in SetupStep]: { title: string; description: string } } =
  {
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
  const [workdayConfig, setWorkdayConfig] =
    useState<WorkdayConfig>(defaultWorkdayConfig);
  const [currentStep, setCurrentStep] = useState<SetupStep>("configure");
  const [shiftSetup, setShiftSetup] = useState<any>(null);

  const steps = useMemo(() => {
    return ["configure", workdayConfig.shiftType, "review"] as SetupStep[];
  }, [workdayConfig.shiftType]);

  const handleWorkdayConfigChange = (config: WorkdayConfig) => {
    setWorkdayConfig(config);
    setCurrentStep(config.shiftType);
  };

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
            />
          </div>
        );
      case "fixed":
        return (
          <FixedShiftSetup
            workdayDuration={workdayConfig.duration}
            startTime={workdayConfig.startTime}
            // onComplete={handleShiftSetup}
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
            onEdit={() => {}}
            onConfirm={() => {}}
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

// import React, { useState, useCallback } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import FixedShiftSetup from "./FixedShiftSetup";
// import CustomShiftSetup from "./CustomShiftSetup";
// import ConfigureWorkday, { WorkdayConfig } from "./ConfigureShiftWorkday";

// const ShiftSetupMain = () => {
//   const [workdayConfig, setWorkdayConfig] = useState<WorkdayConfig>({
//     startTime: "09:00",
//     endTime: "17:00",
//     duration: 8,
//     shiftType: 'fixed'
//   });

//   const handleWorkdayConfigChange = useCallback((newConfig: WorkdayConfig) => {
//     setWorkdayConfig(newConfig);
//   }, []);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6 text-center text-primary">
//         Shift Setup
//       </h1>

//       <ConfigureWorkday
//         onConfigure={handleWorkdayConfigChange}
//         initialConfig={workdayConfig}
//       />

//       {workdayConfig && (
//         <div className="mt-6">
//           {workdayConfig.shiftType === 'fixed' ? (
//               <FixedShiftSetup
//                 workdayDuration={workdayConfig.duration}
//                 startTime={workdayConfig.startTime}
//               />
//             ) : (
//               <CustomShiftSetup
//                 workdayDuration={workdayConfig.duration}
//                 startTime={workdayConfig.startTime}
//                 onComplete={() => {}}
//               />
//             )}
//         </div>
//       )}
//     </div>
//   );
// };
// export default ShiftSetupMain;
