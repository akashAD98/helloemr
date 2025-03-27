
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Stethoscope, Pill, AlertCircle, Clipboard } from "lucide-react";

interface PatientSummaryProps {
  patientId: string;
  lastVisitDate?: string;
  activeProblems?: number;
  activeMedications?: number;
  allergiesCount?: number;
  recentSummary?: string;
  nextAppointment?: string;
}

export function PatientSummary({
  patientId,
  lastVisitDate,
  activeProblems = 0,
  activeMedications = 0,
  allergiesCount = 0,
  recentSummary,
  nextAppointment
}: PatientSummaryProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Patient Summary</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="border rounded-md p-3">
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <CalendarDays className="h-4 w-4 mr-1" />
                <span>Last Visit</span>
              </div>
              <div className="font-medium">
                {lastVisitDate || "No visits recorded"}
              </div>
            </div>
            
            <div className="border rounded-md p-3">
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Stethoscope className="h-4 w-4 mr-1" />
                <span>Active Problems</span>
              </div>
              <div className="font-medium">
                {activeProblems}
                {activeProblems > 0 && (
                  <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 hover:bg-amber-50">
                    Active
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="border rounded-md p-3">
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Pill className="h-4 w-4 mr-1" />
                <span>Medications</span>
              </div>
              <div className="font-medium">
                {activeMedications}
              </div>
            </div>
            
            <div className="border rounded-md p-3">
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>Allergies</span>
              </div>
              <div className="font-medium">
                {allergiesCount}
              </div>
            </div>
          </div>
          
          {recentSummary && (
            <div className="border rounded-md p-3">
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Clipboard className="h-4 w-4 mr-1" />
                <span>Most Recent Visit Summary</span>
              </div>
              <div className="text-sm mt-2">
                {recentSummary}
              </div>
            </div>
          )}
          
          {nextAppointment && (
            <div className="bg-blue-50 text-blue-800 rounded-md p-3 text-sm">
              <div className="font-medium">Next Appointment</div>
              <div>{nextAppointment}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
