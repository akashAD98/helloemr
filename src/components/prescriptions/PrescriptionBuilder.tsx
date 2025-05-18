
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export function PrescriptionBuilder() {
  const { toast } = useToast();
  const [drug, setDrug] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [route, setRoute] = useState("");
  const [quantity, setQuantity] = useState("");
  const [refills, setRefills] = useState("0");
  const [notes, setNotes] = useState("");
  
  const recentMedications = [
    "Metformin 500mg",
    "Lisinopril 10mg",
    "Atorvastatin 20mg",
    "Levothyroxine 50mcg",
    "Amlodipine 5mg"
  ];
  
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
    "As needed"
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
    "Otic"
  ];
  
  const handleSavePrescription = () => {
    // Would normally save prescription to database
    toast({
      title: "Prescription Created",
      description: `Prescription for ${drug} has been created and added to the queue.`,
    });
    
    // Reset form
    setDrug("");
    setDosage("");
    setFrequency("");
    setRoute("");
    setQuantity("");
    setRefills("0");
    setNotes("");
  };
  
  const handleRecentMedicationClick = (med: string) => {
    setDrug(med);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="recent-medications">Recent Medications</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {recentMedications.map((med) => (
              <Button 
                key={med} 
                variant="outline" 
                size="sm"
                onClick={() => handleRecentMedicationClick(med)}
              >
                {med}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="medication">Medication</Label>
            <Input 
              id="medication" 
              value={drug} 
              onChange={(e) => setDrug(e.target.value)}
              placeholder="Start typing to search medications..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input 
              id="dosage" 
              value={dosage} 
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g., 500mg"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
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
            <Select value={route} onValueChange={setRoute}>
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
            <Label htmlFor="quantity">Quantity</Label>
            <Input 
              id="quantity" 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g., 30"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="refills">Refills</Label>
            <Input 
              id="refills" 
              type="number" 
              min="0"
              value={refills} 
              onChange={(e) => setRefills(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea 
            id="notes" 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional instructions for the patient or pharmacist..."
            rows={3}
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button 
          onClick={handleSavePrescription}
          disabled={!drug || !dosage || !frequency || !route || !quantity}
        >
          Save Prescription
        </Button>
      </div>
    </div>
  );
}
