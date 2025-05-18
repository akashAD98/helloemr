
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ShieldCheck, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PDMPRecord {
  id: string;
  patient: string;
  dob: string;
  medication: string;
  quantity: string;
  prescriber: string;
  pharmacy: string;
  fillDate: string;
  schedule: "II" | "III" | "IV" | "V";
}

export function ControlledSubstances() {
  const [activeTab, setActiveTab] = useState("pdmp-search");
  const [patientName, setPatientName] = useState("");
  const [patientDOB, setPatientDOB] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  
  const mockPDMPRecords: PDMPRecord[] = [
    {
      id: "pdmp-001",
      patient: "John Smith",
      dob: "1975-05-12",
      medication: "Oxycodone 5mg",
      quantity: "30 tablets",
      prescriber: "Dr. Robert Williams",
      pharmacy: "CVS Pharmacy - Main St",
      fillDate: "2023-04-15",
      schedule: "II"
    },
    {
      id: "pdmp-002",
      patient: "John Smith",
      dob: "1975-05-12",
      medication: "Alprazolam 0.5mg",
      quantity: "30 tablets",
      prescriber: "Dr. Michael Johnson",
      pharmacy: "Walgreens - Oak Ave",
      fillDate: "2023-03-22",
      schedule: "IV"
    }
  ];
  
  const handleSearch = () => {
    // In a real app, this would query the PDMP database
    setHasSearched(true);
  };
  
  const getScheduleBadge = (schedule: string) => {
    switch (schedule) {
      case "II":
        return <Badge variant="destructive">Schedule II</Badge>;
      case "III":
        return <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">Schedule III</Badge>;
      case "IV":
        return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">Schedule IV</Badge>;
      case "V":
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Schedule V</Badge>;
      default:
        return <Badge variant="outline">{schedule}</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pdmp-search">PDMP Search</TabsTrigger>
          <TabsTrigger value="controlled-rx">Controlled Prescriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pdmp-search" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-name">Patient Name</Label>
                    <Input 
                      id="patient-name" 
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="patient-dob">Date of Birth</Label>
                    <Input 
                      id="patient-dob" 
                      type="date"
                      value={patientDOB}
                      onChange={(e) => setPatientDOB(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSearch}
                    disabled={!patientName || !patientDOB}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search PDMP
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {hasSearched && (
            <div className="space-y-4">
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>PDMP Query Complete</AlertTitle>
                <AlertDescription>
                  Found {mockPDMPRecords.length} controlled substance prescriptions for {patientName}
                </AlertDescription>
              </Alert>
              
              <div className="border rounded-md">
                <Table>
                  <TableCaption>PDMP Records for {patientName}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Prescriber</TableHead>
                      <TableHead>Pharmacy</TableHead>
                      <TableHead>Fill Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPDMPRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.medication}</TableCell>
                        <TableCell>{record.quantity}</TableCell>
                        <TableCell>{getScheduleBadge(record.schedule)}</TableCell>
                        <TableCell>{record.prescriber}</TableCell>
                        <TableCell>{record.pharmacy}</TableCell>
                        <TableCell>{record.fillDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="controlled-rx" className="space-y-4 mt-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Electronic Prescribing of Controlled Substances (EPCS)</AlertTitle>
            <AlertDescription>
              DEA-compliant electronic prescribing of controlled substances requires additional identity verification. 
              Please ensure you have completed the two-factor authentication setup.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-8">
                Controlled substance e-prescribing feature requires additional security setup. 
                Please contact your system administrator.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
