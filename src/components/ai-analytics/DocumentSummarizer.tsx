
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, ArrowLeft, Download, FileUp, X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

interface GeneratedSummary {
  id: string;
  fileName: string;
  summaryType: string;
  content: string;
  timestamp: Date;
}

export function DocumentSummarizer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [summaries, setSummaries] = useState<GeneratedSummary[]>([]);
  const [selectedSummaryType, setSelectedSummaryType] = useState<string>("discharge");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const summaryTypes = [
    { value: "discharge", label: "Discharge Summary" },
    { value: "clinical", label: "Clinical Notes" },
    { value: "referral", label: "Referral Summary" },
    { value: "lab", label: "Lab Report Analysis" },
    { value: "progress", label: "Progress Notes" },
    { value: "consultation", label: "Consultation Summary" }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileUpload = (files: File[]) => {
    files.forEach((file) => {
      if (file.type === "application/pdf" || file.name.endsWith('.pdf')) {
        const fileId = `file-${Date.now()}-${Math.random()}`;
        const fileUrl = URL.createObjectURL(file);
        
        const newFile: UploadedFile = {
          id: fileId,
          name: file.name,
          type: file.type,
          url: fileUrl,
          size: file.size
        };
        
        setUploadedFiles(prev => [...prev, newFile]);
        
        toast({
          title: "File uploaded successfully",
          description: `${file.name} is ready for summarization`
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload PDF files only",
          variant: "destructive"
        });
      }
    });
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const generateSummary = async (file: UploadedFile) => {
    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const summaryContent = generateMockSummary(selectedSummaryType, file.name);
    
    const newSummary: GeneratedSummary = {
      id: `summary-${Date.now()}`,
      fileName: file.name,
      summaryType: selectedSummaryType,
      content: summaryContent,
      timestamp: new Date()
    };
    
    setSummaries(prev => [...prev, newSummary]);
    setIsProcessing(false);
    
    toast({
      title: "Summary Generated",
      description: `${summaryTypes.find(t => t.value === selectedSummaryType)?.label} created for ${file.name}`
    });
  };

  const generateMockSummary = (type: string, fileName: string): string => {
    const summaryTemplates = {
      discharge: `**DISCHARGE SUMMARY**\n\n**Patient:** John Doe\n**Date of Admission:** March 15, 2024\n**Date of Discharge:** March 20, 2024\n\n**Chief Complaint:** Chest pain and shortness of breath\n\n**Hospital Course:**\nPatient presented with acute onset chest pain. Initial workup including ECG, chest X-ray, and cardiac enzymes were performed. Patient was diagnosed with acute coronary syndrome and managed with antiplatelet therapy and cardiac monitoring.\n\n**Discharge Medications:**\n• Aspirin 81mg daily\n• Atorvastatin 40mg daily\n• Metoprolol 25mg twice daily\n\n**Follow-up Instructions:**\n• Cardiology appointment in 1 week\n• Primary care follow-up in 2 weeks\n• Return to ED if experiencing severe chest pain\n\n**Condition at Discharge:** Stable`,
      
      clinical: `**CLINICAL NOTES**\n\n**Date:** March 20, 2024\n**Provider:** Dr. Smith\n\n**Subjective:**\nPatient reports improvement in chest pain since admission. Denies shortness of breath at rest. Ambulating without difficulty.\n\n**Objective:**\n• Vital Signs: BP 120/80, HR 72, RR 16, O2 Sat 98% on room air\n• Physical Exam: Heart regular rate and rhythm, lungs clear\n• Labs: Troponin negative, BNP normal\n\n**Assessment:**\n• Acute coronary syndrome, resolved\n• Hypertension, controlled\n\n**Plan:**\n• Continue current medications\n• Cardiac rehabilitation referral\n• Lifestyle modifications counseling`,
      
      referral: `**REFERRAL SUMMARY**\n\n**Referring Provider:** Dr. Johnson\n**Specialist:** Cardiology\n\n**Reason for Referral:**\nPatient with recent acute coronary syndrome requiring specialized cardiac evaluation and ongoing management.\n\n**Relevant History:**\n• 58-year-old male with hypertension\n• Recent hospitalization for chest pain\n• Family history of coronary artery disease\n\n**Current Medications:**\n• Aspirin, Atorvastatin, Metoprolol\n\n**Requested Services:**\n• Comprehensive cardiac evaluation\n• Risk stratification\n• Long-term management plan\n\n**Urgency:** Routine (within 2 weeks)`,
      
      lab: `**LAB REPORT ANALYSIS**\n\n**Test Date:** March 20, 2024\n\n**Key Findings:**\n• Complete Blood Count: Within normal limits\n• Comprehensive Metabolic Panel: Glucose 95 mg/dL, Creatinine 1.0 mg/dL\n• Lipid Panel: Total cholesterol 220 mg/dL (elevated), LDL 140 mg/dL (elevated)\n• Cardiac Markers: Troponin I <0.01 ng/mL (normal)\n\n**Clinical Significance:**\n• Elevated cholesterol requiring statin therapy\n• Normal kidney function\n• No evidence of myocardial injury\n\n**Recommendations:**\n• Continue statin therapy\n• Repeat lipid panel in 6 weeks\n• Dietary counseling`,
      
      progress: `**PROGRESS NOTES**\n\n**Date:** March 20, 2024\n**Day:** Hospital Day 5\n\n**Interval History:**\nPatient continues to improve. No chest pain overnight. Ambulating in hallway without difficulty.\n\n**Physical Examination:**\n• Vital signs stable\n• Cardiovascular: Regular rate and rhythm\n• Pulmonary: Clear to auscultation\n\n**Laboratory Data:**\n• Morning labs pending\n• Previous troponin negative\n\n**Assessment and Plan:**\n• Acute coronary syndrome - improving\n• Plan for discharge today\n• Medications reconciled\n• Follow-up arranged`,
      
      consultation: `**CONSULTATION SUMMARY**\n\n**Consulting Service:** Cardiology\n**Date:** March 18, 2024\n\n**History of Present Illness:**\nPatient referred for evaluation of chest pain. Presented with typical anginal symptoms with positive stress test.\n\n**Assessment:**\n• Non-ST elevation myocardial infarction\n• Moderate risk for recurrent events\n\n**Recommendations:**\n• Dual antiplatelet therapy\n• High-intensity statin\n• ACE inhibitor if tolerated\n• Cardiac catheterization consideration\n\n**Follow-up:**\n• Outpatient cardiology in 1-2 weeks\n• Risk factor modification counseling`
    };
    
    return summaryTemplates[type as keyof typeof summaryTemplates] || summaryTemplates.clinical;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Card className="border-b rounded-none">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/ai-analytics')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                <CardTitle>Medical Document Summarizer</CardTitle>
              </div>
            </div>
            <Badge variant="secondary">PDF Analysis</Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upload Medical Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Summary Type</label>
              <Select value={selectedSummaryType} onValueChange={setSelectedSummaryType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select summary type" />
                </SelectTrigger>
                <SelectContent>
                  {summaryTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload Area */}
            <div 
              className={cn(
                "border-2 border-dashed rounded-lg p-8 transition-colors text-center",
                dragOver ? "border-green-500 bg-green-50" : "border-muted-foreground/25",
                "hover:border-green-500/50"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <FileUp className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-lg font-medium">Drop PDF files here</p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select Files
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                accept=".pdf"
                onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => generateSummary(file)}
                        disabled={isProcessing}
                        size="sm"
                      >
                        {isProcessing ? "Processing..." : "Generate Summary"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generated Summaries */}
        {summaries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Generated Summaries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summaries.map((summary) => (
                  <div key={summary.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{summary.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {summaryTypes.find(t => t.value === summary.summaryType)?.label} • {summary.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    <div className="bg-muted/30 rounded-md p-4">
                      <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">
                        {summary.content}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
