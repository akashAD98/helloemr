import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, ArrowLeft, Download, FileUp, X, CheckCircle, Copy, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

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
  isEditing: boolean;
}

export function DocumentSummarizer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [summaries, setSummaries] = useState<GeneratedSummary[]>([]);
  const [selectedSummaryType, setSelectedSummaryType] = useState<string>("discharge_summary");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const summaryTypes = [
    { value: "discharge_summary", label: "Discharge Summary", description: "Comprehensive summary of hospital stay including admission details, procedures, diagnosis, and follow-up instructions." },
    { value: "clinical_notes_summary", label: "Clinical Notes Summary", description: "Provides a structured overview of patient information, subjective/objective findings, assessments, and plans." },
    { value: "referral_summary", label: "Referral Summary", description: "Summarizes the reason for referral, relevant history, and key clinical information for the receiving provider." }
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
      // Check file size - limit to 100MB
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size exceeds the 100MB limit. Please upload a smaller file.",
          variant: "destructive"
        });
        return;
      }

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

  const startProgress = () => {
    setProgress(0);
    setProgressText("Processing document...");
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        const increment = Math.random() * 15;
        const newProgress = prev + increment;
        
        if (newProgress > 30) setProgressText("Analyzing content...");
        if (newProgress > 60) setProgressText("Generating summary...");
        if (newProgress > 80) setProgressText("Finalizing...");
        
        return Math.min(90, newProgress);
      });
    }, 500);

    return interval;
  };

  const generateSummary = async (file: UploadedFile) => {
    setError(null);
    setIsProcessing(true);
    const progressInterval = startProgress();
    
    try {
      const formData = new FormData();
      
      // Get the file from the URL
      const response = await fetch(file.url);
      const blob = await response.blob();
      formData.append('file', blob, file.name);
      
      // Add summary type and other parameters
      formData.append('type_of_summary', selectedSummaryType);
      
      const apiResponse = await fetch('https://chatbot.deepaarogya.com/nlp/v1/chatbot/summary/deep_medical_summary_service', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 12345'
        },
        body: formData
      });

      if (!apiResponse.ok) {
        throw new Error(`Server error (${apiResponse.status}): ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      
      if (!data.summary) {
        throw new Error("No summary was generated");
      }

      clearInterval(progressInterval);
      setProgress(100);
      setProgressText("Complete!");

      const newSummary: GeneratedSummary = {
        id: `summary-${Date.now()}`,
        fileName: file.name,
        summaryType: selectedSummaryType,
        content: data.summary,
        timestamp: new Date(),
        isEditing: false
      };
      
      setSummaries(prev => [...prev, newSummary]);
      
      toast({
        title: "Summary Generated",
        description: `${summaryTypes.find(t => t.value === selectedSummaryType)?.label} created for ${file.name}`
      });
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate summary",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgressText("");
    }
  };

  const toggleEdit = (summaryId: string) => {
    setSummaries(prev => prev.map(summary => 
      summary.id === summaryId 
        ? { ...summary, isEditing: !summary.isEditing }
        : summary
    ));
  };

  const updateSummaryContent = (summaryId: string, newContent: string) => {
    setSummaries(prev => prev.map(summary => 
      summary.id === summaryId 
        ? { ...summary, content: newContent }
        : summary
    ));
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "Summary content has been copied to your clipboard"
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying manually",
        variant: "destructive"
      });
    }
  };

  const exportToPDF = async (summary: GeneratedSummary) => {
    try {
      const { jsPDF } = window as any;
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(16);
      doc.setTextColor(46, 69, 132); // #2e4584
      doc.text("Medical Document Summary", 20, 20);
      
      // Add metadata
      doc.setFontSize(10);
      doc.setTextColor(102, 102, 102);
      doc.text(`File: ${summary.fileName}`, 20, 30);
      doc.text(`Type: ${summaryTypes.find(t => t.value === summary.summaryType)?.label}`, 20, 35);
      doc.text(`Generated: ${summary.timestamp.toLocaleString()}`, 20, 40);
      
      // Add content
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      
      const splitText = doc.splitTextToSize(summary.content, 170);
      doc.text(splitText, 20, 50);
      
      // Add footer
      doc.setFontSize(8);
      doc.setTextColor(119, 119, 119);
      doc.text("Generated by Deepaarogya AI", 20, doc.internal.pageSize.height - 10);
      
      // Save the PDF
      doc.save(`${summary.fileName.replace('.pdf', '')}_summary.pdf`);
      
      toast({
        title: "PDF Exported",
        description: "Summary has been exported as a PDF file"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export summary as PDF",
        variant: "destructive"
      });
    }
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
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
              <p className="text-sm text-muted-foreground">
                {summaryTypes.find(t => t.value === selectedSummaryType)?.description}
              </p>
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
                  <p className="text-xs text-muted-foreground mt-1">Maximum file size: 100MB</p>
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

              {isProcessing && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{progressText}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
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
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(summary.content)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleEdit(summary.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          {summary.isEditing ? "Save" : "Edit"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportToPDF(summary)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-md p-4">
                      {summary.isEditing ? (
                        <Textarea
                          value={summary.content}
                          onChange={(e) => updateSummaryContent(summary.id, e.target.value)}
                          className="min-h-[200px] font-mono text-sm"
                        />
                      ) : (
                        <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">
                          {summary.content}
                        </pre>
                      )}
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
