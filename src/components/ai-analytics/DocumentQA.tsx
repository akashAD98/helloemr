
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Send, Bot, User, ArrowLeft, Upload, FileText, X, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  attachedFiles?: string[];
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
}

export function DocumentQA() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: "Hello! I'm your document Q&A assistant. Upload medical documents and I'll answer any questions you have about them. I can analyze patient records, treatment plans, lab results, and more.",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
          url: fileUrl
        };
        
        setUploadedFiles(prev => [...prev, newFile]);
        
        toast({
          title: "Document uploaded",
          description: `${file.name} is now available for Q&A`
        });
        
        // Add system message about file upload
        const systemMessage: ChatMessage = {
          id: `system-${Date.now()}`,
          content: `📄 Document "${file.name}" has been uploaded and analyzed. You can now ask questions about its contents.`,
          role: "assistant",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, systemMessage]);
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
    const file = uploadedFiles.find(f => f.id === fileId);
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    
    if (file) {
      toast({
        title: "Document removed",
        description: `${file.name} has been removed from the session`
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: input,
      role: "user",
      timestamp: new Date(),
      attachedFiles: uploadedFiles.map(f => f.name)
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate contextual responses based on uploaded documents
    let responseContent = generateDocumentResponse(input, uploadedFiles);
    
    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      content: responseContent,
      role: "assistant",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const generateDocumentResponse = (question: string, files: UploadedFile[]): string => {
    const questionLower = question.toLowerCase();
    
    if (files.length === 0) {
      return "I don't see any documents uploaded yet. Please upload a medical document first, and then I'll be able to answer questions about its contents.";
    }
    
    // Simulate document-based responses
    if (questionLower.includes("medication") || questionLower.includes("drug") || questionLower.includes("prescription")) {
      return `Based on the uploaded document(s), I can see the following medication information:\n\n**Current Medications:**\n• Lisinopril 10mg daily - for hypertension\n• Atorvastatin 20mg daily - for cholesterol management\n• Metformin 500mg twice daily - for diabetes\n\n**Recent Changes:**\n• Increased Lisinopril from 5mg to 10mg on last visit\n• Added Atorvastatin due to elevated cholesterol levels\n\n**Notes:**\n• Patient reports good medication compliance\n• No reported side effects\n• Next medication review scheduled in 3 months`;
    }
    
    if (questionLower.includes("lab") || questionLower.includes("test") || questionLower.includes("result")) {
      return `From the lab results in your uploaded document:\n\n**Key Laboratory Findings:**\n• **Glucose:** 156 mg/dL (elevated) - target <140 mg/dL\n• **HbA1c:** 7.2% (elevated) - target <7.0%\n• **Cholesterol:** 245 mg/dL (high) - target <200 mg/dL\n• **Creatinine:** 1.1 mg/dL (normal)\n• **Blood Pressure:** 145/92 mmHg (elevated)\n\n**Clinical Significance:**\n• Diabetes control needs improvement\n• Cardiovascular risk factors present\n• Kidney function is normal\n\n**Recommendations noted:**\n• Adjust diabetes medications\n• Initiate statin therapy\n• Lifestyle modifications`;
    }
    
    if (questionLower.includes("diagnosis") || questionLower.includes("condition") || questionLower.includes("problem")) {
      return `Based on the medical records, here are the key diagnoses and conditions:\n\n**Primary Diagnoses:**\n• Type 2 Diabetes Mellitus (uncontrolled)\n• Essential Hypertension\n• Hyperlipidemia\n\n**Secondary Conditions:**\n• Diabetic retinopathy (mild)\n• Peripheral neuropathy\n\n**Risk Factors:**\n• Family history of cardiovascular disease\n• Sedentary lifestyle\n• Obesity (BMI 32.4)\n\n**Current Status:**\n• Requires medication adjustment\n• Needs lifestyle intervention\n• Regular monitoring recommended`;
    }
    
    if (questionLower.includes("treatment") || questionLower.includes("plan") || questionLower.includes("therapy")) {
      return `The treatment plan outlined in your documents includes:\n\n**Immediate Actions:**\n• Increase Metformin to 1000mg twice daily\n• Start Atorvastatin 20mg daily\n• Blood pressure monitoring at home\n\n**Lifestyle Interventions:**\n• Diabetes education referral\n• Nutritionist consultation\n• Exercise program (30 min, 5x/week)\n\n**Follow-up Schedule:**\n• 2 weeks: Blood pressure check\n• 6 weeks: Lab work (glucose, HbA1c)\n• 3 months: Comprehensive review\n\n**Monitoring Parameters:**\n• Daily glucose logs\n• Weekly weight checks\n• Blood pressure 3x/week`;
    }
    
    if (questionLower.includes("allergy") || questionLower.includes("allergies")) {
      return `According to the medical records:\n\n**Known Allergies:**\n• **Penicillin** - severe rash, documented 2019\n• **Sulfa drugs** - mild gastrointestinal upset\n\n**Drug Intolerances:**\n• **ACE inhibitors** - persistent dry cough\n• **Metformin** - initial GI upset (resolved with food)\n\n**Environmental Allergies:**\n• Seasonal allergies (spring/fall)\n• No food allergies documented\n\n**Important Notes:**\n• Always verify allergies before prescribing\n• Patient carries emergency information card\n• No history of anaphylaxis`;
    }
    
    // Default response for other questions
    return `I've analyzed your uploaded medical document(s) regarding your question about "${question}". Here's what I found:\n\n**Document Analysis:**\n• Successfully processed ${files.length} document(s)\n• Key information extracted and indexed\n• Clinical data points identified\n\n**Relevant Information:**\nBased on the content, I can see references to patient care protocols, treatment guidelines, and clinical observations. For more specific information, please ask about:\n\n• Specific medications or treatments\n• Lab results or diagnostic tests\n• Treatment plans or recommendations\n• Patient history or conditions\n• Follow-up instructions\n\nWhat specific aspect would you like me to focus on?`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
                <HelpCircle className="h-5 w-5 text-purple-500" />
                <CardTitle>Document Q&A Assistant</CardTitle>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {uploadedFiles.length} Document{uploadedFiles.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* File Upload Overlay */}
      {uploadedFiles.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div 
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 transition-colors text-center",
                  dragOver ? "border-purple-500 bg-purple-50" : "border-muted-foreground/25",
                  "hover:border-purple-500/50"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-lg font-medium">Upload Medical Documents</p>
                    <p className="text-sm text-muted-foreground">Drop PDF files here or click to browse</p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select Documents
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
        </div>
      )}

      {/* Chat Interface (shown when files are uploaded) */}
      {uploadedFiles.length > 0 && (
        <>
          {/* Uploaded Files Bar */}
          <div className="border-b bg-muted/30 p-3">
            <div className="flex items-center gap-3 overflow-x-auto">
              <span className="text-sm font-medium flex-shrink-0">Documents:</span>
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-2 bg-white rounded-lg px-3 py-1 border flex-shrink-0">
                  <FileText className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0"
              >
                <Upload className="h-4 w-4 mr-1" />
                Add More
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 max-w-4xl",
                  message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-purple-500 text-white"
                )}>
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                
                <div className={cn(
                  "rounded-lg p-4 max-w-[80%]",
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-white border shadow-sm"
                )}>
                  <div className="space-y-2">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    {message.attachedFiles && message.attachedFiles.length > 0 && (
                      <div className="flex items-center gap-1 text-xs opacity-70">
                        <Paperclip className="h-3 w-3" />
                        <span>{message.attachedFiles.length} document(s) referenced</span>
                      </div>
                    )}
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 max-w-4xl mr-auto">
                <div className="h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-lg p-4 bg-white border shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 animate-bounce bg-purple-500 rounded-full"></div>
                    <div className="h-2 w-2 animate-bounce bg-purple-500 rounded-full" style={{animationDelay: '0.2s'}}></div>
                    <div className="h-2 w-2 animate-bounce bg-purple-500 rounded-full" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <Card className="border-t rounded-none">
            <CardContent className="p-4">
              <div className="flex items-end space-x-3">
                <div className="flex-1 space-y-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask questions about your uploaded medical documents..."
                    className="min-h-[60px] resize-none"
                    disabled={isLoading}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Press Enter to send, Shift+Enter for new line</span>
                    <span className="flex items-center gap-1">
                      <Paperclip className="h-3 w-3" />
                      {uploadedFiles.length} document(s) loaded
                    </span>
                  </div>
                </div>
                <Button 
                  onClick={sendMessage} 
                  size="icon"
                  className="h-[60px] w-[60px] bg-purple-500 hover:bg-purple-600"
                  disabled={!input.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        accept=".pdf"
        onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))}
      />
    </div>
  );
}
