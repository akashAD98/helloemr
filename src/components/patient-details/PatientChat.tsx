
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface PatientChatProps {
  patientId: string;
}

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export function PatientChat({ patientId }: PatientChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: "Hello! I'm your medical assistant. How can I help you with this patient's records today?",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock response based on user input
    let responseContent = "";
    
    if (input.toLowerCase().includes("medication") || input.toLowerCase().includes("drug")) {
      responseContent = "This patient is currently taking Lisinopril 10mg daily for hypertension and Atorvastatin 20mg daily for high cholesterol. Both medications were last prescribed on their April 12th visit.";
    } else if (input.toLowerCase().includes("allergy")) {
      responseContent = "The patient has recorded allergies to penicillin (severe rash) and peanuts (mild swelling). No other allergies are documented.";
    } else if (input.toLowerCase().includes("lab") || input.toLowerCase().includes("test")) {
      responseContent = "Recent lab results from April 12th show: Cholesterol: 220 mg/dL (slightly elevated), Blood glucose: 92 mg/dL (normal range), White blood cell count: 7.5 K/uL (normal range).";
    } else if (input.toLowerCase().includes("history") || input.toLowerCase().includes("condition")) {
      responseContent = "The patient has a history of hypertension (diagnosed 2019) and hyperlipidemia (diagnosed 2020). They have no history of diabetes, cardiac disease, or other major systemic issues.";
    } else if (input.toLowerCase().includes("visit") || input.toLowerCase().includes("appointment")) {
      responseContent = "The patient's last visit was on April 12, 2024 for an annual check-up. Their next appointment is scheduled for May 15, 2024 at 10:30 AM with Dr. Sharma.";
    } else {
      responseContent = "I've analyzed the patient records but need more specific information to help you. You can ask about medications, allergies, lab results, medical history, or recent visits.";
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
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex max-w-[80%] rounded-lg p-3",
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
          <div className="flex max-w-[80%] rounded-lg p-3 bg-muted mr-auto">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 animate-bounce bg-primary rounded-full"></div>
              <div className="h-2 w-2 animate-bounce bg-primary rounded-full animation-delay-200"></div>
              <div className="h-2 w-2 animate-bounce bg-primary rounded-full animation-delay-400"></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this patient's records..."
            className="flex-1 min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button 
            onClick={sendMessage} 
            size="icon"
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          You can ask about medications, allergies, lab results, medical history, or visits
        </p>
      </div>
    </div>
  );
}
