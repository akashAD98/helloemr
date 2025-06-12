
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";

interface Allergy {
  id: string;
  allergen: string;
  reaction: string;
  severity: string;
  dateIdentified: string;
}

interface AllergiesFormProps {
  allergies: Allergy[];
  onSave: (allergies: Allergy[]) => void;
  onCancel: () => void;
}

export function AllergiesForm({ allergies, onSave, onCancel }: AllergiesFormProps) {
  const [editedAllergies, setEditedAllergies] = useState<Allergy[]>(allergies);

  const addAllergy = () => {
    const newAllergy: Allergy = {
      id: `allergy_${Date.now()}`,
      allergen: "",
      reaction: "",
      severity: "mild",
      dateIdentified: new Date().toISOString().split('T')[0]
    };
    setEditedAllergies([...editedAllergies, newAllergy]);
  };

  const removeAllergy = (id: string) => {
    setEditedAllergies(editedAllergies.filter(a => a.id !== id));
  };

  const updateAllergy = (id: string, field: keyof Allergy, value: string) => {
    setEditedAllergies(editedAllergies.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  const handleSave = () => {
    onSave(editedAllergies.filter(a => a.allergen.trim() !== ""));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Edit Allergies</h3>
        <Button onClick={addAllergy} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Allergy
        </Button>
      </div>

      <div className="space-y-4">
        {editedAllergies.map((allergy) => (
          <div key={allergy.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                <div>
                  <Label htmlFor={`allergen-${allergy.id}`}>Allergen</Label>
                  <Input
                    id={`allergen-${allergy.id}`}
                    value={allergy.allergen}
                    onChange={(e) => updateAllergy(allergy.id, 'allergen', e.target.value)}
                    placeholder="Enter allergen"
                  />
                </div>
                <div>
                  <Label htmlFor={`reaction-${allergy.id}`}>Reaction</Label>
                  <Input
                    id={`reaction-${allergy.id}`}
                    value={allergy.reaction}
                    onChange={(e) => updateAllergy(allergy.id, 'reaction', e.target.value)}
                    placeholder="Enter reaction"
                  />
                </div>
                <div>
                  <Label htmlFor={`severity-${allergy.id}`}>Severity</Label>
                  <Select
                    value={allergy.severity}
                    onValueChange={(value) => updateAllergy(allergy.id, 'severity', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">Mild</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`date-${allergy.id}`}>Date Identified</Label>
                  <Input
                    id={`date-${allergy.id}`}
                    type="date"
                    value={allergy.dateIdentified}
                    onChange={(e) => updateAllergy(allergy.id, 'dateIdentified', e.target.value)}
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeAllergy(allergy.id)}
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {editedAllergies.length === 0 && (
          <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
            No allergies added yet. Click "Add Allergy" to get started.
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
