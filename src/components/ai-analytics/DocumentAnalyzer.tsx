
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, MessageSquare, File } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface UploadedDocument {
  id: string;
  name: string;
  uploadDate: Date;
  summary?: string;
  size: string;
  type: string;
}

export function DocumentAnalyzer() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedDocument, setSelectedDocument] = useState<UploadedDocument | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ content: string; role: "user" | "assistant" }>>([]);
  const [chatInput, setChatInput] = useState("");
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newDocument: UploadedDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        uploadDate: new Date(),
        size: formatFileSize(file.size),
        type: file.type,
      };
      
      setDocuments([...documents, newDocument]);
      setSelectedDocument(newDocument);
      setActiveTab("analyze");
      
      toast({
        title: "Document uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };
  
  const generateSummary = async () => {
    if (!selectedDocument) return;
    
    setIsProcessing(true);
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    // Mock summary based on document name
    let summary = "";
    if (selectedDocument.name.toLowerCase().includes("lab")) {
      summary = "This laboratory report indicates normal blood count values with slight elevation in cholesterol levels (220 mg/dL). Liver function tests are within normal ranges. Blood pressure readings show consistent values of 130/85 mmHg across multiple measurements. The document recommends follow-up in 6 months and suggests dietary modifications to address cholesterol levels.";
    } else if (selectedDocument.name.toLowerCase().includes("mri") || selectedDocument.name.toLowerCase().includes("scan")) {
      summary = "The MRI scan shows no evidence of acute infarction or hemorrhage. There are mild degenerative changes in the cervical spine with no significant neural foraminal narrowing or spinal canal stenosis. Small disc bulges are noted at C5-C6 and C6-C7 levels without cord compression. Recommendation is for physical therapy and follow-up in 12 months if symptoms persist.";
    } else if (selectedDocument.name.toLowerCase().includes("report") || selectedDocument.name.toLowerCase().includes("consult")) {
      summary = "This consultation report details a patient with persistent headaches over a 3-month period. Physical examination revealed normal neurological findings. Current medication regimen includes propranolol 20mg daily with partial symptom relief. The consultant suggests increasing dose to 40mg daily and adding a migraine diary to track potential triggers. Recommend follow-up in 6 weeks to reassess efficacy.";
    } else {
      summary = "This medical document contains patient health information regarding treatment history and current status. Key findings include stable vital signs, adherence to prescribed medication regimen, and improvement in primary symptoms. No adverse reactions were reported. The document recommends continuing current treatment plan with follow-up assessment in 3 months.";
    }
    
    setDocuments(docs => docs.map(doc => 
      doc.id === selectedDocument.id ? { ...doc, summary } : doc
    ));
    
    setSelectedDocument({ ...selectedDocument, summary });
    setIsProcessing(false);
    
    // Initialize chat with document context
    setChatMessages([{
      role: "assistant",
      content: "I've analyzed this document. You can ask me specific questions about its contents."
    }]);
    
    toast({
      title: "Summary generated",
      description: "The document has been analyzed successfully.",
    });
  };
  
  const sendDocumentQuery = async () => {
    if (!chatInput.trim() || !selectedDocument) return;
    
    // Add user message
    setChatMessages([...chatMessages, { role: "user", content: chatInput }]);
    const query = chatInput;
    setChatInput("");
    
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Generate mock response based on query
    let response = "";
    if (query.toLowerCase().includes("diagnosis") || query.toLowerCase().includes("condition")) {
      response = "Based on the document, the primary diagnosis is hypertension (ICD-10: I10) with secondary hyperlipidemia (ICD-10: E78.5). The document indicates stable control of both conditions with current medication regimen.";
    } else if (query.toLowerCase().includes("treatment") || query.toLowerCase().includes("medication")) {
      response = "The document mentions the following medications: 1) Lisinopril 10mg daily for hypertension, 2) Atorvastatin 20mg daily for hyperlipidemia. There's a note about considering dose adjustment for Lisinopril if blood pressure remains above 140/90 mmHg on two consecutive visits.";
    } else if (query.toLowerCase().includes("recommendation") || query.toLowerCase().includes("follow")) {
      response = "The key recommendations in this document are: 1) Continue current medications, 2) Follow-up appointment in 3 months, 3) Complete lipid panel and metabolic profile before next visit, 4) Daily blood pressure monitoring at home, 5) Dietary consultation to address cholesterol levels.";
    } else {
      response = "The document doesn't specifically address this question. However, it does contain information about the patient's vital signs (BP: 130/85, HR: 72), current medications, and follow-up plan. Would you like me to provide a general overview of these aspects?";
    }
    
    setChatMessages(prev => [...prev, { role: "assistant", content: response }]);
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex flex-col h-full"
      >
        <div className="border-b">
          <TabsList className="w-full justify-start p-0 bg-transparent h-auto">
            <TabsTrigger 
              value="upload" 
              className="data-[state=active]:bg-background rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger 
              value="analyze" 
              className="data-[state=active]:bg-background rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary"
              disabled={!selectedDocument}
            >
              <FileText className="h-4 w-4 mr-2" />
              Analyze
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="data-[state=active]:bg-background rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary"
              disabled={!selectedDocument?.summary}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="upload" className="flex-1 p-4 m-0">
          <div className="flex flex-col h-full">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Upload Medical Documents</h3>
              <p className="text-muted-foreground">
                Upload PDFs, images, or text files to get AI-generated insights and summaries
              </p>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-md">
                <label 
                  htmlFor="document-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, DOCX, JPG, PNG (MAX. 10MB)
                    </p>
                  </div>
                  <input 
                    id="document-upload" 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                    onChange={handleFileChange} 
                  />
                </label>
              </div>
            </div>
            
            {documents.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Recent uploads</h4>
                <div className="grid gap-2">
                  {documents.map(doc => (
                    <div 
                      key={doc.id}
                      className={cn(
                        "flex items-center p-2 rounded-md border cursor-pointer hover:bg-muted/50 transition-colors",
                        selectedDocument?.id === doc.id && "bg-muted/50 border-primary"
                      )}
                      onClick={() => {
                        setSelectedDocument(doc);
                        setActiveTab("analyze");
                      }}
                    >
                      <File className="h-5 w-5 text-muted-foreground mr-3" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.size} • {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                      {doc.summary && (
                        <div className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Analyzed
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="analyze" className="flex-1 p-4 m-0">
          {selectedDocument && (
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <h3 className="text-lg font-medium">{selectedDocument.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Uploaded on {selectedDocument.uploadDate.toLocaleDateString()}
                </p>
              </div>
              
              {!selectedDocument.summary ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="text-center mb-6">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="text-lg font-medium mb-1">Generate Document Summary</h4>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Our AI will analyze this document and extract key information, providing a concise summary.
                    </p>
                  </div>
                  
                  <Button 
                    onClick={generateSummary}
                    disabled={isProcessing}
                    className="min-w-[200px]"
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      <>Analyze Document</>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="bg-muted/30 rounded-lg p-4 border mb-4">
                    <h4 className="text-sm font-medium mb-2">AI Summary</h4>
                    <p className="text-sm">{selectedDocument.summary}</p>
                  </div>
                  
                  <div className="mt-auto flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab("upload")}
                    >
                      Upload Another
                    </Button>
                    <Button onClick={() => setActiveTab("chat")}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat with Document
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="chat" className="flex-1 p-0 m-0 flex flex-col">
          {selectedDocument?.summary && (
            <>
              <div className="p-4 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <h4 className="text-sm font-medium truncate">{selectedDocument.name}</h4>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveTab("analyze")}
                  >
                    View Summary
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={cn(
                        "max-w-[80%] rounded-lg p-3",
                        msg.role === "user" 
                          ? "bg-primary text-primary-foreground ml-auto" 
                          : "bg-muted mr-auto"
                      )}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  ))}
                  
                  {chatMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <MessageSquare className="h-10 w-10 text-muted-foreground mb-4" />
                      <h4 className="text-lg font-medium mb-1">Chat with this Document</h4>
                      <p className="text-sm text-muted-foreground text-center max-w-sm">
                        Ask specific questions about this document and get AI-powered insights based on its content.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t mt-auto">
                <div className="flex items-center gap-2">
                  <Textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask a question about this document..."
                    className="flex-1 min-h-[60px]"
                  />
                  <Button 
                    onClick={sendDocumentQuery} 
                    disabled={!chatInput.trim()}
                    size="icon"
                    className="h-[60px] w-[60px]"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Try asking about diagnoses, treatments, or recommendations mentioned in the document
                </p>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
