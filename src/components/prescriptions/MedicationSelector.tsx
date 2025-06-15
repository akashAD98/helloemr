
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, AlertTriangle } from "lucide-react";
import { medicationDatabase, medicationCategories, Medication } from "@/data/medicationDatabase";

interface MedicationSelectorProps {
  selectedMedicationId: string;
  customMedication: string;
  onMedicationSelect: (medicationId: string) => void;
  onCustomMedicationChange: (customMedication: string) => void;
  onDosageChange: (dosage: string) => void;
  onFrequencyChange: (frequency: string) => void;
  onRouteChange: (route: string) => void;
}

export function MedicationSelector({
  selectedMedicationId,
  customMedication,
  onMedicationSelect,
  onCustomMedicationChange,
  onDosageChange,
  onFrequencyChange,
  onRouteChange
}: MedicationSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  const filteredMedications = medicationDatabase.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.genericName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.brandName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedMedication = medicationDatabase.find(med => med.id === selectedMedicationId);

  const handleMedicationSelect = (medicationId: string) => {
    onMedicationSelect(medicationId);
    onCustomMedicationChange("");
    
    const medication = medicationDatabase.find(med => med.id === medicationId);
    if (medication) {
      if (medication.commonDosages.length > 0) {
        onDosageChange(medication.commonDosages[0]);
      }
      if (medication.commonFrequencies.length > 0) {
        onFrequencyChange(medication.commonFrequencies[0]);
      }
      if (medication.routes.length > 0) {
        onRouteChange(medication.routes[0]);
      }
    }
  };

  const handleCustomMedicationSubmit = () => {
    if (customMedication.trim()) {
      onMedicationSelect("");
      setIsAddingCustom(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Medication Selection</Label>
        <Dialog open={isAddingCustom} onOpenChange={setIsAddingCustom}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Custom
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom Medication</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="custom-med">Medication Name</Label>
                <Input
                  id="custom-med"
                  value={customMedication}
                  onChange={(e) => onCustomMedicationChange(e.target.value)}
                  placeholder="Enter medication name..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingCustom(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCustomMedicationSubmit}>
                  Add Medication
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!customMedication && (
        <>
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search medications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {medicationCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
            {filteredMedications.map((medication) => (
              <div
                key={medication.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedMedicationId === medication.id ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => handleMedicationSelect(medication.id)}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-sm">{medication.name}</h4>
                    {medication.controlled && (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{medication.brandName}</p>
                  <Badge variant="secondary" className="text-xs">
                    {medication.category}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    Strengths: {medication.strength.join(", ")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {customMedication && (
        <div className="p-3 border rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Custom Medication</h4>
              <p className="text-sm text-muted-foreground">{customMedication}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onCustomMedicationChange("")}
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      {selectedMedication && (
        <div className="p-3 border rounded-lg bg-blue-50">
          <h4 className="font-medium mb-2">Selected: {selectedMedication.name}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Available Strengths:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedMedication.strength.map(str => (
                  <Badge key={str} variant="outline" className="text-xs">
                    {str}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="font-medium">Common Frequencies:</span>
              <div className="text-xs text-muted-foreground mt-1">
                {selectedMedication.commonFrequencies.join(", ")}
              </div>
            </div>
          </div>
          {selectedMedication.warnings && (
            <div className="mt-2 p-2 bg-amber-50 rounded border-l-4 border-amber-400">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                <span className="text-sm font-medium text-amber-800">Warnings:</span>
              </div>
              <ul className="text-xs text-amber-700 mt-1 ml-6">
                {selectedMedication.warnings.map((warning, idx) => (
                  <li key={idx}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
