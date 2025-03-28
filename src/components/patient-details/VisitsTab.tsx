
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Visit } from "@/types/visit";
import { VisitItem } from "./visits/VisitItem";
import { EmptyVisits } from "./visits/EmptyVisits";

// Re-export the Visit type for backwards compatibility
export type { Visit } from "@/types/visit";
export type { VisitMedication, VisitVitals, ExamFindings } from "@/types/visit";

interface VisitsTabProps {
  visits: Visit[];
  onAddVisit?: () => void;
  onEditVisit?: (visitId: string) => void;
}

export function VisitsTab({ visits, onAddVisit, onEditVisit }: VisitsTabProps) {
  const [expandedVisits, setExpandedVisits] = useState<string[]>([]);

  const toggleVisit = (visitId: string) => {
    if (expandedVisits.includes(visitId)) {
      setExpandedVisits(expandedVisits.filter(id => id !== visitId));
    } else {
      setExpandedVisits([...expandedVisits, visitId]);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Patient Visits</h3>
          <Button onClick={onAddVisit} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Visit
          </Button>
        </div>
        
        <div className="space-y-4">
          {visits.map((visit) => (
            <VisitItem
              key={visit.id}
              visit={visit}
              isExpanded={expandedVisits.includes(visit.id)}
              onToggle={() => toggleVisit(visit.id)}
              onEditVisit={onEditVisit}
            />
          ))}
          
          {visits.length === 0 && <EmptyVisits onAddVisit={onAddVisit} />}
        </div>
      </CardContent>
    </Card>
  );
}
