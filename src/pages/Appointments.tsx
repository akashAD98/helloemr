import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Calendar, CalendarIcon, Clock, PlusCircle, CheckCircle, Users, AlertCircle, Activity } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { AppointmentFormDialog } from "@/components/appointments/AppointmentFormDialog";
import { AppointmentStats } from "@/components/appointments/AppointmentStats";
import { DetailedAppointmentList } from "@/components/appointments/DetailedAppointmentList";
import { appointments, patients, Appointment } from "@/data/mockData";
import { NewAppointmentWizard } from "@/components/appointments/NewAppointmentWizard";

export default function Appointments() {
  const [date, setDate] = useState<Date>(new Date());
  const [provider, setProvider] = useState<string>("all");
  const [localAppointments, setLocalAppointments] = useState<Appointment[]>(appointments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const formattedDate = format(date, "yyyy-MM-dd");
  
  // Filter appointments based on selected date and provider
  const filteredAppointments = localAppointments.filter(appointment => {
    const matchesDate = appointment.date === formattedDate;
    const matchesProvider = provider === "all" || appointment.provider.includes(provider);
    return matchesDate && matchesProvider;
  });

  // Calculate appointment statistics
  const todaysStats = {
    total: filteredAppointments.length,
    pending: filteredAppointments.filter(a => a.status === "pending").length,
    booked: filteredAppointments.filter(a => a.status === "booked").length,
    completed: filteredAppointments.filter(a => a.status === "completed").length,
    cancelled: filteredAppointments.filter(a => a.status === "cancelled").length,
    ongoing: filteredAppointments.filter(a => a.status === "booked" && isCurrentTimeSlot(a.time)).length
  };

  // Check if appointment is currently ongoing
  function isCurrentTimeSlot(appointmentTime: string): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const [time, period] = appointmentTime.split(' ');
    const [hour, minute] = time.split(':').map(Number);
    
    let appointmentHour = hour;
    if (period === 'PM' && hour !== 12) appointmentHour += 12;
    if (period === 'AM' && hour === 12) appointmentHour = 0;
    
    const appointmentStart = appointmentHour * 60 + minute;
    const currentTime = currentHour * 60 + currentMinute;
    
    return currentTime >= appointmentStart && currentTime <= appointmentStart + 30;
  }

  // Handle appointment creation for both existing and new patients
  const handleCreateAppointment = (data: any) => {
    // Check if this includes a new patient
    if (data.patient && data.appointment) {
      // Add new patient to mock data (in real app, this would be saved to database)
      const newPatient = data.patient;
      const appointmentData = data.appointment;
      
      const newAppointment: Appointment = {
        id: `a${localAppointments.length + 1}`,
        patientId: newPatient.id,
        patientName: newPatient.name,
        date: appointmentData.date,
        time: appointmentData.time,
        duration: appointmentData.duration,
        type: appointmentData.type,
        status: "pending",
        provider: appointmentData.provider,
        reasonForVisit: appointmentData.reasonForVisit
      };
      
      setLocalAppointments([...localAppointments, newAppointment]);
      toast.success(`New patient ${newPatient.name} registered and appointment scheduled`);
    } else {
      // Existing patient appointment
      const patientData = patients.find(p => p.id === data.patientId);
      
      if (!patientData) {
        toast.error("Patient not found");
        return;
      }
      
      const newAppointment: Appointment = {
        id: `a${localAppointments.length + 1}`,
        patientId: data.patientId,
        patientName: patientData.name,
        date: data.date,
        time: data.time,
        duration: data.duration,
        type: data.type,
        status: "pending",
        provider: data.provider,
        reasonForVisit: data.reasonForVisit
      };
      
      setLocalAppointments([...localAppointments, newAppointment]);
      toast.success(`Appointment scheduled for ${patientData.name}`);
    }
  };

  // Handle status change
  const handleStatusChange = (appointmentId: string, newStatus: 'booked' | 'pending' | 'cancelled' | 'completed') => {
    setLocalAppointments(prevAppointments => 
      prevAppointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: newStatus }
          : appointment
      )
    );
    
    const appointment = localAppointments.find(a => a.id === appointmentId);
    if (appointment) {
      const statusText = newStatus === 'completed' ? 'completed' : 
                         newStatus === 'cancelled' ? 'cancelled' : 
                         'updated';
      toast.success(`Appointment ${statusText} for ${appointment.patientName}`);
    }
  };

  return (
    <PageContainer>
      <div className="p-6 space-y-6">
        <PageHeader 
          title="Appointments" 
          description={`Schedule Management - ${format(date, "EEEE, MMMM d, yyyy")}`}
          actions={
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          }
        />

        {/* Daily Statistics */}
        <AppointmentStats stats={todaysStats} selectedDate={date} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="animate-slideUp">
              <CardContent className="p-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>
            
            <Card className="animate-slideUp animation-delay-100">
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Filter by Provider</h3>
                  <Select value={provider} onValueChange={setProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Providers</SelectItem>
                      <SelectItem value="Dr. Jennifer Davis">Dr. Jennifer Davis</SelectItem>
                      <SelectItem value="Dr. Michael Wong">Dr. Michael Wong</SelectItem>
                      <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Quick Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Available slots:</span>
                      <span className="font-medium text-green-600">4</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Peak hours:</span>
                      <span className="font-medium">10 AM - 2 PM</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Card className="animate-fadeIn animation-delay-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-medical-600" />
                    Today's Appointments
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    {filteredAppointments.length} appointments scheduled
                  </div>
                </div>
                
                <DetailedAppointmentList
                  appointments={filteredAppointments}
                  onStatusChange={handleStatusChange}
                  isCurrentTimeSlot={isCurrentTimeSlot}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <NewAppointmentWizard
        open={isDialogOpen}
        selectedDate={date}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateAppointment}
      />
    </PageContainer>
  );
}
