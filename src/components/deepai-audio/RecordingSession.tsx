
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, FileText, Mic, MicOff, Play, Settings, History, Eye, Globe, Mail, Paperclip, Clock, MessageSquare, Edit, Send, Languages } from "lucide-react";
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
      
      // Add to history
      const newHistoryItem = {
        id: Date.now().toString(),
        note: mockNote,
        timestamp: new Date().toLocaleString()
      };
      setSessionHistory(prev => [newHistoryItem, ...prev]);
      
      setIsProcessing(false);
      setActiveTab("generated");
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
                    onClick={handleCopyNote}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    COPY NOTE
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleAIEdit}
                  >
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
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleViewHistory}
                  >
                    <History className="h-4 w-4 mr-2" />
                    VIEW HISTORY
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
                <h3 className="font-medium mb-3">Session Info</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Patient:</strong> {sessionData.patientName}</div>
                  <div><strong>Visit Type:</strong> {sessionData.visitType}</div>
                  <div><strong>Template:</strong> {currentTemplate}</div>
                  {sessionData.pronouns && <div><strong>Pronouns:</strong> {sessionData.pronouns}</div>}
                  {sessionData.noteLength && <div><strong>Note Length:</strong> {sessionData.noteLength}</div>}
                  <div><strong>Language:</strong> {selectedLanguage === "en" ? "English" : selectedLanguage}</div>
                  <div><strong>History Items:</strong> {sessionHistory.length}</div>
                </div>
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
