
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PDFAttachmentProps {
  patientId: string;
  onSaveNote: (note: { 
    text: string;
    summary?: string;
    pdfUrl?: string;
  }) => void;
}

export function PDFAttachment({ patientId, onSaveNote }: PDFAttachmentProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState("");
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const generateSummary = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Mock PDF analysis and summary
    const mockSummary = "This document contains patient lab results showing normal blood count values. " +
      "Cholesterol levels are slightly elevated at 220 mg/dL. Blood pressure readings show consistent values of 130/85. " +
      "Patient reports occasional headaches after physical activity.";
    
    setSummary(mockSummary);
    setIsProcessing(false);
    
    toast({
      title: "Summary Generated",
      description: "The PDF has been analyzed and summarized.",
    });
  };

  const savePDFNote = () => {
    if (!selectedFile) return;
    
    // Create a blob URL to simulate storing the PDF
    const pdfUrl = URL.createObjectURL(selectedFile);
    
    onSaveNote({
      text: `PDF document "${selectedFile.name}" was uploaded and analyzed.`,
      summary: summary,
      pdfUrl: pdfUrl
    });
    
    toast({
      title: "PDF Note Saved",
      description: "The PDF document and its summary have been added to patient notes.",
    });
    
    // Reset the form
    setSelectedFile(null);
    setSummary("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept=".pdf"
          id="pdf-document"
          className="hidden"
          onChange={handleFileChange}
        />
        <label 
          htmlFor="pdf-document" 
          className="cursor-pointer flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-primary"
        >
          <FileUp className="h-6 w-6 text-muted-foreground" />
          <span className="text-sm font-medium">
            {selectedFile ? selectedFile.name : "Click to upload PDF document"}
          </span>
        </label>
      </div>
      
      {selectedFile && (
        <div className="space-y-4">
          <Button 
            onClick={generateSummary}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-t-transparent"></div>
                Processing...
              </>
            ) : (
              <>Generate Summary</>
            )}
          </Button>
          
          {summary && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Generated Summary</h4>
              <div className="text-sm p-3 bg-muted/30 rounded-md">
                {summary}
              </div>
            </div>
          )}
          
          <Button 
            onClick={savePDFNote}
            disabled={!summary}
            className="w-full"
          >
            Save PDF Note
          </Button>
        </div>
      )}
    </div>
  );
}
