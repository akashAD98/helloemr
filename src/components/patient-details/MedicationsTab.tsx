
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
import { MedicationsForm } from "./forms/MedicationsForm";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  status: string;
}

interface MedicationsTabProps {
  medications: Medication[];
  onUpdateMedications?: (medications: Medication[]) => void;
}

export function MedicationsTab({ medications, onUpdateMedications }: MedicationsTabProps) {
  const [isEditing, setIsEditing] = useState(false);

  const getStatusBadgeType = (status: string) => {
    switch(status) {
      case "active": return "completed";
      case "on-hold": return "pending";
      case "discontinued": return "cancelled";
      default: return "pending";
    }
  };
  
  const formatStatusDisplay = (status: string) => {
    if (status === "on-hold") return "On Hold";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleSave = (updatedMedications: Medication[]) => {
    if (onUpdateMedications) {
      onUpdateMedications(updatedMedications);
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
          <MedicationsForm 
            medications={medications}
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
          <h3 className="text-lg font-medium">Medications</h3>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        
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
