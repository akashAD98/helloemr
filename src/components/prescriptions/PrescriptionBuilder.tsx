
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PatientSelector } from "./PatientSelector";
import { MedicationSelector } from "./MedicationSelector";
import { PrescriptionPDF } from "./PrescriptionPDF";
import { FileText, Download } from "lucide-react";
import { dataStore } from "@/lib/dataStore";
import { medicationDatabase } from "@/data/medicationDatabase";
import { Prescription, PrescriptionFormData } from "@/types/prescription";

export function PrescriptionBuilder() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PrescriptionFormData>({
    patientId: "",
    medicationId: "",
    customMedication: "",
    dosage: "",
    frequency: "",
    route: "",
    quantity: "",
    refills: 0,
    instructions: "",
    notes: ""
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [generatedPrescription, setGeneratedPrescription] = useState<Prescription | null>(null);
  
  const frequencyOptions = [
    "Once daily",
    "Twice daily", 
    "Three times daily",
    "Four times daily",
    "Every morning",
    "Every evening",
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "As needed",
    "Before meals",
    "After meals",
    "At bedtime"
  ];
  
  const routeOptions = [
    "Oral",
    "Topical",
    "Subcutaneous", 
    "Intramuscular",
    "Intravenous",
    "Inhaled",
    "Rectal",
    "Sublingual",
    "Ophthalmic",
    "Otic",
    "Nasal",
    "Transdermal"
  ];

  const selectedPatient = dataStore.getPatientById(formData.patientId);
  const selectedMedication = medicationDatabase.find(med => med.id === formData.medicationId);

  const handleGeneratePrescription = () => {
    if (!formData.patientId) {
      toast({
        title: "Patient Required",
        description: "Please select a patient first.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.medicationId && !formData.customMedication) {
      toast({
        title: "Medication Required", 
        description: "Please select or add a medication.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.dosage || !formData.frequency || !formData.quantity) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const medicationName = formData.customMedication || selectedMedication?.name || "";
    const patientName = selectedPatient?.name || `${selectedPatient?.firstName} ${selectedPatient?.lastName}` || "";

    const prescription: Prescription = {
      id: `rx-${Date.now()}`,
      patientId: formData.patientId,
      patientName,
      medicationId: formData.medicationId,
      medicationName,
      dosage: formData.dosage,
      frequency: formData.frequency,
      route: formData.route,
      quantity: formData.quantity,
      refills: formData.refills,
      instructions: formData.instructions,
      prescribedBy: "Dr. Sarah Johnson", // In real app, this would be the logged-in provider
      prescribedDate: new Date().toLocaleDateString(),
      status: "pending",
      notes: formData.notes
    };

    setGeneratedPrescription(prescription);
    setShowPreview(true);

    toast({
      title: "Prescription Generated",
      description: `Prescription for ${medicationName} has been created for ${patientName}.`,
    });
  };

  const handleUpdateField = (field: keyof PrescriptionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      patientId: "",
      medicationId: "",
      customMedication: "",
      dosage: "",
      frequency: "",
      route: "",
      quantity: "",
      refills: 0,
      instructions: "",
      notes: ""
    });
    setShowPreview(false);
    setGeneratedPrescription(null);
  };

  return (
    <div className="space-y-6">
      {!showPreview ? (
        <>
          <PatientSelector
            selectedPatientId={formData.patientId}
            onPatientSelect={(patientId) => handleUpdateField("patientId", patientId)}
          />

          <Separator />

          <MedicationSelector
            selectedMedicationId={formData.medicationId}
            customMedication={formData.customMedication}
            onMedicationSelect={(medicationId) => handleUpdateField("medicationId", medicationId)}
            onCustomMedicationChange={(customMedication) => handleUpdateField("customMedication", customMedication)}
            onDosageChange={(dosage) => handleUpdateField("dosage", dosage)}
            onFrequencyChange={(frequency) => handleUpdateField("frequency", frequency)}
            onRouteChange={(route) => handleUpdateField("route", route)}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage *</Label>
              <Input 
                id="dosage" 
                value={formData.dosage} 
                onChange={(e) => handleUpdateField("dosage", e.target.value)}
                placeholder="e.g., 500mg, 1 tablet"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency *</Label>
              <Select value={formData.frequency} onValueChange={(frequency) => handleUpdateField("frequency", frequency)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map((freq) => (
                    <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="route">Route</Label>
              <Select value={formData.route} onValueChange={(route) => handleUpdateField("route", route)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  {routeOptions.map((rt) => (
                    <SelectItem key={rt} value={rt}>{rt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input 
                id="quantity" 
                value={formData.quantity} 
                onChange={(e) => handleUpdateField("quantity", e.target.value)}
                placeholder="e.g., 30 tablets, 90 days supply"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="refills">Refills</Label>
              <Input 
                id="refills" 
                type="number" 
                min="0"
                max="5"
                value={formData.refills} 
                onChange={(e) => handleUpdateField("refills", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instructions">Patient Instructions</Label>
            <Textarea 
              id="instructions" 
              value={formData.instructions} 
              onChange={(e) => handleUpdateField("instructions", e.target.value)}
              placeholder="Take with food, avoid alcohol, etc..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Provider Notes (Internal)</Label>
            <Textarea 
              id="notes" 
              value={formData.notes} 
              onChange={(e) => handleUpdateField("notes", e.target.value)}
              placeholder="Internal notes for pharmacy or records..."
              rows={2}
            />
          </div>
          
          <Separator />
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={resetForm}>Reset Form</Button>
            <Button onClick={handleGeneratePrescription}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Prescription
            </Button>
          </div>
        </>
      ) : (
        generatedPrescription && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Prescription Preview</h3>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Edit Prescription
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  New Prescription
                </Button>
              </div>
            </div>
            
            <PrescriptionPDF prescription={generatedPrescription} />
          </div>
        )
      )}
    </div>
  );
}
