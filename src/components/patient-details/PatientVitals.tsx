
import { useState } from "react";
import { VitalCard } from "@/components/common/VitalCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { VitalsForm } from "./forms/VitalsForm";

interface Vital {
  id: string;
  patientId: string;
  type: string;
  value: string;
  unit: string;
  date: string;
  secondary?: string;
}

interface PatientVitalsProps {
  vitals: Vital[];
  patientId?: string;
  onUpdateVitals?: (vitals: Vital[]) => void;
}

export function PatientVitals({ vitals, patientId, onUpdateVitals }: PatientVitalsProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (updatedVitals: Vital[]) => {
    if (onUpdateVitals) {
      onUpdateVitals(updatedVitals);
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
          <VitalsForm 
            vitals={vitals}
            patientId={patientId || ""}
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
          <h3 className="text-lg font-medium">Patient Vitals</h3>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Vitals
          </Button>
        </div>
        
        {vitals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vitals.slice(0, 6).map(vital => (
              <VitalCard
                key={vital.id}
                title={vital.type}
                value={vital.value}
                unit={vital.unit}
                date={vital.date}
                secondary={vital.secondary}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
            No vitals recorded yet. Click "Edit Vitals" to add some.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
