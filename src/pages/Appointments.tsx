
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Calendar, CalendarIcon, Clock, PlusCircle, CheckCircle } from "lucide-react";
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
import { appointments, patients, Appointment } from "@/data/mockData";

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

  // Handle appointment creation
  const handleCreateAppointment = (formData: any) => {
    const patientData = patients.find(p => p.id === formData.patientId);
    
    if (!patientData) {
      toast.error("Patient not found");
      return;
    }
    
    const newAppointment: Appointment = {
      id: `a${localAppointments.length + 1}`,
      patientId: formData.patientId,
      patientName: patientData.name,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      type: formData.type,
      status: "pending",
      provider: formData.provider,
      reasonForVisit: formData.reasonForVisit
    };
    
    setLocalAppointments([...localAppointments, newAppointment]);
    toast.success(`Appointment scheduled for ${patientData.name}`);
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
          description="Manage your schedule"
          actions={
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          }
        />
        
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
                  <h3 className="text-sm font-medium mb-2">Provider</h3>
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
                  <h3 className="text-sm font-medium mb-2">Appointment Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-medium">{filteredAppointments.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Booked:</span>
                      <span className="font-medium">
                        {filteredAppointments.filter(a => a.status === "booked").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pending:</span>
                      <span className="font-medium">
                        {filteredAppointments.filter(a => a.status === "pending").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available slots:</span>
                      <span className="font-medium">4</span>
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
                    {format(date, "EEEE, MMMM d, yyyy")}
                  </h2>
                </div>
                
                {filteredAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                      <div 
                        key={appointment.id} 
                        className="flex p-4 border rounded-lg hover:shadow-subtle transition-all card-hover"
                      >
                        <div className="flex-shrink-0 w-20 text-center">
                          <div className="text-lg font-medium">{appointment.time}</div>
                          <div className="text-xs text-muted-foreground">{appointment.duration}</div>
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{appointment.patientName}</h3>
                              <div className="text-sm text-muted-foreground">{appointment.type}</div>
                              {appointment.reasonForVisit && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Reason: {appointment.reasonForVisit}
                                </div>
                              )}
                            </div>
                            <StatusBadge status={appointment.status} />
                          </div>
                          
                          <div className="mt-2 text-xs text-muted-foreground">
                            Provider: {appointment.provider}
                          </div>
                        </div>
                        
                        <div className="ml-4 flex items-center">
                          {appointment.status === "pending" && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleStatusChange(appointment.id, "booked")}
                            >
                              <Clock className="h-4 w-4 mr-1" />
                              <span>Confirm</span>
                            </Button>
                          )}
                          {appointment.status === "booked" && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleStatusChange(appointment.id, "completed")}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span>Complete</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium">No appointments scheduled</h3>
                    <p className="mt-1">There are no appointments scheduled for this date.</p>
                    <Button 
                      className="mt-4"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Appointment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <AppointmentFormDialog
        open={isDialogOpen}
        selectedDate={date}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateAppointment}
      />
    </PageContainer>
  );
}
