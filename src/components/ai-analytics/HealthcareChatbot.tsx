
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Bot, User, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export function HealthcareChatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI healthcare assistant. I can help you with medical questions, symptom analysis, treatment options, and clinical guidance. What would you like to know today?",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: input,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate contextual medical responses
    let responseContent = "";
    const inputLower = input.toLowerCase();
    
    if (inputLower.includes("headache") || inputLower.includes("head pain")) {
      responseContent = "Headaches can have various causes including tension, dehydration, lack of sleep, or underlying conditions. For frequent or severe headaches, I recommend:\n\n• Stay hydrated (8-10 glasses of water daily)\n• Maintain regular sleep schedule\n• Consider stress management techniques\n• Over-the-counter pain relievers as directed\n\nSeek immediate medical attention if you experience sudden severe headache, fever, vision changes, or neck stiffness.";
    } else if (inputLower.includes("fever") || inputLower.includes("temperature")) {
      responseContent = "Fever is your body's natural response to infection. Management approaches:\n\n• Rest and stay hydrated\n• Acetaminophen or ibuprofen as directed\n• Cool compresses for comfort\n• Monitor temperature regularly\n\nSeek medical care if:\n• Temperature >103°F (39.4°C)\n• Fever persists >3 days\n• Difficulty breathing or chest pain\n• Severe dehydration signs";
    } else if (inputLower.includes("medication") || inputLower.includes("drug interaction")) {
      responseContent = "I can provide general medication information, but always consult your pharmacist or physician for specific drug interactions. Important considerations:\n\n• Always inform healthcare providers of all medications\n• Include over-the-counter drugs and supplements\n• Check with pharmacist before starting new medications\n• Never stop prescribed medications without consulting your doctor\n\nWhat specific medication information are you looking for?";
    } else if (inputLower.includes("chest pain") || inputLower.includes("heart")) {
      responseContent = "⚠️ **IMPORTANT**: Chest pain can be serious. Seek immediate emergency care if experiencing:\n\n• Crushing chest pressure\n• Pain radiating to arm, jaw, or back\n• Shortness of breath\n• Nausea with chest discomfort\n• Sudden severe chest pain\n\nCall 911 or emergency services immediately for these symptoms. Other chest pain causes may include muscle strain, acid reflux, or anxiety, but evaluation is important.";
    } else {
      responseContent = "Thank you for your question. I'm here to provide general medical information and guidance. For the most accurate assessment of your specific situation, I recommend:\n\n• Consulting with your primary care physician\n• Providing complete medical history\n• Discussing any concerning symptoms\n\nIs there a specific medical topic or symptom you'd like me to help explain? I can provide information about conditions, treatments, or when to seek medical care.";
    }
    
    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      content: responseContent,
      role: "assistant",
      timestamp: new Date()
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
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <CardTitle>Healthcare AI Assistant</CardTitle>
              </div>
            </div>
            <Badge variant="secondary">Medical Chat</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
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
                : "bg-blue-500 text-white"
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
            <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-lg p-4 bg-white border shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 animate-bounce bg-blue-500 rounded-full"></div>
                <div className="h-2 w-2 animate-bounce bg-blue-500 rounded-full" style={{animationDelay: '0.2s'}}></div>
                <div className="h-2 w-2 animate-bounce bg-blue-500 rounded-full" style={{animationDelay: '0.4s'}}></div>
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
                placeholder="Ask about symptoms, medications, treatments, or medical advice..."
                className="min-h-[60px] resize-none"
                disabled={isLoading}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span>Medical AI Assistant • Not a substitute for professional care</span>
              </div>
            </div>
            <Button 
              onClick={sendMessage} 
              size="icon"
              className="h-[60px] w-[60px] bg-blue-500 hover:bg-blue-600"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
