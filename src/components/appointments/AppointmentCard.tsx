
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Clock, 
  CheckCircle, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Activity,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Appointment, patients } from "@/data/mockData";

interface AppointmentCardProps {
  appointment: Appointment;
  onStatusChange: (appointmentId: string, newStatus: 'booked' | 'pending' | 'cancelled' | 'completed') => void;
  isOngoing?: boolean;
}

export function AppointmentCard({ appointment, onStatusChange, isOngoing }: AppointmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const patient = patients.find(p => p.id === appointment.patientId);
  const initials = appointment.patientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const getStatusColor = (status: string) => {
    const statusColors = {
      'completed': 'text-green-600 bg-green-50 border-green-200',
      'booked': 'text-blue-600 bg-blue-50 border-blue-200',
      'pending': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'cancelled': 'text-red-600 bg-red-50 border-red-200'
    };
    return statusColors[status as keyof typeof statusColors] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const PatientDetails = () => patient && isExpanded ? (
    <div className="mt-3 pt-3 border-t border-gray-200/60">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{patient.age} years • {patient.gender}</span>
          {patient.pronouns && <span>({patient.pronouns})</span>}
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{patient.contactInfo.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{patient.contactInfo.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs">{patient.contactInfo.address}</span>
        </div>
        {patient.medicalHistory && patient.medicalHistory.length > 0 && (
          <div className="col-span-full flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <span className="font-medium">Medical History: </span>
              <span className="text-muted-foreground">
                {patient.medicalHistory.join(", ")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;

  const ActionButtons = () => (
    <div className="flex flex-col gap-2 ml-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs"
      >
        {isExpanded ? "Less Info" : "More Info"}
      </Button>
      
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
    </div>
  );

  return (
    <div 
      className={cn(
        "border rounded-lg p-4 transition-all duration-200 hover:shadow-md",
        isOngoing && "ring-2 ring-red-200 bg-red-50/30",
        getStatusColor(appointment.status)
      )}
    >
      <div className="flex items-start gap-4">
        {/* Time and Duration */}
        <div className="flex-shrink-0 text-center min-w-[80px]">
          <div className="text-lg font-semibold">{appointment.time}</div>
          <div className="text-xs text-muted-foreground">{appointment.duration}</div>
          {isOngoing && (
            <Badge variant="destructive" className="mt-1 text-xs">
              <Activity className="w-3 h-3 mr-1" />
              ONGOING
            </Badge>
          )}
        </div>

        {/* Patient Info */}
        <div className="flex items-start gap-3 flex-1">
          <Avatar className="h-12 w-12">
            <AvatarImage src={patient?.image} alt={appointment.patientName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{appointment.patientName}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{appointment.type}</span>
                  <span>•</span>
                  <span>Provider: {appointment.provider}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={appointment.status} />
                <Link
                  to={`/patients/${appointment.patientId}`}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Reason for Visit */}
            {appointment.reasonForVisit && (
              <div className="text-sm">
                <span className="font-medium">Reason: </span>
                <span className="text-muted-foreground">{appointment.reasonForVisit}</span>
              </div>
            )}

            <PatientDetails />
          </div>
        </div>

        <ActionButtons />
      </div>
    </div>
  );
}
