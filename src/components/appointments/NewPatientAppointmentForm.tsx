
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { appointmentTypes, availableTimeSlots, durationOptions, providers } from "@/data/mockData";
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
import { dataStore } from "@/lib/dataStore";

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
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
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

  const validateForm = (): boolean => {
    // Validate patient data
    if (!patientData.firstName.trim() || !patientData.lastName.trim()) {
      toast.error("Please enter patient's first and last name");
      return false;
    }
    
    if (!patientData.dateOfBirth) {
      toast.error("Please enter patient's date of birth");
      return false;
    }
    
    if (!patientData.gender) {
      toast.error("Please select patient's gender");
      return false;
    }
    
    if (!patientData.phone.trim()) {
      toast.error("Please enter patient's phone number");
      return false;
    }

    // Validate appointment data
    if (!appointmentData.date) {
      toast.error("Please select appointment date");
      return false;
    }
    
    if (!appointmentData.time) {
      toast.error("Please select appointment time");
      return false;
    }
    
    if (!appointmentData.type) {
      toast.error("Please select appointment type");
      return false;
    }
    
    if (!appointmentData.provider) {
      toast.error("Please select a provider");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Create new patient object
    const newPatient: Patient = {
      id: dataStore.generatePatientId(),
      firstName: patientData.firstName.trim(),
      lastName: patientData.lastName.trim(),
      name: `${patientData.firstName.trim()} ${patientData.lastName.trim()}`,
      dateOfBirth: patientData.dateOfBirth,
      age: calculateAge(patientData.dateOfBirth),
      gender: patientData.gender,
      active: true,
      status: "active",
      provider: appointmentData.provider,
      primaryProvider: appointmentData.provider,
      contactInfo: {
        email: patientData.email.trim() || undefined,
        phone: patientData.phone.trim(),
        address: patientData.address.trim() || undefined
      },
      email: patientData.email.trim() || undefined,
      phone: patientData.phone.trim(),
      address: patientData.address.trim() || undefined,
      lastVisit: new Date().toISOString().split('T')[0]
    };

    // Create appointment data
    const appointmentFormData = {
      patientId: newPatient.id,
      ...appointmentData
    };

    console.log("Creating new patient and appointment:", { patient: newPatient, appointment: appointmentFormData });

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
          <h3 className="text-lg font-medium border-b pb-2">Patient Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient-firstName">
                First Name *
              </Label>
              <Input
                id="patient-firstName"
                value={patientData.firstName}
                onChange={(e) => handlePatientChange('firstName', e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-lastName">
                Last Name *
              </Label>
              <Input
                id="patient-lastName"
                value={patientData.lastName}
                onChange={(e) => handlePatientChange('lastName', e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient-dob">
                Date of Birth *
              </Label>
              <Input
                id="patient-dob"
                type="date"
                value={patientData.dateOfBirth}
                onChange={(e) => handlePatientChange('dateOfBirth', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-gender">
                Gender *
              </Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient-phone">
                Phone *
              </Label>
              <Input
                id="patient-phone"
                value={patientData.phone}
                onChange={(e) => handlePatientChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-email">
                Email
              </Label>
              <Input
                id="patient-email"
                type="email"
                value={patientData.email}
                onChange={(e) => handlePatientChange('email', e.target.value)}
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="patient-address">
              Address
            </Label>
            <Input
              id="patient-address"
              value={patientData.address}
              onChange={(e) => handlePatientChange('address', e.target.value)}
              placeholder="Street address"
            />
          </div>
        </div>

        {/* Appointment Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Appointment Details</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointment-date">
                Date *
              </Label>
              <Input
                id="appointment-date"
                type="date"
                value={appointmentData.date}
                onChange={(e) => handleAppointmentChange('date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointment-time">
                Time *
              </Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointment-duration">
                Duration
              </Label>
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
            <div className="space-y-2">
              <Label htmlFor="appointment-type">
                Type *
              </Label>
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

          <div className="space-y-2">
            <Label htmlFor="appointment-provider">
              Provider *
            </Label>
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

          <div className="space-y-2">
            <Label htmlFor="appointment-reason">
              Reason for Visit
            </Label>
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
