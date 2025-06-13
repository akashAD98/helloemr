
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, FileText, Mic, MicOff, Play, Settings, History, Eye, Globe, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAudioRecording } from "@/components/patient-details/audio-notes/useAudioRecording";

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
  const [activeTab, setActiveTab] = useState("generated");
  const [transcribedText, setTranscribedText] = useState("");
  const [generatedNote, setGeneratedNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
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

  const handleStartRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await startRecording();
    } catch (error) {
      console.error("Microphone access denied:", error);
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    setIsProcessing(true);
    
    // Simulate AI transcription and note generation
    setTimeout(() => {
      const mockTranscription = `Doctor: Good morning, ${sessionData.patientName}. How are you feeling today?

Patient: Good morning, Doctor. I've been having severe headaches for the past three days.

Doctor: Can you describe the pain? On a scale of 1 to 10, how would you rate it?

Patient: I'd say it's about a 10 out of 10. It's really intense and gets worse when I move or when there's bright light.

Doctor: I see. Have you experienced any nausea or sensitivity to light?

Patient: Yes, both actually. The light sensitivity is particularly bad.

Doctor: Based on your symptoms, this sounds like it could be a migraine. Let me do a quick examination and we'll discuss treatment options.`;

      const mockNote = `Summary

The patient was seen for a follow-up regarding a severe headache of recent onset. Clinical assessment suggests a migraine, exacerbated by movement and light, and impacting daily activities. A plan is in place for further assessment and management, which includes ensuring insurance coverage for tests, as well as lifestyle recommendations to aid long-term health, such as smoking reduction.

Subjective

1. Reason for Visit

Patient presents with a severe headache.

2. Chief Complaints

Chief complaint of a headache that started three days ago with 10 out of 10 intensity, worsened by movement and light.`;

      setTranscribedText(mockTranscription);
      setGeneratedNote(mockNote);
      setIsProcessing(false);
    }, 2000);
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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Example of Visit Note</h1>
            <p className="text-muted-foreground">Recording session for {sessionData.patientName}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              PATIENT HISTORY
            </Button>
            <Button className="bg-green-500 hover:bg-green-600">
              <FileText className="h-4 w-4 mr-2" />
              START AUDIO RECORDING
            </Button>
          </div>
        </div>

        {/* Recording Controls */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Button
                size="lg"
                onClick={handleCaptureConversation}
                disabled={isProcessing}
                className={`px-8 py-6 text-lg ${
                  isRecording 
                    ? "bg-red-500 hover:bg-red-600" 
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="mr-2 h-5 w-5" />
                    STOP RECORDING ({formatTime(recordingTime)})
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-5 w-5" />
                    🎤 CAPTURE CONVERSATION
                  </>
                )}
              </Button>

              {audioUrl && (
                <Button variant="outline" onClick={playAudio}>
                  <Play className="mr-2 h-4 w-4" />
                  Play Recording
                </Button>
              )}

              {isProcessing && (
                <div className="text-center text-muted-foreground">
                  Processing audio and generating notes...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        {(transcribedText || generatedNote) && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                    Transcript
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="generated" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-line">
                          {generatedNote}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="transcript" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="bg-gray-50 border rounded-lg p-6">
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {transcribedText}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar Actions */}
            <div className="lg:col-span-1 space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => copyToClipboard(activeTab === 'generated' ? generatedNote : transcribedText, activeTab === 'generated' ? "Generated note" : "Transcript")}
              >
                <Copy className="h-4 w-4 mr-2" />
                COPY
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                AI EDIT
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                SWITCH TEMPLATE
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <History className="h-4 w-4 mr-2" />
                VIEW HISTORY
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                CHANGE LANGUAGE
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                SHOW BLANK ITEMS
              </Button>
              
              <Button className="w-full justify-start bg-green-500 hover:bg-green-600">
                <Mail className="h-4 w-4 mr-2" />
                SEND PATIENT INSTRUCTIONS
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
