
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Send, 
  Edit,
  Trash, 
  Search 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Prescription {
  id: string;
  patient: string;
  medication: string;
  dosage: string;
  frequency: string;
  status: "draft" | "ready" | "sent" | "error";
  pharmacy: string;
  created: string;
}

export function PrescriptionQueue() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  
  const mockPrescriptions: Prescription[] = [
    {
      id: "rx-001",
      patient: "John Smith",
      medication: "Metformin 500mg",
      dosage: "1 tablet",
      frequency: "Twice daily",
      status: "ready",
      pharmacy: "CVS Pharmacy - Main St",
      created: "2023-05-15"
    },
    {
      id: "rx-002",
      patient: "Emma Johnson",
      medication: "Lisinopril 10mg",
      dosage: "1 tablet",
      frequency: "Once daily",
      status: "draft",
      pharmacy: "Walgreens - Oak Ave",
      created: "2023-05-16"
    },
    {
      id: "rx-003",
      patient: "Michael Williams",
      medication: "Atorvastatin 20mg",
      dosage: "1 tablet",
      frequency: "Every evening",
      status: "sent",
      pharmacy: "Walmart Pharmacy",
      created: "2023-05-14"
    },
    {
      id: "rx-004",
      patient: "Sophia Brown",
      medication: "Amoxicillin 500mg",
      dosage: "1 capsule",
      frequency: "Three times daily",
      status: "error",
      pharmacy: "CVS Pharmacy - Main St",
      created: "2023-05-16"
    }
  ];
  
  const filteredPrescriptions = mockPrescriptions.filter(rx => {
    const matchesSearch = rx.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        rx.medication.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterStatus || rx.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });
  
  const handleSendPrescription = (id: string) => {
    toast({
      title: "Prescription Sent",
      description: `Prescription ${id} has been successfully transmitted to the pharmacy.`,
    });
  };
  
  const handleEditPrescription = (id: string) => {
    toast({
      title: "Edit Prescription",
      description: `Opening editor for prescription ${id}.`,
    });
  };
  
  const handleDeletePrescription = (id: string) => {
    toast({
      title: "Prescription Deleted",
      description: `Prescription ${id} has been removed from the queue.`,
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "ready":
        return <Badge variant="default">Ready</Badge>;
      case "sent":
        return <Badge variant="success" className="bg-green-500 hover:bg-green-600">Sent</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="rx-search">Search</Label>
          <div className="flex mt-1">
            <Input
              id="rx-search"
              placeholder="Search by patient or medication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="ghost" className="ml-2">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="w-full sm:w-48">
          <Label htmlFor="status-filter">Status</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Any Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableCaption>Prescription Queue</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Medication</TableHead>
              <TableHead>Dosage & Frequency</TableHead>
              <TableHead>Pharmacy</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrescriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No prescriptions matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredPrescriptions.map((rx) => (
                <TableRow key={rx.id}>
                  <TableCell>{rx.patient}</TableCell>
                  <TableCell>{rx.medication}</TableCell>
                  <TableCell>{rx.dosage}, {rx.frequency}</TableCell>
                  <TableCell>{rx.pharmacy}</TableCell>
                  <TableCell>{getStatusBadge(rx.status)}</TableCell>
                  <TableCell>{rx.created}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {rx.status !== "sent" && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleSendPrescription(rx.id)}
                          disabled={rx.status !== "ready"}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditPrescription(rx.id)}
                        disabled={rx.status === "sent"}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeletePrescription(rx.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
