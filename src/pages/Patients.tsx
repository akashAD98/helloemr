
import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { PatientCard } from "@/components/common/PatientCard";
import { PlusCircle, Search, RefreshCw } from "lucide-react";
import { supabaseDataStore } from "@/lib/supabaseDataStore";
import { Patient } from "@/types/patient";
import { toast } from "sonner";
import { patients as mockPatients } from "@/data/mockData";

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load patients on component mount
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      console.log('Loading patients from Supabase...');
      await supabaseDataStore.initialize();
      const supabasePatients = await supabaseDataStore.getPatients();
      console.log('Supabase patients:', supabasePatients);
      
      // If no patients in Supabase, use mock data as fallback
      if (supabasePatients.length === 0) {
        console.log('No patients in Supabase, using mock data:', mockPatients);
        setPatients(mockPatients);
        toast.info('Using demo patient data. Click "Import Demo Data" to save to database.');
      } else {
        setPatients(supabasePatients);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
      console.log('Falling back to mock data due to error');
      setPatients(mockPatients);
      toast.error('Failed to load patients from database, showing demo data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await supabaseDataStore.refresh();
    await loadPatients();
    toast.success("Patients refreshed");
  };

  const handleImportDemoData = async () => {
    try {
      setLoading(true);
      console.log('Importing demo data to Supabase...');
      
      for (const patient of mockPatients) {
        const patientName = patient.name || 'Unknown Patient';
        console.log('Adding patient:', patientName);
        await supabaseDataStore.addPatient(patient);
      }
      
      toast.success('Demo data imported successfully!');
      await loadPatients(); // Reload to show the imported data
    } catch (error) {
      console.error('Error importing demo data:', error);
      toast.error('Failed to import demo data');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredPatients = patients.filter(patient => 
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.gender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.provider?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewPatient = () => {
    toast.info("New patient registration will be available soon");
  };

  return (
    <PageContainer>
      <div className="p-6 space-y-6">
        <PageHeader 
          title="Patients" 
          description={`Manage your patient records (${patients.length} total patients)`}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {patients.length === 0 || patients === mockPatients ? (
                <Button variant="outline" onClick={handleImportDemoData} disabled={loading}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Import Demo Data
                </Button>
              ) : null}
              <Button onClick={handleNewPatient}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Patient
              </Button>
            </div>
          }
        />
        
        <Card className="animate-fadeIn">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search patients..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === "grid" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </Button>
                <Button 
                  variant={viewMode === "table" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setViewMode("table")}
                >
                  Table
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading patients...</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients.map(patient => (
                  <PatientCard
                    key={patient.id}
                    id={patient.id}
                    name={patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || "Unknown"}
                    age={patient.age || 0}
                    gender={patient.gender}
                    pronouns={patient.pronouns}
                    provider={patient.provider || patient.primaryProvider}
                  />
                ))}
                
                {filteredPatients.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    No patients found
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Name</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map(patient => (
                      <TableRow 
                        key={patient.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => window.location.href = `/patients/${patient.id}`}
                      >
                        <TableCell className="font-medium">
                          {patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || "Unknown"}
                        </TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell>{patient.age} years</TableCell>
                        <TableCell>{patient.provider || patient.primaryProvider}</TableCell>
                        <TableCell>
                          {patient.active !== false ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                              Inactive
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {filteredPatients.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No patients found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
