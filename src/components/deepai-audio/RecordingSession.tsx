import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, FileText, Mic, MicOff, Play, Settings, History, Eye, Globe, Mail, Paperclip, Clock, MessageSquare, Edit, Send, Languages, ArrowLeft, Home } from "lucide-react";
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
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [mainTab, setMainTab] = useState("note");
  const [activeTab, setActiveTab] = useState("generated");
  const [generatedNote, setGeneratedNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [fullTranscript, setFullTranscript] = useState("");
  const [currentTemplate, setCurrentTemplate] = useState(sessionData.template);
  const [templateInstructions, setTemplateInstructions] = useState("");
  const [showBlankItems, setShowBlankItems] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [sessionHistory, setSessionHistory] = useState<Array<{id: string, note: string, timestamp: string}>>([]);
  
  // AI Edit dialog states
  const [isAIEditOpen, setIsAIEditOpen] = useState(false);
  const [aiEditPrompt, setAiEditPrompt] = useState("");
  const [isAIEditing, setIsAIEditing] = useState(false);
  
  // Patient instructions dialog states
  const [isPatientInstructionsOpen, setIsPatientInstructionsOpen] = useState(false);
  const [patientEmail, setPatientEmail] = useState("");
  const [instructionsText, setInstructionsText] = useState("");
  
  const { 
    isRecording, 
    audioUrl, 
    recordingTime,
    startRecording, 
    stopRecording,
    playAudio
  } = useAudioRecording();

  const handleBackToMain = () => {
    navigate('/deepai-audio-notes');
    toast({
      title: "Returning to setup",
      description: "Navigating back to the main DeepAI Audio Notes page",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTemplateChange = (templateId: string, instructions: string) => {
    setCurrentTemplate(templateId);
    setTemplateInstructions(instructions);
    
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
      setActiveTab("transcript");
      
      toast({
        title: "Recording Started",
        description: "Conversation is being recorded and transcribed in real-time",
      });
      
      const mockTranscriptUpdates = [
        "You: Miss Bellamy? Yes, Hi, I'm Honey Harris. I'll be your doctor today. Let me just wash my hands really quick. Would you prefer Mrs. Bellamy, or can I call you Pat? Pat's fine. Great. Well, it's nice to meet you. Nice to meet you too. Can you tell me why you're here today?",
        "\n\nPatient: I have a terrible headache that started three days ago. It's really severe, about 10 out of 10 pain.",
        "\n\nYou: I'm sorry to hear that. Can you describe the headache? Is it throbbing, sharp, or dull? Does anything make it better or worse?",
        "\n\nPatient: It's throbbing and gets much worse when I move or when there's bright light. I also feel nauseous.",
        "\n\nYou: That sounds very uncomfortable. Have you taken any medications for this? Any other symptoms I should know about?",
        "\n\nPatient: I tried some over-the-counter pain relievers but they didn't help much. I'm also concerned about my insurance coverage since I recently switched plans."
      ];

      let currentTranscript = "";
      mockTranscriptUpdates.forEach((update, index) => {
        setTimeout(() => {
          currentTranscript += update;
          setFullTranscript(currentTranscript);
        }, (index + 1) * 3000);
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
    
    toast({
      title: "Processing Recording",
      description: "Generating clinical note from your conversation...",
    });
    
    setTimeout(() => {
      const mockNote = `CLINICAL NOTE - ${sessionData.patientName}
Visit Date: ${new Date().toLocaleDateString()}
Visit Type: ${sessionData.visitType}
Template: ${currentTemplate}

SUMMARY
The patient was seen for evaluation of a severe headache of 3-day duration. Clinical presentation is consistent with migraine headache based on throbbing quality, photophobia, phonophobia, and associated nausea. Patient reports 10/10 pain intensity with functional impairment. Insurance coverage concerns were addressed.

SUBJECTIVE
Chief Complaint: Severe headache x 3 days

History of Present Illness:
- 3-day history of severe headache, 10/10 intensity
- Throbbing quality
- Exacerbated by movement and bright lights
- Associated with nausea
- No relief with OTC analgesics
- Patient concerned about insurance coverage

Review of Systems:
- Neurological: Headache, photophobia, nausea
- Other systems: Negative per conversation

OBJECTIVE
Vital Signs: To be documented
Physical Examination: Clinical assessment in progress

ASSESSMENT
1. Severe headache, likely migraine
   - 3-day duration with classic migraine features
   - Throbbing quality with photophobia and nausea
   - Functional impairment noted

PLAN
1. Complete physical examination
2. Consider migraine-specific therapy
3. Address insurance verification for diagnostic studies if indicated
4. Patient education regarding migraine triggers
5. Follow-up as clinically indicated
6. Return precautions discussed

Patient expressed understanding of the plan and agreed to proceed.`;

      setGeneratedNote(mockNote);
      
      // Add to history
      const newHistoryItem = {
        id: Date.now().toString(),
        note: mockNote,
        timestamp: new Date().toLocaleString()
      };
      setSessionHistory(prev => [newHistoryItem, ...prev]);
      
      setIsProcessing(false);
      setActiveTab("generated");
      
      toast({
        title: "Note Generated Successfully",
        description: "Clinical note has been created from your recording",
      });
    }, 4000);
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

  const handleCopyNote = () => {
    if (generatedNote) {
      copyToClipboard(generatedNote, "Generated note");
    } else {
      toast({
        title: "No note to copy",
        description: "Generate a note first by recording a conversation",
        variant: "destructive"
      });
    }
  };

  const handleAIEdit = () => {
    if (!generatedNote) {
      toast({
        title: "No note to edit",
        description: "Generate a note first by recording a conversation",
        variant: "destructive"
      });
      return;
    }
    setIsAIEditOpen(true);
  };

  const processAIEdit = () => {
    if (!aiEditPrompt.trim()) {
      toast({
        title: "Enter edit instructions",
        description: "Please provide instructions for how to edit the note",
        variant: "destructive"
      });
      return;
    }

    setIsAIEditing(true);
    
    // Simulate AI editing process
    setTimeout(() => {
      const editedNote = generatedNote + "\n\n[AI EDIT APPLIED]\nNote edited based on: " + aiEditPrompt;
      setGeneratedNote(editedNote);
      
      // Add to history
      const newHistoryItem = {
        id: Date.now().toString(),
        note: editedNote,
        timestamp: new Date().toLocaleString()
      };
      setSessionHistory(prev => [newHistoryItem, ...prev]);
      
      setIsAIEditing(false);
      setIsAIEditOpen(false);
      setAiEditPrompt("");
      
      toast({
        title: "Note edited successfully",
        description: "AI has applied your requested changes",
      });
    }, 2000);
  };

  const handleViewHistory = () => {
    if (sessionHistory.length === 0) {
      toast({
        title: "No history available",
        description: "Generate some notes first to see the history",
      });
    } else {
      toast({
        title: "History",
        description: `You have ${sessionHistory.length} previous versions`,
      });
    }
  };

  const handleLanguageChange = () => {
    toast({
      title: "Language changed",
      description: `Changed to ${selectedLanguage === "en" ? "English" : "Selected language"}`,
    });
  };

  const toggleBlankItems = () => {
    setShowBlankItems(!showBlankItems);
    toast({
      title: showBlankItems ? "Hiding blank items" : "Showing blank items",
      description: showBlankItems ? "Empty sections are now hidden" : "Empty sections are now visible",
    });
  };

  const handleSendPatientInstructions = () => {
    if (!generatedNote) {
      toast({
        title: "No note available",
        description: "Generate a note first to send patient instructions",
        variant: "destructive"
      });
      return;
    }
    setIsPatientInstructionsOpen(true);
    
    // Pre-fill instructions based on the note
    setInstructionsText("Based on your visit today:\n\n• Continue current medications as prescribed\n• Follow up in 2 weeks\n• Contact us if symptoms worsen\n\nPlease don't hesitate to reach out with any questions.");
  };

  const sendInstructions = () => {
    if (!patientEmail.trim() || !instructionsText.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both email and instructions",
        variant: "destructive"
      });
      return;
    }

    // Simulate sending email
    setTimeout(() => {
      toast({
        title: "Instructions sent",
        description: `Patient instructions sent to ${patientEmail}`,
      });
      setIsPatientInstructionsOpen(false);
      setPatientEmail("");
      setInstructionsText("");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleBackToMain}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Setup
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-green-600 mb-2">🎤 Recording Session</h1>
              <h2 className="text-xl font-semibold">{sessionData.patientName}</h2>
              <p className="text-muted-foreground">
                {sessionData.visitType} • Template: {currentTemplate}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <History className="h-4 w-4 mr-2" />
              PATIENT HISTORY
            </Button>
            <Button 
              onClick={handleCaptureConversation}
              disabled={isProcessing}
              className={`${
                isRecording 
                  ? "bg-red-500 hover:bg-red-600" 
                  : "bg-green-500 hover:bg-green-600"
              } px-6 py-3 text-lg font-semibold`}
              size="lg"
            >
              {isRecording ? (
                <>
                  <MicOff className="h-5 w-5 mr-2" />
                  STOP RECORDING ({formatTime(recordingTime)})
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5 mr-2" />
                  START RECORDING
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Recording Status Banner */}
        {isRecording && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-800 font-semibold">RECORDING ACTIVE</span>
              </div>
              <span className="text-red-600">Duration: {formatTime(recordingTime)}</span>
              <span className="text-red-600 text-sm">• Speak clearly for best transcription quality</span>
            </div>
          </div>
        )}

        {/* Processing Banner */}
        {isProcessing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <span className="text-blue-800 font-semibold">PROCESSING RECORDING</span>
              <span className="text-blue-600">• Transcribing and generating clinical note...</span>
            </div>
          </div>
        )}

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
                        <FileText className="h-4 w-4 mr-2" />
                        Generated Note
                        {generatedNote && <Badge variant="secondary" className="ml-2">Ready</Badge>}
                      </TabsTrigger>
                      <TabsTrigger 
                        value="transcript"
                        className={`${activeTab === 'transcript' ? 'bg-green-500 text-white' : ''}`}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Live Transcript
                        {isRecording && <Badge variant="destructive" className="ml-2">Live</Badge>}
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="generated" className="mt-0 h-[calc(100%-120px)] overflow-y-auto p-4">
                    {isProcessing ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                          <p className="text-muted-foreground">Generating clinical note...</p>
                          <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
                        </div>
                      </div>
                    ) : generatedNote ? (
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-line text-sm leading-relaxed">
                          {generatedNote}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium">Ready to Generate Clinical Notes</p>
                          <p className="mt-2">Start recording your conversation to automatically generate structured clinical documentation</p>
                          <div className="mt-4 p-4 bg-green-50 rounded-lg text-left">
                            <h4 className="font-medium text-green-800 mb-2">What happens next:</h4>
                            <ul className="text-sm text-green-700 space-y-1">
                              <li>• Click "Start Recording" to begin capturing audio</li>
                              <li>• Speak naturally during your patient interaction</li>
                              <li>• AI will transcribe and structure your notes automatically</li>
                              <li>• Review and edit the generated clinical note as needed</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="transcript" className="mt-0 h-[calc(100%-120px)] overflow-y-auto p-4">
                    {fullTranscript ? (
                      <div className="text-sm leading-relaxed whitespace-pre-line font-mono">
                        {fullTranscript}
                        {isRecording && (
                          <span className="inline-block w-2 h-4 bg-green-500 animate-pulse ml-1"></span>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Real-Time Transcription</p>
                        <p className="mt-2">Your conversation will appear here in real-time as you speak</p>
                        {!isRecording && (
                          <Button 
                            onClick={handleStartRecording} 
                            className="mt-4 bg-green-500 hover:bg-green-600"
                          >
                            <Mic className="h-4 w-4 mr-2" />
                            Start Recording Now
                          </Button>
                        )}
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
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleCopyNote}
                    disabled={!generatedNote}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    COPY NOTE
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleAIEdit}
                    disabled={!generatedNote}
                  >
                    <Edit className="h-4 w-4 mr-2" />
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
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleViewHistory}
                  >
                    <History className="h-4 w-4 mr-2" />
                    VIEW HISTORY ({sessionHistory.length})
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Globe className="h-4 w-4 mr-2" />
                        CHANGE LANGUAGE
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Language</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="language">Select Language</Label>
                          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                              <SelectItem value="it">Italian</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleLanguageChange} className="w-full">
                          <Languages className="h-4 w-4 mr-2" />
                          Apply Language Change
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={toggleBlankItems}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showBlankItems ? 'HIDE' : 'SHOW'} BLANK ITEMS
                  </Button>
                  
                  <Button 
                    className="w-full justify-start bg-green-500 hover:bg-green-600"
                    onClick={handleSendPatientInstructions}
                    disabled={!generatedNote}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    SEND PATIENT INSTRUCTIONS
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Session Info */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Session Details</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Patient:</strong> {sessionData.patientName}</div>
                  <div><strong>Visit Type:</strong> {sessionData.visitType}</div>
                  <div><strong>Template:</strong> {currentTemplate}</div>
                  {sessionData.pronouns && <div><strong>Pronouns:</strong> {sessionData.pronouns}</div>}
                  {sessionData.noteLength && <div><strong>Note Length:</strong> {sessionData.noteLength}</div>}
                  <div><strong>Language:</strong> {selectedLanguage === "en" ? "English" : selectedLanguage}</div>
                  <div><strong>Status:</strong> 
                    <Badge variant={isRecording ? "destructive" : generatedNote ? "default" : "secondary"} className="ml-2">
                      {isRecording ? "Recording" : generatedNote ? "Note Ready" : "Ready to Record"}
                    </Badge>
                  </div>
                </div>
                
                {audioUrl && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Last Recording</span>
                      <Button size="sm" variant="outline" onClick={playAudio}>
                        <Play className="h-3 w-3 mr-1" />
                        Play
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Edit Dialog */}
        <Dialog open={isAIEditOpen} onOpenChange={setIsAIEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                AI Edit Note
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="aiEditPrompt">Edit Instructions</Label>
                <Textarea
                  id="aiEditPrompt"
                  value={aiEditPrompt}
                  onChange={(e) => setAiEditPrompt(e.target.value)}
                  placeholder="Tell the AI how you want to edit the note... (e.g., 'Add more detail to the assessment section' or 'Make the plan more specific')"
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={processAIEdit}
                  disabled={isAIEditing}
                  className="bg-green-500 hover:bg-green-600"
                >
                  {isAIEditing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Apply Edit
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setIsAIEditOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Patient Instructions Dialog */}
        <Dialog open={isPatientInstructionsOpen} onOpenChange={setIsPatientInstructionsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Send Patient Instructions
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="patientEmail">Patient Email</Label>
                <Input
                  id="patientEmail"
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  placeholder="patient@example.com"
                />
              </div>
              <div>
                <Label htmlFor="instructionsText">Instructions</Label>
                <Textarea
                  id="instructionsText"
                  value={instructionsText}
                  onChange={(e) => setInstructionsText(e.target.value)}
                  placeholder="Enter patient instructions..."
                  className="min-h-[120px]"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={sendInstructions}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Instructions
                </Button>
                <Button variant="outline" onClick={() => setIsPatientInstructionsOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
