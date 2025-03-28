
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";

interface Patient {
  id: string;
  name: string;
  pronouns: string;
  age: number;
  gender: string;
  dateOfBirth: string;
  active: boolean;
  provider: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  image?: string;
}

interface PatientInfoSidebarProps {
  patient: Patient;
}

export function PatientInfoSidebar({ patient }: PatientInfoSidebarProps) {
  // Get initials from name
  const initials = patient.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
    
  return (
    <Card className="animate-slideUp">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={patient.image} alt={patient.name} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-semibold">{patient.name}</h2>
          <p className="text-sm text-muted-foreground">{patient.pronouns}</p>
          
          <div className="mt-4 w-full">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground text-right">Age:</div>
              <div className="text-left font-medium">{patient.age} years</div>
              
              <div className="text-muted-foreground text-right">Gender:</div>
              <div className="text-left font-medium">{patient.gender}</div>
              
              <div className="text-muted-foreground text-right">DOB:</div>
              <div className="text-left font-medium">{
                new Date(patient.dateOfBirth).toLocaleDateString()
              }</div>
              
              <div className="text-muted-foreground text-right">Status:</div>
              <div className="text-left">
                {patient.active ? (
                  <StatusBadge status="completed" className="!bg-green-50">Active</StatusBadge>
                ) : (
                  <StatusBadge status="overdue" className="!bg-red-50">Inactive</StatusBadge>
                )}
              </div>
            </div>
          </div>
          
          <div className="w-full border-t mt-4 pt-4">
            <h3 className="text-sm font-medium mb-2 text-left">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <span className="text-muted-foreground w-20">Email:</span>
                <span className="flex-1 text-left">{patient.contactInfo.email}</span>
              </div>
              <div className="flex items-start">
                <span className="text-muted-foreground w-20">Phone:</span>
                <span className="flex-1 text-left">{patient.contactInfo.phone}</span>
              </div>
              <div className="flex items-start">
                <span className="text-muted-foreground w-20">Address:</span>
                <span className="flex-1 text-left">{patient.contactInfo.address}</span>
              </div>
            </div>
          </div>
          
          <div className="w-full border-t mt-4 pt-4">
            <h3 className="text-sm font-medium mb-2 text-left">Provider</h3>
            <div className="text-sm text-left">{patient.provider}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
