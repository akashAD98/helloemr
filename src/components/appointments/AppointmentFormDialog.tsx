
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { X, ArrowLeft } from "lucide-react";
import { appointmentTypes, availableTimeSlots, durationOptions, providers } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { dataStore } from "@/lib/dataStore";
import { Patient } from "@/types/patient";

interface AppointmentFormData {
  patientId: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  provider: string;
  reasonForVisit: string;
}

interface AppointmentFormDialogProps {
  open: boolean;
  selectedDate?: Date;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AppointmentFormData) => void;
  showBackButton?: boolean;
}

export function AppointmentFormDialog({
  open,
  selectedDate,
  onOpenChange,
  onSubmit,
  showBackButton = false
}: AppointmentFormDialogProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState<AppointmentFormData>({
    patientId: "",
    date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
    time: "",
    duration: "30 minutes",
    type: "Follow-up",
    provider: "Dr. Jennifer Davis",
    reasonForVisit: "",
  });

  // Load patients from data store
  useEffect(() => {
    const allPatients = dataStore.getPatients();
    setPatients(allPatients);
  }, [open]);

  // Update form when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: format(selectedDate, "yyyy-MM-dd")
      }));
    }
  }, [selectedDate]);

  const handleChange = (field: keyof AppointmentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      { field: 'patientId', message: 'Please select a patient' },
      { field: 'date', message: 'Please select a date' },
      { field: 'time', message: 'Please select a time' },
      { field: 'type', message: 'Please select appointment type' },
      { field: 'provider', message: 'Please select a provider' }
    ];

    for (const { field, message } of requiredFields) {
      if (!formData[field as keyof AppointmentFormData]) {
        toast.error(message);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    console.log("Submitting appointment:", formData);
    onSubmit(formData);
    
    if (!showBackButton) {
      onOpenChange(false);
    }
  };

  const FormFields = () => (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
      <div className="space-y-2">
        <Label htmlFor="patient">Patient *</Label>
        <Select 
          value={formData.patientId} 
          onValueChange={(value) => handleChange('patientId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select patient" />
          </SelectTrigger>
          <SelectContent>
            {patients.map(patient => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.name || `${patient.firstName} ${patient.lastName}` || "Unknown Patient"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Time *</Label>
          <Select 
            value={formData.time} 
            onValueChange={(value) => handleChange('time', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {availableTimeSlots.map(slot => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Select 
            value={formData.duration} 
            onValueChange={(value) => handleChange('duration', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {durationOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {appointmentTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="provider">Provider *</Label>
        <Select 
          value={formData.provider} 
          onValueChange={(value) => handleChange('provider', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select provider" />
          </SelectTrigger>
          <SelectContent>
            {providers.map(provider => (
              <SelectItem key={provider} value={provider}>
                {provider}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Visit</Label>
        <Textarea
          id="reason"
          placeholder="Reason for visit"
          value={formData.reasonForVisit}
          onChange={(e) => handleChange('reasonForVisit', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );

  // Wizard view (embedded in NewAppointmentWizard)
  if (showBackButton) {
    return (
      <>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <DialogTitle>Schedule Appointment</DialogTitle>
              <DialogDescription>
                Select a patient and schedule their appointment
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <FormFields />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Back
          </Button>
          <Button onClick={handleSubmit}>
            Schedule Appointment
          </Button>
        </DialogFooter>
      </>
    );
  }

  // Standalone dialog view
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Appointment</DialogTitle>
          <DialogDescription>
            Schedule a new appointment for a patient
          </DialogDescription>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <FormFields />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Schedule Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
