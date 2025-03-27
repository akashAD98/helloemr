
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

interface Problem {
  id: string;
  name: string;
  dateIdentified: string;
  status: string; // Changed from '"active" | "resolved" | "chronic"' to string
  notes: string;
}

interface ProblemsTabProps {
  problems: Problem[];
}

export function ProblemsTab({ problems }: ProblemsTabProps) {
  // Helper function to determine status badge type
  const getStatusBadgeType = (status: string) => {
    switch(status) {
      case "active": return "high-risk";
      case "chronic": return "medium-risk";
      case "resolved": return "completed";
      default: return "pending";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Problems & Conditions</h3>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Problem</TableHead>
                <TableHead>Date Identified</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {problems.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell className="font-medium">{problem.name}</TableCell>
                  <TableCell>{problem.dateIdentified}</TableCell>
                  <TableCell>
                    <StatusBadge 
                      status={getStatusBadgeType(problem.status)}
                    >
                      {problem.status.charAt(0).toUpperCase() + problem.status.slice(1)}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
              
              {problems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No problems or conditions found
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
