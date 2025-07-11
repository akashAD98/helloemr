
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, Mail, MapPin, Stethoscope, Pill, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PatientCardProps {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  pronouns?: string;
  provider?: string;
  image?: string;
  dateOfBirth?: string;
  lastVisit?: string;
  activeProblems?: number;
  medications?: number;
  allergies?: number;
  nextAppointment?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

export function PatientCard({
  id,
  name,
  age,
  gender,
  pronouns,
  provider,
  image,
  dateOfBirth,
  lastVisit,
  activeProblems = 0,
  medications = 0,
  allergies = 0,
  nextAppointment,
  contactInfo
}: PatientCardProps) {
  const navigate = useNavigate();

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleClick = () => {
    navigate(`/patients/${id}`);
  };

  return (
    <Card 
      className="w-full max-w-md mx-auto cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-white"
      onClick={handleClick}
    >
      <CardContent className="p-4 md:p-6">
        {/* Header with Avatar and Basic Info */}
        <div className="flex flex-col items-center text-center mb-4 md:mb-6">
          <Avatar className="h-16 w-16 md:h-20 md:w-20 mb-3 md:mb-4 ring-2 md:ring-4 ring-blue-50">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback className="text-base md:text-lg font-semibold bg-blue-100 text-blue-700">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 px-2">{name}</h3>
          {pronouns && (
            <p className="text-sm text-gray-500 mb-2">{pronouns}</p>
          )}
          
          <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm w-full max-w-xs">
            {age && (
              <div className="text-center md:text-left">
                <span className="text-gray-500 block md:inline">Age:</span>
                <span className="ml-0 md:ml-2 font-medium block md:inline">{age} years</span>
              </div>
            )}
            <div className="text-center md:text-left">
              <span className="text-gray-500 block md:inline">Gender:</span>
              <span className="ml-0 md:ml-2 font-medium block md:inline">{gender}</span>
            </div>
            {dateOfBirth && (
              <div className="col-span-2 text-center md:text-left">
                <span className="text-gray-500 block md:inline">DOB:</span>
                <span className="ml-0 md:ml-2 font-medium block md:inline">{dateOfBirth}</span>
              </div>
            )}
          </div>
          
          <Badge variant="outline" className="mt-2 md:mt-3 bg-green-50 text-green-700 border-green-200 text-xs">
            Active
          </Badge>
        </div>

        {/* Patient Summary Stats */}
        <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
          <h4 className="text-center font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Patient Summary</h4>
          
          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4">
            <div className="text-center p-2 md:p-3 bg-white rounded-md">
              <Calendar className="h-3 w-3 md:h-4 md:w-4 mx-auto text-gray-500 mb-1" />
              <div className="text-xs text-gray-500">Last Visit</div>
              <div className="font-medium text-xs md:text-sm">
                {lastVisit || "No visits"}
              </div>
            </div>
            
            <div className="text-center p-2 md:p-3 bg-white rounded-md">
              <Stethoscope className="h-3 w-3 md:h-4 md:w-4 mx-auto text-gray-500 mb-1" />
              <div className="text-xs text-gray-500">Problems</div>
              <div className="font-bold text-base md:text-lg text-amber-600">{activeProblems}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <div className="text-center p-2 md:p-3 bg-white rounded-md">
              <Pill className="h-3 w-3 md:h-4 md:w-4 mx-auto text-gray-500 mb-1" />
              <div className="text-xs text-gray-500">Medications</div>
              <div className="font-bold text-base md:text-lg">{medications}</div>
            </div>
            
            <div className="text-center p-2 md:p-3 bg-white rounded-md">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4 mx-auto text-gray-500 mb-1" />
              <div className="text-xs text-gray-500">Allergies</div>
              <div className="font-bold text-base md:text-lg">{allergies}</div>
            </div>
          </div>
        </div>

        {/* Next Appointment */}
        {nextAppointment && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 md:p-3 mb-3 md:mb-4">
            <div className="text-center">
              <div className="text-xs md:text-sm font-semibold text-blue-800">Next Appointment</div>
              <div className="text-xs md:text-sm text-blue-700 px-1">{nextAppointment}</div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="space-y-1.5 md:space-y-2">
          <h4 className="font-semibold text-gray-900 text-xs md:text-sm">Contact Information</h4>
          
          {contactInfo?.email && (
            <div className="flex items-center text-xs md:text-sm">
              <Mail className="h-3 w-3 text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-gray-600 truncate">{contactInfo.email}</span>
            </div>
          )}
          
          {contactInfo?.phone && (
            <div className="flex items-center text-xs md:text-sm">
              <Phone className="h-3 w-3 text-gray-400 mr-2 flex-shrink-0" />
              <span className="text-gray-600">{contactInfo.phone}</span>
            </div>
          )}
          
          {contactInfo?.address && (
            <div className="flex items-start text-xs md:text-sm">
              <MapPin className="h-3 w-3 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 text-xs leading-relaxed">{contactInfo.address}</span>
            </div>
          )}
        </div>

        {/* Provider */}
        {provider && (
          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-xs text-gray-500">Provider</div>
              <div className="font-medium text-xs md:text-sm text-gray-800">{provider}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
