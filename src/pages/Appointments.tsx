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
import { Appointment } from "@/data/mockData";
import { NewAppointmentWizard } from "@/components/appointments/NewAppointmentWizard";
import { dataStore } from "@/lib/dataStore";

export default function Appointments() {
  const [date, setDate] = useState<Date>(new Date());
  const [provider, setProvider] = useState<string>("all");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const formattedDate = format(date, "yyyy-MM-dd");
  
  // Load appointments from data store
  useEffect(() => {
    const loadAppointments = () => {
      const allAppointments = dataStore.getAppointments();
      setAppointments(allAppointments);
    };
    
    loadAppointments();
    
    // Listen for storage changes to update when new appointments are added
    const handleStorageChange = () => {
      loadAppointments();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  // Schedule notifications when appointments change
  useEffect(() => {
    // Import notification service dynamically to avoid circular dependencies
    import('@/services/notificationService').then(({ notificationService }) => {
      notificationService.scheduleAppointmentNotifications();
    });
  }, [appointments]);
  
  // Filter appointments based on selected date and provider
  const filteredAppointments = appointments.filter(appointment => {
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
    try {
      // Check if this includes a new patient
      if (data.patient && data.appointment) {
        // Add new patient to data store
        const newPatient = data.patient;
        dataStore.addPatient(newPatient);
        
        const appointmentData = data.appointment;
        const newAppointment: Appointment = {
          id: dataStore.generateAppointmentId(),
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
        
        dataStore.addAppointment(newAppointment);
        
        // Update local state
        setAppointments(dataStore.getAppointments());
        
        // Schedule notifications for this appointment
        import('@/services/notificationService').then(({ notificationService }) => {
          notificationService.scheduleAppointmentNotifications();
        });
        
        toast.success(`New patient ${newPatient.name} registered and appointment scheduled for ${appointmentData.date} at ${appointmentData.time}`);
      } else {
        // Existing patient appointment
        const patientData = dataStore.getPatientById(data.patientId);
        
        if (!patientData) {
          toast.error("Patient not found");
          return;
        }
        
        const newAppointment: Appointment = {
          id: dataStore.generateAppointmentId(),
          patientId: data.patientId,
          patientName: patientData.name || `${patientData.firstName} ${patientData.lastName}`,
          date: data.date,
          time: data.time,
          duration: data.duration,
          type: data.type,
          status: "pending",
          provider: data.provider,
          reasonForVisit: data.reasonForVisit
        };
        
        dataStore.addAppointment(newAppointment);
        
        // Update local state
        setAppointments(dataStore.getAppointments());
        
        // Schedule notifications for this appointment
        import('@/services/notificationService').then(({ notificationService }) => {
          notificationService.scheduleAppointmentNotifications();
        });
        
        toast.success(`Appointment scheduled for ${patientData.name} on ${data.date} at ${data.time}`);
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Failed to create appointment. Please try again.");
    }
  };

  // Handle status change
  const handleStatusChange = (appointmentId: string, newStatus: 'booked' | 'pending' | 'cancelled' | 'completed') => {
    try {
      dataStore.updateAppointment(appointmentId, { status: newStatus });
      setAppointments(dataStore.getAppointments());
      
      const appointment = appointments.find(a => a.id === appointmentId);
      if (appointment) {
        const statusText = newStatus === 'completed' ? 'completed' : 
                           newStatus === 'cancelled' ? 'cancelled' : 
                           newStatus === 'booked' ? 'confirmed' : 'updated';
        toast.success(`Appointment ${statusText} for ${appointment.patientName}`);
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Failed to update appointment status");
    }
  };

  return (
    <PageContainer>
      <div className="p-4 md:p-6 space-y-6">
        <PageHeader 
          title="Appointments" 
          description={`Schedule Management - ${format(date, "EEEE, MMMM d, yyyy")} (${appointments.length} total appointments)`}
          actions={
            <Button onClick={() => setIsDialogOpen(true)} size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New Appointment</span>
              <span className="sm:hidden">New</span>
            </Button>
          }
        />

        {/* Daily Statistics */}
        <AppointmentStats stats={todaysStats} selectedDate={date} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <Card className="animate-slideUp">
              <CardContent className="p-3 md:p-4">
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
              <CardContent className="p-3 md:p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Filter by Provider</h3>
                  <Select value={provider} onValueChange={setProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Providers</SelectItem>
                      <SelectItem value="Dr. Jennifer Davis">Dr. Jennifer Davis</SelectItem>
                      <SelectItem value="Dr. Anjali Gupta">Dr. Anjali Gupta</SelectItem>
                      <SelectItem value="Dr. Michael Wong">Dr. Michael Wong</SelectItem>
                      <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Quick Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total appointments:</span>
                      <span className="font-medium text-blue-600">{appointments.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Today's appointments:</span>
                      <span className="font-medium text-green-600">{todaysStats.total}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Card className="animate-fadeIn animation-delay-200">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                  <h2 className="text-lg md:text-xl font-semibold flex items-center">
                    <Calendar className="mr-2 h-4 w-4 md:h-5 md:w-5 text-medical-600" />
                    <span className="hidden sm:inline">Selected Day's Appointments</span>
                    <span className="sm:hidden">Today's Schedule</span>
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} scheduled
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
