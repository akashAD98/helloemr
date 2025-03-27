
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Eye } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

interface LabResult {
  id: string;
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  date: string;
  pdfReport?: string; // URL to PDF report if available
}

interface LabsTabProps {
  labResults: LabResult[];
  onUploadPdf: (file: File) => void;
}

export function LabsTab({ labResults, onUploadPdf }: LabsTabProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = () => {
    if (selectedFile) {
      onUploadPdf(selectedFile);
      setSelectedFile(null);
    }
  };

  return (
    <>
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Laboratory Results</h3>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Lab Report
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Lab Report PDF</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept=".pdf"
                      id="lab-report"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label 
                      htmlFor="lab-report" 
                      className="cursor-pointer flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-primary"
                    >
                      <FileText className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {selectedFile ? selectedFile.name : "Click to select PDF file"}
                      </span>
                    </label>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleUpload}
                    disabled={!selectedFile}
                  >
                    Upload Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Reference Range</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Report</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labResults.map((lab) => (
                  <TableRow key={lab.id}>
                    <TableCell className="font-medium">{lab.testName}</TableCell>
                    <TableCell>{lab.value}</TableCell>
                    <TableCell>{lab.unit}</TableCell>
                    <TableCell>{lab.referenceRange}</TableCell>
                    <TableCell>{lab.date}</TableCell>
                    <TableCell>
                      {lab.pdfReport ? (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={lab.pdfReport} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </a>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-xs">No report</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                
                {labResults.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No lab results found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
