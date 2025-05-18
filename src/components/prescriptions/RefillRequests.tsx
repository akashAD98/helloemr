
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
  CheckCircle, 
  X, 
  Clock, 
  Search 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RefillRequest {
  id: string;
  patient: string;
  medication: string;
  dosage: string;
  requestDate: string;
  status: "pending" | "approved" | "denied" | "completed";
  pharmacy: string;
  requestSource: string;
}

export function RefillRequests() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  
  const mockRefillRequests: RefillRequest[] = [
    {
      id: "refill-001",
      patient: "John Smith",
      medication: "Metformin 500mg",
      dosage: "1 tablet twice daily",
      requestDate: "2023-05-15",
      status: "pending",
      pharmacy: "CVS Pharmacy - Main St",
      requestSource: "Patient Portal"
    },
    {
      id: "refill-002",
      patient: "Emma Johnson",
      medication: "Lisinopril 10mg",
      dosage: "1 tablet once daily",
      requestDate: "2023-05-16",
      status: "approved",
      pharmacy: "Walgreens - Oak Ave",
      requestSource: "Phone Call"
    },
    {
      id: "refill-003",
      patient: "Michael Williams",
      medication: "Atorvastatin 20mg",
      dosage: "1 tablet every evening",
      requestDate: "2023-05-14",
      status: "denied",
      pharmacy: "Walmart Pharmacy",
      requestSource: "Pharmacy Direct"
    },
    {
      id: "refill-004",
      patient: "Sophia Brown",
      medication: "Levothyroxine 50mcg",
      dosage: "1 tablet every morning",
      requestDate: "2023-05-16",
      status: "completed",
      pharmacy: "CVS Pharmacy - Main St",
      requestSource: "Patient Portal"
    }
  ];
  
  const filteredRequests = mockRefillRequests.filter(req => {
    const matchesSearch = req.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        req.medication.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterStatus || req.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });
  
  const handleApproveRequest = (id: string) => {
    toast({
      title: "Request Approved",
      description: `Refill request ${id} has been approved.`,
    });
  };
  
  const handleDenyRequest = (id: string) => {
    toast({
      title: "Request Denied",
      description: `Refill request ${id} has been denied.`,
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Approved</Badge>;
      case "denied":
        return <Badge variant="destructive">Denied</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="refill-search">Search</Label>
          <div className="flex mt-1">
            <Input
              id="refill-search"
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="denied">Denied</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableCaption>Refill Requests</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Medication</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Pharmacy</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No refill requests matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.patient}</TableCell>
                  <TableCell>{req.medication}</TableCell>
                  <TableCell>{req.dosage}</TableCell>
                  <TableCell>{req.pharmacy}</TableCell>
                  <TableCell>{req.requestDate}</TableCell>
                  <TableCell>{getStatusBadge(req.status)}</TableCell>
                  <TableCell>
                    {req.status === "pending" && (
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleApproveRequest(req.id)}
                          title="Approve Request"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDenyRequest(req.id)}
                          title="Deny Request"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    )}
                    {req.status !== "pending" && (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
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
