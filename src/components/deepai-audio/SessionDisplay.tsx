
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, FileText, Play, Clock, User, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SessionData {
  id: string;
  patientName: string;
  visitType: string;
  date: string;
  duration: string;
  generatedNote: string;
  transcript: string;
  summary: string;
  audioUrl?: string;
  template: string;
}

interface SessionDisplayProps {
  sessionData: SessionData;
  onPlayAudio?: () => void;
}

export function SessionDisplay({ sessionData, onPlayAudio }: SessionDisplayProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("generated");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} copied successfully`,
    });
  };

  const formatNoteContent = (content: string) => {
    const sections = content.split('\n\n');
    return sections.map((section, index) => {
      if (section.startsWith('Summary:') || section.startsWith('Subjective:') || 
          section.startsWith('Objective:') || section.startsWith('Assessment:') || 
          section.startsWith('Plan:')) {
        const [title, ...body] = section.split('\n');
        return (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-medical-700">{title}</h3>
            <div className="pl-4 border-l-2 border-medical-200">
              {body.map((line, lineIndex) => (
                <p key={lineIndex} className="mb-2">{line}</p>
              ))}
            </div>
          </div>
        );
      }
      return <p key={index} className="mb-4">{section}</p>;
    });
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Session Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FileText className="h-6 w-6 text-medical-600" />
                Session Results
              </h2>
              <p className="text-muted-foreground mt-1">
                Generated from audio recording session
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Session Complete
            </Badge>
          </div>

          {/* Session Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{sessionData.patientName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{sessionData.visitType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{sessionData.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{sessionData.template}</span>
            </div>
          </div>

          {/* Audio Player */}
          {sessionData.audioUrl && (
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <Button variant="outline" onClick={onPlayAudio}>
                <Play className="h-4 w-4 mr-2" />
                Play Recording
              </Button>
              <span className="text-sm text-muted-foreground">
                Original audio recording • {sessionData.duration}
              </span>
            </div>
          )}

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generated" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Generated Note
              </TabsTrigger>
              <TabsTrigger value="transcript" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Transcript
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generated" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Generated Clinical Note</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(sessionData.generatedNote, "Generated note")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>

                <div className="prose prose-sm max-w-none bg-white border rounded-lg p-6">
                  {formatNoteContent(sessionData.generatedNote)}
                </div>

                {sessionData.summary && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Summary</h4>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">{sessionData.summary}</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="transcript" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Audio Transcript</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(sessionData.transcript, "Transcript")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>

                <div className="bg-gray-50 border rounded-lg p-6">
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {sessionData.transcript}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
