import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PatientSelector } from "./PatientSelector";
import { MedicationSelector } from "./MedicationSelector";
import { PrescriptionPDF } from "./PrescriptionPDF";
import { FileText, RotateCcw, Send } from "lucide-react";
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
    route: "Oral",
    quantity: "",
    refills: 0,
    instructions: "",
    notes: ""
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [generatedPrescription, setGeneratedPrescription] = useState<Prescription | null>(null);
  
  // Simplified, common options that doctors use most - ensuring no empty values
  const quickFrequencies = [
    "Once daily",
    "Twice daily", 
    "Three times daily",
    "As needed",
    "At bedtime",
    "With meals"
  ].filter(freq => freq && freq.trim() !== ""); // Filter out any empty values
  
  const quickQuantities = [
    "30 tablets",
    "60 tablets", 
    "90 tablets",
    "30 days supply",
    "60 days supply",
    "90 days supply"
  ].filter(qty => qty && qty.trim() !== ""); // Filter out any empty values

  const refillOptions = [
    { value: "0", label: "No refills" },
    { value: "1", label: "1 refill" },
    { value: "2", label: "2 refills" },
    { value: "3", label: "3 refills" },
    { value: "5", label: "5 refills" }
  ].filter(option => option.value && option.value.trim() !== ""); // Filter out any empty values

  const selectedPatient = dataStore.getPatientById(formData.patientId);
  const selectedMedication = medicationDatabase.find(med => med.id === formData.medicationId);

  const handleGeneratePrescription = () => {
    // Simple validation
    if (!formData.patientId) {
      toast({
        title: "Select Patient",
        description: "Please choose a patient first.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.medicationId && !formData.customMedication) {
      toast({
        title: "Select Medication", 
        description: "Please choose a medication.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.dosage || !formData.frequency || !formData.quantity) {
      toast({
        title: "Complete Prescription",
        description: "Please fill in dosage, frequency, and quantity.",
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
      prescribedBy: "Dr. Sarah Johnson",
      prescribedDate: new Date().toLocaleDateString(),
      status: "pending",
      notes: formData.notes
    };

    setGeneratedPrescription(prescription);
    setShowPreview(true);

    toast({
      title: "Prescription Ready",
      description: `${medicationName} prescription created for ${patientName}`,
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
      route: "Oral",
      quantity: "",
      refills: 0,
      instructions: "",
      notes: ""
    });
    setShowPreview(false);
    setGeneratedPrescription(null);
  };

  const quickFillCommon = () => {
    if (selectedMedication) {
      handleUpdateField("instructions", "Take as directed by your physician. If you experience any side effects, contact your doctor immediately.");
    }
  };

  return (
    <div className="space-y-6">
      {!showPreview ? (
        <>
          <PatientSelector
            selectedPatientId={formData.patientId}
            onPatientSelect={(patientId) => handleUpdateField("patientId", patientId)}
          />

          <MedicationSelector
            selectedMedicationId={formData.medicationId}
            customMedication={formData.customMedication}
            onMedicationSelect={(medicationId) => handleUpdateField("medicationId", medicationId)}
            onCustomMedicationChange={(customMedication) => handleUpdateField("customMedication", customMedication)}
            onDosageChange={(dosage) => handleUpdateField("dosage", dosage)}
            onFrequencyChange={(frequency) => handleUpdateField("frequency", frequency)}
            onRouteChange={(route) => handleUpdateField("route", route)}
          />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Prescription Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage *</Label>
                  <Input 
                    id="dosage" 
                    value={formData.dosage} 
                    onChange={(e) => handleUpdateField("dosage", e.target.value)}
                    placeholder="e.g., 500mg, 1 tablet"
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="route">Route</Label>
                  <Select value={formData.route} onValueChange={(route) => handleUpdateField("route", route)}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Oral">Oral</SelectItem>
                      <SelectItem value="Topical">Topical</SelectItem>
                      <SelectItem value="Injection">Injection</SelectItem>
                      <SelectItem value="Inhaled">Inhaled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency *</Label>
                  <Select value={formData.frequency} onValueChange={(frequency) => handleUpdateField("frequency", frequency)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="How often?" />
                    </SelectTrigger>
                    <SelectContent>
                      {quickFrequencies.map((freq) => (
                        <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Select value={formData.quantity} onValueChange={(quantity) => handleUpdateField("quantity", quantity)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="How much?" />
                    </SelectTrigger>
                    <SelectContent>
                      {quickQuantities.map((qty) => (
                        <SelectItem key={qty} value={qty}>{qty}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="refills">Refills</Label>
                  <Select value={formData.refills.toString()} onValueChange={(refills) => handleUpdateField("refills", parseInt(refills))}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {refillOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={quickFillCommon}
                    className="h-11 w-full"
                    disabled={!selectedMedication}
                  >
                    Quick Fill Instructions
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructions">Patient Instructions</Label>
                <Textarea 
                  id="instructions" 
                  value={formData.instructions} 
                  onChange={(e) => handleUpdateField("instructions", e.target.value)}
                  placeholder="Instructions for the patient..."
                  rows={3}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={resetForm}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleGeneratePrescription} size="lg">
              <FileText className="h-4 w-4 mr-2" />
              Create Prescription
            </Button>
          </div>
        </>
      ) : (
        generatedPrescription && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Prescription Ready</h3>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Edit
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Prescription
                </Button>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send to Pharmacy
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
