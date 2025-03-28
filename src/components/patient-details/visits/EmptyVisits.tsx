
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyVisitsProps {
  onAddVisit?: () => void;
}

export function EmptyVisits({ onAddVisit }: EmptyVisitsProps) {
  return (
    <div className="text-center py-8 border rounded-md">
      <p className="text-muted-foreground">No visits recorded</p>
      <Button onClick={onAddVisit} size="sm" className="mt-2">
        <Plus className="h-4 w-4 mr-2" />
        Add First Visit
      </Button>
    </div>
  );
}
