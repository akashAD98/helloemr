
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, AlertTriangle, Pill } from "lucide-react";
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
  const [showCustomInput, setShowCustomInput] = useState(false);

  // More robust category validation with explicit checks and fallbacks
  const validCategories = (() => {
    try {
      if (!Array.isArray(medicationCategories)) {
        console.warn('medicationCategories is not an array, using empty array');
        return [];
      }
      
      const filtered = medicationCategories.filter(category => {
        const isValid = category && 
                       typeof category === 'string' && 
                       category.trim() !== "" && 
                       category.length > 0;
        console.log('Category validation:', category, 'isValid:', isValid);
        return isValid;
      }).map(category => category.trim()); // Ensure no whitespace issues
      
      console.log('Valid categories after filtering:', filtered);
      return filtered;
    } catch (error) {
      console.error('Error processing medication categories:', error);
      return [];
    }
  })();

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
    setShowCustomInput(false);
    
    const medication = medicationDatabase.find(med => med.id === medicationId);
    if (medication) {
      // Auto-fill common values to save doctor's time
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

  const handleCustomMedicationAdd = () => {
    if (customMedication.trim()) {
      onMedicationSelect("");
      setShowCustomInput(false);
      setSearchTerm("");
    }
  };

  const clearMedication = () => {
    onMedicationSelect("");
    onCustomMedicationChange("");
    setShowCustomInput(false);
    setSearchTerm("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Medication</Label>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowCustomInput(!showCustomInput)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Custom
        </Button>
      </div>

      {!selectedMedicationId && !customMedication && (
        <>
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Type medication name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {validCategories.length > 0 ? (
                  validCategories.map(category => {
                    console.log('Rendering category SelectItem:', category);
                    return (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    );
                  })
                ) : (
                  <SelectItem value="no-categories" disabled>
                    No categories available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {searchTerm && (
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border rounded-lg p-2">
              {filteredMedications.slice(0, 8).map((medication) => (
                <div
                  key={medication.id}
                  className="p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 hover:border-primary"
                  onClick={() => handleMedicationSelect(medication.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Pill className="h-4 w-4 text-blue-600" />
                      <div>
                        <h4 className="font-medium">{medication.name}</h4>
                        <p className="text-sm text-muted-foreground">{medication.brandName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs mb-1">
                        {medication.category}
                      </Badge>
                      {medication.controlled && (
                        <div className="flex items-center text-amber-600">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          <span className="text-xs">Controlled</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filteredMedications.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  No medications found. Try a different search term.
                </div>
              )}
            </div>
          )}

          {showCustomInput && (
            <div className="p-3 border rounded-lg bg-muted/20">
              <Label className="text-sm font-medium mb-2 block">Custom Medication Name</Label>
              <div className="flex space-x-2">
                <Input
                  value={customMedication}
                  onChange={(e) => onCustomMedicationChange(e.target.value)}
                  placeholder="Enter medication name..."
                  className="flex-1"
                />
                <Button onClick={handleCustomMedicationAdd} disabled={!customMedication.trim()}>
                  Add
                </Button>
                <Button variant="outline" onClick={() => setShowCustomInput(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {(selectedMedication || customMedication) && (
        <div className="p-4 border rounded-lg bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Pill className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-900">
                  {customMedication || selectedMedication?.name}
                </h4>
                {selectedMedication && (
                  <div className="space-y-1 mt-1">
                    <p className="text-sm text-green-700">{selectedMedication.brandName}</p>
                    <div className="flex items-center space-x-4 text-xs text-green-600">
                      <span>Strengths: {selectedMedication.strength.join(", ")}</span>
                      <Badge variant="outline" className="text-xs">
                        {selectedMedication.category}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={clearMedication}>
              Change
            </Button>
          </div>
          
          {selectedMedication?.warnings && (
            <div className="mt-3 p-2 bg-amber-50 rounded border-l-4 border-amber-400">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                <span className="text-sm font-medium text-amber-800">Important:</span>
              </div>
              <ul className="text-xs text-amber-700 mt-1 ml-6 space-y-1">
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
