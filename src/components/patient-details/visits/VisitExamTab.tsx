
import { Badge } from "@/components/ui/badge";
import { Visit } from "@/types/visit";

interface VisitExamTabProps {
  visit: Visit;
}

export function VisitExamTab({ visit }: VisitExamTabProps) {
  return (
    <div className="space-y-4 mt-0">
      {visit.examFindings?.subjective && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Subjective</h4>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Patient reported
            </Badge>
          </div>
          <div className="text-sm bg-muted/30 p-3 rounded-md">
            {visit.examFindings.subjective}
          </div>
        </div>
      )}
      
      {visit.examFindings?.objective && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Objective</h4>
            <Badge variant="outline" className="bg-amber-50 text-amber-700">
              Provider observed
            </Badge>
          </div>
          <div className="text-sm bg-muted/30 p-3 rounded-md">
            {visit.examFindings.objective}
          </div>
        </div>
      )}
      
      {visit.examFindings?.assessment && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Assessment</h4>
          </div>
          <div className="text-sm bg-muted/30 p-3 rounded-md">
            {visit.examFindings.assessment}
          </div>
        </div>
      )}
      
      {!visit.examFindings?.subjective && 
       !visit.examFindings?.objective && 
       !visit.examFindings?.assessment && (
        <div className="text-center py-4 text-muted-foreground">
          No examination details recorded
        </div>
      )}
    </div>
  );
}
