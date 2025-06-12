
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Edit } from "lucide-react";
import { ProblemsForm } from "./forms/ProblemsForm";

interface Problem {
  id: string;
  name: string;
  dateIdentified: string;
  status: string;
  notes: string;
}

interface ProblemsTabProps {
  problems: Problem[];
  onUpdateProblems?: (problems: Problem[]) => void;
}

export function ProblemsTab({ problems, onUpdateProblems }: ProblemsTabProps) {
  const [isEditing, setIsEditing] = useState(false);

  const getStatusBadgeType = (status: string) => {
    switch(status) {
      case "active": return "high-risk";
      case "chronic": return "medium-risk";
      case "resolved": return "completed";
      default: return "pending";
    }
  };

  const handleSave = (updatedProblems: Problem[]) => {
    if (onUpdateProblems) {
      onUpdateProblems(updatedProblems);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card>
        <CardContent className="p-6">
          <ProblemsForm 
            problems={problems}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Problems & Conditions</h3>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        
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
