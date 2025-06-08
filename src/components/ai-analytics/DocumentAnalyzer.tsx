
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Send, FileText, Upload, FileUp, Search, Clock, CheckCircle, AlertCircle, Brain, Database, User, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { dataStore } from "@/lib/dataStore";
import { Patient } from "@/types/patient";

type ChatMode = "document" | "medical" | "patient";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function DocumentAnalyzer() {
  const [activeTab, setActiveTab] = useState("upload");
  const [chatMode, setChatMode] = useState<ChatMode>("document");
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "processing" | "complete" | "error">("idle");
  const [documents, setDocuments] = useState<Array<{id: string, name: string, date: string, type: string, status: string}>>([
    { id: "doc1", name: "Patient History Report.pdf", date: "2023-05-12", type: "PDF", status: "analyzed" },
    { id: "doc2", name: "Lab Results Q1 2023.pdf", date: "2023-04-03", type: "PDF", status: "analyzed" },
  ]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hello! I can help you in different ways. Choose a mode above to get started.", timestamp: new Date() }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const patients = dataStore.getPatients();
  
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
              setActiveTab("chat");
              setChatMode("document");
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
    setChatMode("document");
  };

  const handleChatModeChange = (mode: ChatMode) => {
    setChatMode(mode);
    
    // Reset chat messages based on mode
    let welcomeMessage = "";
    switch (mode) {
      case "document":
        welcomeMessage = "I can help analyze your uploaded medical documents. Upload a document first or select one from the library.";
        break;
      case "medical":
        welcomeMessage = "I'm your general medical assistant. Ask me about medical conditions, treatments, drug interactions, or general medical questions.";
        break;
      case "patient":
        welcomeMessage = "I can analyze patient data and provide insights. Please select a patient from the dropdown to get started.";
        break;
    }
    
    setChatMessages([
      { role: "assistant", content: welcomeMessage, timestamp: new Date() }
    ]);
  };
  
  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const userMessage: ChatMessage = { 
      role: "user", 
      content: message, 
      timestamp: new Date() 
    };
    setChatMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const responseContent = generateAIResponse(message, chatMode, selectedPatient);
      setChatMessages(prev => [...prev, { 
        role: "assistant", 
        content: responseContent, 
        timestamp: new Date() 
      }]);
      setIsLoading(false);
    }, 1500);
  };
  
  const generateAIResponse = (query: string, mode: ChatMode, patientId: string) => {
    switch (mode) {
      case "document":
        return generateDocumentResponse(query);
      case "medical":
        return generateMedicalResponse(query);
      case "patient":
        return generatePatientResponse(query, patientId);
      default:
        return "I'm here to help! Please select a chat mode to get started.";
    }
  };

  const generateDocumentResponse = (query: string) => {
    const responses = [
      "Based on the uploaded documents, the patient shows normal blood glucose levels but elevated cholesterol. I recommend dietary changes and a follow-up test in 3 months.",
      "The medical literature indicates this treatment has a 78% efficacy rate for patients with similar profiles. Side effects are minimal in most cases.",
      "According to the uploaded research, this approach has been tested in three clinical trials with positive outcomes for patients in the same demographic.",
      "The lab results show improvement in liver function tests compared to previous results. All values are now within normal ranges.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateMedicalResponse = (query: string) => {
    if (query.toLowerCase().includes("diabetes")) {
      return "Type 2 diabetes management typically involves lifestyle modifications (diet and exercise), blood glucose monitoring, and medications like metformin as first-line therapy. Regular HbA1c monitoring every 3-6 months is recommended to assess long-term glucose control.";
    }
    if (query.toLowerCase().includes("hypertension") || query.toLowerCase().includes("blood pressure")) {
      return "Hypertension management follows a stepped approach: lifestyle modifications first (low-sodium diet, exercise, weight management), then ACE inhibitors or ARBs as first-line therapy, with the addition of calcium channel blockers or thiazide diuretics as needed. Target BP is typically <130/80 mmHg.";
    }
    if (query.toLowerCase().includes("interaction")) {
      return "Drug interactions can be pharmacokinetic (affecting absorption, distribution, metabolism, or excretion) or pharmacodynamic (affecting drug action). Always check for interactions when prescribing, especially with warfarin, digoxin, and medications metabolized by CYP450 enzymes.";
    }
    return "I can help with medical questions about conditions, treatments, drug interactions, and clinical guidelines. Please be more specific about what you'd like to know.";
  };

  const generatePatientResponse = (query: string, patientId: string) => {
    if (!patientId) {
      return "Please select a patient first to analyze their data and provide insights.";
    }
    
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
      return "Patient not found. Please select a valid patient.";
    }

    const patientName = patient.name || `${patient.firstName} ${patient.lastName}`;
    
    if (query.toLowerCase().includes("risk") || query.toLowerCase().includes("assessment")) {
      return `Based on ${patientName}'s profile (Age: ${patient.age}, Medical History: ${patient.medicalHistory?.join(", ") || "None documented"}), the primary risk factors include age-related cardiovascular risks. Recommend regular monitoring and preventive care.`;
    }
    if (query.toLowerCase().includes("medication") || query.toLowerCase().includes("drug")) {
      return `${patientName}'s medication review shows no current contraindications based on age (${patient.age}) and documented allergies. Regular medication reconciliation is recommended.`;
    }
    return `${patientName} (${patient.age} years old, ${patient.gender}) - I can analyze various aspects of this patient's data including risk assessment, medication review, or care recommendations. What specific insights would you like?`;
  };

  const getChatModeIcon = (mode: ChatMode) => {
    switch (mode) {
      case "document": return <FileText className="h-4 w-4" />;
      case "medical": return <Brain className="h-4 w-4" />;
      case "patient": return <Database className="h-4 w-4" />;
    }
  };

  const getChatModeDescription = (mode: ChatMode) => {
    switch (mode) {
      case "document": return "Chat about uploaded documents";
      case "medical": return "General medical assistant";
      case "patient": return "Patient data analysis";
    }
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
            <MessageSquare className="h-4 w-4 mr-2" />
            AI Assistant
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {(["document", "medical", "patient"] as ChatMode[]).map((mode) => (
              <Card 
                key={mode} 
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  chatMode === mode ? "ring-2 ring-primary bg-primary/5" : ""
                )}
                onClick={() => handleChatModeChange(mode)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    {getChatModeIcon(mode)}
                    <h3 className="font-medium capitalize">{mode} Assistant</h3>
                    <p className="text-xs text-muted-foreground">
                      {getChatModeDescription(mode)}
                    </p>
                    {chatMode === mode && (
                      <Badge variant="default" className="mt-1">Active</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {chatMode === "patient" && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Patient</label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a patient for analysis" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name || `${patient.firstName} ${patient.lastName}`} - Age {patient.age}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                {getChatModeIcon(chatMode)}
                {chatMode === "document" && "Document Analysis Chat"}
                {chatMode === "medical" && "Medical Assistant Chat"}
                {chatMode === "patient" && "Patient Data Analysis Chat"}
              </CardTitle>
              <CardDescription>
                {chatMode === "document" && "Ask questions about uploaded documents and get AI insights"}
                {chatMode === "medical" && "Get general medical information and guidance"}
                {chatMode === "patient" && "Analyze patient data and get personalized insights"}
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
                        "rounded-lg px-4 py-3 max-w-[80%]",
                        msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-lg px-4 py-3 bg-muted max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 animate-bounce bg-primary rounded-full"></div>
                        <div className="h-2 w-2 animate-bounce bg-primary rounded-full" style={{animationDelay: '0.2s'}}></div>
                        <div className="h-2 w-2 animate-bounce bg-primary rounded-full" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleMessageSubmit} className="flex gap-2 mt-4">
                <Input 
                  placeholder={
                    chatMode === "document" ? "Ask about the document..." :
                    chatMode === "medical" ? "Ask a medical question..." :
                    "Ask about the selected patient..."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                  disabled={isLoading || (chatMode === "patient" && !selectedPatient)}
                />
                <Button 
                  type="submit" 
                  disabled={!message.trim() || isLoading || (chatMode === "patient" && !selectedPatient)}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              
              {chatMode === "patient" && !selectedPatient && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Please select a patient above to start the conversation
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
