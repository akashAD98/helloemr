
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
import { AllergiesForm } from "./forms/AllergiesForm";

interface Allergy {
  id: string;
  allergen: string;
  reaction: string;
  severity: string;
  dateIdentified: string;
}

interface AllergiesTabProps {
  allergies: Allergy[];
  onUpdateAllergies?: (allergies: Allergy[]) => void;
}

export function AllergiesTab({ allergies, onUpdateAllergies }: AllergiesTabProps) {
  const [isEditing, setIsEditing] = useState(false);

  const getSeverityBadgeType = (severity: string) => {
    switch(severity) {
      case "severe": return "high-risk";
      case "moderate": return "medium-risk";
      case "mild": return "low-risk";
      default: return "pending";
    }
  };

  const handleSave = (updatedAllergies: Allergy[]) => {
    if (onUpdateAllergies) {
      onUpdateAllergies(updatedAllergies);
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
          <AllergiesForm 
            allergies={allergies}
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
          <h3 className="text-lg font-medium">Allergies</h3>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        
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
