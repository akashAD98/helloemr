
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  CheckCircle, 
  User, 
  Phone, 
  Calendar,
  Activity,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Appointment, patients } from "@/data/mockData";

interface DetailedAppointmentListProps {
  appointments: Appointment[];
  onStatusChange: (appointmentId: string, newStatus: 'booked' | 'pending' | 'cancelled' | 'completed') => void;
  isCurrentTimeSlot: (time: string) => boolean;
}

export function DetailedAppointmentList({ 
  appointments, 
  onStatusChange, 
  isCurrentTimeSlot 
}: DetailedAppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-medium">No appointments scheduled</h3>
        <p className="mt-1">There are no appointments scheduled for this date.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => {
        const patient = patients.find(p => p.id === appointment.patientId);
        const initials = appointment.patientName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();
        
        const isOngoing = isCurrentTimeSlot(appointment.time);

        return (
          <Card 
            key={appointment.id}
            className={cn(
              "overflow-hidden transition-all duration-200 hover:shadow-md",
              isOngoing && "ring-2 ring-red-200 bg-red-50/30"
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Time and Status */}
                <div className="flex-shrink-0 text-center min-w-[100px]">
                  <div className="text-xl font-bold text-blue-600">{appointment.time}</div>
                  <div className="text-sm text-muted-foreground">{appointment.duration}</div>
                  {isOngoing && (
                    <Badge variant="destructive" className="mt-2 text-xs">
                      <Activity className="w-3 h-3 mr-1" />
                      ONGOING
                    </Badge>
                  )}
                </div>

                {/* Patient Info */}
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={patient?.image} alt={appointment.patientName} />
                    <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    {/* Patient Name and Basic Info */}
                    <div className="flex items-start justify-between">
                      <div>
                        <Link 
                          to={`/patients/${appointment.patientId}`}
                          className="text-xl font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2"
                        >
                          {appointment.patientName}
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {patient?.age} years • {patient?.gender}
                            {patient?.pronouns && ` (${patient.pronouns})`}
                          </span>
                          {patient?.contactInfo?.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {patient.contactInfo.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <StatusBadge status={appointment.status} />
                    </div>

                    {/* Appointment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Type: </span>
                        <span className="text-muted-foreground">{appointment.type}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Provider: </span>
                        <span className="text-muted-foreground">{appointment.provider}</span>
                      </div>
                      {appointment.reasonForVisit && (
                        <div className="md:col-span-2">
                          <span className="font-medium text-gray-700">Reason: </span>
                          <span className="text-muted-foreground">{appointment.reasonForVisit}</span>
                        </div>
                      )}
                    </div>

                    {/* Patient Medical History (if available) */}
                    {patient?.medicalHistory && patient.medicalHistory.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Medical History: </span>
                        <span className="text-muted-foreground">
                          {patient.medicalHistory.slice(0, 2).join(", ")}
                          {patient.medicalHistory.length > 2 && "..."}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 ml-4">
                  {appointment.status === "pending" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onStatusChange(appointment.id, "booked")}
                      className="text-xs"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Confirm
                    </Button>
                  )}
                  
                  {appointment.status === "booked" && !isOngoing && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onStatusChange(appointment.id, "completed")}
                      className="text-xs"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </Button>
                  )}

                  {isOngoing && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => onStatusChange(appointment.id, "completed")}
                      className="text-xs bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Finish
                    </Button>
                  )}

                  <Link
                    to={`/patients/${appointment.patientId}`}
                    className="text-xs"
                  >
                    <Button variant="ghost" size="sm" className="text-xs w-full">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
