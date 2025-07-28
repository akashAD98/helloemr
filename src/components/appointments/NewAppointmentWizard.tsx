
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
import { toast } from "sonner";
import { dataStore } from "@/lib/dataStore";

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
      // Save to local storage
      dataStore.addAppointment(data);
      const newAppointment = { ...data, id: Date.now().toString() };
      
      onSubmit(newAppointment);
      toast.success('Appointment created successfully');
      resetWizard();
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

      <div className="grid gap-3 md:gap-4 py-4">
        <Card 
          className="cursor-pointer hover:bg-accent/50 transition-colors" 
          onClick={() => setStep('existing-patient')}
        >
          <CardHeader className="p-4 md:pb-4">
            <CardTitle className="flex items-center text-base md:text-lg">
              <Users className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              Select Existing Patient
            </CardTitle>
            <CardDescription className="text-sm">
              Choose from registered patients and schedule an appointment
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover:bg-accent/50 transition-colors" 
          onClick={() => setStep('new-patient')}
        >
          <CardHeader className="p-4 md:pb-4">
            <CardTitle className="flex items-center text-base md:text-lg">
              <UserPlus className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 text-green-600" />
              Add New Patient & Schedule
            </CardTitle>
            <CardDescription className="text-sm">
              Register a new patient and create their first appointment
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
