
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, User, Calendar, Phone } from "lucide-react";
import { dataStore } from "@/lib/dataStore";
import { Patient } from "@/types/patient";

interface PatientSelectorProps {
  selectedPatientId: string;
  onPatientSelect: (patientId: string) => void;
}

export function PatientSelector({ selectedPatientId, onPatientSelect }: PatientSelectorProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const allPatients = dataStore.getPatients();
    setPatients(allPatients);
  }, []);

  const filteredPatients = patients.filter(patient => {
    const patientName = patient.name || `${patient.firstName} ${patient.lastName}` || "";
    const searchLower = searchTerm.toLowerCase();
    return patientName.toLowerCase().includes(searchLower) ||
           patient.phone?.includes(searchTerm) ||
           patient.dateOfBirth?.includes(searchTerm);
  });

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const handlePatientSelect = (patient: Patient) => {
    onPatientSelect(patient.id);
    setSearchTerm("");
    setShowResults(false);
  };

  const clearSelection = () => {
    onPatientSelect("");
    setSearchTerm("");
    setShowResults(false);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="patient-search" className="text-base font-medium">Patient Selection</Label>
      
      {!selectedPatient ? (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="patient-search"
              placeholder="Search by name, phone, or DOB..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowResults(e.target.value.length > 0);
              }}
              className="pl-10 h-12 text-base"
              onFocus={() => setShowResults(searchTerm.length > 0)}
            />
          </div>
          
          {showResults && filteredPatients.length > 0 && (
            <div className="border rounded-lg max-h-60 overflow-y-auto bg-white shadow-lg">
              {filteredPatients.slice(0, 10).map((patient) => (
                <div
                  key={patient.id}
                  className="p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                  onClick={() => handlePatientSelect(patient)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {patient.name || `${patient.firstName} ${patient.lastName}`}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {patient.dateOfBirth}
                          </span>
                          <span>{patient.gender}</span>
                          {patient.phone && (
                            <span className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {patient.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {showResults && filteredPatients.length === 0 && searchTerm && (
            <div className="p-4 text-center text-muted-foreground border rounded-lg">
              No patients found matching "{searchTerm}"
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-900">
                  {selectedPatient.name || `${selectedPatient.firstName} ${selectedPatient.lastName}`}
                </p>
                <div className="flex items-center space-x-4 text-sm text-blue-700">
                  <span>DOB: {selectedPatient.dateOfBirth}</span>
                  <span>{selectedPatient.gender}</span>
                  {selectedPatient.phone && <span>Ph: {selectedPatient.phone}</span>}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={clearSelection}>
              Change Patient
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
