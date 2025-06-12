
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  status: string;
}

interface MedicationsFormProps {
  medications: Medication[];
  onSave: (medications: Medication[]) => void;
  onCancel: () => void;
}

export function MedicationsForm({ medications, onSave, onCancel }: MedicationsFormProps) {
  const [editedMedications, setEditedMedications] = useState<Medication[]>(medications);

  const addMedication = () => {
    const newMedication: Medication = {
      id: `med_${Date.now()}`,
      name: "",
      dosage: "",
      frequency: "",
      startDate: new Date().toISOString().split('T')[0],
      status: "active"
    };
    setEditedMedications([...editedMedications, newMedication]);
  };

  const removeMedication = (id: string) => {
    setEditedMedications(editedMedications.filter(m => m.id !== id));
  };

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setEditedMedications(editedMedications.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const handleSave = () => {
    onSave(editedMedications.filter(m => m.name.trim() !== ""));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Edit Medications</h3>
        <Button onClick={addMedication} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Medication
        </Button>
      </div>

      <div className="space-y-4">
        {editedMedications.map((medication) => (
          <div key={medication.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
                <div>
                  <Label htmlFor={`med-name-${medication.id}`}>Medication Name</Label>
                  <Input
                    id={`med-name-${medication.id}`}
                    value={medication.name}
                    onChange={(e) => updateMedication(medication.id, 'name', e.target.value)}
                    placeholder="Enter medication name"
                  />
                </div>
                <div>
                  <Label htmlFor={`dosage-${medication.id}`}>Dosage</Label>
                  <Input
                    id={`dosage-${medication.id}`}
                    value={medication.dosage}
                    onChange={(e) => updateMedication(medication.id, 'dosage', e.target.value)}
                    placeholder="e.g., 10mg"
                  />
                </div>
                <div>
                  <Label htmlFor={`frequency-${medication.id}`}>Frequency</Label>
                  <Input
                    id={`frequency-${medication.id}`}
                    value={medication.frequency}
                    onChange={(e) => updateMedication(medication.id, 'frequency', e.target.value)}
                    placeholder="e.g., Once daily"
                  />
                </div>
                <div>
                  <Label htmlFor={`start-date-${medication.id}`}>Start Date</Label>
                  <Input
                    id={`start-date-${medication.id}`}
                    type="date"
                    value={medication.startDate}
                    onChange={(e) => updateMedication(medication.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`status-${medication.id}`}>Status</Label>
                  <Select
                    value={medication.status}
                    onValueChange={(value) => updateMedication(medication.id, 'status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                      <SelectItem value="discontinued">Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeMedication(medication.id)}
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {editedMedications.length === 0 && (
          <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
            No medications added yet. Click "Add Medication" to get started.
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
