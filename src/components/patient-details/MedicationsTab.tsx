
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

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  status: string; // Changed from '"active" | "discontinued" | "on-hold"' to string
}

interface MedicationsTabProps {
  medications: Medication[];
}

export function MedicationsTab({ medications }: MedicationsTabProps) {
  // Helper function to determine status badge type
  const getStatusBadgeType = (status: string) => {
    switch(status) {
      case "active": return "completed";
      case "on-hold": return "pending";
      case "discontinued": return "cancelled";
      default: return "pending";
    }
  };
  
  // Helper function to format the status display
  const formatStatusDisplay = (status: string) => {
    if (status === "on-hold") return "On Hold";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Medications</h3>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medications.map((medication) => (
                <TableRow key={medication.id}>
                  <TableCell className="font-medium">{medication.name}</TableCell>
                  <TableCell>{medication.dosage}</TableCell>
                  <TableCell>{medication.frequency}</TableCell>
                  <TableCell>{medication.startDate}</TableCell>
                  <TableCell>
                    <StatusBadge 
                      status={getStatusBadgeType(medication.status)}
                    >
                      {formatStatusDisplay(medication.status)}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
              
              {medications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No medications found
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
