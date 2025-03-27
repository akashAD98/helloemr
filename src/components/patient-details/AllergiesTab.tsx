
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { StatusBadge } from "@/components/common/StatusBadge";

interface Allergy {
  id: string;
  allergen: string;
  reaction: string;
  severity: string; // Changed from '"mild" | "moderate" | "severe"' to string
  dateIdentified: string;
}

interface AllergiesTabProps {
  allergies: Allergy[];
}

export function AllergiesTab({ allergies }: AllergiesTabProps) {
  // Helper function to determine status badge type based on severity
  const getSeverityBadgeType = (severity: string) => {
    switch(severity) {
      case "severe": return "high-risk";
      case "moderate": return "medium-risk";
      case "mild": return "low-risk";
      default: return "pending";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Allergies</h3>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Allergen</TableHead>
                <TableHead>Reaction</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Date Identified</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allergies.map((allergy) => (
                <TableRow key={allergy.id}>
                  <TableCell className="font-medium">{allergy.allergen}</TableCell>
                  <TableCell>{allergy.reaction}</TableCell>
                  <TableCell>
                    <StatusBadge 
                      status={getSeverityBadgeType(allergy.severity)}
                    >
                      {allergy.severity.charAt(0).toUpperCase() + allergy.severity.slice(1)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{allergy.dateIdentified}</TableCell>
                </TableRow>
              ))}
              
              {allergies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No allergies found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
