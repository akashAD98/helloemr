
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { dataStore } from "@/lib/dataStore";
import { Patient } from "@/types/patient";

interface PatientSelectorProps {
  selectedPatientId: string;
  onPatientSelect: (patientId: string) => void;
}

export function PatientSelector({ selectedPatientId, onPatientSelect }: PatientSelectorProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const allPatients = dataStore.getPatients();
    setPatients(allPatients);
  }, []);

  const filteredPatients = patients.filter(patient => {
    const patientName = patient.name || `${patient.firstName} ${patient.lastName}` || "";
    return patientName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="space-y-2">
      <Label htmlFor="patient-search">Select Patient</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="patient-search"
          placeholder="Search for patient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {searchTerm && (
        <Select value={selectedPatientId} onValueChange={onPatientSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a patient">
              {selectedPatient && (
                <div className="flex items-center justify-between w-full">
                  <span>{selectedPatient.name || `${selectedPatient.firstName} ${selectedPatient.lastName}`}</span>
                  <span className="text-xs text-muted-foreground">
                    {selectedPatient.dateOfBirth} • {selectedPatient.gender}
                  </span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {filteredPatients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {patient.name || `${patient.firstName} ${patient.lastName}`}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    DOB: {patient.dateOfBirth} • {patient.gender}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
