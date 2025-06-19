
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, Users } from "lucide-react";
import { AppointmentFormDialog } from "./AppointmentFormDialog";
import { NewPatientAppointmentForm } from "./NewPatientAppointmentForm";
import { supabaseDataStore } from "@/lib/supabaseDataStore";
import { toast } from "sonner";

interface NewAppointmentWizardProps {
  open: boolean;
  selectedDate?: Date;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

type WizardStep = 'selection' | 'existing-patient' | 'new-patient';

export function NewAppointmentWizard({
  open,
  selectedDate,
  onOpenChange,
  onSubmit
}: NewAppointmentWizardProps) {
  const [step, setStep] = useState<WizardStep>('selection');

  const resetWizard = () => setStep('selection');

  const handleClose = () => {
    resetWizard();
    onOpenChange(false);
  };

  const handleBackToSelection = () => setStep('selection');

  const handleAppointmentSubmit = async (data: any) => {
    try {
      // Save to Supabase
      const newAppointment = await supabaseDataStore.addAppointment(data);
      
      if (newAppointment) {
        onSubmit(newAppointment);
        toast.success('Appointment created successfully');
        resetWizard();
      } else {
        toast.error('Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to create appointment');
    }
  };

  const SelectionStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>New Appointment</DialogTitle>
        <DialogDescription>
          Choose how you'd like to schedule the appointment
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <Card 
          className="cursor-pointer hover:bg-accent/50 transition-colors" 
          onClick={() => setStep('existing-patient')}
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg">
              <Users className="mr-3 h-5 w-5 text-blue-600" />
              Select Existing Patient
            </CardTitle>
            <CardDescription>
              Choose from registered patients and schedule an appointment
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover:bg-accent/50 transition-colors" 
          onClick={() => setStep('new-patient')}
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg">
              <UserPlus className="mr-3 h-5 w-5 text-green-600" />
              Add New Patient & Schedule
            </CardTitle>
            <CardDescription>
              Register a new patient and create their first appointment
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {step === 'selection' && <SelectionStep />}

        {step === 'existing-patient' && (
          <AppointmentFormDialog
            open={true}
            selectedDate={selectedDate}
            onOpenChange={handleBackToSelection}
            onSubmit={handleAppointmentSubmit}
            showBackButton={true}
          />
        )}

        {step === 'new-patient' && (
          <NewPatientAppointmentForm
            selectedDate={selectedDate}
            onBack={handleBackToSelection}
            onSubmit={handleAppointmentSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
