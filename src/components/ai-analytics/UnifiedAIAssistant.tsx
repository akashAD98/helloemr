
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Upload, FileText, Brain, BarChart3, X, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  mode: "chat" | "summarize" | "insights";
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
}

export function UnifiedAIAssistant() {
  const [activeMode, setActiveMode] = useState<"chat" | "summarize" | "insights">("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI medical assistant. I can help with general medical questions, document analysis, or provide health insights. Select a mode above to get started.",
      role: "assistant",
      timestamp: new Date(),
      mode: "chat"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const modeConfig = {
    chat: {
      icon: MessageSquare,
      label: "Chat",
      color: "bg-blue-500",
      description: "General medical Q&A",
      placeholder: "Ask any medical question..."
    },
    summarize: {
      icon: FileText,
      label: "Summarize",
      color: "bg-green-500", 
      description: "Instant document summary",
      placeholder: "Upload a document or paste text to summarize..."
    },
    insights: {
      icon: BarChart3,
      label: "Insights",
      color: "bg-purple-500",
      description: "Risk insights & analytics",
      placeholder: "Ask for risk analysis, trends, or health insights..."
    }
  };

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
      const fileId = `file-${Date.now()}-${Math.random()}`;
      const fileUrl = URL.createObjectURL(file);
      
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        type: file.type,
        url: fileUrl
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
      
      // Auto-switch to summarize mode if uploading a document
      if (activeMode === "chat") {
        setActiveMode("summarize");
      }
    });

    toast({
      title: "File uploaded successfully",
      description: "Document is ready for analysis"
    });
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const sendMessage = async () => {
    if (!input.trim() && uploadedFiles.length === 0) return;
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: input || "Analyzing uploaded documents...",
      role: "user",
      timestamp: new Date(),
      mode: activeMode
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let responseContent = "";
    
    if (activeMode === "chat") {
      if (input.toLowerCase().includes("medication") || input.toLowerCase().includes("drug")) {
        responseContent = "For medication information, I can help you understand drug interactions, dosages, and contraindications. Please provide specific medication names for detailed analysis.";
      } else if (input.toLowerCase().includes("diagnosis")) {
        responseContent = "I can assist with differential diagnosis considerations based on symptoms and clinical findings. Please describe the patient's presentation for a thorough analysis.";
      } else {
        responseContent = "I'm here to help with your medical questions. You can ask about treatments, conditions, medications, or clinical guidelines. How can I assist you today?";
      }
    } else if (activeMode === "summarize") {
      if (uploadedFiles.length > 0) {
        responseContent = `I've analyzed the uploaded document(s). Here's a summary:\n\n• Key findings: Normal blood work with slightly elevated cholesterol\n• Recommendations: Dietary modifications and follow-up in 3 months\n• Action items: Schedule nutritionist consultation\n• Risk factors: Family history of cardiovascular disease`;
      } else {
        responseContent = "Please upload a document or paste text content for me to summarize. I can analyze lab reports, clinical notes, research papers, and other medical documents.";
      }
    } else if (activeMode === "insights") {
      responseContent = "Based on your patient population data:\n\n📊 Risk Analysis:\n• 15% of patients show elevated cardiovascular risk\n• Diabetes management has improved 12% this quarter\n• Medication adherence rate: 87%\n\n🔍 Trending Patterns:\n• Increased hypertension cases in 45-65 age group\n• Seasonal flu vaccination rate up 8%";
    }
    
    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      content: responseContent,
      role: "assistant",
      timestamp: new Date(),
      mode: activeMode
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const currentConfig = modeConfig[activeMode];

  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Assistant
        </CardTitle>
        
        {/* Mode Selection Tabs */}
        <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {Object.entries(modeConfig).map(([mode, config]) => {
              const Icon = config.icon;
              return (
                <TabsTrigger 
                  key={mode} 
                  value={mode}
                  className="flex items-center gap-2 text-sm"
                >
                  <Icon className="h-4 w-4" />
                  {config.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Mode Description */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {currentConfig.description}
          </Badge>
        </div>

        {/* File Upload Area */}
        <div 
          className={cn(
            "border-2 border-dashed rounded-lg p-4 transition-colors",
            dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            "hover:border-primary/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Upload className="h-4 w-4" />
              <span>Drag & drop files or</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-auto p-0 text-primary hover:text-primary/80"
              >
                browse to upload
              </Button>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))}
          />
        </div>

        {/* Uploaded Files Carousel */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Uploaded Documents:</span>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {uploadedFiles.map((file) => (
                <div 
                  key={file.id}
                  className="flex items-center gap-2 bg-muted/50 rounded-lg p-2 min-w-0 flex-shrink-0"
                >
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs truncate max-w-[120px]">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0.5"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex max-w-[85%] rounded-lg p-4",
                message.role === "user" 
                  ? "bg-primary text-primary-foreground ml-auto" 
                  : "bg-muted mr-auto"
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.mode !== "chat" && (
                    <Badge variant="outline" className="text-xs">
                      {modeConfig[message.mode].label}
                    </Badge>
                  )}
                </div>
                <p className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex max-w-[85%] rounded-lg p-4 bg-muted mr-auto">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 animate-bounce bg-primary rounded-full"></div>
                <div className="h-2 w-2 animate-bounce bg-primary rounded-full" style={{animationDelay: '0.2s'}}></div>
                <div className="h-2 w-2 animate-bounce bg-primary rounded-full" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex items-end space-x-2">
            <div className="flex-1 space-y-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={currentConfig.placeholder}
                className="min-h-[60px] resize-none"
                disabled={isLoading}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Press Enter to send, Shift+Enter for new line</span>
                {uploadedFiles.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Paperclip className="h-3 w-3" />
                    {uploadedFiles.length} file(s) attached
                  </span>
                )}
              </div>
            </div>
            <Button 
              onClick={sendMessage} 
              size="icon"
              className={cn("h-[60px] w-[60px]", currentConfig.color)}
              disabled={(!input.trim() && uploadedFiles.length === 0) || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
