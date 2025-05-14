
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export function HealthAssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: "Hello, Dr. Davis. I'm your medical AI assistant. How can I help you today? You can ask me about patient data, medical conditions, or treatment options.",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: input,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock AI response based on query content
    let responseContent = "";
    
    if (input.toLowerCase().includes("diabetes") || input.toLowerCase().includes("blood sugar")) {
      responseContent = "Based on the records of patients with diabetes in your practice, the average A1C level has decreased by 0.8% over the past 6 months. The most effective treatment plans appear to be those combining metformin with dietary changes and regular exercise monitoring. Would you like me to identify patients who might benefit from this combined approach?";
    } else if (input.toLowerCase().includes("hypertension") || input.toLowerCase().includes("blood pressure")) {
      responseContent = "Your hypertensive patient population shows a 12% improvement in blood pressure control when medication adherence is tracked through the patient portal. I've detected 7 patients with consistently high readings despite medication. Would you like me to prepare a list for follow-up consultations?";
    } else if (input.toLowerCase().includes("jane") || input.toLowerCase().includes("doe")) {
      responseContent = "Jane Doe's latest lab results show normal kidney function but slightly elevated liver enzymes (ALT: 52, AST: 48). Her medication list includes a statin which may be contributing to these elevated values. The pattern suggests monitoring liver function over the next 3 months would be advisable.";
    } else if (input.toLowerCase().includes("chart") || input.toLowerCase().includes("trend")) {
      responseContent = "I can create visualization charts for any health metrics you'd like to track. This could include treatment efficacy across patient groups, medication response patterns, or health outcome trends. What specific data would you like to visualize?";
    } else if (input.toLowerCase().includes("research") || input.toLowerCase().includes("study")) {
      responseContent = "Based on recent medical literature, there are 3 clinical trials relevant to your patient population: a COPD management study, a cardiovascular risk assessment tool validation, and a diabetes prevention program. Would you like more details about any of these studies?";
    } else {
      responseContent = "I've analyzed the available medical data and can provide insights on patient trends, treatment efficacy, or specific patient cases. You can ask about conditions like hypertension or diabetes, request analysis of specific patient records like Jane Doe's, or ask for data visualizations and research updates.";
    }
    
    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      content: responseContent,
      role: "assistant",
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 p-3 border-b bg-muted/50">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Health Assistant</h3>
      </div>
      
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
              <p className="text-sm">{message.content}</p>
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
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about patient data, conditions, or treatment options..."
            className="flex-1 min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button 
            onClick={sendMessage} 
            size="icon"
            className="h-[60px] w-[60px]"
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          For complex queries, try to be specific about patient names, conditions, or the type of analysis you need
        </p>
      </div>
    </div>
  );
}
