
import { Visit } from "./VisitsTab";
import { Button } from "@/components/ui/button";

interface CurrentVisitAlertProps {
  visit: Visit;
  onEditVisit: (visitId: string) => void;
}

export function CurrentVisitAlert({ visit, onEditVisit }: CurrentVisitAlertProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-blue-800">{visit.reason} - In Session</h3>
          <p className="text-sm text-blue-700">Current provider: {visit.provider}</p>
        </div>
        <Button 
          variant="outline" 
          className="bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
          onClick={() => onEditVisit(visit.id)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
