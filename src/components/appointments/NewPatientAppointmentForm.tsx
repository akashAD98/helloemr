
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { appointmentTypes, availableTimeSlots, durationOptions, providers, patients } from "@/data/mockData";
import { Patient } from "@/types/patient";
import { Button } from "@/components/ui/button";
import {
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

interface NewPatientAppointmentFormProps {
  selectedDate?: Date;
  onBack: () => void;
  onSubmit: (data: { patient: Patient; appointment: any }) => void;
}

export function NewPatientAppointmentForm({
  selectedDate,
  onBack,
  onSubmit
}: NewPatientAppointmentFormProps) {
  const [patientData, setPatientData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
  });

  const [appointmentData, setAppointmentData] = useState({
    date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
    time: "",
    duration: "30 minutes",
    type: "New Patient",
    provider: "Dr. Anjali Gupta",
    reasonForVisit: "",
  });

  useEffect(() => {
    if (selectedDate) {
      setAppointmentData(prev => ({
        ...prev,
        date: format(selectedDate, "yyyy-MM-dd")
      }));
    }
  }, [selectedDate]);

  const handlePatientChange = (field: keyof typeof patientData, value: string) => {
    setPatientData({
      ...patientData,
      [field]: value,
    });
  };

  const handleAppointmentChange = (field: keyof typeof appointmentData, value: string) => {
    setAppointmentData({
      ...appointmentData,
      [field]: value,
    });
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = () => {
    // Validate patient data
    if (!patientData.name || !patientData.dateOfBirth || !patientData.gender || !patientData.phone) {
      toast.error("Please fill in all required patient fields");
      return;
    }

    // Validate appointment data
    if (!appointmentData.date || !appointmentData.time || !appointmentData.type || !appointmentData.provider) {
      toast.error("Please fill in all required appointment fields");
      return;
    }

    // Create new patient object
    const newPatient: Patient = {
      id: `p${patients.length + 1}`,
      name: patientData.name,
      dateOfBirth: patientData.dateOfBirth,
      age: calculateAge(patientData.dateOfBirth),
      gender: patientData.gender,
      active: true,
      provider: appointmentData.provider,
      contactInfo: {
        email: patientData.email,
        phone: patientData.phone,
        address: ""
      }
    };

    // Create appointment data
    const appointmentFormData = {
      patientId: newPatient.id,
      ...appointmentData
    };

    onSubmit({ patient: newPatient, appointment: appointmentFormData });
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <DialogTitle>Add New Patient & Schedule</DialogTitle>
            <DialogDescription>
              Register a new patient and create their first appointment
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto">
        {/* Patient Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Patient Information</h3>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="patient-name" className="text-right">
              Name *
            </Label>
            <div className="col-span-3">
              <Input
                id="patient-name"
                value={patientData.name}
                onChange={(e) => handlePatientChange('name', e.target.value)}
                placeholder="Full name"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="patient-dob" className="text-right">
              Date of Birth *
            </Label>
            <div className="col-span-3">
              <Input
                id="patient-dob"
                type="date"
                value={patientData.dateOfBirth}
                onChange={(e) => handlePatientChange('dateOfBirth', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="patient-gender" className="text-right">
              Gender *
            </Label>
            <div className="col-span-3">
              <Select 
                value={patientData.gender} 
                onValueChange={(value) => handlePatientChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Non-binary">Non-binary</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="patient-phone" className="text-right">
              Phone *
            </Label>
            <div className="col-span-3">
              <Input
                id="patient-phone"
                value={patientData.phone}
                onChange={(e) => handlePatientChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="patient-email" className="text-right">
              Email
            </Label>
            <div className="col-span-3">
              <Input
                id="patient-email"
                type="email"
                value={patientData.email}
                onChange={(e) => handlePatientChange('email', e.target.value)}
                placeholder="email@example.com"
              />
            </div>
          </div>
        </div>

        {/* Appointment Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Appointment Details</h3>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="appointment-date" className="text-right">
              Date *
            </Label>
            <div className="col-span-3">
              <Input
                id="appointment-date"
                type="date"
                value={appointmentData.date}
                onChange={(e) => handleAppointmentChange('date', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="appointment-time" className="text-right">
              Time *
            </Label>
            <div className="col-span-3">
              <Select 
                value={appointmentData.time} 
                onValueChange={(value) => handleAppointmentChange('time', value)}
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="appointment-duration" className="text-right">
              Duration
            </Label>
            <div className="col-span-3">
              <Select 
                value={appointmentData.duration} 
                onValueChange={(value) => handleAppointmentChange('duration', value)}
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
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="appointment-type" className="text-right">
              Type *
            </Label>
            <div className="col-span-3">
              <Select 
                value={appointmentData.type} 
                onValueChange={(value) => handleAppointmentChange('type', value)}
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="appointment-provider" className="text-right">
              Provider *
            </Label>
            <div className="col-span-3">
              <Select 
                value={appointmentData.provider} 
                onValueChange={(value) => handleAppointmentChange('provider', value)}
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
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="appointment-reason" className="text-right">
              Reason
            </Label>
            <div className="col-span-3">
              <Textarea
                id="appointment-reason"
                placeholder="Reason for visit"
                value={appointmentData.reasonForVisit}
                onChange={(e) => handleAppointmentChange('reasonForVisit', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit}>
          Create Patient & Schedule
        </Button>
      </DialogFooter>
    </>
  );
}
