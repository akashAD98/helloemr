
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Visit } from "./types";

interface VisitSelectorProps {
  visits: Visit[];
  selectedVisit: string;
  onVisitChange: (value: string) => void;
}

export function VisitSelector({ visits, selectedVisit, onVisitChange }: VisitSelectorProps) {
  if (visits.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Associate with Visit (Optional)
      </label>
      <Select 
        value={selectedVisit} 
        onValueChange={onVisitChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a visit" />
        </SelectTrigger>
        <SelectContent>
          {visits.map(visit => (
            <SelectItem key={visit.id} value={visit.id}>
              {visit.date} - {visit.reason}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
