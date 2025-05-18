
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Search, CheckCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function InteractionChecker() {
  const [medicationToCheck, setMedicationToCheck] = useState("");
  const [hasChecked, setHasChecked] = useState(false);
  
  const mockInteractions = [
    {
      severity: "high",
      description: "Potential for increased risk of QT interval prolongation with Amiodarone",
      recommendation: "Consider alternative medication or close monitoring"
    }
  ];
  
  const mockAllergies = [
    {
      allergen: "Penicillin",
      reaction: "Rash, hives",
      severity: "moderate"
    }
  ];
  
  const mockCurrentMedications = [
    { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
    { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
    { name: "Atorvastatin", dosage: "20mg", frequency: "Every evening" },
    { name: "Aspirin", dosage: "81mg", frequency: "Once daily" }
  ];
  
  const handleCheckInteractions = () => {
    // In a real app, this would make an API call to check interactions
    setHasChecked(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="medication-check">Medication to Check</Label>
          <div className="flex gap-2">
            <Input 
              id="medication-check" 
              value={medicationToCheck} 
              onChange={(e) => setMedicationToCheck(e.target.value)}
              placeholder="Enter medication name..."
              className="flex-1"
            />
            <Button onClick={handleCheckInteractions}>
              <Search className="h-4 w-4 mr-2" />
              Check
            </Button>
          </div>
        </div>
        
        {hasChecked && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Current Medications</h3>
              <ScrollArea className="h-[150px] border rounded-md p-4 mt-2">
                <div className="space-y-2">
                  {mockCurrentMedications.map((med, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{med.name}</span> {med.dosage}
                      </div>
                      <span className="text-muted-foreground text-sm">{med.frequency}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Allergies</h3>
              {mockAllergies.length > 0 ? (
                <div className="space-y-2 mt-2">
                  {mockAllergies.map((allergy, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Allergy: {allergy.allergen}</AlertTitle>
                      <AlertDescription>
                        Reaction: {allergy.reaction} (Severity: {allergy.severity})
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <Alert className="mt-2">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>No allergies recorded</AlertTitle>
                </Alert>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Potential Interactions</h3>
              {medicationToCheck && mockInteractions.length > 0 ? (
                <div className="space-y-2 mt-2">
                  {mockInteractions.map((interaction, index) => (
                    <Alert key={index} variant={interaction.severity === "high" ? "destructive" : "warning"}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Interaction: {medicationToCheck}</AlertTitle>
                      <AlertDescription className="space-y-2">
                        <div>{interaction.description}</div>
                        <div className="font-medium">Recommendation: {interaction.recommendation}</div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <Alert className="mt-2">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>No interactions detected</AlertTitle>
                  <AlertDescription>
                    No potential interactions found between {medicationToCheck} and current medications.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
