
import { useState, useRef } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Send, FileText, Upload, FileUp, Search, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function DocumentAnalyzer() {
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "processing" | "complete" | "error">("idle");
  const [documents, setDocuments] = useState<Array<{id: string, name: string, date: string, type: string, status: string}>>([
    { id: "doc1", name: "Patient History Report.pdf", date: "2023-05-12", type: "PDF", status: "analyzed" },
    { id: "doc2", name: "Lab Results Q1 2023.pdf", date: "2023-04-03", type: "PDF", status: "analyzed" },
  ]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{role: "user" | "assistant", content: string}>>([
    { role: "assistant", content: "Hello! I can help answer questions about the medical documents you've uploaded. What would you like to know?" }
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const simulateUpload = (file: File) => {
    setUploadState("uploading");
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState("processing");
          
          setTimeout(() => {
            setUploadState("complete");
            setDocuments(prev => [...prev, {
              id: `doc${prev.length + 1}`,
              name: file.name,
              date: new Date().toISOString().split('T')[0],
              type: file.name.split('.').pop()?.toUpperCase() || "PDF",
              status: "analyzed"
            }]);
            
            setTimeout(() => {
              setUploadState("idle");
              setActiveTab("library");
            }, 1000);
          }, 2000);
          
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload(file);
    }
  };
  
  const handleDocumentSelect = (docId: string) => {
    setSelectedDocument(docId);
    setActiveTab("chat");
  };
  
  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const userMessage = { role: "user" as const, content: message };
    setChatMessages(prev => [...prev, userMessage]);
    setMessage("");
    
    // Simulate AI response
    setTimeout(() => {
      const responseContent = simulateAIResponse(message);
      setChatMessages(prev => [...prev, { role: "assistant" as const, content: responseContent }]);
    }, 1000);
  };
  
  const simulateAIResponse = (query: string) => {
    const responses = [
      "Based on the uploaded documents, the patient shows normal blood glucose levels but elevated cholesterol. I recommend dietary changes and a follow-up test in 3 months.",
      "The medical literature indicates this treatment has a 78% efficacy rate for patients with similar profiles. Side effects are minimal in most cases.",
      "According to the uploaded research, this approach has been tested in three clinical trials with positive outcomes for patients in the same demographic.",
      "The lab results show improvement in liver function tests compared to previous results. All values are now within normal ranges.",
      "The patient history indicates no adverse reactions to this class of medications in the past. Monitoring for typical side effects is still recommended."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="library">
            <FileText className="h-4 w-4 mr-2" />
            Document Library
          </TabsTrigger>
          <TabsTrigger value="chat">
            <Search className="h-4 w-4 mr-2" />
            Chat & Analyze
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Upload Medical Documents</CardTitle>
              <CardDescription>
                Upload medical documents, research papers, or patient records for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
              
              {uploadState === "idle" ? (
                <div 
                  className={cn(
                    "border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors",
                    "flex flex-col items-center justify-center"
                  )}
                  onClick={handleUpload}
                >
                  <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-1">Click to upload documents</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    PDF, DOC, DOCX, TXT files supported (up to 25MB)
                  </p>
                  <Button variant="secondary" onClick={handleUpload}>
                    Select File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    {uploadState === "uploading" && <Clock className="text-blue-500 animate-pulse h-5 w-5" />}
                    {uploadState === "processing" && <Clock className="text-amber-500 animate-pulse h-5 w-5" />}
                    {uploadState === "complete" && <CheckCircle className="text-green-500 h-5 w-5" />}
                    {uploadState === "error" && <AlertCircle className="text-red-500 h-5 w-5" />}
                    
                    <span className="font-medium">
                      {uploadState === "uploading" && "Uploading document..."}
                      {uploadState === "processing" && "Processing document..."}
                      {uploadState === "complete" && "Document uploaded successfully!"}
                      {uploadState === "error" && "Error uploading document"}
                    </span>
                  </div>
                  
                  <Progress value={uploadProgress} className="h-2" />
                  
                  {(uploadState === "processing" || uploadState === "complete") && (
                    <p className="text-sm text-muted-foreground">
                      AI is analyzing your document. This may take a few moments.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="library" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Document Library</CardTitle>
              <CardDescription>
                View and analyze your uploaded medical documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map(doc => (
                  <div 
                    key={doc.id} 
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border",
                      selectedDocument === doc.id ? "bg-muted border-primary" : "hover:bg-muted/50 cursor-pointer"
                    )}
                    onClick={() => handleDocumentSelect(doc.id)}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">Uploaded: {doc.date}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      handleDocumentSelect(doc.id);
                    }}>
                      Analyze
                    </Button>
                  </div>
                ))}
                
                {documents.length === 0 && (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">No documents uploaded yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle>Chat with Document AI</CardTitle>
              <CardDescription>
                Ask questions about the selected document and get AI-powered insights
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                {chatMessages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div 
                      className={cn(
                        "rounded-lg px-4 py-2 max-w-[80%]",
                        msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleMessageSubmit} className="flex gap-2 mt-4">
                <Input 
                  placeholder="Ask a question about the document..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
