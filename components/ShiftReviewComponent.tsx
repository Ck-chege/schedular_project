import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, Timer, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import ShiftVisual from './24-HourShiftVisualComponent';
import { ShiftTemplate, WorkdayConfigTemplate } from '@/types/types';
import { saveShiftTemplate } from '@/actions/shiftTemplateActions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface ShiftReviewProps {
  workdayConfig: WorkdayConfigTemplate;
  shifts: Array<ShiftTemplate>;
  onEdit: (step: string) => void;
  onConfirm: () => void;
}

const ShiftReview: React.FC<ShiftReviewProps> = ({ 
  workdayConfig, shifts, 
  // onEdit, onConfirm
 }) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${parseInt(hours, 10)}:${minutes}`;
  };

  const { toast } = useToast();
  const router = useRouter();
  
  const totalShiftHours = shifts.reduce((acc, shift) => acc + shift.duration, 0);
  const isFullyCovered = totalShiftHours === workdayConfig.duration;

  const handleConfirmAndSave = async () => {
    const result = await saveShiftTemplate(workdayConfig, shifts);
    if (result.error) {
      toast({
        title: "Error",
        description: "Failed to save shift template. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Shift template saved successfully!",
        variant: "default",
      });
      
      localStorage.removeItem('workdayConfig');
      localStorage.removeItem('shifts');
      localStorage.removeItem('currentStep');
      // Redirect to the shift management page
      router.push('/home/shift');
    }
  };

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground">
          <CardTitle className="text-2xl">{`Workday Overview - ${workdayConfig.title}`}</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Review your workday configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
          {[
            { icon: Clock, label: "Start Time", value: formatTime(workdayConfig.startTime) },
            { icon: Clock, label: "End Time", value: formatTime(workdayConfig.endTime) },
            { icon: Timer, label: "Duration", value: `${workdayConfig.duration} hrs` },
            { icon: Users, label: "Shift Type", value: workdayConfig.shiftType }
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg shadow-inner">
              <Icon className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
              <span className="text-xl font-bold mt-1">{value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="h-6 w-6" />
            Shift Details
          </CardTitle>
          <CardDescription>
            {shifts.length} shift{shifts.length !== 1 ? 's' : ''} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shifts.map((shift, index) => (
              <div key={shift.id} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full font-bold text-lg shadow-md">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Shift {shift.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">{shift.duration} hours</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ShiftVisual workdayConfig={workdayConfig} shifts={shifts} />

      <Alert variant={isFullyCovered ? "default" : "destructive"}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {isFullyCovered
            ? "All workday hours are covered by shifts."
            : `Warning: There's a discrepancy between workday duration (${workdayConfig.duration} hrs) and total shift hours (${totalShiftHours} hrs).`
          }
        </AlertDescription>
      </Alert>

      <div className="flex justify-end items-center">
        <Button onClick={handleConfirmAndSave} className="gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Confirm and Save
        </Button>
      </div>
    </div>
  );
};

export default ShiftReview;










