
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface Vital {
  id: string;
  patientId: string;
  type: string;
  value: string | number;
  unit: string;
  date: string;
  secondary?: string;
}

interface VitalsFormProps {
  vitals: Vital[];
  patientId: string;
  onSave: (vitals: Vital[]) => void;
  onCancel: () => void;
}

export function VitalsForm({ vitals, patientId, onSave, onCancel }: VitalsFormProps) {
  const [editedVitals, setEditedVitals] = useState<Vital[]>(vitals);

  const addVital = () => {
    const newVital: Vital = {
      id: `vital_${Date.now()}`,
      patientId,
      type: "",
      value: "",
      unit: "",
      date: new Date().toISOString().split('T')[0],
      secondary: ""
    };
    setEditedVitals([...editedVitals, newVital]);
  };

  const removeVital = (id: string) => {
    setEditedVitals(editedVitals.filter(v => v.id !== id));
  };

  const updateVital = (id: string, field: keyof Vital, value: string | number) => {
    setEditedVitals(editedVitals.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  const handleSave = () => {
    onSave(editedVitals.filter(v => v.type.trim() !== "" && String(v.value).trim() !== ""));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Edit Patient Vitals</h3>
        <Button onClick={addVital} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Vital
        </Button>
      </div>

      <div className="space-y-4">
        {editedVitals.map((vital) => (
          <div key={vital.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
                <div>
                  <Label htmlFor={`type-${vital.id}`}>Vital Type</Label>
                  <Input
                    id={`type-${vital.id}`}
                    value={vital.type}
                    onChange={(e) => updateVital(vital.id, 'type', e.target.value)}
                    placeholder="e.g., Blood Pressure"
                  />
                </div>
                <div>
                  <Label htmlFor={`value-${vital.id}`}>Value</Label>
                  <Input
                    id={`value-${vital.id}`}
                    value={String(vital.value)}
                    onChange={(e) => updateVital(vital.id, 'value', e.target.value)}
                    placeholder="e.g., 120"
                  />
                </div>
                <div>
                  <Label htmlFor={`unit-${vital.id}`}>Unit</Label>
                  <Input
                    id={`unit-${vital.id}`}
                    value={vital.unit}
                    onChange={(e) => updateVital(vital.id, 'unit', e.target.value)}
                    placeholder="e.g., mmHg"
                  />
                </div>
                <div>
                  <Label htmlFor={`secondary-${vital.id}`}>Secondary Value</Label>
                  <Input
                    id={`secondary-${vital.id}`}
                    value={vital.secondary || ""}
                    onChange={(e) => updateVital(vital.id, 'secondary', e.target.value)}
                    placeholder="e.g., 80 (for BP)"
                  />
                </div>
                <div>
                  <Label htmlFor={`date-${vital.id}`}>Date</Label>
                  <Input
                    id={`date-${vital.id}`}
                    type="date"
                    value={vital.date}
                    onChange={(e) => updateVital(vital.id, 'date', e.target.value)}
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeVital(vital.id)}
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {editedVitals.length === 0 && (
          <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
            No vitals added yet. Click "Add Vital" to get started.
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
