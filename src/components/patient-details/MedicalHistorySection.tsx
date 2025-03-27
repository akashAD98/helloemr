
import { Card, CardContent } from "@/components/ui/card";
import { Edit, FileText, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MedicalCondition {
  id: string;
  condition: string;
  status: string; // "controlled", "managed", etc.
  details?: string;
  medications?: string[];
}

interface MedicalHistoryProps {
  patientId: string;
  conditions: MedicalCondition[];
  onEdit?: () => void;
}

export function MedicalHistorySection({ 
  patientId, 
  conditions,
  onEdit 
}: MedicalHistoryProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Medical History</h3>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        
        <div className="bg-muted/30 p-4 rounded-md mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Summarized based on past docs</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                <FileText className="h-3 w-3 mr-1" />
                Document
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Mic className="h-3 w-3 mr-1" />
                Audio
              </Badge>
            </div>
          </div>
          
          <ul className="space-y-3 mt-4">
            {conditions.map((condition, index) => (
              <li key={condition.id} className="flex items-start gap-2">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted-foreground/20 text-xs flex items-center justify-center text-muted-foreground">
                  {index + 1}
                </div>
                <div>
                  <span className="font-medium">{condition.condition}</span>
                  {condition.status && (
                    <span className="text-muted-foreground ml-2">({condition.status})</span>
                  )}
                  {condition.details && (
                    <p className="text-sm text-muted-foreground mt-1">{condition.details}</p>
                  )}
                </div>
              </li>
            ))}
            
            {conditions.length === 0 && (
              <li className="text-center py-2 text-muted-foreground">
                No medical history recorded
              </li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
