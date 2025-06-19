
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Patient } from "@/types/patient";
import { Mail, Phone, MapPin, Calendar, User, Hash } from "lucide-react";

interface PatientInfoSidebarProps {
  patient: Patient;
}

export function PatientInfoSidebar({ patient }: PatientInfoSidebarProps) {
  const patientName = patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Unknown Patient';
  
  const initials = patientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
    
  return (
    <Card className="animate-slideUp">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 md:h-24 md:w-24 mb-4 ring-4 ring-blue-50">
            <AvatarImage src={patient.image} alt={patientName} />
            <AvatarFallback className="text-lg md:text-xl font-semibold bg-blue-100 text-blue-700">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">{patientName}</h2>
          {patient.pronouns && (
            <p className="text-sm text-gray-500 mb-3">{patient.pronouns}</p>
          )}
          
          {patient.active !== undefined && (
            <div className="mb-4">
              {patient.active ? (
                <StatusBadge status="completed" className="!bg-green-50 !text-green-700">
                  Active Patient
                </StatusBadge>
              ) : (
                <StatusBadge status="overdue" className="!bg-red-50 !text-red-700">
                  Inactive
                </StatusBadge>
              )}
            </div>
          )}
          
          {/* Patient Details Grid */}
          <div className="w-full bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 gap-3 text-sm">
              {patient.age && (
                <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center text-gray-600">
                    <Hash className="h-4 w-4 mr-2" />
                    <span>Age</span>
                  </div>
                  <span className="font-medium text-gray-900">{patient.age} years</span>
                </div>
              )}
              
              <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <span>Gender</span>
                </div>
                <span className="font-medium text-gray-900">{patient.gender}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>DOB</span>
                </div>
                <span className="font-medium text-gray-900">
                  {new Date(patient.dateOfBirth).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="w-full">
            <h3 className="text-sm font-semibold mb-3 text-left text-gray-900">Contact Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <Mail className="h-4 w-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-left min-w-0">
                  <div className="text-xs text-gray-500 mb-1">Email</div>
                  <div className="font-medium text-gray-900 break-all">
                    {patient.contactInfo?.email || patient.email || "Not provided"}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-4 w-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <div className="text-xs text-gray-500 mb-1">Phone</div>
                  <div className="font-medium text-gray-900">
                    {patient.contactInfo?.phone || patient.phone || "Not provided"}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-left min-w-0">
                  <div className="text-xs text-gray-500 mb-1">Address</div>
                  <div className="font-medium text-gray-900 text-xs leading-relaxed">
                    {patient.contactInfo?.address || patient.address || "Not provided"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Provider */}
          {patient.provider && (
            <div className="w-full mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold mb-2 text-left text-gray-900">Primary Provider</h3>
              <div className="text-center bg-blue-50 rounded-lg p-3">
                <div className="font-medium text-blue-900">{patient.provider}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
