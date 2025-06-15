
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileText, BarChart3, ArrowRight, Bot, Upload, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AIMode {
  id: "healthcare-chat" | "document-summary" | "document-qa";
  title: string;
  description: string;
  icon: any;
  color: string;
  features: string[];
}

export function UnifiedAIAssistant() {
  const navigate = useNavigate();

  const aiModes: AIMode[] = [
    {
      id: "healthcare-chat",
      title: "Healthcare Chatbot",
      description: "General medical consultation and health advice",
      icon: MessageSquare,
      color: "bg-blue-500",
      features: [
        "Medical symptom analysis",
        "Treatment recommendations", 
        "Drug interactions",
        "Clinical guidelines"
      ]
    },
    {
      id: "document-summary",
      title: "Medical Document Summarizer",
      description: "Generate summaries from uploaded medical documents",
      icon: FileText,
      color: "bg-green-500",
      features: [
        "Discharge summaries",
        "Clinical notes",
        "Referral summaries",
        "Lab report analysis"
      ]
    },
    {
      id: "document-qa",
      title: "Document Q&A Assistant",
      description: "Ask questions about your uploaded medical documents",
      icon: HelpCircle,
      color: "bg-purple-500",
      features: [
        "Document-based Q&A",
        "Medical record analysis",
        "Patient history insights",
        "Treatment plan queries"
      ]
    }
  ];

  const handleModeSelect = (mode: AIMode) => {
    // Navigate to the specific AI assistant route
    navigate(`/ai-analytics/${mode.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          AI Medical Assistant
        </h2>
        <p className="text-muted-foreground">
          Choose your AI assistant type to get started with medical analysis and consultation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {aiModes.map((mode) => {
          const Icon = mode.icon;
          return (
            <Card 
              key={mode.id} 
              className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleModeSelect(mode)}
            >
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg ${mode.color} flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{mode.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{mode.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium">Key Features:</span>
                  <ul className="space-y-1">
                    {mode.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  className="w-full group-hover:bg-primary/90 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModeSelect(mode);
                  }}
                >
                  Start Session
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-muted/30 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Getting Started
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <Badge variant="secondary">Healthcare Chat</Badge>
            <p className="text-muted-foreground">
              Ask general medical questions, get symptom analysis, and receive clinical guidance.
            </p>
          </div>
          <div className="space-y-2">
            <Badge variant="secondary">Document Summary</Badge>
            <p className="text-muted-foreground">
              Upload medical PDFs to generate professional summaries and clinical notes.
            </p>
          </div>
          <div className="space-y-2">
            <Badge variant="secondary">Document Q&A</Badge>
            <p className="text-muted-foreground">
              Upload documents and ask specific questions about patient records and treatments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
