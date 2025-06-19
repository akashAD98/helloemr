
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
      <CardContent className="p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4 text-center md:text-left">Patient Summary</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="border rounded-lg p-3 bg-gray-50">
              <div className="flex items-center justify-center md:justify-start text-sm text-muted-foreground mb-2">
                <CalendarDays className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Last Visit</span>
                <span className="sm:hidden">Visit</span>
              </div>
              <div className="font-medium text-center md:text-left text-sm">
                {lastVisitDate || "No visits"}
              </div>
            </div>
            
            <div className="border rounded-lg p-3 bg-amber-50">
              <div className="flex items-center justify-center md:justify-start text-sm text-muted-foreground mb-2">
                <Stethoscope className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Problems</span>
                <span className="sm:hidden">Issues</span>
              </div>
              <div className="font-bold text-lg text-amber-600 text-center md:text-left">
                {activeProblems}
                {activeProblems > 0 && (
                  <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs">
                    Active
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="border rounded-lg p-3 bg-blue-50">
              <div className="flex items-center justify-center md:justify-start text-sm text-muted-foreground mb-2">
                <Pill className="h-4 w-4 mr-1" />
                <span>Medications</span>
              </div>
              <div className="font-bold text-lg text-blue-600 text-center md:text-left">
                {activeMedications}
              </div>
            </div>
            
            <div className="border rounded-lg p-3 bg-red-50">
              <div className="flex items-center justify-center md:justify-start text-sm text-muted-foreground mb-2">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>Allergies</span>
              </div>
              <div className="font-bold text-lg text-red-600 text-center md:text-left">
                {allergiesCount}
              </div>
            </div>
          </div>
          
          {recentSummary && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Clipboard className="h-4 w-4 mr-2" />
                <span>Most Recent Visit Summary</span>
              </div>
              <div className="text-sm mt-2 leading-relaxed">
                {recentSummary}
              </div>
            </div>
          )}
          
          {nextAppointment && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <div className="font-semibold text-blue-800 mb-1">Next Appointment</div>
              <div className="text-blue-700">{nextAppointment}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
