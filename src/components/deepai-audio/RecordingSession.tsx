import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, FileText, Mic, MicOff, Play, Settings, History, Eye, Globe, Mail, Paperclip, Clock, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAudioRecording } from "@/components/patient-details/audio-notes/useAudioRecording";
import { TemplateSwitcher } from "./TemplateSwitcher";

interface RecordingSessionProps {
  sessionData: {
    patientName: string;
    visitType: string;
    pronouns: string;
    noteLength: string;
    pastContext: string;
    template: string;
  };
}

export function RecordingSession({ sessionData }: RecordingSessionProps) {
  const { toast } = useToast();
  const [mainTab, setMainTab] = useState("note");
  const [activeTab, setActiveTab] = useState("generated");
  const [generatedNote, setGeneratedNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [fullTranscript, setFullTranscript] = useState("");
  const [currentTemplate, setCurrentTemplate] = useState(sessionData.template);
  const [templateInstructions, setTemplateInstructions] = useState("");
  
  const { 
    isRecording, 
    audioUrl, 
    recordingTime,
    startRecording, 
    stopRecording,
    playAudio
  } = useAudioRecording();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTemplateChange = (templateId: string, instructions: string) => {
    setCurrentTemplate(templateId);
    setTemplateInstructions(instructions);
    
    // If we have a generated note, we might want to regenerate it with the new template
    if (generatedNote) {
      toast({
        title: "Template Changed",
        description: "Template updated. Recording session will use the new template for future generations.",
      });
    }
  };

  const handleStartRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await startRecording();
      setActiveTab("transcript"); // Switch to transcript view when recording starts
      
      // Simulate real-time transcript updates
      const mockTranscriptUpdates = [
        "You: Miss Bellamy? Yes, Hi, I'm Honey Harris. I'll be your doctor today. Let me just wash my hands really quick. Would you prefer Mrs. Bellamy, or can I call you Pat? Pat's fine. Great. Well, it's nice to meet you. Nice to meet you too. Can you tell me why you're here today?",
        "\n\nPatient: I have a terrible headache.",
        "\n\nYou: It looks really bad. Is there anything else besides your headache that you want to address here today at the Clinical partner?",
        "\n\nPatient: No, it's just that. Except I am concerned. I just recently changed insurance companies and I'm not sure this is going to be covered yet."
      ];

      let currentTranscript = "";
      mockTranscriptUpdates.forEach((update, index) => {
        setTimeout(() => {
          currentTranscript += update;
          setFullTranscript(currentTranscript);
        }, (index + 1) * 2000);
      });

    } catch (error) {
      console.error("Microphone access denied:", error);
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to start recording",
        variant: "destructive"
      });
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    setIsProcessing(true);
    
    // Simulate AI note generation
    setTimeout(() => {
      const mockNote = `Summary

The patient was seen for a follow-up regarding a severe headache of recent onset. Clinical assessment suggests a migraine, exacerbated by movement and light, and impacting daily activities. A plan is in place for further assessment and management, which includes ensuring insurance coverage for tests, as well as lifestyle recommendations to aid long-term health, such as smoking reduction.

Subjective

1. Reason for Visit
Patient presents with a severe headache.

2. Chief Complaints
Chief complaint of a headache that started three days ago with 10 out of 10 intensity, worsened by movement and light.

3. History of Present Illness (HPI)
Patient reports severe headache lasting three days with 10/10 intensity. Pain is exacerbated by movement and bright light. Associated symptoms include nausea and photophobia. Patient expresses concern about insurance coverage for treatment.

Objective

1. Vital Signs
Not documented during this session.

2. Physical Examination
Initial examination planned to assess migraine symptoms.

Assessment

1. Primary Assessment
Severe headache consistent with migraine presentation based on symptoms of photophobia, nausea, and movement-related exacerbation.

Plan

1. Further Evaluation
Clinical examination to be completed to confirm migraine diagnosis.

2. Insurance Verification
Address patient's concerns regarding insurance coverage for diagnostic tests and treatment.

3. Follow-up
Schedule appropriate follow-up based on examination findings and treatment response.`;

      setGeneratedNote(mockNote);
      setIsProcessing(false);
      setActiveTab("generated"); // Switch to generated note view when processing is complete
    }, 3000);
  };

  const handleCaptureConversation = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} copied successfully`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">Welcome to Recording Conversation</h1>
            <h2 className="text-xl font-semibold">Recording Session - {sessionData.patientName}</h2>
            <p className="text-muted-foreground">
              {sessionData.visitType} • Template: {currentTemplate}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              PATIENT HISTORY
            </Button>
            <Button 
              onClick={handleCaptureConversation}
              disabled={isProcessing}
              className={`${
                isRecording 
                  ? "bg-red-500 hover:bg-red-600" 
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  STOP RECORDING ({formatTime(recordingTime)})
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  START AUDIO RECORDING
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column - Generated Note/Transcript */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                  <div className="p-4 border-b">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger 
                        value="generated" 
                        className={`${activeTab === 'generated' ? 'bg-green-500 text-white' : ''}`}
                      >
                        Generated Note
                      </TabsTrigger>
                      <TabsTrigger 
                        value="transcript"
                        className={`${activeTab === 'transcript' ? 'bg-green-500 text-white' : ''}`}
                      >
                        Full Transcript
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="generated" className="mt-0 h-[calc(100%-120px)] overflow-y-auto p-4">
                    {isProcessing ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                          <p className="text-muted-foreground">Generating clinical note...</p>
                        </div>
                      </div>
                    ) : generatedNote ? (
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-line text-sm">
                          {generatedNote}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Start recording to generate clinical notes</p>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="transcript" className="mt-0 h-[calc(100%-120px)] overflow-y-auto p-4">
                    {fullTranscript ? (
                      <div className="text-sm leading-relaxed whitespace-pre-line">
                        {fullTranscript}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Full conversation transcript will appear here</p>
                        <p className="text-sm mt-2">Start recording to see the transcript</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions */}
          <div className="lg:col-span-1 space-y-3">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Actions</h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => copyToClipboard(generatedNote, "Generated note")}
                    disabled={!generatedNote}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    COPY NOTE
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Settings className="h-4 w-4 mr-2" />
                    AI EDIT
                  </Button>
                  
                  <TemplateSwitcher 
                    currentTemplate={currentTemplate}
                    onTemplateChange={handleTemplateChange}
                  >
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      SWITCH TEMPLATE
                    </Button>
                  </TemplateSwitcher>
                  
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <History className="h-4 w-4 mr-2" />
                    VIEW HISTORY
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Globe className="h-4 w-4 mr-2" />
                    CHANGE LANGUAGE
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Eye className="h-4 w-4 mr-2" />
                    SHOW BLANK ITEMS
                  </Button>
                  
                  <Button className="w-full justify-start bg-green-500 hover:bg-green-600" disabled>
                    <Mail className="h-4 w-4 mr-2" />
                    SEND PATIENT INSTRUCTIONS
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Session Info */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Session Info</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Patient:</strong> {sessionData.patientName}</div>
                  <div><strong>Visit Type:</strong> {sessionData.visitType}</div>
                  <div><strong>Template:</strong> {currentTemplate}</div>
                  {sessionData.pronouns && <div><strong>Pronouns:</strong> {sessionData.pronouns}</div>}
                  {sessionData.noteLength && <div><strong>Note Length:</strong> {sessionData.noteLength}</div>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
